import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Page from "./Page";

const FourOFour = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1 {
    font-size: 3rem;
  }
  p {
    font-size: 1.1rem;
  }
  .button {
    width: calc(var(--vw) * 0.8);
    max-width: 200px;
    margin: 10px auto;
  }
`;

export default () => {
  useEffect(() => {
    document.title = "Thank-you";
}, []);
  return (
    <Page>
      <FourOFour>
        <div className="content">
          <h1>Thank you!</h1>
          <Link className="button" to="/">
            go home
          </Link>
        </div>
      </FourOFour>
    </Page>
  );
};
