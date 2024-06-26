import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { auth, fs } from "../config/Config";
import { CartProducts } from "./CartProducts";
import {
  collection,
  doc,
  query,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  // State to store the current user
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  // Effect to get the current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        const userRef = doc(fs, "users", userAuth.uid);
        getDoc(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUser(snapshot.data().Email);
            } else {
              console.log("No user document found");
            }
          })
          .catch((error) => {
            console.error("Error getting user document:", error);
          });
      } else {
        setUser(null);
      }
    });

    // Clean up the onAuthStateChanged listener
    return () => unsubscribe();
  }, []);

  // Effect to retrieve the user's cart
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(fs, "Cart " + user.uid));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });

        return () => unsubscribeSnapshot; // Unsubscribe from the snapshot when the component unmounts
      } else {
        console.log("User is not signed in to retrieve cart");
        setCartProducts([]); // Reset cart products if there is no user
      }
    });

    return () => unsubscribe(); // Unsubscribe from auth state changes when the component unmounts
  }, []);

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    let Product = { ...cartProduct, qty: cartProduct.qty + 1 };
    Product.TotalProductPrice = Product.qty * Product.price;

    auth.onAuthStateChanged((user) => {
      if (user) {
        const productRef = doc(fs, `Cart ${user.uid}`, cartProduct.ID);
        updateDoc(productRef, Product).then(() => {
          console.log("increment added");
        });
      } else {
        console.log("user is not logged in to increment");
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    if (cartProduct.qty > 1) {
      let Product = { ...cartProduct, qty: cartProduct.qty - 1 };
      Product.TotalProductPrice = Product.qty * Product.price;

      auth.onAuthStateChanged((user) => {
        if (user) {
          const productRef = doc(fs, `Cart ${user.uid}`, cartProduct.ID);
          updateDoc(productRef, Product).then(() => {
            console.log("decrement");
          });
        } else {
          console.log("user is not logged in to decrement");
        }
      });
    }
  };

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const cartCollectionRef = collection(fs, `Cart ${user.uid}`);
        const unsubscribeSnapshot = onSnapshot(
          cartCollectionRef,
          (snapshot) => {
            const qty = snapshot.docs.length;
            setTotalProducts(qty);
          }
        );

        return unsubscribeSnapshot; // Unsubscribes from the cart collection snapshot when the component unmounts.
      } else {
        setTotalProducts(0); // Reset total products if there is no user.
      }
    });

    return unsubscribe; // Unsubscribes from auth state changes when the component unmounts.
  }, []);

  // getting the qty from cartProducts in a seperate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  // getting the TotalProductPrice from cartProducts in a seperate array
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  // reducing the price in a single value
  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);

  // charging payment
  const handleToken = async (token) => {
    console.log(token);
    const cart = { name: "All Products", totalPrice };
    const response = await axios.post("http://localhost:8080/checkout", {
      token,
      cart,
    });
    console.log(response);
    let { status } = response.data;
    console.log(status);
    if (response.data.status === "success") {
      navigate("/");
      toast.success("Your order has been placed successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      // Clear the cart after successful checkout
      const uid = auth.currentUser.uid;
      const cartSnapshot = await getDocs(collection(fs, `Cart ${uid}`));
      cartSnapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(fs, `Cart ${uid}`, document.id));
      });
    } else {
      alert("Something went wrong in checkout");
    }
  };

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleApplyCoupon = async () => {
    const couponsCollectionRef = collection(fs, "coupons");
    const couponsSnapshot = await getDocs(couponsCollectionRef);
    const coupons = couponsSnapshot.docs.map((doc) => doc.data());

    const matchedCoupon = coupons.find((c) => c.code === couponCode);
    if (matchedCoupon) {
      setDiscount(matchedCoupon.discount);
      toast.info(
        `Coupon applied! ${matchedCoupon.discount * 100}% off your purchase.`
      );
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  // Adjust the totalPrice based on the discount
  const discountedPrice = (totalPrice * (1 - discount)).toFixed(2);

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br></br>
      {cartProducts.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">Cart</h1>
          <div className="products-box">
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
            />
          </div>
          <div className="summary-box">
            <h5>Cart Summary</h5>
            <br></br>
            <div>
              Total No of Products: <span>{totalQty}</span>
            </div>
            <div>
              Total Price to Pay:{" "}
              <span>$ {(totalPrice * 1.0825).toFixed(2)}</span>
            </div>
            <div>
              Coupon:
              <br />
              <input
                className="form-control"
                value={couponCode}
                onChange={handleCouponCodeChange}
              />
              <button onClick={handleApplyCoupon}>Apply Coupon</button>
            </div>
            <br />
            <div>
              Total Price to Pay after discount:{" "}
              <span>$ {(discountedPrice * 1.0825).toFixed(2)}</span>
            </div>
            <br />
            <br></br>
            <StripeCheckout
              stripeKey="pk_test_51OCBCTIIejFEPErE9KQZKll56fiA6vpa8TTVnkam8kAdINbVT5qbEEczxjZiEgAZFJ9G0L0wwWs7TGeRKjGLL2wk00kHsGSD7D"
              token={handleToken}
              billingAddress
              shippingAddress
              name="All Products"
              amount={Math.round(discountedPrice * 100 * 1.0825)}
            ></StripeCheckout>
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className="container-fluid">No products to show</div>
      )}
    </>
  );
};
