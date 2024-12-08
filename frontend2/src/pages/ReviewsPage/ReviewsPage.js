import './ReviewsPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserReview from '../../components/UserReview/UserReview';

function ReviewsPage() {

  const [userReviews, setUserReviews] = useState(null);

  const getUserReviews = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/reviews/get-user-reviews', {
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

  useEffect (() => {
    getUserReviews();
  }, [])

  return(
    <div className='container'>

      <div className='row'>
        <div className='col' id='result-message-col'>
          Your Reviews
        </div>
      </div>

      <div className='row p-3'>
        {userReviews ? userReviews.map(review => (
          <div className='col-12 p-0' style={{marginBottom:'0.5rem'}}>
            {<UserReview review={review}/>}
          </div>
        )) : <div></div>}
      </div>

    </div>
  );
}

export default ReviewsPage;