import React, { useEffect } from "react";
import { useFormik } from "formik";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CURRENCY } from "../constants";

// Example images/icons – replace paths as needed
import paypalIcon from "../assets/PayPal.png";
import visaIcon from "../assets/Visa.png";
import marbleBg from "../assets/MasterCard.png";

// -------------------------------------------------
// Styled Components
// -------------------------------------------------
const CheckoutWrapper = styled.div`
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  padding: 40px 0;
  box-sizing: border-box;
`;

const CheckoutContainer = styled.div`
  max-width: 1412px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;
const CheckoutContainer2 = styled.div`
  max-width: 1412px;
  margin: 0 auto;
  padding: 0 30px;
`;
const LeftSection = styled.div`
  padding: 30px;
  border-right: 2px solid #B9B9B9;
`;

const RightSection = styled.div`
  padding-right: 30px;
  height: fit-content;
  align-self: start;
  @media (max-width: 995px) {
    margin: 0px 30px 0 30px;
    padding-top: 14px;
    padding-right: 0;
    border-top: 2px solid #B9B9B9;
  }
`;

const SectionTitle = styled.h2`
  font-size: 17px;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-weight: 900;
`;
const SectionTitle2 = styled.h2`
  font-size: 17px;
  border-top: 2px solid #B9B9B9;
  padding-top: 8px;
  margin-top: 20px;
  margin-bottom: 14px;
  text-transform: uppercase;
  font-weight: 900;
`;
const SectionTitle4 = styled.h2`
  font-size: 17px;
  text-transform: uppercase;
  font-weight: 900;
  margin-bottom: 8px;
  margin-top: 6px;
`;
const SectionTitle3 = styled.h2`
  font-size: 17px;
  border-bottom: 2px solid #B9B9B9;
  margin-top: 20px;
  text-transform: uppercase;
  font-weight: 900;
        @media (max-width:500px){
      text-align: center;
  }
`;
const Inputsfift = styled.h2`
  display: flex;
  justify-content: space-between;
  gap-col: 60px;
  flex-wrap: wrap;
  div {
    width: 45%;
  }
  @media (max-width: 500px) {
    div {
      width: 100%;
    }
  }
`;

const ExpressCheckout = styled.div`
  text-align: center;
  span {
    font-size: 17px;
    color: #000000;
    font-weight: 900;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .icon {
    width: 60px;
    height: auto;
    margin-right: 10px;
    @media (max-width: 508px) {
        width: 80px;
    }
  }
`;

/* Centered OR divider with lines on each side */
const OrDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  color: black;
  font-weight: bold;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 2px;
    background: #B9B9B9;
    margin: 0 15px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-weight: 900;
    margin-bottom: 5px;
    font-size: 18px;
    color: #696969;
  }

  input,
  select,
  textarea {
    width: 100%;
    height: 36px;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    box-sizing: border-box;
    background: #EDEDEDA3;
    border: 1px solid #737373;
  }

  textarea {
    height: 80px;
    resize: none;
  }

  .error {
    color: red;
    font-size: 0.8rem;
    margin-top: 3px;
  }
`;

const PayButton = styled.button`
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
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const OrderSummaryContainer = styled.div`
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0px;
    font-weight: 700;
    color: #6D6D6D;
    font-size: 16px;
    &.total {
      font-size: 16px;
      color: black;
      font-weight: 900;
      text-transform: uppercase;
      margin-top: 9px;
    }
  }
