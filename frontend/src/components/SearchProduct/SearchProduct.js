import React, { useState } from 'react';
import './SearchProduct.css';
import { IoIosStar } from "react-icons/io";
import ButtonRounded from '../ButtonRounded/ButtonRounded';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SearchProduct = ({ id, isMagazine, cover, title, price, issues, city, rating, productInCart, addProductToCart, removeProductFromCart,}) => {

  const formatPrice = () => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatIssuesPerYear = () => {
    return `${issues} Issues / Year`;
  };

  const formatRating = () => {
    return rating.toFixed(1);
  };

  const navigate = useNavigate();
    
  return (
    <div className='row search-product-outline' onClick={() => {navigate(`/products/${id}`);}}>
      <div className='col'>

        <div className='row'>
          <div className='col image-col'>
            <img src={cover}>
            </img>
          </div>
        </div>

        <div className='row'>
          <div className='col px-1 title-col'>
            {title}
          </div>
          <div className='col-auto px-1 price-col'>
            {formatPrice(price)}
          </div>
        </div>

        <div className='row extra-info-row'>
          <div className='col px-1 issues-col'>
            {isMagazine ? formatIssuesPerYear(issues) : city}
          </div>

          <div className='col-auto p-0'>
            <div className='row'>
              <div className='col-auto p-0 rating-col'>
                {formatRating(rating)}
              </div>
              <div className='col-auto d-flex align-items-center p-0'>
                <IoIosStar 
                  style={{
                    fontSize: '1.25rem',
                    color: '#11A36F',
                    marginLeft: '0.125rem',
                    marginRight: '0.25rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='row mt-1'>
          <div className='col'>
            <ButtonRounded
              onClick={(e) => {
                e.stopPropagation();
                productInCart ? removeProductFromCart(id) : addProductToCart(id)
              }}
              buttonHeight={'2rem'}
              text={`${productInCart ? 'Remove From' : 'Add To'} Cart`}
              showBorder={productInCart? true : false}
              borderColor='#D9D9D9'
              backgroundColor={productInCart ? '#FFFFFF' : '#11A36F'}
              accentColor={productInCart ? '#4D4D4D' : '#FFFFFF'}
              textWeight={700}
              borderRadius={'0.5rem'}
            />
          </div>
        </div>

     </div>
    </div>
  );
};


export default SearchProduct;
