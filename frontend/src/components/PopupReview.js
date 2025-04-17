import React, { useState } from "react";
import "../css/scheduler.css";

const PopupReview = ({ user, onClose }) => {
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!rating || review.trim() === "") {
      setError("Please select a rating and write a review.");
      return;
    }

    // Submit logic here
    console.log("Review submitted for", user.name, {
      rating,
      review,
    });

    setError("");
    onClose();
  };

  return (
    <div className="calendarOverlay" onClick={onClose}>
      <div className="calendarComponent" onClick={(e) => e.stopPropagation()}>
        <h2>Leave a Review for {user?.name}</h2>

        <div className="formGroup">
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="reviewSelect"
          >
            <option value="">Select a rating</option>
            <option value="5">★★★★★ - Excellent</option>
            <option value="4">★★★★ - Good</option>
            <option value="3">★★★ - Average</option>
            <option value="2">★★ - Poor</option>
            <option value="1">★ - Terrible</option>
          </select>
        </div>

        <div className="formGroup">
          <label>Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="reviewTextarea"
            rows={4}
            placeholder="Write your feedback here..."
          />
        </div>

        {error && <p className="errorText">{error}</p>}

        <button
          className="scheduleButton"
          style={{ marginTop: "1vh" }}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PopupReview;
