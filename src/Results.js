import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css';

function Results() {
  const location = useLocation();
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState(location.state?.inputText || '');
  const CHARACTER_LIMIT = 40;
  
  const handleInputChange = (e) => {
    if (e.target.value.length <= CHARACTER_LIMIT) {
      setInputText(e.target.value);
      setError(null);
    }
  };  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    processText(inputText);
  };

  const processText = async (text) => {
    console.log("Starting API request...");
  
    if (!text) {
      setError('Please enter some text to analyze.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const url = "https://pjhs2z55t3.execute-api.us-east-1.amazonaws.com/api/process";
    const requestData = { text: text, dummy: "0" };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      console.log("API response received:", response);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Processed API result:", result);
      setResponseData(result);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Failed to process text: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.inputText) {
      processText(location.state.inputText);
    }
  }, [location.state?.inputText]);

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
          marginBottom: '100px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter a sentence to analyze..."
              style={{
                flex: '1',
                padding: '12px 15px',
                fontSize: '18px',
                borderRadius: '4px 0 0 4px',
                border: '1px solid #ccc',
                outline: 'none'
              }}
              disabled={loading}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#486cff'; // Change background color
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#00008b'; // Revert background color
              }}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>

          {/* Character Counter */}
          <p style={{ fontSize: '14px', color: inputText.length === CHARACTER_LIMIT ? 'red' : 'gray', textAlign: 'center', marginTop: '8px' }}>
            {inputText.length} / {CHARACTER_LIMIT}
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h2 style={{ marginBottom: '30px' }}>Results:</h2>
          
          {loading ? (
            <div className="loading-indicator" style={{
              textAlign: 'center',
              margin: '20px 0',
              fontSize: '18px',
              color: '#555'
            }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '15px' }}>Analyzing your text...</p>
            </div>
          ) : error ? (
            <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
          ) : responseData ? (
            <div style={{ textAlign: 'center', fontSize: '24px', color: 'black', lineHeight: '1.6' }}>
              {responseData.map((item, index) => {
                if (!item.type) {
                  return (
                    <span key={index} style={{ margin: "0 2px" }}>
                      {item.text}
                    </span>
                  );
                }
                
                return (
                  <span
                    key={index}
                    className={`group ${item.type.toLowerCase().replace(' ', '-')}`}
                  >
                    <span className="word">{item.text}</span>
                    
                    <a 
                      href={item.definition_link?.startsWith("http") ? item.definition_link : `https://en.wikipedia.org/wiki/${encodeURIComponent(item.text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="periodic-element"
                    >

                      <div className="element-arrow"></div>
                      <div className="element-name">
                        {item.element_name === "TBD" ? item.definition : item.element_name}
                      </div>
                      <div className="element-symbol">
                        {item.text}
                      </div>
                      <div className="element-definition">
                        {item.definition}
                      </div>
                    </a>
                  </span>
                );
              })}
            </div>
          ) : (
            <div>Enter a sentence above to see the analysis</div>
          )}
        </div>
        
        <a
          href="https://rapidapi.com/vectionary-sd11-vectionary-sd11-default/api/vectionary-api1/playground/apiendpoint_37ebbcd8-6050-4cd6-a5c8-261101ae2d1e"
          className="api-info"
          target="_blank"
          rel="noopener noreferrer"
        >
          Looking for the API?
        </a>
        <a
          href="https://www.pangeon.com/parsimony"
          className="p7y-info"
          target="_blank"
          rel="noopener noreferrer"
        >
          P7Y
        </a>
      </header>
    </div>
  );
}

export default Results;