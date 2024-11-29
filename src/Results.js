// src/Results.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css'; // Import the CSS file for styling
import axios from 'axios';


function Results() {
  const location = useLocation();
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
          console.error('Error:', error)
        });
    }
  }, [inputText]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ position: 'absolute', top: '20px', textAlign: 'center', width: '100%' }}>Vectionary</h1>
        <p style={{ position: 'absolute', top: '100px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>Project of Parsimony</p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '150px'
        }}>
          <h2 style={{ marginBottom: '50px' }}>Results</h2>
          <p style={{ textAlign: 'center', fontSize: '24px', color: 'black' }}>
            {/* Display the text submitted */}
            You submitted: <strong>{inputText}</strong>
          </p>

          {responseData ? (
          <div style={{ textAlign: 'center', fontSize: '18px', color: 'black', lineHeight: '1.6' }}>
            {responseData.map((item, index) => (
              <p key={index}>
                The <span className="tooltip">
                <strong style={{ color: '#486Cff' }}>{item.text}</strong>
                <span className="tooltip-text">{item.defintion}</span>
                </span> was identified as an entity of type <u>{item.type}</u>.
                For more details, see this{' '}  
                <a 
                  href={item.defintion} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontWeight: 'bold', color: '#486Cff' }}
                >
                  link
                </a>.
              </p>
            ))}
          </div>
        ) : (
          <div>No data available</div>
)}
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