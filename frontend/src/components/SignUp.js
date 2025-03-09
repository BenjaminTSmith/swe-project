import { React, useState } from "react";
import { getFirestore, doc,setDoc } from 'firebase/firestore';
import { app } from './firebaseConfig.js';

const db = getFirestore(app); 

const addUser = async (email, name, password, uid) => {
  try {
    console.log("Attempting to add user with UID: ", uid);
    const userRef = doc(db, "Users", uid);
    await setDoc(userRef, {
      email: email,
      name: name,
      password: password,
    });
    console.log("User added successfully!");
  } catch (e) {
    console.error("Error adding user: ", e);  
    alert(`Error adding user: ${e.message}`);  
    throw new Error("Error adding user");
  }
};

const SignUp = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPass, setVerifyPass] = useState("");
  const [name, setName] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const handleSignup = () => {
    let valid = true;
    const ufRegex = /^[A-Za-z0-9._%+-]+@ufl\.edu$/i;
    if (email === "") {
      setEmailError("Email can't be blank");
      valid = false;
    } else if (!ufRegex.test(email)) {
      setEmailError("Must use a valid UFL email");
      valid = false;
    }

    if (password === "") {
      setPasswordError("Password can't be blank");
      valid = false;
    } else if (password !== verifyPass) {
      setPasswordError("Passwords do not match");
      valid = false;
    }

    if (name === "") {
      setNameError("Name can't be blank");
      valid = false;
    }
    if (valid) {
      const uid = email; 
      addUser(email, name, password, uid);
      setConfirmation(true);
    }
  };

  return (
    <div className="loginOverlay" onClick={onClose}>
      <div className="loginComponent" onClick={(e) => e.stopPropagation()}>
        {confirmation ? (
          <div>TODO: Send email to verify and create account</div>
        ) : (
          <>
            <div className="loginText"> UFL Email</div>
            <input
              type="text"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError("");
              }}
              className="loginInput"
            />
            {emailError && <div className="errorText">{emailError}</div>}

            <div className="loginText" style={{ marginTop: "0.75rem" }}>
              Name
            </div>
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setNameError("");
              }}
              className="loginInput"
            />
            {nameError && <div className="errorText">{nameError}</div>}

            <div className="loginText" style={{ marginTop: "0.75rem" }}>
              Password
            </div>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
              className="loginInput"
            />

            <div className="loginText" style={{ marginTop: "0.75rem" }}>
              Verify Password
            </div>
            <input
              type="password"
              value={verifyPass}
              onChange={(event) => {
                setVerifyPass(event.target.value);
                setPasswordError("");
              }}
              className="loginInput"
            />
            {passwordError && <div className="errorText">{passwordError}</div>}

            <button
              className="loginButton"
              style={{
                padding: "0.5rem",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
