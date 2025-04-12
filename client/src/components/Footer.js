import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
const Footer = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px 20px 10px 20px;
  .footer-linktxt {
    color: #555555;
    font-size: 10px;
    font-weight: 900;

  }
  .footer-linktxt:hover {
    color: #212121;
    font-size: 10px;
    font-weight: 900;

  }
    .footer-items {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
    }
    .footer-blocksin {
        text-align: center;
    }
    .footer-items2 {
        display: none;
    }
    .footer-itemsel {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }
    @media (max-width: 768px) {
      .footer-items2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 20px;
      }
      .footer-items {
        display: none;
      }
    }

`;

export default () => {
  return (
    <Footer className="footer">
        <div className="footer-items">
          
            <div className="footer-linktxt"><NavLink to="/terms">TERMS</NavLink></div>
            <div className="footer-linktxt"><NavLink to="/privacy">PRIVACY</NavLink></div>
            <div className="footer-blocksin">
                <div><a href="https://www.instagram.com/ersaintmcmliv"><img src={require("../assets/instagram-icon-1.svg")} /></a></div>
                <div className="footer-linktxt">© 2024 ERSAINT MCMLIV. ALL RIGHTS RESERVED</div>
            </div>
            <div className="footer-linktxt"><NavLink to="/general">GENERAL</NavLink></div>
            <div className="footer-linktxt"><NavLink to="/contact">CONTACT</NavLink></div>
        </div>
        <div className="footer-items2">
        <div className="footer-blocksin">
                <div style={{marginBottom: "10px"}}><a href="https://www.instagram.com/ersaintmcmliv"><img src={require("../assets/instagram-icon-1.svg")} /></a></div>
                </div>
            <div className="footer-itemsel">
                <div className="footer-linktxt"><NavLink to="/terms">TERMS</NavLink></div>
                <div className="footer-linktxt"><NavLink to="/privacy">PRIVACY</NavLink></div>
              
                <div className="footer-linktxt"><NavLink to="/general">GENERAL</NavLink></div>
                <div className="footer-linktxt"><NavLink to="/contact">CONTACT</NavLink></div>
            </div>
            <div className="footer-linktxt">© 2024 ERSAINT MCMLIV. ALL RIGHTS RESERVED</div>
        </div>
    </Footer>
  );
};
