import React, { useState } from 'react';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';

const ReviewStars = ({ rating, starSize, gapSize, isInput = false, onRatingChange }) => {
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (starIndex) => {
    if (isInput) {
      const newRating = starIndex + 1;
      setCurrentRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    }
  };

  const fullStars = Math.floor(currentRating);
  const halfStars = currentRating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const starStyle = {
    fontSize: starSize,
    color: '#11A36F',
    marginRight: gapSize,
    marginTop: gapSize
  };

  const stars = [
    ...Array(fullStars).fill(<IoIosStar style={starStyle} />),
    ...Array(halfStars).fill(<IoIosStarHalf style={starStyle} />),
    ...Array(emptyStars).fill(<IoIosStarOutline style={starStyle} />)
  ];

  return (
    <div className='row align-items-center'>
      <div className="col d-flex justify-content-center">
        {stars.map((star, index) => (
          <span
            key={index}
            onClick={() => handleClick(index)}
            style={{ cursor: isInput ? 'pointer' : 'default' }}
          >
            {star}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReviewStars;
