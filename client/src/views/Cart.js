import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { CURRENCY } from "../constants";
import * as Api from "../api";
import { updateCart } from "../ducks/cart";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

// Example shipping cost for demonstration
const SHIPPING_COST = 0;

const CartPageContainer = styled.div`
  max-width: 1412px;
  margin: 0 auto;
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    display: block;
  }
`;

/* Left column: BAG title & items */
const CartLeft = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  width: 70%;
  @media (max-width: 768px) {
      width: 100%;
  }
`;

const BagTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 0px;
  border-bottom: 2px solid #B9B9B9;
        @media (max-width:500px){
      text-align: center;
  }
`;

const ItemWrapper = styled.div`
  padding: 20px 0;
  border-bottom: 2px solid #B9B9B9;
  position: relative;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
    @media (max-width: 768px) {
        align-items: flex-end;
  }
`;

/* Left side inside each item: image + name */
const ItemInfo = styled.div`

  .item-image {
    width: 200px;
    height: 200px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-details {
    margin-bottom: 20px;

    .item-name {
      font-size: 16px;
      font-weight: 900;
      text-transform: uppercase;
    }

    .item-size {
      font-size: 0.85rem;
      color: #666;
    }
  }
  
    @media (max-width: 768px) {
      .item-image {
        width: 150px;
        height: 150px;
      }
  }
       @media (max-width: 368px) {
      .item-image {
        width: 120px;
        height: 120px;
      }
  }
`;

/* Right side inside each item: price + quantity + delete */
const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 40px;
  margin-top: 40px;
  .item-price {
    font-size: 16px;
    font-weight: 900;
    margin-right: 20px;
  }

  .item-quantity {
    width: 47px;
    height: 20px;
    padding: 0px;
    font-size: 16px;
    text-align: center;
    font-weight: 900;
  }
  .quantix {
    display: flex;
    gap: 20px;
  }

  .delete-btn {
    position: absolute;
    top:20px;
    right:0;
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #999;
    cursor: pointer;
    &:hover {
      color: #000;
    }
  }
    @media (max-width: 768px) {
      margin-right: 0px;
  }
`;

/* Right column: Summary box */
const CartRight = styled.div`
  width: 30%;
  flex-shrink: 0;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 20px;
    @media (max-width: 768px) {
      width: 100%;
  }
`;

const SummaryBox = styled.div`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    color: #6D6D6D;
    font-size: 16px;
  }

  .summary-total {
    font-size: 16px;
    color: black;
    text-transform: uppercase;
  }
`;

const CheckoutButton = styled.button`
    background: none;
    color: black;
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
    padding: 10px 0;
    width: 100%;
    border: 3px solid black;
    transition: 0.5s;
    border-radius: 5px;
  &:hover {
       background: black;
    color: white;
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
    padding: 10px 0;
    width: 100%;
    border: 3px solid black;
  }
`;

const Disclaimer = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #6D6D6D;
  font-weight: 900;
`;

const AgreementText = styled.label`
  font-size: 12px;
  color: #6D6D6D;
  line-height: 1.4;
  font-weight: 900;
  margin-top: 9px;
`;


export default function CartPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  // Redux cart data
  const items = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const coupon = useSelector((state) => state.cart.coupon);
  const discountAmount = useSelector((state) => state.cart.discountAmount);

  // If total is already discounted in your store logic, use total directly.
  // If not, you might do: const subTotal = total + discountAmount
  const subTotal = total;
  const shipping = SHIPPING_COST;
  const finalTotal = subTotal + shipping;

  async function handleQuantityChange(e, item) {
    const newQty = parseInt(e.target.value, 10);
    if (!newQty || newQty < 1) return; // Basic guard
    await updateQuantity(item, newQty);
  }

  async function updateQuantity(item, newQty) {
    const { data, error } = await Api.updateCartItem(item.id, item.size, newQty);
    if (error) {
      console.log(error.response.data);
      return;
    }
    dispatch(updateCart(data));
  }
  useEffect(() => {
    document.title = "Bag";
}, []);
  async function deleteItem(item) {
    const { data, error } = await Api.deleteCartItem(item.id);
    if (error) {
      console.log(error.response.data);
      return;
    }
    dispatch(updateCart(data));
  }

  if (!items || items.length === 0) {
    return (
      <CartPageContainer>
        <CartLeft>
          <BagTitle>BAG</BagTitle>
        </CartLeft>
      </CartPageContainer>
    );
  }

  return (
    <div className="containernewed">
            <BagTitle>BAG</BagTitle>
          <CartPageContainer>
      {/* Left column: Bag items */}
      <CartLeft>

        {items.map((item) => {
          const product = item.product;
          const price = product.discount_price || product.price;

          return (
            <ItemWrapper key={item.id}>
              <ItemRow>
                <ItemInfo>
                  <div className="item-details">
                    <div className="item-name">{product.name}</div>
                  </div>
                  <div className="item-image">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                </ItemInfo>

                <ItemActions>
                  <div className="item-price">
                    {CURRENCY}
                    {price.toFixed(2)}
                  </div>
                  <span className="quantix"><span>X</span> <input
                    type="number"
                    className="item-quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(e, item)}
                  /></span>
                  
                  <button className="delete-btn" onClick={() => deleteItem(item)}>
                    <img src={require("../assets/Close.svg")}/>
                  </button>
                </ItemActions>
              </ItemRow>
            </ItemWrapper>
          );
        })}
      </CartLeft>

      {/* Right column: Summary */}
      <CartRight>
        <SummaryBox>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              {CURRENCY}
              {subTotal.toFixed(2)}
            </span>
          </div>
       
            <div className="summary-row">
              <span>Discount</span>
              <span>
                $0
              </span>
            </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {CURRENCY}
              {shipping.toFixed(2)}
            </span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>
              {CURRENCY}
              {finalTotal.toFixed(2)}
            </span>
          </div>
          <CheckoutButton onClick={() => history.push("/checkout")}>
            Checkout
          </CheckoutButton>
          <AgreementText htmlFor="agree">
                By continuing to checkout, I agree to the <NavLink to="/terms"><span style={{textDecoration: "underline"}}>Terms &amp; Conditions</span></NavLink>. I
                have read the <NavLink to="/privacy"><span style={{textDecoration: "underline"}}>Privacy Policy</span></NavLink> and the <NavLink to="/general"><span style={{textDecoration: "underline"}}>Return Policy</span></NavLink>
              </AgreementText>
        </SummaryBox>
      </CartRight>
    </CartPageContainer>
    </div>
  );
}
