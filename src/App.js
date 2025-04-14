import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Results from './Results';

function Home() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    navigate('/results', { state: { inputText } });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ position: 'absolute', top: '20px', textAlign: 'center', width: '100%' }}>Vectionary</h1>
        <p style={{ position: 'absolute', top: '110px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>The Periodic Table of Meaning</p>

        <div style={{
            position: 'relative',
            width: '50%',
            maxWidth: '700px',
            margin: '0 auto',
            marginBottom: '100px',
            marginTop: '-138px'  // Adjust this value to move it further up
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a sentence to analyze..."
                style={{
                  flex: '1',
                  padding: '12px 15px',
                  fontSize: '18px',
                  borderRadius: '4px 0 0 4px',
                  border: '1px solid #ccc',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 20px',
                  fontSize: '18px',
                  backgroundColor: '#00008b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 4px 4px 0',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>

        <a href="https://rapidapi.com/vectionary-sd11-vectionary-sd11-default/api/vectionary-api1/playground/apiendpoint_37ebbcd8-6050-4cd6-a5c8-261101ae2d1e" className="api-info" target="_blank" rel="noopener noreferrer">
          Looking for the API?
        </a>
        <a href="https://www.pangeon.com/parsimony" className="p7y-info" target="_blank" rel="noopener noreferrer">
          P7Y
        </a>
      </header>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
