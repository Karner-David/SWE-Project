import './UserReview.css';
import React, { useState, useEffect } from 'react';
import ProductReview from '../ProductReview/ProductReview';
import axios from 'axios';
import ButtonRounded from '../ButtonRounded/ButtonRounded';

function UserReview({ review }) {

  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const id = review.product_id;
      const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
      setProduct(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchProduct()
  }, [])

  if (product == null) {
    return(<div></div>)
  }

  return(
    <div className='row'>

      <div className='col-2 test'>
        <div className='row'>
          <div className='col user-review-image-col'>
            <img src={product.cover}>
            </img>
          </div>
        </div>
      </div>

      <div className='col-10' style={{
        paddingLeft: '1rem'
        }}>
        <div className='row'>
          <div className='col' style={{
            fontSize: '1rem',
            fontWeight: 700
          }}>
            {review.review_status}
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <ProductReview review={review}/>
          </div>
        </div>
        
      {/* buttons here */}

      </div>

    </div>
  );
}

export default UserReview;