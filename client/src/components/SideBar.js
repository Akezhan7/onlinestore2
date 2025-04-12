import React from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { TiTimes } from "react-icons/ti";
import { useSelector } from "react-redux";
import useModal from "../hooks/useModal";

const SideBar = styled.div`
  height: var(--vh);
  width: calc(var(--vw) * 0.8);
  max-width: 400px;
  
  button.close {
    margin-left: auto;
  }
  .content {
    width: 80%;
    margin: 50px auto;
  }
  .links {
    text-transform: uppercase;
    font-variant: small-caps;
    font-weight: bold;
    font-size: 1.15rem;
    padding: 20px 0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .links li,
  .other-links li {
    margin: 10px 0;
  }
  .links li .link-active {
    text-decoration: line-through;
  }
  .other-links {
    font-size: 1.1rem;
    margin: 20px 0;
    text-transform: capitalize;
  }
`;

const Sidebar = () => {
  const display = useModal();
  const categories = useSelector((state) => state.global.categories); // Получаем категории из Redux

  function closeModal() {
    display({ type: "CLOSE" });
  }

  return (
    <SideBar>
      <button className="button close" onClick={closeModal}>
        <TiTimes size={20} />
      </button>
      <div className="content">
        <ul className="links">

          {/* Вывод категорий */}
          {categories.map((category) => (
            <li key={category.id} onClick={closeModal}>
              <NavLink to={`/shop/${category.name}`} activeClassName="link-active">
                {category.name}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* <ul className="other-links">
          <li onClick={closeModal}>
            <Link to="/order-tracking">Order Tracking</Link>
          </li>
          <li onClick={closeModal}>
            <Link to="/faq">FAQ</Link>
          </li>
          <li onClick={closeModal}>
            <Link to="/return-policy">Return Policy</Link>
          </li>
        </ul> */}
      </div>
    </SideBar>
  );
};

export default Sidebar;
