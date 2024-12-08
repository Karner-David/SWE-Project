import './ReviewsPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserReview from '../../components/UserReview/UserReview';

function ReviewsPage() {

  const [userReviews, setUserReviews] = useState(null);

  const getUserReviews = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/reviews/user', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      setUserReviews(response.data);
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }

  const approveReview = async (id) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/reviews/approve-review',
        { review_id : id },
      );
      console.log('Review approved');
      getUserReviews();
    } catch (error) {

    }
  }

  const denyReview = async (id) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/reviews/deny-review',
        { review_id : id },
      );
      console.log('Review denied');
      getUserReviews();
    } catch (error) {

    }
  }

  useEffect (() => {
    getUserReviews();
  }, [])

  return(
    <div className='container'>

      <div className='row'>
        <div className='col' id='result-message-col'>
          Reviews
        </div>
      </div>

      <div className='row p-3'>
        {userReviews ? userReviews.map(review => (
          <div className='col-12 p-0' style={{marginBottom:'0.5rem'}}>
            {<UserReview
              review={review}
              approveReview={approveReview}
              denyReview={denyReview}
            />}
          </div>
        )) : <div></div>}
      </div>

    </div>
  );
}

export default ReviewsPage;