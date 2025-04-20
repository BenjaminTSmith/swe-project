import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import PopupReview from "../components/PopupReview";
import ReviewCard from "../components/ReviewCard";
import "../css/profile.css";

const ProfileScr = () => {
  const location = useLocation();
  const passedUser = location.state.user;
  const navigate = useNavigate();

  const [reviewOpen, setReviewOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    ...passedUser,
    bio:
      passedUser.bio ||
      ""
  });

  const handleLogout = () => {
    signOut(auth)
    .then(() => {
      navigate("/");
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const isOwnProfile = currentUser && formData.uid === currentUser.uid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "Users", currentUser.email);
      await updateDoc(docRef, {
        bio: formData.bio,
        subjects: formData.subjects,
        location: formData.location,
        rate: formData.rate,
      });
      alert("Profile updated!");
    } catch (err) {
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="profileContainer">
      <h1 className="profileName">{formData.name}</h1>

      {/* Logout button, submit button, and editable fields appear if its the user's own profile */}
      {isOwnProfile && (<button onClick={handleLogout} className="logoutButton">Logout</button>)}

      <form onSubmit={handleSubmit} className="profileForm">
        <div className="profileBioWrapper">
          {isOwnProfile ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="profileTextarea"
              rows={5}
              placeholder="Put a short description of yourself and your preferred contact information here"
            />
          ) : (
            <p className="profileBio">{formData.bio}</p>
          )}
        </div>

        {/* field to display the user's rating */}
        {passedUser?.rating && <div className="profileField">
          <strong>Rating:</strong>
          <span>{passedUser.rating?.toFixed(2)}</span>
        </div>}

        {/* Field to display the user's subjects */}
        <div className="profileField">
          <strong>Subjects:</strong>
          {isOwnProfile ? (
            <input
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              className="schedulerTextInput"
            />
          ) : (
            <span>{formData.subjects}</span>
          )}
        </div>

        {/* Field to display preferred meeting location */}
        <div className="profileField">
          <strong>Location:</strong>
          {isOwnProfile ? (
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="schedulerTextInput"
            />
          ) : (
            <span>{formData.location}</span>
          )}
        </div>

        {/* Field to display tutor's rate */}
        <div className="profileField">
          <strong>Hourly Rate:</strong>
          {isOwnProfile ? (
            <div className="rateWrapper">
              <span className="dollarSign">$</span>
              <input
                name="rate"
                type="number"
                value={formData.rate}
                onChange={handleChange}
                className="schedulerTextInput smallInput"
              />
            </div>
          ) : (
            <span>${formData.rate}</span>
          )}
        </div>

        {isOwnProfile && (
          <button type="submit" className="saveButton">
            Save Changes
          </button>
        )}
      </form>
      <div className="reviewSection">
        <div className="reviewHeader">
          <h1>Reviews</h1>
          {!isOwnProfile && (
            <button type="button" className="reviewButton" onClick={()=>setReviewOpen(true)}>
              Leave a Review
            </button>
          )}
        </div>
        {reviewOpen && <PopupReview user = {passedUser} reviewer = {currentUser} onClose={()=>setReviewOpen(false)}/>}
        <div className="reviewCardContainer">
        {/* Creates a list of ReviewCards */}
        {passedUser?.reviews && passedUser?.reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScr;
