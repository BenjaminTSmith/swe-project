import React, { useState } from "react";

const VerifyEmail = ({ expectedCode, onVerifySuccess, onClose }) => {
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    if (codeInput.trim() === expectedCode) {
      onVerifySuccess();
    } else {
      setError("Incorrect verification code. Please try again.");
    }
  };

  return (
    <div className="loginOverlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="loginComponent" onClick={(e) => e.stopPropagation()}>
        <h2>Email Verification</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={codeInput}
            onChange={(e) => {
              setCodeInput(e.target.value);
              setError("");
            }}
            className="loginInput"
            maxLength={6}
          />
          {error && <div className="errorText">{error}</div>}
          <button type="submit" className="loginButton" style={{ marginTop: "1rem" }}>
            Verify Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
