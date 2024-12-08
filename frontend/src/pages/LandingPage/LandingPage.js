import './LandingPage.css';
import React, { useState, useEffect, useRef } from 'react';
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';
import { FaArrowRight } from "react-icons/fa";
import axios from 'axios';
import SearchProduct from '../../components/SearchProduct/SearchProduct';
import {useNavigate} from 'react-router-dom';

function LandingPage({ currentSearchType, addProductToCart, removeProductFromCart, currentCartProducts }) {

  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const [buttonBottom, setButtonBottom] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [searchResults, setSearchResults] = useState();
  const navigate = useNavigate();

  const isProductInCart = (id) => {
    return currentCartProducts?.some(product => product.product_id === id);
  };

  const getResults = async () => {
    const searchParams = {
      type: currentSearchType,
      sortby: 'none',
      orderby: 'descending',
      count: 8,
      search: ''
    }
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
  }, [currentSearchType])

  useEffect(() => {
    const getButtonBottom = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonBottom(rect.bottom);
      }
    };

    const getContainerWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
      }
    };

    getButtonBottom();
    getContainerWidth();
    window.addEventListener('resize', getButtonBottom);
    window.addEventListener('resize', getContainerWidth);
    return () => {
      window.removeEventListener('resize', getButtonBottom);
      window.removeEventListener('resize', getContainerWidth);
    };
  }, []);



  return(
    <div className='container-fluid d-flex justify-content-center' ref={containerRef}>
      <img
        id='landing-background-img'
        src={require('../../images/log-in-sign-up-background.jpg')}
        alt='A big rack of magazines'
      />

      <div className='container' style={{zIndex: 1}}>
        <div className='row'>
          <div className='col'style={{
            marginTop: '15rem',
            fontSize: '4rem',
            fontWeight: '700',
            color: '#FFFFFF'
          }}>
            News. Magazines. Delivered.
          </div>
        </div>
        <div className='row' style={{width: '50%'}}>
          <div className='col'style={{
            marginTop: '0rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#FFFFFF',
          }}>
            Get instant access to the latest headlines and exclusive magazine content, all in one place. Subscribe now for unlimited stories, in-depth features, and expert insights – delivered directly to you for free.
          </div>
        </div>
        <div className='row'>
          <div className='col-auto p-0' ref={buttonRef} style={{
            marginTop: '2rem'
          }}>
            <ButtonRounded
              onClick={() => {navigate(`/search?type=${currentSearchType}&sortby=none&orderby=ascending&search=`)}}
              text={'Shop Now'}
              textSize={'1.5rem'}
              textWeight={700}
              endIcon={FaArrowRight}
              endIconGap={'0.5rem'}
              borderRadius={'2rem'}
              paddingHorizontal={'2rem'}
              buttonHeight={'4rem'}
            />
          </div>
        </div>
        <div className='row' style={{
          marginTop: '11rem',
          }}>
          <div className='col'>
            <div className='row'>
              <div className='col' id='result-message-col'>
                {`Our Latest ${currentSearchType === 'MAGAZINE' ? 'Magazine' : 'Newspaper'} Releases`}
              </div>
            </div>
          </div>
        </div>
        <div className='row' style={{
          marginTop: '0rem',
          }}>
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

      <div id='content-background' style={{
        position: 'absolute',
        top: buttonBottom ? `calc(${Math.round(buttonBottom)}px + 15rem)` : 0,
        borderRadius: '3rem 3rem 0 0',
        height: '100vh',
        width: containerWidth ? `${containerWidth}px` : '100vw',
        backgroundColor: '#FFFFFF',
        transition: 'all 1s cubic-bezier(0.66, 0.0, 0.33, 1)'
      }}>

      </div>

    </div>
  );
}

export default LandingPage;