`;

// -------------------------------------------------
// Component
// -------------------------------------------------

// Empty address for initialization
const EmptyAddress = {
  name: "",
  lastname: "",
  street: "",
  apartment: "",
  zip_code: "",
  country: "",
  city: "",
  state: "",
  phone_number: "",
};

function validateAddress(address) {
  const errors = {};
  const fields = ["name", "lastname", "street", "apartment", "zip_code", "country"];
  fields.forEach((field) => {
    if (!address[field]) {
      errors[field] = `${field} is required`;
    }
  });
  return errors;
}

function validateForm(values) {
  const errors = {};

  // Billing address validation
  const billingErrors = validateAddress(values.billing);
  if (Object.keys(billingErrors).length !== 0) {
    errors.billing = billingErrors;
  }

  // Email validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }

  // If shipping is different
  if (values.altShippingAddress) {
    const shippingErrors = validateAddress(values.shipping);
    if (Object.keys(shippingErrors).length !== 0) {
      errors.shipping = shippingErrors;
    }
  }

  // Payment fields validations (for demonstration)
  if (!values.cardNumber) {
    errors.cardNumber = "Card Number is required";
  }
  if (!values.cardExpiry) {
    errors.cardExpiry = "Expiration Date is required";
  }
  if (!values.cardCvc) {
    errors.cardCvc = "CVC is required";
  }
  if (!values.cardholderName) {
    errors.cardholderName = "Cardholder Name is required";
  }

  return errors;
}

export default function CheckoutPage() {
  const history = useHistory();

  // Получаем данные из Redux
  const items = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const user = useSelector((state) => state.auth.user);

  const formik = useFormik({
    initialValues: {
      email: "",
      altShippingAddress: false,
      billing: EmptyAddress,
      shipping: EmptyAddress,
      // Payment fields (for display only)
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardholderName: "",
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  });

  // Обновление значений формы, если пользователь авторизован
  useEffect(() => {
    if (user) {
      formik.setValues({
        ...formik.values,
        email: user.email || "",
        billing: user.address?.billing || EmptyAddress,
        shipping: user.address?.shipping || EmptyAddress,
      });
    }
    // eslint-disable-next-line
  }, [user]);
  useEffect(() => {
    document.title = "Checkout";
}, []);
  // Если корзина пуста, показываем сообщение
  if (!items || items.length === 0) {
    return (
      <CheckoutWrapper>
        <CheckoutContainer>
          <h2 style={{ color: "#333" }}>No items in cart</h2>
        </CheckoutContainer>
      </CheckoutWrapper>
    );
  }

  // Обновлённая функция отправки заказа
  async function handleSubmit(values, { setSubmitting }) {
    try {
      // Объединяем данные формы с информацией о корзине
      const orderData = {
        ...values,
        items, // данные о товарах из Redux
        total, // итоговая стоимость из Redux
      };

      const response = await fetch('http://localhost:3001/submit-order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Error submitting order');
      }
      history.push("/thank-you");
    } catch (error) {
      console.error("Order submission failed:", error);
      // Можно добавить отображение ошибки для пользователя
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CheckoutWrapper>
      <CheckoutContainer2>
        <SectionTitle3>Checkout</SectionTitle3>
      </CheckoutContainer2>
      <CheckoutContainer>
        {/* LEFT SECTION: Express Checkout + Form */}
        <LeftSection>
          {/* EXPRESS CHECKOUT ICONS */}
          <ExpressCheckout>
            <span>EXPRESS CHECKOUT</span>
            <div>
              <a href="https://www.mastercard.kz/ru-kz/consumers/products/cards.html"><img src={marbleBg} alt="MasterCard" className="icon" /></a>
              <a href="https://www.paypal.com/kz/home"><img src={paypalIcon} alt="PayPal" className="icon" /></a>
              <a href="https://www.visa.com.kz/"> <img src={visaIcon} alt="Visa" className="icon" /></a>
            </div>
          </ExpressCheckout>

          {/* OR DIVIDER */}
          <OrDivider>OR</OrDivider>

          {/* SHIPPING / BILLING / PAYMENT FORM */}
          <form onSubmit={formik.handleSubmit}>
            <SectionTitle>Shipping</SectionTitle>
            <Inputsfift>
              <FormGroup>
                <label htmlFor="billing.name">First Name</label>
                <input
                  type="text"
                  name="billing.name"
                  id="billing.name"
                  value={formik.values.billing.name}
                  onChange={formik.handleChange}
                />
                {formik.errors.billing?.name && (
                  <p className="error">{formik.errors.billing.name}</p>
                )}
              </FormGroup>

              <FormGroup>
                <label htmlFor="billing.lastname">Last Name</label>
                <input
                  type="text"
                  name="billing.lastname"
                  id="billing.lastname"
                  value={formik.values.billing.lastname}
                  onChange={formik.handleChange}
                />
                {formik.errors.billing?.lastname && (
                  <p className="error">{formik.errors.billing.lastname}</p>
                )}
              </FormGroup>
            </Inputsfift>

            <FormGroup>
              <label htmlFor="billing.country">Country</label>
              <input
                type="text"
                name="billing.country"
                id="billing.country"
                value={formik.values.billing.country}
                onChange={formik.handleChange}
              />
              {formik.errors.billing?.country && (
                <p className="error">{formik.errors.billing.country}</p>
              )}
            </FormGroup>

            <FormGroup>
              <label htmlFor="billing.street">Address (Street)</label>
              <input
                type="text"
                name="billing.street"
                id="billing.street"
                value={formik.values.billing.street}
                onChange={formik.handleChange}
              />
              {formik.errors.billing?.street && (
                <p className="error">{formik.errors.billing.street}</p>
              )}
            </FormGroup>

            <FormGroup>
              <label htmlFor="billing.apartment">Address 2</label>
              <input
                type="text"
                name="billing.apartment"
                id="billing.apartment"
                value={formik.values.billing.apartment}
                onChange={formik.handleChange}
              />
              {formik.errors.billing?.apartment && (
                <p className="error">{formik.errors.billing.apartment}</p>
              )}
            </FormGroup>

            <Inputsfift>
              <FormGroup>
                <label htmlFor="billing.city">City</label>
                <input
                  type="text"
                  name="billing.city"
                  id="billing.city"
                  value={formik.values.billing.city}
                  onChange={formik.handleChange}
                />
                {formik.errors.billing?.city && (
                  <p className="error">{formik.errors.billing.city}</p>
                )}
              </FormGroup>
              <FormGroup>
                <label htmlFor="billing.state">State</label>
                <input
                  type="text"
                  name="billing.state"
                  id="billing.state"
                  value={formik.values.billing.state}
                  onChange={formik.handleChange}
                />
                {formik.errors.billing?.state && (
                  <p className="error">{formik.errors.billing.state}</p>
                )}
              </FormGroup>
              <FormGroup>
                <label htmlFor="billing.zip_code">ZIP Code</label>
                <input
                  type="text"
                  name="billing.zip_code"
                  id="billing.zip_code"
                  value={formik.values.billing.zip_code}
                  onChange={formik.handleChange}
                />
                {formik.errors.billing?.zip_code && (
                  <p className="error">{formik.errors.billing.zip_code}</p>
                )}
              </FormGroup>
              <FormGroup>
                <label htmlFor="billing.phone_number">Phone number</label>
                <input
                  type="text"
                  name="billing.phone_number"
                  id="billing.phone_number"
                  value={formik.values.billing.phone_number}
                  onChange={formik.handleChange}
                />
                {formik.errors.billing?.phone_number && (
                  <p className="error">{formik.errors.billing.phone_number}</p>
                )}
              </FormGroup>
            </Inputsfift>

            <SectionTitle2>Payment</SectionTitle2>
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && (
                <p className="error">{formik.errors.email}</p>
              )}
            </FormGroup>

            <FormGroup>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formik.values.cardNumber}
                onChange={formik.handleChange}
              />
              {formik.errors.cardNumber && (
                <p className="error">{formik.errors.cardNumber}</p>
              )}
            </FormGroup>

            <Inputsfift>
              <FormGroup>
                <label htmlFor="cardExpiry">Expiration Date</label>
                <input
                  type="text"
                  name="cardExpiry"
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={formik.values.cardExpiry}
                  onChange={formik.handleChange}
                />
                {formik.errors.cardExpiry && (
                  <p className="error">{formik.errors.cardExpiry}</p>
                )}
              </FormGroup>

              <FormGroup>
                <label htmlFor="cardCvc">CVC / CVV</label>
                <input
                  type="text"
                  name="cardCvc"
                  id="cardCvc"
                  placeholder="3 DIGITS"
                  value={formik.values.cardCvc}
                  onChange={formik.handleChange}
                />
                {formik.errors.cardCvc && (
                  <p className="error">{formik.errors.cardCvc}</p>
                )}
              </FormGroup>
            </Inputsfift>

            <FormGroup>
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                id="cardholderName"
                value={formik.values.cardholderName}
                onChange={formik.handleChange}
              />
              {formik.errors.cardholderName && (
                <p className="error">{formik.errors.cardholderName}</p>
              )}
            </FormGroup>

            <PayButton type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Processing..." : "PAY"}
            </PayButton>
          </form>
        </LeftSection>

        {/* RIGHT SECTION: ORDER SUMMARY */}
        <RightSection>
          <SectionTitle4>Order Summary</SectionTitle4>
          <OrderSummaryContainer>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>
                {CURRENCY}
                {total.toFixed(2)}
              </span>
            </div>
            <div className="summary-row">
              <span>Discount:</span>
              <span>$0</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$0</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>
                {CURRENCY}
                {total.toFixed(2)}
              </span>
            </div>
          </OrderSummaryContainer>
        </RightSection>
      </CheckoutContainer>
    </CheckoutWrapper>
  );
}
