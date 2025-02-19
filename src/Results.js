import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css';
import axios from 'axios';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  // Provide a default value to prevent errors if accessed directly
  const inputText = location.state?.inputText || '';

  useEffect(() => {
    if (!inputText) {
      setError('No input text provided.');
      return;
    }

    console.log('Making request with:', inputText);
    const url = `http://107.23.181.250:8000/text/${encodeURIComponent(inputText)}`;

    axios
      .get(url)
      .then(response => {
        console.log(response.data);
        setResponseData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('An error occurred while fetching the data.');
      });
  }, [inputText]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ position: 'absolute', top: '10px', textAlign: 'center', width: '100%' }}>
          Vectionary
        </h1>
        <p style={{ position: 'absolute', top: '100px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        The Periodic Table of Meaning
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>
          <h2 style={{ marginBottom: '50px' }}>Results:</h2>

          {inputText ? (
            <p style={{ textAlign: 'center', fontSize: '24px', color: 'black' }}>
              You inputted: <strong>{inputText}</strong>
            </p>
          ) : (
            <p style={{ textAlign: 'center', fontSize: '24px', color: 'black' }}>
              No input text provided.
            </p>
          )}

          {error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            responseData ? (
              <div style={{ textAlign: 'center', fontSize: '24px', color: 'black', lineHeight: '1.6' }}>
                {responseData.map((item, index) => {
                  const wiktionaryLink = `https://en.wiktionary.org/wiki/${encodeURIComponent(item.text)}`;

                  return (
                    <span key={index} className={`tooltip ${item.type.toLowerCase()}`} style={{ margin: '0 2px' }}>
                      {['NOUN', 'VERB', 'ADJ', 'ADV'].includes(item.type) ? (
                        <a href={wiktionaryLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
                          {item.text}
                        </a>
                      ) : (
                        <span>{item.text}</span>
                      )}

                      {['NOUN', 'VERB', 'ADJ', 'ADV'].includes(item.type) && (
                        <span className="tooltip-text">
                          <b>Definition Link:</b>{' '}
                          {item.definition === "TBD" ? (
                            <a href={wiktionaryLink} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                              {wiktionaryLink}
                            </a>
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
                  );
                })}
              </div>
            ) : (
              <div>No data available</div>
            )
          )}

          <button
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#00008b', color: 'white', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            Go Back
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

export default Results;
