import React from 'react';
import { useNavigate } from 'react-router-dom';
const LoginScr = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    alert('TODO: Add Sign in logic');
    // sends time to FLask currently as just a test
    const response = await fetch("http://127.0.0.1:5000/time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time: new Date() }),
    });

    const data = await response.json();
    console.log(data);  // Log Flask response
    navigate('/discover');
  };

  return (
    <div className = 'loginScreen'>
      <div className = 'loginTextContainer'>
        <div className = 'loginLargeText'>
          Connect → Schedule → Learn
        </div>
        <div className = 'loginSmallText'>
          Learn from students tutors who have <b>aced</b> your classes
        </div>
      </div>
      <button className = 'loginButton' type= 'button' onClick={handleLogin}>
        <b>Sign in with GatorLink</b>
      </button>
    </div>
  )
}

export default LoginScr