import React from 'react';
import './ProductReview.css';
import ReviewStars from '../ReviewStars/ReviewStars';

const ProductReview = ({ review, fullName }) => {
  return (
    <div className='row'>
      <div className='col' style={{
        marginBottom: '0.5rem'
      }}>

        <div className='row'>
          <div className='col-auto p-0'>
            <ReviewStars 
              rating={review.review_rating}
              starSize={'1.25rem'}
              gapSize={'-0.125rem'}
            />
          </div>
          <div className='col' style={{
            marginLeft: '0.25rem',
            fontSize: '1rem',
            fontWeight: 600
          }}>
            {fullName ? fullName : ""}
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            {review.review_text}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductReview;
