import { React, useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import "../css/login.css";

const LoginScr = () => {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  return (
    <div className="loginScreen">
      {login && (
        <Login
          onClose={() => setLogin(false)}
          onSignup={() => {
            setSignup(true);
            setLogin(false);
          }}
        />
      )}
      {signup && <SignUp onClose={() => setSignup(false)} />}
      <div className="loginTextContainer">
        <div className="loginLargeText">Connect → Schedule → Learn</div>
        <div className="loginSmallText">
          Learn from students tutors who have <b>aced</b> your classes
        </div>
      </div>
      <button
        className="loginButton"
        type="button"
        onClick={() => {
          setLogin(true);
        }}
      >
        <b>Sign in</b>
      </button>
    </div>
  );
};

export default LoginScr;
