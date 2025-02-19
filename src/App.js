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
        <p style={{ position: 'absolute', top: '100px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>Project of Parsimony</p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-25%' }}>
          <input 
            type="text" 
            placeholder="Enter text" 
            style={{ padding: '16px', fontSize: '18px', marginBottom: '20px', width: '400px' }}
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', color: 'white', backgroundColor: '#00008b', transition: 'background-color 0.1s', fontWeight: 'bold' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#486Cff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00008b'}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        <a href="https://c71sd9neqf.execute-api.us-east-1.amazonaws.com/api/" className="api-info" target="_blank" rel="noopener noreferrer">
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
