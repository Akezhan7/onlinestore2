import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Page from "./Page";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

const BackgroundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
`;

const FormTitle = styled.h2`
  font-size: 18px;
  color: #000000;
  margin-bottom: 28px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 15px;
  color: #696969;
  margin-bottom: 6px;
  font-weight: 800;
`;

const Input = styled.input`
    width: 100%;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 17px;
    font-weight: 800;
    box-sizing: border-box;
    background: #EDEDEDA3;
    border: 1px solid #737373;
    margin-bottom: 28px;
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
   font-size: 17px;
    font-weight: 900;
    box-sizing: border-box;
    background: #EDEDEDA3;
    border: 1px solid #737373;
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  background: none;
  color: black;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: 0.5s;
  border: 3px solid #000000;
  margin-top: 48px;
  &:hover {
    background: #000;
    color: #fff;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const AgreementText = styled.label`
  font-size: 12px;
  color: #6D6D6D;
  line-height: 1.4;
  font-weight: 600;
  margin-top: 21px;
`;


export default function Contact() {
  const history = useHistory();
  // State to store form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "",
    message: "",
  });
  useEffect(() => {
    document.title = "Contact";
}, []);
  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message); // For debugging or show success message
      history.push("/thank-you");
      // Optionally clear the form or show a success alert
    } catch (error) {
      console.error("Error sending contact form:", error);
      // Optionally show an error alert
    }
  };

  return (
    <Page>
      <BackgroundContainer>
        <FormWrapper>
          <FormTitle>Send us a message</FormTitle>
          <StyledForm onSubmit={handleSubmit}>
            <Label htmlFor="firstName">First Name*</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required="true"
            />

            <Label htmlFor="lastName">Last Name*</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
                      required="true"
            />

            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Label htmlFor="orderNumber">Order Number</Label>
            <Input
              type="text"
              id="orderNumber"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
            />

            <Label htmlFor="subject">Subject</Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />

            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
            />

            <SubmitButton type="submit">Submit</SubmitButton>

            <CheckboxContainer>
              <AgreementText htmlFor="agree">
                By continuing to checkout, I agree to the <NavLink to="/terms"><span style={{textDecoration: "underline"}}>Terms &amp; Conditions</span></NavLink>. I
                have read the <NavLink to="/privacy"><span style={{textDecoration: "underline"}}>Privacy Policy</span></NavLink> and the <NavLink to="/general"><span style={{textDecoration: "underline"}}>Return Policy</span></NavLink>
              </AgreementText>
            </CheckboxContainer>
          </StyledForm>
        </FormWrapper>
      </BackgroundContainer>
    </Page>
  );
}
