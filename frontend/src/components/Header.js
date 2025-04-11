import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/Logo.png";
import "../css/header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "Users", currentUser.email);
        const userDocSnap = await getDoc(userDocRef);

        const userData = userDocSnap.exists()
          ? userDocSnap.data()
          : {};

        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          uid: currentUser.uid,
          location: userData.location || "",
          subjects: userData.subjects || "",
          rate: userData.rate || "",
          isPublic: userData.isPublic || false,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const isLoginPage = location.pathname === "/";

  const handleProfileClick = () => {
    navigate("/profile", { state: { user } });
  };

  return (
    <header className="Header">
      <div className="header-content">
        <img className="logo" src={logo} alt="Logo" />

        {!isLoginPage && (
          <nav className="navigation-menu">
            <ul>
              <li className={location.pathname === "/discover" ? "active" : ""}>
                <Link to="/discover">Discover Tutors</Link>
              </li>
              <li className={location.pathname === "/scheduler" ? "active" : ""}>
                <Link to="/scheduler">Tutor Calendar</Link>
              </li>
            </ul>
          </nav>
        )}

        {!isLoginPage && user && (
          <div className="user-info" onClick={handleProfileClick}>
            {user.name}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;