import React from "react";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../Assets/images/logo.png";


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div>
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>
        <div className="nav-links">
          <Link to="/">HOME</Link>
          <div className="dropdown">
            <Link to="#">ABOUT ▾</Link>
            <div className="dropdown-content">
              <Link to="/about">About Us</Link>
              <Link to="/mission">Mission & Vision</Link>
            </div>
          </div>
          <Link to="/donor">BECOME A DONOR</Link>
          <Link to="/plan">OUR PLAN</Link>
          <Link to="/legals">LEGALS</Link>
          <Link to="/login">LOGIN</Link>
          <Link to="/register">REGISTRATION</Link> 
          <Link to="/contact">CONTACT</Link>
        </div>

        <div
          className="hamburger"
          onClick={() => {
            document.querySelector(".nav-links").classList.toggle("open");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
