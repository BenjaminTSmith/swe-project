import React from 'react'
const loginScr = () => {

  const handleLogin = () => {
    alert('LoginButton Clicked');
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

export default loginScr