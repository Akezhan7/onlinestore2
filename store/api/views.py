import json
import os
from rest_framework import generics
from django.db.models import Q, F
from store.models import (
    Category,
    Coupon,
    Product,
    ProductSize,
    Order,
    Address,
    OrderItem,
    User
)
from .serializers import (
    AnonymousCartSerializer,
    CategorySerializer,
    ProductSerializer,
    AddressSerializer,
    OrderSerializer,
    OrderItemSerializer,
    OrderUpdateSerializer,
    CartSerializer,
    UserSerializer
)
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from .pagination import ProductListPagination

# Define a guest cart structure for unauthenticated users
GUEST_INITIAL_CART = {
    "items": [],
    "coupon": {
        "amount": 0,
        "code": ""
    }
}


def findItem(collection, cb):
    for item in collection:
        if cb(item) is True:
            return item
    return None


class IsOwnerPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class CategoryList(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = ProductListPagination

    def get_queryset(self):
        queryset = Product.objects.annotate(
            discount_price=F("price") - F("price") * F("discount")
        )
        category = self.request.query_params.get("category", None)
        order_by = self.request.query_params.get("order_by", "latest")
        size = self.request.query_params.get("size", None)
        min_price = self.request.query_params.get("min_price", None)
        max_price = self.request.query_params.get("max_price", None)
        query = self.request.query_params.get("q", None)
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | Q(category__name__icontains=query)
            )
        if order_by == "price-desc":
            queryset = queryset.order_by("-discount_price")
        elif order_by == "price":
            queryset = queryset.order_by("discount_price")
        if category is not None:
            queryset = queryset.filter(category__name=category)
        if size is not None:
            queryset = queryset.filter(
                sizes__in=ProductSize.objects.filter(label=size)
            )
        if min_price and max_price:
            queryset = queryset.filter(
                discount_price__range=(min_price, max_price)
            )
        return queryset


