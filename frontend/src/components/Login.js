import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../firebaseConfig.js";

const Login = ({ onClose, onSignup }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        navigate("/discover");
      }
    } catch (error) {
      const errorCode = error.code;
      if (errorCode === "auth/user-not-found") {
        setLoginError("Incorrect Username/Password");
      } else if (errorCode === "auth/wrong-password") {
        setLoginError("Incorrect Username/Password");
      } else {
        setLoginError("Failed to sign in. Try again.");
      }
    }
  };

  return (
    <div className="loginOverlay" data-testid="login-overlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
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
