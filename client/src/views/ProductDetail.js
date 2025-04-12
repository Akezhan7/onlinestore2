import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import { CURRENCY, SIZES } from "../constants";
import Page from "./Page";
import CloseBtnIcon from "../assets/Close.svg";
import { TiTimes } from "react-icons/ti";
import {
  Spinner,
  QuantityInput,
  Tabs,
  ProductCarousel,
  Modal,
  NotContent,
} from "../components";
import { useUpdateEffect } from "../hooks";
import * as Api from "../api";
import { useDispatch } from "react-redux";
import { addCartItem } from "../ducks/cart";

const Image = styled.div`
  height: 100%;
  width: 100%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  /* При узком экране, если изображение не помещается, оно масштабируется */
  @media (max-width: 768px) {
    background-size: contain;
  }

  /* Если внутри окажется тег <img>, применяем аналогичные правила */
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
    transition: opacity 0.5s;
  }
  @media (min-width: 200px) {
    background-image: ${({ url }) => `url(${url})`};
    cursor: pointer;
    &:hover img {
      opacity: 0;
    }
  }
`;

const ViewBox = styled.div`
  width: 100vw;
  height: 100vh;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 103;
  cursor: pointer;

  @media (max-width: 508px) {
    top: 45px;
  }
`;

const ModalImage = styled.div`
  width: 90%;
  height: 90%;
  background-image: ${props => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transition: background-size 0.3s, background-position 0.3s;
  cursor: zoom-in;
  &:hover {
    background-size: 130%;
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 102;
    text-shadow: 
    -1px -1px 0 white,  
     1px -1px 0 white,
    -1px  1px 0 white,
     1px  1px 0 white; /* Белая обводка вокруг текста */
  ${props => (props.left ? "left: 20px;" : "right: 20px;")}
  .prvsbtn {
      display: none;
    }
    @media (max-width: 520px) {
     top: 90%;
    .previousbtn {
      display: none;
    }
    .prvsbtn {
      display: block;
    }
  }
`;

const ProductDetail = styled.div`
  font-size: 1.05rem;
  .productdetail__info {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .productdetail__images,
  .productdetail__content {
    width: 100%;
  }
  .productdetail__images {
    height: 400px;
  }

  .productdetail__content {
    margin-top: 20px;
  }
  .productdetail__content .descrda {
    font-size: 15px;
    text-transform: uppercase;
    font-weight: 900;
  }
  .productdetail__content .descrda span{
    font-size: 13px;
    text-transform: uppercase;
    font-weight: 900;
    word-wrap: break-word;
    white-space: pre-line;

  }
  .productdetail__content .product__name {
    text-align: left;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .productdetail__content .product__price {
    text-align: left;
    font-size: 18px;
    font-weight: 900;
    color: #5C5C5C;
  }
  .productdetail__content .actual-price {
    margin-right: 5px;
  }

  .product__sizes {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  .product__sizes .size {
    text-align: center;
    font-size: 14px;
    margin: 5px 0;
    height: 30px;
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .product__sizes button {
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    font-weight: bold;
    color: #7A7A7A;
  }

  .product__sizes button:disabled:after {
    height: 2px;
    width: 200px;
    content: "";
    z-index: 4;
    left: 0;
    top: 0;
    position: absolute;
    background: #ccc;
    transform: rotateZ(15deg);
    transform-origin: left;
  }
  .product__sizes .size button:not(:disabled):hover {
     font-weight: bold;
    color: black;
    text-decoration: underline;
  }
  .product__sizes .size.active button {
    font-weight: 900;
    color: black;
    text-decoration: underline;
  }

  .productdetail__content .figure {
    font-size: 1.2rem;
  }

  .product__action {
    margin: 18px auto;
  }
  .product__action .qty {
    width: 100px;
    margin-right: 15px;
  }
  .product__action .button {
    flex: 1;
    background: none;
    color: black;
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
    padding: 10px 0;
    max-width: 220px;
    width: 100%;
    border: 3px solid black;
    transition: 0.5s;
    border-radius: 5px;
  }
  .product__action .button:hover {
    flex: 1;
    background: black;
    color: white;
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
    padding: 10px 0;
    max-width: 220px;
    width: 100%;
    border: none;
  }

  .meta-info {
    border: 1px solid #777;
  }
  .meta-info .info {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #777;
    justify-content: center;
  }

  .meta-info .info:last-of-type {
    border-bottom: none;
  }
  .meta-info .info span {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex: 1;
  }
  .meta-info .info span:first-of-type {
    border-right: 1px solid #777;
    font-weight: bold;
  }
  @media (min-width: 300px) {
    .productdetail__images {
      height: 500px;
       width: 100%;
    }
  }
  @media (max-width: 440px) {
      .productdetail__content .descrda div{
          text-align: center;
      }
      .productdetail__content .product__name{
          text-align: center;
      }
      .productdetail__content .product__price{
          text-align: center;
      }    
      .productdetail__content .product__sizes{
          justify-content: center;
      }    
      .productdetail__content .product__action {
          margin: 19px auto;
          text-align: center;
          display: flex;
          justify-content: center;
      }
  }
  @media (min-width: 520px) {
    .productdetail__images {
      height: 600px;
    }
  }

  @media (min-width: 768px) {
    .productdetail__info {
      height: 500px;
      flex-direction: row;
      justify-content: end;
    }
    .productdetail__images,
    .productdetail__content {
      height: 100%;
    }
    .productdetail__images {
      width: 40%;
    }
    .productdetail__content {
      width: 30%;
      margin-top: 100px;
      padding: 0 30px;
    }
    .productdetail__content .descrda div{
      text-align: left;
    }
  }
  @media (min-width: 1024px) {
    .productdetail__info {
      height: 600px;
    }
  }
`;

