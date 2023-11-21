import React, { useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { fs } from '../config/Config';
import Search from './Search';
import { Products } from './Products';

const SearchResults = () => {
  const [products, setProducts] = useState([]);

  const searchProduct = async (searchTerm) => {
    // Assuming items are stored in a collection named 'items' and you're searching 'name' field
    const itemsRef = collection(fs, "items");
    const q = query(itemsRef, where("name", "==", searchTerm));

    try {
      const querySnapshot = await getDocs(q);
      const searchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(searchedProducts);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  return (
    <div>
      <div className="searchbar">
      <Search onSearch={searchProduct} />
      <Products products={products}/>
      </div>
    </div>
  );
};

export default SearchResults;
