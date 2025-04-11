import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ProfileScr = () => {
  const location = useLocation();
  const profileUser = location.state?.user;
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState(profileUser || {});

  const isOwnProfile = currentUser && profileUser?.uid === currentUser.uid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: update Firestore with formData
    console.log("Saving changes:", formData);
  };

  return (
    <div>
      <h1>{formData.name}'s Profile</h1>
      <form onSubmit={handleSubmit}>
        <p>Email: {formData.email}</p>

        <label>
          Location:
          {isOwnProfile ? (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          ) : (
            <span> {formData.location} </span>
          )}
        </label>
        <br />

        <label>
          Subjects:
          {isOwnProfile ? (
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
            />
          ) : (
            <span> {formData.subjects} </span>
          )}
        </label>
        <br />

        <label>
          Rate:
          {isOwnProfile ? (
            <input
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
            />
          ) : (
            <span> {formData.rate} </span>
          )}
        </label>
        <br />

        <label>
          Public:
          {isOwnProfile ? (
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
          ) : (
            <span> {formData.isPublic ? "Yes" : "No"} </span>
          )}
        </label>
        <br />

        {isOwnProfile && <button type="submit">Save</button>}
      </form>
    </div>
  );
};

export default ProfileScr;
