import React, { useEffect, useState } from 'react';
import './SearchPage.css';
import SearchProduct from '../../components/SearchProduct/SearchProduct';
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const SearchPage = ( {addProductToCart, removeProductFromCart, currentCartProducts} ) => {

  const [searchResults, setSearchResults] = useState();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');
  const getResults = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/products/get', {
        params: searchParams
      });
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {

    }
  }

  useEffect(() => {
    getResults();
  }, [location.search])

  const isProductInCart = (id) => {
    return currentCartProducts?.some(product => product.product_id === id);
  };
  
  return (
    <div className='container'>

      <div className='row'>
        <div className='col' id='result-message-col'>
          {searchResults?.length} Results {searchTerm ? ` For "${searchTerm}"` : ''}
        </div>
      </div>

      <div className='row'>
        {searchResults ? searchResults.map(result => (
          <div className='col-12 col-sm-6 col-md-4 col-lg-3 my-3 px-3'>
            <SearchProduct
              id = {result.product_id}
              isMagazine={result.type}
              cover={result.cover}
              title={result.title}
              price={result.price}
              issues={result.issues}
              city={result.city}
              rating={result.rating}
              addProductToCart={(id) => {addProductToCart(id)}}
              removeProductFromCart={(id) => {removeProductFromCart(id)}}
              productInCart={isProductInCart(result.product_id)}
            />
          </div>
        )) : <div></div>}
      </div>
    </div>
  );
};


export default SearchPage;
