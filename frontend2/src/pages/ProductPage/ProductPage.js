import './ProductPage.css';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoIosStar } from "react-icons/io";
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';
import axios from 'axios';
import ProductReview from '../../components/ProductReview/ProductReview';
import FieldText from '../../components/FieldText/FieldText';
import { Button } from 'bootstrap';
import ReviewStars from '../../components/ReviewStars/ReviewStars';

function ProductPage( {addProductToCart, removeProductFromCart, currentCartProducts} ) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [userReviewRating, setUserReviewRating] = useState(5);
  const [userReviewText, setUserReviewText] = useState('');
  const [reviewErrorMessage, setReviewErrorMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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

    fetchProduct(); 
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = axios.get(`http://127.0.0.1:5000/reviews/product/${id}`);
        setReviews(response.data);
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

    fetchReviews(); 
  }, [product])

  if (!product) {
    return <div></div>;
  }

  const isProductInCart = () => {
    return currentCartProducts?.some(product => product.product_id == id);
  };

  const formatRating = () => {
    return product.rating.toFixed(1);
  };

  const formatIssuesPerYear = () => {
    return `${product.issues} Issues / Year`;
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const sampleReviews = [
    {
      review_id: 1,
      user_id: 101,
      product_id: 202,
      review_date: '2024-11-20',
      review_status: 'approved',
      review_text: 'Great product, highly recommend it!',
      review_rating: 3.5
    },
    {
      review_id: 2,
      user_id: 102,
      product_id: 203,
      review_date: '2024-11-22',
      review_status: 'approved',
      review_text: 'It works well, but the quality could be better.',
      review_rating: 1.6
    },
    {
      review_id: 3,
      user_id: 103,
      product_id: 204,
      review_date: '2024-11-25',
      review_status: 'approved',
      review_text: 'I am not satisfied with this product. It broke after one use.',
      review_rating: 3.4
    },
    {
      review_id: 4,
      user_id: 104,
      product_id: 205,
      review_date: '2024-11-26',
      review_status: 'approved',
      review_text: 'The design is amazing, and it functions perfectly.',
      review_rating: 3.9
    },
    {
      review_id: 5,
      user_id: 105,
      product_id: 206,
      review_date: '2024-11-27',
      review_status: 'approved',
      review_text: 'Decent product for the price. Nothing extraordinary.',
      review_rating: 5
    }
  ];
  
  const handleLeaveReview = async () => {

    const wordCount = userReviewText.trim().split(/\s+/).length;
    const sentenceCount = userReviewText.trim().split(/[.!?]+/).filter(Boolean).length;

    if (wordCount < 50 || sentenceCount < 5) {
      setReviewErrorMessage('Your review must be at least 50 words and 5 sentences long.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/reviews/leave-review', {
        product_id: id,
        review_text: userReviewText,
        review_rating: userReviewRating,
      });
      console.log('Review submitted:', response.data);

      // Clear the error message and alert success
      setReviewErrorMessage('');
      alert('Review submitted!');
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  };

  return(
    <div className='container' style={{marginTop: '6rem'}}>
      <div className='row'>
        <div className='col-5 product-cover-img'>
          <img src={product.cover}/>
        </div>

        <div className='col-7' style={{
          paddingLeft: '2rem'
        }}>
          <div className='row'>
            <div className='col' style={{
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              {product.title}
            </div>
          </div>
          <div className='row' style={{
            marginTop: '0.5rem'
          }}>
            <div className='col' style={{
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {`One Year Subscription - ${
                  (product.type === 'MAGAZINE') ? formatIssuesPerYear() : product.city
                  }`}
            </div>
          </div>
          <div className='row'>
            <div className='col-auto p-0' style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#27D99D'
            }}>
              {formatRating()}
            </div>
            <div className='col-auto p-0'>
              <IoIosStar 
                style={{
                  fontSize: '1.25rem',
                  color: '#27D99D',
                  marginLeft: '0.125rem',
                  marginRight: '0.25rem'
                }}
              />
            </div>
            <div className='col-auto p-0' style={{
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {reviews ? reviews.length : 0} Reviews
            </div>
          </div>
          <div className='row'>
            <div className='col' style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginTop: '0.5rem'
            }}>
              {formatPrice(product.price)}
            </div>
          </div>
          <div className='row'>
            <div className='col' style={{
              marginTop: '1.5rem'
            }}>
              <ButtonRounded
                onClick={(e) => {
                  e.stopPropagation();
                  isProductInCart() ? removeProductFromCart(id) : addProductToCart(id)
                }}
                text={`${isProductInCart() ? 'Remove From' : 'Add To'} Cart`}
                textSize={'1rem'}
                borderRadius={'0.5rem'}
              />
            </div>
          </div>
          <div className='row m-0'>
            <div className='col separator-line' style={{
              marginTop: '1rem'
            }}/>
          </div>
          <div className='row'>
            <div className='col' style={{
              fontSize: '1rem',
              fontWeight: '300'
            }}>
              Subscriptions will automatically renew at the end of each term unless canceled before the renewal date. Prices are subject to change, and any changes will be communicated in advance. All subscriptions are non-refundable once activated. For full terms and conditions, please refer to our 
              <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and 
              <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>

      <div className='row mt-3'>
        <div className='col-auto p-0'>
          <div className='row'>
            <div
              className='col tab-title-col'
              onClick={() => {setActiveTab('details')}}
              style={{
                color: (activeTab === 'details') ? '#000000' : '#BFBFBF'
              }}>
              Details
            </div>
          </div>
          <div className='row d-flex justify-content-center'>
            <div className='col-auto p-0 tab-indicator-col' style={{
              opacity: (activeTab === 'details') ? 100 : 0,
              width: (activeTab === 'details') ? '100%' : 0,
            }}/>
          </div>
        </div>
        <div className='col-auto px-4'>
          <div className='row'>
            <div
              className='col tab-title-col'
              onClick={() => {setActiveTab('shipping')}}
              style={{
                color: (activeTab === 'shipping') ? '#000000' : '#BFBFBF',
              }}>
              Shipping
            </div>
          </div>
          <div className='row d-flex justify-content-center'>
            <div className='col-auto p-0 tab-indicator-col' style={{
              opacity: (activeTab === 'shipping') ? 100 : 0,
              width: (activeTab === 'shipping') ? '100%' : 0,
            }}/>
          </div>
        </div>
        <div className='col-auto p-0'>
          <div className='row'>
            <div
              className='col tab-title-col'
              onClick={() => {setActiveTab('reviews')}}
              style={{
                color: (activeTab === 'reviews') ? '#000000' : '#BFBFBF',
              }}>
              Reviews
            </div>
          </div>
          <div className='row d-flex justify-content-center'>
            <div className='col-auto p-0 tab-indicator-col' style={{
              opacity: (activeTab === 'reviews') ? 100 : 0,
              width: (activeTab === 'reviews') ? '100%' : 0,
            }}/>
          </div>
        </div>
      </div>
      <div className='row m-0'>
        <div className='col separator-line' style={{
          marginTop: '-0.125rem'
        }}/>
      </div>

      <div className='row'>
        {activeTab === 'details' && (
          <div className='col'>
            {product.description}
          </div>
        )}
        {activeTab === 'shipping' && (
          <div className='col'>
            We are pleased to offer <strong>free shipping</strong> on all subscription orders within the United States, with no minimum purchase required. All orders are processed within <strong>1-3 business days</strong> and shipped on a regular schedule based on your subscription plan. You will receive an email notification with tracking details for each shipment. Estimated delivery times for each shipment typically range from <strong>5-7 business days</strong>, depending on your location. Free shipping is available for all U.S. orders, and any additional shipping charges for special delivery requests will be clearly displayed during checkout. If your package is lost or damaged in transit, please contact our customer service team at <strong>support@papertrail.com</strong> or call <strong>1-800-123-4567</strong>, and we’ll assist you in resolving the issue. Thank you for subscribing, and we look forward to delivering your content on time!
          </div>
        )}
        {
          activeTab === 'reviews' && (
            <div className='col'>
              {/* <div className='row'>
                <div className='col' style={{
                  fontSize: '1.125rem',
                  fontWeight: 700
                }}>
                  Leave A Review
                </div>
              </div> */}
              <div className='row d-flex align-items-center'>
                <div className='col-auto p-0'>
                  <ReviewStars 
                    rating={userReviewRating}
                    starSize={'2rem'}
                    gapSize={'-0.2rem'}
                    isInput={true}
                    onRatingChange={(newRating) => {
                      console.log(newRating);
                      setUserReviewRating(newRating)
                    }}
                  />
                </div>
                <div className='col px-2' style={{
                  marginTop: '-0.25rem'
                }}>
                  <FieldText onTextChange={(newText) => {
                    console.log(newText);
                    setUserReviewText(newText);
                    setReviewErrorMessage('');
                    }}
                    errorMessage={reviewErrorMessage}
                    />
                </div>
                <div className='col-auto p-0'>
                  <ButtonRounded
                    onClick={() => {handleLeaveReview()}}
                    text={'Submit Review'}
                    paddingHorizontal={'1rem'}
                    borderRadius={'0.5rem'}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col' style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginTop: '1rem',
                }}>
                  Reviews From Other Customers
                </div>
              </div>
              <div className='row'>
                {sampleReviews ? sampleReviews.map(review => (
                  <div className='col-12 p-0'>
                    {<ProductReview review={review}/>}
                  </div>
                )) : <div></div>}
              </div>
            </div>
          )
        }
      </div>



    </div>
  );
}

export default ProductPage;