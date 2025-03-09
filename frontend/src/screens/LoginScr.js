import React from 'react';
import { useNavigate } from 'react-router-dom';
const LoginScr = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    alert('TODO: Add Sign in logic');
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