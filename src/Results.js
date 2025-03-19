import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css'; // Import the CSS file for styling
import axios from 'axios';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const [inputText, setInputText] = useState(location.state?.inputText || ''); // Initialize with passed state or empty string
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(null); // For error handling

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    setError(null);   // Clear any previous errors
    await processText(inputText);
  };

  const processText = async (text) => {
    if (text) {
      const url = "https://vectionary-api1.p.rapidapi.com/process";
      const payload = { text, dummy: "0" };
      const headers = {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY, // Make sure the key is in your .env file
        "X-RapidAPI-Host": "vectionary-api1.p.rapidapi.com",
        "Content-Type": "application/json"
      };

      try {
        const response = await axios.post(url, payload, { headers });

        // Format API response data
        const formattedData = response.data.map((item) => ({
          text: item.text,
          type: item.type || 'NOUN', // Default to NOUN if no type
          definition: item.definition_link || 'TBD', // Use definition link if available
        }));

        setResponseData(formattedData); // Update state with API response
      } catch (error) {
        console.error("Error processing text:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false); // Turn off loading when done
      }
    }
  };

  useEffect(() => {
    if (location.state?.inputText) {
      setInputText(location.state.inputText);
      processText(location.state.inputText);
    }
  }, [location.state?.inputText]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ position: 'absolute', top: '20px', textAlign: 'center', width: '100%' }}>Vectionary</h1>
        <p style={{ position: 'absolute', top: '110px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          The Periodic Table of Meaning
        </p>

        {/* New Text Input Form */}
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
            >
              Submit
            </button>
          </form>
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

          {loading && <div>Loading...</div>}

          {error && <div style={{ color: 'red' }}>{error}</div>}

          {responseData ? (
            <div style={{ textAlign: 'center', fontSize: '24px', color: 'black', lineHeight: '1.6' }}>
              {responseData.map((item, index) => {
                return (
                  <span
                    key={index}
                    className={`tooltip ${item.type.toLowerCase().replace(' ', '-')}`}
                    style={{
                      margin: "0 2px",
                    }}
                  >
                    {item.definition !== "TBD" ? (
                      <a
                        href={item.definition}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}

                    {/* Tooltip for the word - only show for categorized words */}
                    <span className="tooltip-text">
                      <b>Parsimony Element:</b>
                      {item.definition === "TBD" ? (
                        <span>{item.definition}</span>
                      ) : (
                        <a href={item.definition} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                          {item.definition}
                        </a>
                      )}
                      <br />
                      <b>Definition:</b> {item.type}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
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
