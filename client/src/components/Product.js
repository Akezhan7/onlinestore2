import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Spinner } from ".";
import { ReactComponent as CartAddIcon } from "../assets/svg/cart-add.svg";
import { CURRENCY } from "../constants";
import { addCartItem } from "../ducks/cart";
import { TiTick } from "react-icons/ti";
import { FaListUl } from "react-icons/fa";

const Product = styled.div`
  max-width: 550px;
  height: 550px;
  width: 100%;
  
  :hover .product__name,
  :hover .product__price {
    opacity: 1;
  }

  .product__display {
    position: relative;
    display: block;
    height: 100%;
  }
  
  .product__images {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
  }

  .product__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s;
  }
  
  /* Видимость изображения определяется классом visible */
  .product__image.visible {
    opacity: 1;
  }
  
  .product__images img {
    width: 100%;
    height: 100%;
  }

  .product__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .product__action {
    position: absolute;
    z-index: 4;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
  }
  
  .icon,
  .cartadd,
  .options {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cartadd,
  .options {
    background: #fff;
  }
  
  .icon {
    background: #b39964;
  }
  
  .product__name {
    font-size: 16px;
    color: black;
    font-weight: 900;
    text-align: center;
    opacity: 0;
    margin-top: 45px;
    text-transform: uppercase;
    transition: all 0.5s;
  }
  
  .product__name a:hover {
    text-decoration: underline;
    transition: all 0.2s ease-in;
  }
  
  .product__category {
    text-transform: uppercase;
    font-variant: small-caps;
    font-size: 0.9rem;
    color: #000;
  }
  
  .product__category:hover {
    color: #000;
  }
  
  .product__price {
    font-size: 16px;
    color: #4d4d4d;
    font-weight: 900;
    text-align: center;
    opacity: 0;
    transition: all 0.5s;
  }
  
  .product__price .actual__price {
    text-decoration: line-through;
    color: #ccc;
    margin-right: 5px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 900px) {
    height: 300px;
  }
`;

export default (props) => {
  const dispatch = useDispatch();
  const {
    id,
    images,
    price,
    discount_price,
    category,
    name,
    sizes,
    slug,
  } = props;
  
  // Состояние для отслеживания hover
  const [hovered, setHovered] = useState(false);

  // Если изображение всего одно – дублируем его, чтобы избежать ошибок
  const product_images =
    images.length < 2 ? [images[0], images[0]] : images.slice(0, 2);

  const productlink = `/product/${slug}`;

  const [status, setStatus] = useState("done");
  const items = useSelector((state) => state.cart.items);
  const inCart = items.find((item) => item.product.id === id);

  const hasOptions = !["bottoms", "foot wear", "accessories"].includes(category);

  function addToCart() {
    setStatus("loading");
    dispatch(addCartItem(sizes[0], id, name)).then(() => setStatus("done"));
  }

  return (
    <Product>
      <div className="product__display">
        <Link
          className="product__images"
          to={productlink}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {product_images.map((image, i) => (
            <div
              key={i}
              className={`product__image ${
                (!hovered && i === 0) || (hovered && i === 1) ? "visible" : ""
              }`}
            >
              <img src={image} alt={name} />
            </div>
          ))}
        </Link>
      </div>
      <div className="product__info">
        <p className="product__name">
          <Link to={productlink}>{name}</Link>
        </p>
        <p className="product__price">
          <span className="discount__price">
            {CURRENCY}
            {discount_price ? discount_price.toFixed(1) : price.toFixed(2)}
          </span>
        </p>
      </div>
    </Product>
  );
};
