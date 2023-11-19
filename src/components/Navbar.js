import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../config/Config";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="navbar">
      <div className="leftside">
        <div className="logo">
          <img src={logo} alt="logo"></img>
        </div>
      </div>
      <div className="rightside">
        {!user && (
          <>
            <div>
              <Link to="signup" className="navlink">
                SIGN UP
              </Link>
            </div>
            <div>
              <Link to="login" className="navlink">
                LOGIN
              </Link>
            </div>
          </>
        )}
        {user && (
          <>
            <div>
              <Link to="/">{user}</Link>
            </div>
            <div className="cart-menu-btn">
              <Link className="navlink" to="/cart">
                <Icon icon={shoppingCart} size={20}></Icon>
              </Link>
              {/* <span className="cart-indicator">{totalQty}</span> */}
            </div>
            <div className="btn btn-danger btn-md" onClick={handleLogout}>
              LOGOUT
            </div>
          </>
        )}
      </div>
    </div>
  );
};
