import React, { useState } from 'react';
import './SearchBar.css';
import { IoSearch } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";

const SearchBar = ({ defaultText, initialSearchTerm, onSearch, onMenu }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ? initialSearchTerm : '');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className='row' id='background-row'>

      <div className='col-auto p-0' id='left-icon-col' onClick={handleSearch}>
        <IoSearch />
      </div>

      <div className='col' id='input-col'>
        <input
          type='text'
          className='search-input'
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={defaultText}
          onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='col-auto p-0' id='right-icon-col' onClick={onMenu}>
        <IoMenu />
      </div>

    </div>






  );
};

export default SearchBar;


