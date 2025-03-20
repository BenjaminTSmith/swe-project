import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, app } from "../firebaseConfig.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";

//logic to verify logins
const db = getFirestore(app);

const Login = ({ onClose, onSignup }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const checkLogin = async (uid, password) => {
    // Only works with last entry in Users
    try {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.password === password) {
          // goes through with auth
          return userData;
        } else {
          //wrong password
          setLoginError("Incorrect Password");
        }
      } else {
        //user email not found
        setLoginError("User Not found");
      }
    } catch (e) {
      //exceptions
      console.error("Error during login:", e);
    }
  };

  const handleLogin = async () => {
    const result = await checkLogin(email, password);
    if (result) {
      navigate("/discover");
    }
  };

  return (
    <div className="loginOverlay" data-testid="login-overlay" onClick={onClose}>
      <div
        className="loginComponent"
        data-testid="login-form"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="loginText"> UFL Email</div>
        <input
          type="text"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setLoginError("");
          }}
          className="loginInput"
        />
        <div className="loginText" style={{ marginTop: "0.75rem" }}>
          Password
        </div>
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setLoginError("");
          }}
          className="loginInput"
        />
        {loginError && <div className="errorText">{loginError}</div>}
        <button
          className="loginButton"
          style={{
            padding: "0.5rem",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
          onClick={handleLogin}
        >
          Sign In
        </button>
        <div>
          Don't have an account yet?{" "}
          <button className="signupLink" onClick={onSignup}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
