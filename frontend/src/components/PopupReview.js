import React, { useState } from "react";
import { db } from "../firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../css/profile.css";

const PopupReview = ({ user, reviewer, onClose }) => {
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  console.log(reviewer);

  const handleConfirm = async () => {
    if (!rating || review.trim() === "") {
      setError("Please select a rating and write a review.");
      return;
    }
  
    try {
      // Get reviewer name from Firestore
      const reviewerDocRef = doc(db, "Users", reviewer.email);
      const reviewerDocSnap = await getDoc(reviewerDocRef);
      const reviewerData = reviewerDocSnap.exists() ? reviewerDocSnap.data() : {};
      const reviewerName = reviewerData.name || "Anonymous";
  
      const userDocRef = doc(db, "Users", user.email);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {};
  
      const previousReviews = userData.reviews || [];
  
      const newReview = {
        reviewerName,
        rating: parseInt(rating),
        review,
        timestamp: new Date().toISOString(),
      };
  
      const updatedReviews = [...previousReviews, newReview];
  
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
  
      await updateDoc(userDocRef, {
        reviews: updatedReviews,
        rating: avgRating,
      });
  
      setError("");
      onClose();
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="reviewOverlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="createReviewContainer" onClick={(e) => e.stopPropagation()}>
        <h2>Leave a Review for {user?.name}</h2>

        <div className="formGroup">
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setError("");
            }}
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
            onChange={(e) => {
              setReview(e.target.value);
              setError("");
            }}
            className="reviewTextarea"
            rows={4}
            placeholder="Write your feedback here..."
          />
        </div>

        {error && <p className="errorText">{error}</p>}

        <button
          type="button"
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
