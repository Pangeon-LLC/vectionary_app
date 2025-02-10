import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css'; // Import the CSS file for styling
import axios from 'axios';

function Results() {
  const location = useLocation();
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null); // State for error handling
  const inputText = location.state?.inputText; // Access the input text from the passed state

  useEffect(() => {
    if (inputText) {
      console.log('Making request with:', inputText);
      const url = `http://107.23.181.250:8000/text/` + inputText; // Safely encode the URL

      axios
        .get(url)
        .then(response => {
          console.log(response.data);
          setResponseData(response.data);
        })
        .catch(error => {
          console.error('Error:', error);
          setError('An error occurred while fetching the data.'); // Set error message
        });
    }
  }, [inputText]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ position: 'absolute', top: '20px', textAlign: 'center', width: '100%' }}>
          Vectionary
        </h1>
        <p
          style={{
            position: 'absolute',
            top: '100px',
            textAlign: 'center',
            fontSize: 'calc(1px + 2vmin)',
            color: 'black',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          Project of Parsimony
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '150px',
          }}
        >
          <h2 style={{ marginBottom: '50px' }}>Results:</h2>
          {inputText ? (
            <p style={{ textAlign: 'center', fontSize: '24px', color: 'black' }}>
              You submitted: <strong>{inputText}</strong>
            </p>
          ) : (
            <p style={{ textAlign: 'center', fontSize: '24px', color: 'black' }}>
              No input text provided.
            </p>
          )}

          {responseData ? (
            <div style={{ textAlign: 'center', fontSize: '24px', color: 'black', lineHeight: '1.6' }}>
              {responseData.map((item, index) => (
                <span
                  key={index}
                  className={`tooltip ${item.type.toLowerCase()}`}
                  style={{ margin: '0 2px' }}
                >
                  {['NOUN', 'VERB', 'ADJ', 'ADV'].includes(item.type) ? (
                    <span>
                      {item.definition === "TBD" ? (
                        <span>{item.text}</span>
                      ) : (
                        <a
                          href={item.definition}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.text}
                        </a>
                      )}
                    </span>
                  ) : (
                    <span>{item.text}</span>
                  )}

                  {/* Tooltip with additional info */}
                  {['NOUN', 'VERB', 'ADJ', 'ADV'].includes(item.type) && (
                    <span className="tooltip-text">
                      <b>Definition Link:</b>{' '}
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
