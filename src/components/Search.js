import React, { useState, useEffect } from 'react';
import {fs} from '../config/Config';
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";

const Search = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  /*
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await fs.database().ref('products').orderByChild('name')
          .startAt(searchQuery.toLowerCase()).endAt(searchQuery.toLowerCase + '\uf8ff')
          .once('value');

  const data = snapshot.val();

  if (data) {
    const array = Object.keys(data).map(key => ({id: key, ...data[key] }));
    setSearchResults(array);

  } else {
    setSearchResults([]);
    }
    }
  }
};
*/
}
export default Search;