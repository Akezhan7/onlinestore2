import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import useModal from "../hooks/useModal";

const HomeHeader = styled.header`
  height: 70px;
  background: transparent;
  padding-top: 15px;
padding-top: 15px;
  .header__content {
    width: 99%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    height: 100%;
    color: white;
  }

  .nav {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .menu-button {
    flex: 1;
    position: relative;
  }

  .logo {
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    width: 40px;
    height: 40px;
  }

  .logo.open {
    transform: translateX(190px);
    position: relative;
    z-index: 10;
  }

  .links {
    width: 60%;
    text-transform: uppercase;
    font-variant: small-caps;
    font-weight: bold;
    justify-content: center;
    display: flex;
  }

  .links li {
    margin-left: 10px;
  }

  .actions {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .cart {
    position: relative;
    color: white;
 
  }

  .cart .label {
    font-weight: 900;
    font-size: 18px;
  }
  .cart span {
          font-weight: 900;
    font-size: 18px;
      font-family: "Satoshi", sans-serif !important;
  }

  .link-active {
    text-decoration: line-through;
  }

  @media (max-width: 968px) {
    .logo.open {
      transform: none;
    }
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  border-radius: 5px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 13px 10px;
    color: ${({ textColor }) => textColor || "white"};
    cursor: pointer;
    transition: background 0.2s ease-in-out;
    font-size: 18px;
    text-align: center;
  }

  li:hover {
    color: #727272;
  }

  li a {
    text-transform: uppercase !important;
    font-weight: 600;
  }
`;

const FullScreenMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: white;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  justify-content: space-evenly; /* Равномерное распределение по вертикали */
  align-items: center;
  text-align: center;
  padding: 0 20px; /* Горизонтальные отступы от краёв */
  z-index: 5000;

  .menu-logo {
    width: 80px;
    height: 80px;
    /* Убираем нижний margin, так как распределение через space-evenly */
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 15px 0; /* Отступы сверху и снизу для каждого пункта */
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }

  li a {
    color: black;
    text-transform: uppercase;
    text-decoration: none;
  }

  li a:hover {
    color: #727272;
  }
`;


export default () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
  const qty = useSelector((state) => state.cart.qty);
  const display = useModal();
  const categories = useSelector((state) => state.global.categories);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <HomeHeader>
      <div className="header__content">
        <nav className="nav">
          <div className="menu-button">
            <img
              src={require("../assets/BUTTONWHITE.svg")}
              alt="logo"
              className={menuOpen && !isMobile ? "logo open" : "logo"}
              onClick={toggleMenu}
            />
          </div>

          {/* Навигационные ссылки с изображением */}
          <ul className="links">
            <li>
              <NavLink to="/" activeClassName="link-active" exact>
                <img src={require("../assets/LOGO2dasd12.png")} alt="logo1" />
              </NavLink>
            </li>
          </ul>

          <ul className="actions">
            <li className="cart">
               <NavLink to="/cart" exact>
               <span>BAG</span>
               {qty > 0 && <span className="label"> / {qty}</span>}
               </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* ПК версия меню */}
      {!isMobile && (
        <Menu isOpen={menuOpen} textColor="white">
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <NavLink to={`/shop/${category.name}`} activeClassName="link-active" onClick={toggleMenu}>
                  {category.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </Menu>
      )}

      {/* Мобильная версия меню */}
      {isMobile && (
        <FullScreenMenu isOpen={menuOpen}>
          <img
            src={require("../assets/logo1.png")}
            alt="menu-logo"
            className="menu-logo"
          />
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <NavLink to={`/shop/${category.name}`} activeClassName="link-active" onClick={toggleMenu}>
                  {category.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </FullScreenMenu>
      )}
    </HomeHeader>
  );
};
