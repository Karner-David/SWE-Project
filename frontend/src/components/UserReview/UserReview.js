import './UserReview.css';
import React, { useState, useEffect } from 'react';
import ProductReview from '../ProductReview/ProductReview';
import axios from 'axios';
import ButtonRounded from '../ButtonRounded/ButtonRounded';
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

function UserReview({ review, approveReview, denyReview }) {

  const [product, setProduct] = useState(null);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/users/get-profile', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data.username);
        setAdmin(response.data.username === 'admin');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchAdminStatus(); 
  }, []);

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
  }, [review])

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

      <div className='col-9' style={{
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

      <div className='col-1'>
        {isAdmin && (
          <div className='row'>
            <div className='col'>

              <div className='row'>
                <div className='col-auto p-0'>
                  <ButtonRounded 
                      onClick={() => {approveReview(review.review_id)}}
                      borderRadius={'1.5rem'}
                      paddingHorizontal={'0.75rem'}
                      backgroundColor={'#11A36F'}
                      startIcon={FaCheck}
                      startIconSize={'1.5rem'}
                    />
                </div>
              </div>

              <div className='row'>
                <div className='col-auto px-0 py-2'>
                  <ButtonRounded 
                      onClick={() => {denyReview(review.review_id)}}
                      borderRadius={'1.5rem'}
                      paddingHorizontal={'0.625rem'}
                      showBorder={true}
                      borderColor='#D9D9D9'
                      backgroundColor={'#FFFFFF'}
                      accentColor={'#4D4D4D'}
                      startIcon={FaTimes}
                      startIconSize={'1.5rem'}
                    />
                </div>
              </div>

            </div>
          </div>
        )}
        
      </div>

      
    </div>
  );
}

export default UserReview;