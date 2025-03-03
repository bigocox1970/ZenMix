import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#121212', 
      color: 'white' 
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '10px', 
        boxShadow: '0 0 20px rgba(100, 108, 255, 0.3)' 
      }}>
        <h1 style={{ color: '#646cff' }}>React Test Page</h1>
        <p>If you can see this, React is working correctly.</p>
      </div>
    </div>
  );
}

export default TestApp;
