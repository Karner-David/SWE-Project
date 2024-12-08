import './CartProduct.css';
import React, { useState, useEffect } from 'react';
import ButtonRounded from '../ButtonRounded/ButtonRounded';
import { useNavigate } from 'react-router-dom';

function CartProduct({ cartProductInfo, removeProductFromCart, }) {

  const formatPrice = (amount) => {
    console.log(cartProductInfo)

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatIssuesPerYear = () => {
    return `${cartProductInfo.issues} Issues / Year`;
  };

  const navigate = useNavigate();

  return(
    <div className='row cart-products-row' style={{
      marginBottom: '1rem',
      marginRight: '2rem',
    }}>

      <div className='col p-0 test' onClick={() => {navigate(`/products/${cartProductInfo.product_id}`)}}>
        <div className='row'>
          <div className='col cart-product-image-col'>
            <img src={cartProductInfo.cover}>
            </img>
          </div>
        </div>
      </div>

      <div className='col cart-products-col' style={{
        marginLeft: '1rem',
        marginTop: '-0.125rem'
      }}>
        <div className='row'>
          <div className='col'>
            <div className='row'>
              <div className='col' style={{
                fontSize: '1.5rem',
                fontWeight: 600
              }}>
                {cartProductInfo.title}
              </div>
            </div>

            <div className='row'>
              <div className='col' style={{
                fontSize: '1rem',
                fontWeight: 500,
                marginTop: '-0.25rem'
              }}>
                {`One Year Subscription - ${
                  (cartProductInfo.type === 'MAGAZINE') ? formatIssuesPerYear() : cartProductInfo.city
                  }`}
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <div className='row'>
              <div className='col'style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginTop: '-1rem'
              }}>
                {formatPrice(cartProductInfo.price)}
              </div>
            </div>

            <div className='row'>
              <div className='col'style={{
                fontSize: '1rem',
                marginTop: '-0.25rem'
              }}>
                {`Estimated Tax: ${formatPrice(cartProductInfo.estimated_tax)}`}
              </div>
            </div>

            <div className='row'>
              <div className='col'style={{
                fontSize: '1rem',
                marginTop: '-0.25rem'
              }}>
                {`Points Gained: ${cartProductInfo.points_gained}`}
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <ButtonRounded
              onClick={() => {removeProductFromCart(cartProductInfo.product_id)}}
              text={'Remove From Cart'}
              textSize={'1rem'}
              textWeight={'700'}
              showBorder={true}
              borderColor={'#D9D9D9'}
              borderRadius={'0.5rem'}
              backgroundColor={'#FFFFFF'}
              accentColor={'#4D4D4D'}
            />
          </div>
        </div>

      </div>

    </div>
  );
}

export default CartProduct;