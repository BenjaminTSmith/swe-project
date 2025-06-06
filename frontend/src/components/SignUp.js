import { React, useState } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import VerifyEmail from "./VerifyEmail";

const db = getFirestore(app);
const auth = getAuth();

const SignUp = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPass, setVerifyPass] = useState("");
  const [name, setName] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  const addUser = async (email, name, uid) => {
    try {
      const userRef = doc(db, "Users", uid);

      const userCheck = await getDoc(userRef);
      if (userCheck.exists()) {
        setPasswordError(`User with email ${email} already exists!`);
        return false;
      }
      await setDoc(userRef, {
        email: email,
        name: name,
        availability: [],
        location: "",
        subjects: "",
        rate: "",
        isPublic: false,
      });
      console.log("in here");
    } catch (e) {
      console.error("Error adding user: ", e);
      setPasswordError(`Error adding user: ${e.message}`);
      return false;
    }
    return true;
  };

  const sendVerificationCode = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/send_verification_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setVerificationCode(data.code);
      setConfirmation(true);
    } catch (error) {
      setPasswordError("Verification request failed");
    }
  };

  const handleSignup = async () => {
    let valid = true;
    const ufRegex = /^[A-Za-z0-9._%+-]+@ufl\.edu$/i;
    // ensure email ends with @ufl.edu
    if (email === "") {
      setEmailError("Email can't be blank");
      valid = false;
    } else if (!ufRegex.test(email)) {
      setEmailError("Must use a valid UFL email");
      valid = false;
    }

    // ensure password is valid
    if (password === "") {
      setPasswordError("Password can't be blank");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password is too short! Minimum 6 characters");
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
      await sendVerificationCode(email);
    }
  };

  const handleVerifyCode = async () => {
    if (codeInput === verificationCode) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const emailUID = email.toLowerCase();
        const res = await addUser(email, name, emailUID);
        if (res) {
          onClose();
        }
      } catch (error) {
        setPasswordError(error.message);
      }
    } else {
      setCodeError("Incorrect verification code");
    }
  };

  return (
    // Close SignUp when clicking out of the form area
    <div className="loginOverlay" data-testid="overlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div
        className="loginComponent"
        data-testid="component"
        onClick={(e) => e.stopPropagation()}
      >
        {confirmation ? (
        <>
            <div className="loginText">Enter the 6-digit code sent to your email</div>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value);
                setCodeError("");
              }}
              className="loginInput"
            />
            {codeError && <div className="errorText">{codeError}</div>}
            <button className="loginButton" onClick={handleVerifyCode}>
              Verify Code
            </button>
          </>
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
                data-testid="email-input"
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
                data-testid="name-input"
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
                data-testid="pass-input"
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
                data-testid="verify-input"
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
