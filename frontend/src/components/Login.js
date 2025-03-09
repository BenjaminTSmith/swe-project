import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose, onSignup }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("TODO: Implement Login Logic");
    navigate("/discover");
  };

  return (
    <div className="loginOverlay" onClick={onClose}>
      <div className="loginComponent" onClick={(e) => e.stopPropagation()}>
        <div className="loginText"> UFL Email</div>
        <input
          type="text"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
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
          }}
          className="loginInput"
        />
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
