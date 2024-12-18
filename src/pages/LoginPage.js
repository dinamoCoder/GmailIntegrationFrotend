import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google'; // Redirect to backend Google OAuth
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Login to Gmail</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
