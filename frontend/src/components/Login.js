import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, app } from "./firebaseConfig.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";

//logic to verify logins
const db = getFirestore(app);

const checkLogin = async (uid, password) => {
  try {
    console.log("Attempting login for UID:", uid);
    const userRef = doc(db, "Users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.password === password) {
        console.log("Login successful!");
        // goes through with auth
        return userData;
      } else {
        //wrong password
        console.error("Incorrect password");
        alert("Incorrect password");
        throw new Error("Incorrect password");
      }
    } else {
      //user email not found
      console.error("User not found");
      alert("User not found");
      throw new Error("User not found");
    }
  } catch (e) {
    //exceptions
    console.error("Error during login:", e);
    alert(`Error during login: ${e.message}`);
    throw new Error("Error during login");
  }
};

const Login = ({ onClose, onSignup }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    alert("TODO: Add Sign in logic");
    // sends time to Flask currently as just a test
    // const response = await fetch("http://127.0.0.1:5000/time", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ time: new Date() }),
    // });

    // const data = await response.json();
    // console.log(data); // Log Flask response

    //you can move this to whenever you make the login logic, but this is to check if the password matches the user
    const result = checkLogin(email, password);
    console.log(result);

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
