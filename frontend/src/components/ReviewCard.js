import React from "react";

const ReviewCard = ({ review }) => {
  const { reviewerName, timestamp, rating, review: reviewText } = review;

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString()
    : "Unknown Date";

  return (
    <div className="reviewCard">
      <div className="infoSection">
        <p><strong>{reviewerName}</strong></p>
        <p>{formattedDate}</p>
        <p style={{fontSize: "1.5rem"}}><b>{rating}/5</b></p>
      </div>
      <div className="reviewText">
        <p>{reviewText}</p>
      </div>
    </div>
  );
};

export default ReviewCard;