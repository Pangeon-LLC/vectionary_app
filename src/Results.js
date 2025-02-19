// src/Results.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css'; // Import the CSS file for styling
import axios from 'axios';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const inputText = location.state?.inputText; // Access the input text from the passed state

  useEffect(() => {
    if (inputText) {
      // Making a request with the inputText
      console.log('Making request with:', inputText);
      const url = 'http://107.23.181.250:8000/dummy_text/' + inputText;

      axios.get(url)
        .then(response => {
          console.log(response.data);
          setResponseData(response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [inputText]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ position: 'absolute', top: '20px', textAlign: 'center', width: '100%' }}>Vectionary</h1>
        <p style={{ position: 'absolute', top: '110px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>The Periodic Table of Meaning</p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '150px'
        }}>
          <h2 style={{ marginBottom: '50px' }}>Results:</h2>
          <p style={{ textAlign: 'center', fontSize: '24px', color: 'black' }}>
            {/* Display the text submitted */}
            You submitted: <strong>{inputText}</strong>
          </p>

          {responseData ? (
            <div style={{ textAlign: 'center', fontSize: '24px', color: 'black', lineHeight: '1.6' }}>
              {responseData.map((item, index) => (
                <span
                  key={index}
                  className={`tooltip ${item.type.toLowerCase()}`} // Apply class based on type
                  style={{
                    margin: "0 2px", // Adds spacing between words
                  }}
                >
                  {item.type === "NOUN" ? (
                    <span>
                      {item.definition === "TBD" ? (
                        <span>{item.text}</span>  // If definition is "TBD", don't make it a link
                      ) : (
                        <a
                          href={item.definition}  // Link to the definition if it's not "TBD"
                          target="_blank"          // Open link in a new tab
                          rel="noopener noreferrer"
                        >
                          {item.text}
                        </a>
                      )}
                    </span>
                  ) : (
                    <span>{item.text}</span>  // For non-NOUN, VERB, ADJ text, display normally
                  )}

                  {/* Tooltip for the noun */}
                  {(item.type === "NOUN") && (
                    <span className="tooltip-text">
                      <b>Definition Link:</b> 
                      {item.definition === "TBD" ? (
                        <span>{item.definition}</span>
                      ) : (
                        <a href={item.definition} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                          {item.definition}
                        </a>
                      )}
                      <br />
                      <b>Part of Speech:</b> {item.type}
                      <br />
                      <b>Index:</b> {item.index + 1}
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <div>No data available</div>
          )}

          {/* Back Button */}
          <button
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#00008b', color: 'white', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            Go Back
          </button>
        </div>

        <a
          href="https://i.etsystatic.com/40798348/r/il/235c22/4607038596/il_fullxfull.4607038596_dznd.jpg"
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
