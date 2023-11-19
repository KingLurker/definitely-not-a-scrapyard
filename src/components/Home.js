import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Products } from "./Products";
import { auth, fs } from "../config/Config";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  // State to store the current user
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const uid = GetUserUid();

  const navigate = useNavigate();

  // gettin current user uid
  function GetUserUid() {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    return uid;
  }

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

  // Gets all of the products from the DB
  useEffect(() => {
    const getProducts = async () => {
      const productsCol = collection(fs, "products");
      const productSnapshots = await getDocs(productsCol);
      const productsList = productSnapshots.docs.map((doc) => ({
        ID: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    getProducts();
  }, []);

  // Creates a new cart for the user
  const addToCart = async (product) => {
    if (uid !== null) {
      // Prepare the product object to be added to cart
      let Product = { ...product, qty: 1, TotalProductPrice: product.price };

      // Create a reference to the cart document for the current user
      const cartDocRef = doc(fs, `Cart ${uid}`, product.ID);

      try {
        // Set the product data in the cart document
        await setDoc(cartDocRef, Product);
        console.log("successfully added to cart");
      } catch (error) {
        console.error("Error adding to cart: ", error);
      }
    } else {
      // Navigate the user to the login page if they're not logged in
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar user={user} />
      <br></br>
      {products.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">Products</h1>
          <div className="products-box">
            <Products products={products} addToCart={addToCart}></Products>
          </div>
        </div>
      )}
      {products.length < 1 && (
        <div className="container-fluid">Please wait...</div>
      )}
    </>
  );
};
