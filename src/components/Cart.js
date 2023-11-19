import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { auth, fs } from "../config/Config";
import { CartProducts } from "./CartProducts";
import {
  collection,
  doc,
  query,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

export const Cart = () => {
  // State to store the current user
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

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

  return (
    <>
      <Navbar user={user} />
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
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className="container-fluid">No products to show</div>
      )}
    </>
  );
};
