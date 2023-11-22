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
        <form onSubmit={handleSearch} className="searchbar-form">
            <input
                type="text"
                className="search-input"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
                Search
            </button>
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

    useEffect(() => {
        const getProducts = async () => {
            const productsCol = collection(fs, "products");
            const productSnapshots = await getDocs(productsCol);
            const productsList = productSnapshots.docs.map((doc) => ({
                ID: doc.id,
                ...doc.data(),
            }));
            setProducts(productsList);
            setSearchResults(productsList); 
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

    const addToCart = async (product) => {
        if (uid !== null) {
            let Product = { ...product, qty: 1, TotalProductPrice: product.price };
            const cartDocRef = doc(fs, `Cart ${uid}`, product.ID);

            try {
                await setDoc(cartDocRef, Product);
                console.log("successfully added to cart");
            } catch (error) {
                console.error("Error adding to cart: ", error);
            }
        } else {
            navigate("/login");
        }
    };

    const [spans] = useState([
        { id: 'Price', text: 'Price' },
        { id: 'Quantity', text: 'Quantity' }
    ]);

    const [totalProducts, setTotalProducts] = useState('');
    const [active, setActive] = useState('');
    const [category, setCategory] = useState('');

    const handleChange = (individualSpan) => {
        setActive(individualSpan.id);
        setCategory(individualSpan.text);
        filterFunction(individualSpan.text);
    };

    const [filteredProducts, setFilteredProducts] = useState([]);

    const filterFunction = (category) => {
        let sortedProducts = [];

        if (products.length > 1) {
            if (category === 'Price') {
                sortedProducts = [...products].sort((a, b) => a.price - b.price);
            } else if (category === 'Quantity') {
                sortedProducts = [...products].sort((a, b) => b.qty - a.qty);
            }

            setFilteredProducts(sortedProducts);
        } else {
            console.log('No products to sort');
        }
    };

    const returntoAllProducts = () => {
        setActive('');
        setCategory('');
        setFilteredProducts([]);
    };


    return (
      <>
        <Navbar user={user} />
        <div className="searchbar">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className='container-fluid'>
          <div className='filter-box'>
            <h6>Filters</h6>
            {spans.map((individualSpan, index) => (
              <span key={index} id={individualSpan.id}
                onClick={() => handleChange(individualSpan)}
                className={individualSpan.id === active ? 'active' : 'deactive'}>
                {individualSpan.text}
              </span>
            ))}
          </div>
          {filteredProducts.length > 0 ? (
            <div className='my-products'>
              <h1 className='text-center'>{category}</h1>
              <a href="#" onClick={returntoAllProducts}>Return to All Products</a>
              <div className='products-box'>
                {filteredProducts.map(individualFilteredProduct => (
                  <IndividualFilteredProduct key={individualFilteredProduct.ID}
                    individualFilteredProduct={individualFilteredProduct}
                    addToCart={addToCart} />
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className='my-products'>
              <div className='products-box'>
                {searchResults.map(product => (
                  <IndividualFilteredProduct key={product.ID} individualFilteredProduct={product} addToCart={addToCart} />
                ))}
              </div>
            </div>
          ) : (
            <div className='my-products please-wait'>Please wait...</div>
          )}
        </div>
      </>
    );
  };
  



export default Home;

