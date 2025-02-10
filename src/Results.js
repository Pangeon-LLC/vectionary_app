import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css';
import axios from 'axios';

function Results() {
  const location = useLocation();
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const inputText = location.state?.inputText;

  const SUPPORTED_POS = ['NOUN', 'VERB', 'ADJ', 'ADV'];

  useEffect(() => {
    if (inputText) {
      console.log('Making request with:', inputText);
      const url = `http://107.23.181.250:8000/text/` + encodeURIComponent(inputText);

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
              {responseData.map((item, index) => {
                const isHighlightedWord = SUPPORTED_POS.includes(item.type);
                const wiktionaryLink = `https://en.wiktionary.org/wiki/${encodeURIComponent(item.text)}`;
                
                return (
                  <React.Fragment key={index}>
                    {isHighlightedWord ? (
                      <span className={`tooltip ${item.type.toLowerCase()}`}>
                        <a
                          href={wiktionaryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={item.type.toLowerCase()}
                        >
                          {item.text}
                        </a>
                        <span className="tooltip-text">
                          <b>Definition Link:</b>{' '}
                          {item.definition === "TBD" ? (
                            <a href={wiktionaryLink} target="_blank" rel="noopener noreferrer">
                              {wiktionaryLink}
                            </a>
                          ) : (
                            <a href={item.definition} target="_blank" rel="noopener noreferrer">
                              {item.definition}
                            </a>
                          )}
                          <br />
                          <b>Part of Speech:</b> {item.type}
                          <br />
                          <b>Index:</b> {item.index + 1}
                        </span>
                      </span>
                    ) : (
                      // Plain text for non-highlighted words
                      <span>{item.text}</span>
                    )}
                    {/* Add space after each word except the last one */}
                    {index < responseData.length - 1 && <span> </span>}
                  </React.Fragment>
                );
              })}
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