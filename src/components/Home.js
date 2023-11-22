import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { auth, fs } from "../config/Config";
import { Products } from "./Products";
import { IndividualFilteredProduct } from "./IndividualFilteredProducts";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm.toLowerCase().trim());
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export const Home = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const uid = useUserUid();
  const navigate = useNavigate();

  function useUserUid() {
    const [uid, setUid] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });

      return unsubscribe;
    }, []);

    return uid;
  }

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

    return () => unsubscribe();
  }, []);


  //Get all items for cards
  useEffect(() => {
    const getProducts = async () => {
      const productsCol = collection(fs, "products");
      const productSnapshots = await getDocs(productsCol);
      const productsList = productSnapshots.docs.map((doc) => ({
        ID: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
      setSearchResults(productsList); // Initialize search results with all products
    };

    getProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setSearchResults(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
      );
      setSearchResults(filtered);
    }
  };

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


  //Sorting function
  const [spans]=useState([
    {id: 'Price', text: 'Price'},
    {id: 'Quantity', text: 'Quantity'}
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
  const returntoAllProducts=()=>{
      setActive('');
    setCategory('');
    setFilteredProducts([]);
  }


  return (
    <>
      <Navbar user={user} />
      <div className="searchbar">
      <SearchBar onSearch={handleSearch} />
      </div>
      <div className='container-fluid'>
        <div className='filter-box'>
          <h6>Filters</h6>
          {spans.map((individualSpan,index)=>(
                    <span key={index} id={individualSpan.id}
                    onClick={()=>handleChange(individualSpan)}
                    className={individualSpan.id===active ? active:'deactive'}>{individualSpan.text}</span>
                ))}
        </div>
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
               
        <div className='my-products'>
          {searchResults.length > 0 ? (
            <div className='products-box'>
              {searchResults.map(product => (
                <IndividualFilteredProduct key={product.ID} individualFilteredProduct={product} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div>No products found...</div>
          )}
        </div>
    </>
  );
};



export default Home;