class ProductDetail(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    lookup_field = "slug"


class UserAddressCreation(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = AddressSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response(
                serializer.error_messages, status=HTTP_400_BAD_REQUEST
            )
        data = dict(serializer.validated_data)
        address_type = data.get("address_type")
        Address.objects.update_or_create(
            default=True,
            address_type=address_type,
            user=request.user,
            defaults=data,
        )
        return Response(
            UserSerializer(request.user).data, status=HTTP_200_OK
        )


class UserAddress(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    queryset = Address.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerPermission]


class OrderListUpdate(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = OrderUpdateSerializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response(
                serializer.error_messages, status=HTTP_400_BAD_REQUEST
            )
        data = serializer.validated_data
        size = data.get("size")
        product = data.get("product")
        quantity = data.get("quantity", None)
        # Verify that the product has the requested size
        size_qs = product.sizes.all().filter(label=size.label)
        if not size_qs.exists():
            return Response(
                {"message": "Invalid request (size nonexistent on product)"},
                status=HTTP_400_BAD_REQUEST,
            )
        size_instance = size_qs.first()
        if request.user.is_authenticated:
            active_order = Order.objects.get_or_create(
                user=request.user, ordered=False
            )[0]
            order_item_qs = active_order.items.filter(
                product=product, size__label=size_instance.label
            )
            if not order_item_qs.exists():
                order_item = active_order.items.create(
                    size=size_instance, product=product, quantity=0
                )
            else:
                order_item = order_item_qs.first()
            if quantity is not None:
                order_item.quantity += quantity
            else:
                order_item.quantity += 1
            order_item.save()
            return Response(
                CartSerializer(active_order).data, status=HTTP_200_OK
            )
        else:
            cart = request.session.get("cart", GUEST_INITIAL_CART)
            item_id = len(cart["items"]) + 1
            item = findItem(
                cart["items"],
                lambda item: item["product"]["name"] == product.name
                and item["size"] == size_instance.label,
            )
            if item:
                item["quantity"] += quantity
            else:
                cart["items"].append(
                    {
                        "product": ProductSerializer(product).data,
                        "size": size_instance.label,
                        "quantity": quantity,
                        "id": item_id,
                    }
                )
            request.session["cart"] = cart
            return Response(
                AnonymousCartSerializer(cart).data, status=HTTP_200_OK
            )

    def get(self, request, *args, **kwargs):
        status_param = request.query_params.get("status", None)
        if request.user.is_authenticated:
            if status_param == "active":
                cart = Order.objects.get_or_create(
                    user=request.user, ordered=False
                )[0]
                return Response(
                    CartSerializer(cart).data, status=HTTP_200_OK
                )
            orders = Order.objects.filter(user=request.user, ordered=True)
            return Response(
                OrderSerializer(orders, many=True).data, status=HTTP_200_OK
            )
        else:
            cart = request.session.get("cart", GUEST_INITIAL_CART)
            return Response(
                AnonymousCartSerializer(cart).data, status=HTTP_200_OK
            )

    def patch(self, request, *args, **kwargs):
        coupon_code = request.data.get("code", None)
        if not coupon_code:
            return Response(
                {"message": "Invalid input"}, status=HTTP_400_BAD_REQUEST
            )
        coupon_qs = Coupon.objects.filter(code__exact=coupon_code)
        if not coupon_qs.exists():
            return Response(
                {"message": "Invalid coupon"}, status=HTTP_400_BAD_REQUEST
            )
        coupon = coupon_qs.first()
        if coupon.used:
            return Response(
                {"message": "Expired coupon"}, status=HTTP_400_BAD_REQUEST
            )
        if request.user.is_authenticated:
            active_order = Order.objects.get_or_create(
                user=request.user, ordered=False
            )[0]
            active_order.coupon = coupon
            coupon.used = True
            coupon.save()
            active_order.save()
            return Response(
                CartSerializer(active_order).data, status=HTTP_200_OK
            )
        else:
            cart = request.session.get("cart", GUEST_INITIAL_CART)
            cart["coupon"]["code"] = coupon.code
            cart["coupon"]["amount"] = coupon.amount
            request.session["cart"] = cart
            return Response(
                AnonymousCartSerializer(cart).data, status=HTTP_200_OK
            )


class TrackOrder(generics.RetrieveAPIView):
    permission_classes = []
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(ordered=True)


class DeleteUpdateOrderItem(APIView):
    permission_classes = []

    def delete(self, request, *args, **kwargs):
        try:
            pk = int(kwargs["pk"])
        except ValueError:
            return Response(
                {"message": "Invalid CartItemId"}, status=HTTP_400_BAD_REQUEST
            )
        if request.user.is_authenticated:
            active_order = Order.objects.get_or_create(
                user=request.user, ordered=False
            )[0]
            order_item_qs = active_order.items.filter(pk=pk)
            if not order_item_qs.exists():
                return Response(
                    {"message": "Invalid CartItemId"},
                    status=HTTP_400_BAD_REQUEST,
                )
            order_item_qs.first().delete()
            return Response(
                CartSerializer(active_order).data, status=HTTP_200_OK
            )
        else:
            cart = request.session.get("cart", GUEST_INITIAL_CART)
            item = findItem(cart["items"], lambda item: item["id"] == pk)
            if not item:
                return Response(
                    {"message": "Invalid CartItemId"},
                    status=HTTP_400_BAD_REQUEST,
                )
            cart["items"].remove(item)
            request.session["cart"] = cart
            return Response(
                AnonymousCartSerializer(cart).data, status=HTTP_200_OK
            )

    def put(self, request, *args, **kwargs):
        try:
            pk = int(kwargs["pk"])
        except ValueError:
            return Response(
                {"message": "Invalid CartItemId"}, status=HTTP_400_BAD_REQUEST
            )
        try:
            quantity = int(request.data.get("quantity", None))
        except (ValueError, TypeError):
            return Response(
                {"message": "Invalid Quantity value"},
                status=HTTP_400_BAD_REQUEST,
            )
        size = request.data.get("size")
        if request.user.is_authenticated:
            active_order = Order.objects.get_or_create(
                user=request.user, ordered=False
            )[0]
            order_item_qs = active_order.items.filter(pk=pk)
            if not order_item_qs.exists():
                return Response(
                    {"message": "Invalid CartItemId"},
                    status=HTTP_400_BAD_REQUEST,
                )
            order_item = order_item_qs.first()
            size_instance = ProductSize.objects.filter(label=size).first()
            order_item.quantity = quantity
            order_item.size = size_instance
            order_item.save()
            return Response(
                CartSerializer(active_order).data, status=HTTP_200_OK
            )
        else:
            cart = request.session.get("cart", GUEST_INITIAL_CART)
            item = findItem(cart["items"], lambda item: item["id"] == pk)
            if not item:
                return Response(
                    {"message": "Invalid CartItemId"},
                    status=HTTP_400_BAD_REQUEST,
                )
            if size not in item["product"].get("sizes", []):
                return Response(
                    {"message": "Invalid product size"},
                    status=HTTP_400_BAD_REQUEST,
                )
            item["quantity"] = quantity
            item["size"] = size
            request.session["cart"] = cart
            return Response(
                AnonymousCartSerializer(cart).data, status=HTTP_200_OK
            )


# New endpoint: record order submissions to a file (order.txt)