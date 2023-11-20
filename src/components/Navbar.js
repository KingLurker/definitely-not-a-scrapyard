import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../config/Config";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ user, totalProducts }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  // Check if the logged-in user is the admin
  const adminUID = "admin@dnas.com";
  const isAdmin = user === adminUID;

  // Debug: Log the user object and whether they are recognized as admin
  React.useEffect(() => {
    console.log("User object:", user);
    console.log("Is Admin:", isAdmin);
  }, [user, isAdmin]);

  return (
    <div className="navbar">
      <div className="leftside">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="rightside">
        {!user && (
          <>
            <div>
              <Link className="navlink" to="signup">
                SIGN UP
              </Link>
            </div>
            <div>
              <Link className="navlink" to="login">
                LOGIN
              </Link>
            </div>
          </>
        )}

        {user && !isAdmin && (
          <>
            <div>
              <Link className="navlink" to="/">
                {user}
              </Link>
            </div>
            <div className="cart-menu-btn">
              <Link className="navlink" to="cart">
                <Icon icon={shoppingCart} size={20} />
              </Link>
              <span className="cart-indicator">{totalProducts}</span>
            </div>
            <div className="btn btn-danger btn-md" onClick={handleLogout}>
              LOGOUT
            </div>
          </>
        )}

        {isAdmin && (
          <>
            {/* Same HTML structure for the admin, for testing purposes */}
            <div>
              <Link className="navlink" to="addproduct">
                ADD PRODUCTS
              </Link>
            </div>
            <div>
              <Link className="navlink" to="/">
                Admin: {user}
              </Link>
            </div>
            <div className="cart-menu-btn">
              <Link className="navlink" to="cart">
                <Icon icon={shoppingCart} size={20} />
              </Link>
              <span className="cart-indicator">{totalProducts}</span>
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
