import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Products } from "./Products";
import { auth, fs } from "../config/Config";
import { IndividualFilteredProduct } from "./IndividualSortedProducts";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  // State to store the current user
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const uid = useUserUid();

  const navigate = useNavigate();

  // Custom hook to get the current user uid
  function useUserUid() {
    const [uid, setUid] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });

      return unsubscribe; // Correctly return the unsubscribe function
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


  //----------Testing Filters--------------
  
  //Sorted items
  const [spans]=useState([
    {id: 'Price', text: 'Price'},
    //{id: 'Quantity', text 'Quantity'}, need to add to db         
])

  const [totalProducts, setTotalProducts]=useState('');
  const [active, setActive]=useState('');
  const [category, setCategory]=useState('');

  const handleChange=(individualSpan)=>{
    setActive(individualSpan.id);
    setCategory(individualSpan.text);
    filterFunction(individualSpan.text);
}
  const [filteredProducts, setFilteredProducts]=useState([]);
  // Sorts by increasing
  const filterFunction = () => {
    if (products.length > 1) {
      const filtered = [...products].sort((a, b) => a.price - b.price);
      setFilteredProducts(filtered);
  } else {
    console.log('No products to sort');
  }
};
// Return to unsorted
const returntoAllProducts=()=>{
    setActive('');
    setCategory('');
    setFilteredProducts([]);
}
return (
    <>
      <Navbar user={user} totalProducts={totalProducts}/>           
        <br></br>
        <div className='container-fluid filter-products-main-box'>
            <div className='filter-box'>
                <h6>Filters</h6>
                {spans.map((individualSpan,index)=>(
                    <span key={index} id={individualSpan.id}
                    onClick={()=>handleChange(individualSpan)}
                    className={individualSpan.id===active ? active:'deactive'}>{individualSpan.text}</span>
                ))}
            </div>
            {filteredProducts.length > 0&&(
              <div className='my-products'>
                  <h1 className='text-center'>{category}</h1>
                  <a href="javascript:void(0)" onClick={returntoAllProducts}>Return to All Products</a>
                  <div className='products-box'>
                      {filteredProducts.map(individualFilteredProduct=>(
                          <IndividualFilteredProduct key={individualFilteredProduct.ID}
                          individualFilteredProduct={individualFilteredProduct}
                          addToCart={addToCart}/>
                      ))}
                  </div>
              </div>  
            )}
            {filteredProducts.length < 1&&(
                <>
                    {products.length > 0&&(
                        <div className='my-products'>
                            <h1 className='text-center'>All Products</h1>
                            <div className='products-box'>
                                <Products products={products} addToCart={addToCart}/>
                            </div>
                        </div>
                    )}
                    {products.length < 1&&(
                        <div className='my-products please-wait'>Please wait...</div>
                    )}
                </>
            )}
        </div>       
    </>
)
}


/* old product display. DO NOT DELETE
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
*/
