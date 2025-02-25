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
      // Log that we would normally make a request
      console.log('Would normally make request with:', inputText);
      
      // Instead of making an API call, create mock data
      const words = inputText.split(' ');
      const mockResponse = words.map((word, index) => {
        // Clean the word for analysis (remove punctuation)
        const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
        const originalWord = word; // Keep the original word with correct casing
        
        // Simple logic to assign part of speech - focusing on the 5 requested categories
        let type = 'NOUN'; // Default to noun
        
        // Check for proper nouns - words that start with capital letters (not at the beginning of a sentence)
        const isFirstWord = index === 0;
        const startsWithCapital = /^[A-Z]/.test(originalWord);
        
        if (startsWithCapital && !isFirstWord) {
          type = 'PROPER NOUN';
        }
        // Special case for first word - if it's a known proper noun
        else if (isFirstWord && startsWithCapital && 
                ['Central', 'Park', 'John', 'Mary', 'London', 'America', 'Paris', 
                 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 
                 'Sunday', 'January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December',
                 'Netflix', 'Hulu', 'Amazon', 'Google', 'Apple', 'Microsoft', 
                 'Facebook', 'Twitter', 'Instagram'].includes(originalWord)) {
          type = 'PROPER NOUN';
        }
        // Common verbs list
        else if (['was', 'were', 'be', 'being', 'been', 'have', 
                  'has', 'had', 'do', 'does', 'did', 'go', 'goes', 'went', 'run', 
                  'runs', 'ran', 'see', 'sees', 'saw', 'walk', 'walks', 'walked',
                  'take', 'takes', 'took', 'get', 'gets', 'got', 'make', 'makes',
                  'made', 'say', 'says', 'said', 'find', 'finds', 'found', 'give',
                  'gives', 'gave'].includes(cleanWord)) {
          type = 'VERB';
        } 
        // Common adjectives list
        else if (['good', 'bad', 'big', 'small', 'happy', 'sad', 'beautiful', 'ugly',
                  'tall', 'short', 'fat', 'thin', 'red', 'blue', 'green', 'yellow',
                  'old', 'new', 'young', 'high', 'low', 'rich', 'poor', 'easy', 'hard',
                  'early', 'late', 'fast', 'slow', 'hot', 'cold', 'warm', 'cool',
                  'bright', 'dark', 'clean', 'dirty', 'sweet', 'bitter', 'soft', 'hard',
                  'central', 'quick', 'quickly', 'his'].includes(cleanWord)) {
          type = 'ADJECTIVE';
        } 
        // Common adverbs list
        else if (['quickly', 'slowly', 'loudly', 'quietly', 'well', 'badly', 'very',
                  'really', 'almost', 'nearly', 'too', 'enough', 'just', 'only',
                  'even', 'still', 'already', 'soon', 'now', 'then', 'here', 'there',
                  'always', 'never', 'often', 'sometimes', 'usually', 'rarely',
                  'seldom', 'again', 'once', 'twice', 'across'].includes(cleanWord)) {
          type = 'ADVERB';
        }
        
        // Special handling for multi-word proper nouns
        // If the previous word was "Central" and this word is "Park", mark it as a proper noun
        if (index > 0 && words[index-1].replace(/[.,!?;:]/g, '') === "Central" && 
            originalWord.replace(/[.,!?;:]/g, '') === "Park") {
          type = 'PROPER NOUN';
        }
        
        // Create a Wiktionary link for each word
        const urlWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
        const wiktionaryLink = `https://en.wiktionary.org/wiki/${urlWord}`;
        
        return {
          text: word, // Keep original word with punctuation
          type: type,
          definition: wiktionaryLink
        };
      });
      
      // Second pass to handle multi-word proper nouns
      for (let i = 0; i < mockResponse.length; i++) {
        // If we find "Central" and the next word is "Park", mark both as PROPER NOUN
        if (i < mockResponse.length - 1 && 
            mockResponse[i].text.replace(/[.,!?;:]/g, '') === "Central" && 
            mockResponse[i+1].text.replace(/[.,!?;:]/g, '') === "Park") {
          mockResponse[i].type = "PROPER NOUN";
          mockResponse[i+1].type = "PROPER NOUN";
        }
      }
      
      // Set the mock response data
      console.log('Mock response:', mockResponse);
      setResponseData(mockResponse);
      
      // Comment out the actual API call
      /*
      const url = 'http://107.23.181.250:8000/dummy_text/' + inputText;
      axios.get(url)
        .then(response => {
          console.log(response.data);
          setResponseData(response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      */
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
                  className={`tooltip ${item.type.toLowerCase().replace(' ', '-')}`} // Apply class based on type, replace space with dash for CSS
                  style={{
                    margin: "0 2px", // Adds spacing between words
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
                  {/* Tooltip for the word */}
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
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <div>No data available</div>
          )}
          {/* Back Button */}
          <button
            style={{ marginTop: '50px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#00008b', color: 'white', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            Go Back
          </button>
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