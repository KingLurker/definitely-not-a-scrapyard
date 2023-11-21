import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;

  /*
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await fs.database().ref('products').orderByChild('title')
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