export default () => {
  let { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [chosenSize, setChosenSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [viewBox, setViewBox] = useState({ open: false, startIndex: 1 });
  const [status, setStatus] = useState("loading");
  const [buttonStatus, setButtonStatus] = useState("done");
  const [isAdded, setIsAdded] = useState(false);

  async function getProduct() {
    const { data, error } = await Api.fetchFullProduct(slug);
    if (error) {
      console.log(error);
      setStatus("error");
      return;
    }
    setProduct(data);
  }

  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, [slug]);

  useUpdateEffect(() => {
    if (product == null) {
      setStatus("error");
    } else {
      setStatus("done");
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.title = product.name;
    }
  }, [product]);

  function toggleViewBox(i = null) {
    if (viewBox.open) {
      setViewBox({ open: false, startIndex: 1 });
    } else {
      setViewBox({ open: true, startIndex: i ? i : viewBox.startIndex });
    }
  }

  function handlePrev(e) {
    e.stopPropagation();
    setViewBox(prev => {
      const newIndex =
        prev.startIndex > 1 ? prev.startIndex - 1 : product.images.length;
      return { ...prev, startIndex: newIndex };
    });
  }

  function handleNext(e) {
    e.stopPropagation();
    setViewBox(prev => {
      const newIndex =
        prev.startIndex < product.images.length ? prev.startIndex + 1 : 1;
      return { ...prev, startIndex: newIndex };
    });
  }

  function addToCart() {
    if (!chosenSize) {
      console.log("Please select a size");
      return;
    }
    setButtonStatus("loading");
    dispatch(addCartItem(chosenSize, product.id, product.name, qty)).then(() => {
      setButtonStatus("done");
      setQty(1);
      setChosenSize(null);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000); // Сбрасываем текст через 3 секунды
    });
  }

  function zoom(e) {
    const zoomer = e.currentTarget;
    const { left, top, width, height } = zoomer.getBoundingClientRect();
    let eventX = e.touches ? e.touches[0].clientX : e.clientX;
    let eventY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((eventX - left) / width) * 100;
    const y = ((eventY - top) / height) * 100;
    zoomer.style.backgroundPosition = `${x}% ${y}%`;
  }

  function handleMouseLeave(e) {
    e.currentTarget.style.backgroundPosition = "center";
  }

  if (status === "error") {
    return (
      <NotContent offset={200}>
        <h3>Error getting product. This product may be out of stock</h3>
        <Link className="button" style={{ width: "100%" }} to="/shop">
          Go to shop
        </Link>
      </NotContent>
    );
  } else if (status === "loading") {
    return (
      <NotContent offset={200}>
        <Spinner />
      </NotContent>
    );
  }

  return (
    <>
      <Modal isOpen={viewBox.open} close={toggleViewBox}>
        <ViewBox>
          <CloseButton onClick={toggleViewBox}>
            <img src={CloseBtnIcon} width={35} height={35}/>
          </CloseButton>
          <NavButton left onClick={handlePrev}>
            <span className="previousbtn">PREVIOUS</span>
            <span className="prvsbtn">PRVS</span>
          </NavButton>
          <ModalImage
            src={product.images[viewBox.startIndex - 1]}
            onMouseMove={zoom}
            onMouseLeave={handleMouseLeave}
          />
          <NavButton onClick={handleNext}>NEXT</NavButton>
        </ViewBox>
      </Modal>
      <Page>
        <ProductDetail>
          <div className="productdetail__info">
            <div className="productdetail__images">
              <ProductCarousel>
                {product.images.map((image, i) => (
                  <Image
                    onClick={() => toggleViewBox(i + 1)}
                    thumb={image}
                    className="image-wrap"
                    key={i}
                    url={image.replace("700", "1300")}
                  >
         
                  </Image>
                ))}
              </ProductCarousel>
            </div>
            <div className="productdetail__content">
              <h1 className="product__name">{product.name}</h1>
              <p className="product__price">
                {product.discount_price && (
                  <span className="actual-price">
                    was {CURRENCY}
                    <span className="figure">{product.price.toFixed(2)}</span>
                  </span>
                )}
                {product.discount_price ? (
                  <span className="final-price">
                    Now {CURRENCY}
                    <span className="figure">
                      {product.discount_price.toFixed(2)}
                    </span>
                  </span>
                ) : (
                  <span className="final-price">
                    {CURRENCY}
                    <span className="figure">{product.price.toFixed(2)}</span>
                  </span>
                )}
              </p>
              <ul className="product__sizes">
                {SIZES.map((size, i) => (
                  <li
                    role="button"
                    key={i}
                    className={`size ${chosenSize === size ? "active" : ""}`}
                  >
                    <button
                      onClick={() => setChosenSize(size)}
                      disabled={!product.sizes.includes(size)}
                    >
                      {size}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="product__action">
              <button className="button" onClick={addToCart}>
                {isAdded ? "Added to Bag" : "Add to Bag"}
              </button>
              </div>
              <div label="Description" className="descrda">
                <div>DETAILS:</div>
                <span>{product.description}</span>
                </div>
            </div>
          </div>
        </ProductDetail>
      </Page>
    </>
  );
};
