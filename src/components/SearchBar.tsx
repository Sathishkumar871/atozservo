import React from 'react';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search services..."
        className="search-input"
      />
      <button className="search-button">🔍</button>
    </div>
  );
};

export default SearchBar;
