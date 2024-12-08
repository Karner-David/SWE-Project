import './SubscriptionProduct.css';
import React, { useState, useEffect } from 'react';
import ButtonRounded from '../ButtonRounded/ButtonRounded';
import axios from 'axios';

function SubscriptionProduct({ subscriptionProductInfo, }) {

  const productInfo = subscriptionProductInfo.product_info

  const formatPrice = (amount) => {
    console.log(subscriptionProductInfo)

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatIssuesPerYear = () => {
    return `${productInfo.issues} Issues / Year`;
  };

  if (productInfo == null) {
    return (
      <div></div>
    )
  }

  return(
    <div className='row subscription-products-row' style={{
      marginBottom: '1rem',
      marginRight: '2rem',
    }}>

      <div className='col p-0 test'>
        <div className='row'>
          <div className='col subscription-product-image-col'>
            <img src={productInfo.cover}>
            </img>
          </div>
        </div>
      </div>

      <div className='col subscription-products-col' style={{
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
                {productInfo.title}
              </div>
            </div>

            <div className='row'>
              <div className='col' style={{
                fontSize: '1rem',
                fontWeight: 500,
                marginTop: '-0.25rem'
              }}>
                {`One Year Subscription - ${
                  (productInfo.type === 'MAGAZINE') ? formatIssuesPerYear() : productInfo.city
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
                {formatPrice(productInfo.price)}
              </div>
            </div>

            <div className='row'>
              <div className='col'style={{
                fontSize: '1rem',
                marginTop: '-0.25rem'
              }}>
                {`Amount Refunded: ${formatPrice(subscriptionProductInfo.amount_to_refund)} + (${formatPrice(productInfo.estimated_tax)} Tax)`}
              </div>
            </div>

            <div className='row'>
              <div className='col'style={{
                fontSize: '1rem',
                marginTop: '-0.25rem'
              }}>
                {`Points Removed: ${productInfo.points_gained}`}
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <ButtonRounded
              onClick={() => {}}
              text={subscriptionProductInfo.cancellable ? 'Cancel Subscription' : 'Not Cancellable'}
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

export default SubscriptionProduct;