import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css';

function Results() {
  const location = useLocation();
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState(location.state?.inputText || '');
  
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError(null);
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
  
    const url = "https://c71sd9neqf.execute-api.us-east-1.amazonaws.com/api/process";
    const requestData = { text: text, dummy: "1" };
  
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

  const getWordColor = (type) => {
    const colorMap = {
      'NOUN': '#ff69b4', // hotpink
      'VERB': '#ffa500', // orange
      'ADJ': '#008000', // green
      'ADV': '#008000', // green
      'PRON': '#4b0082', // indigo
      'DET': '#808080', // gray
      'PRT': '#808080', // gray
    };
    return colorMap[type] || '#000000';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ position: 'absolute', top: '20px', textAlign: 'center', width: '100%' }}>Vectionary</h1>
        <p style={{ position: 'absolute', top: '110px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          The Periodic Table of Meaning
        </p>
        
        <div style={{ position: 'relative', width: '50%', maxWidth: '700px', margin: '0 auto', marginBottom: '100px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter a sentence to analyze..."
              style={{
                flex: '1',padding: '12px 15px',
                fontSize: '18px',
                borderRadius: '4px 0 0 4px',
                border: '1px solid #ccc',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 20px',
                fontSize: '18px',
                backgroundColor: loading ? '#cccccc' : '#00008b',
                color: 'white',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
          
          {error && (
            <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '30px' }}>Results:</h2>
          
          {loading && (
            <div className="spinner"></div>
          )}
          
          {!loading && responseData ? (
            <div style={{ textAlign: 'center', fontSize: '24px', color: 'black', lineHeight: '1.6' }}>
              {responseData.map((item, index) => (
                <span
                  key={index}
                  className="tooltip"
                  style={{ 
                    margin: "0 2px",
                    color: getWordColor(item.type)
                  }}
                >
                  {item.definition ? (
                    <a
                      href={item.definition}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: getWordColor(item.type) }}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                  <span className="tooltip-text">
                    <b>Type:</b> {item.type}<br />
                    {item.element_name && (
                      <><b>Element:</b> {item.element_name}<br /></>
                    )}
                    {item.definition_link && (
                      <><b>Definition:</b> <a href={item.definition_link} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>{item.definition}</a></>
                    )}
                  </span>
                </span>
              ))}
            </div>
          ) : !loading && (
            <div>Enter a sentence above to see the analysis</div>
          )}
        </div>
        
        <a
          href="https://c71sd9neqf.execute-api.us-east-1.amazonaws.com/api/"
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
