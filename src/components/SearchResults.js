import React, { useState } from 'react';
import { fs } from '../config/Config';
import Search from './Search';
import { Products } from './Products';
import { get, ref, query, orderByChild, equalTo } from "firebase/database";

const SearchResults = () => {
  const [products, setProducts] = useState([]);

  const searchProduct = async (searchTerm) => {
  }

  //Database fetch code

  //Need to modify output
  return (
    <div>
      <Search onSearch={searchProduct} />
      <Products products={products}/>
    </div>
  );
};

export default SearchResults;
