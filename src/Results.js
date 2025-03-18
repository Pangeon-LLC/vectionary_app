import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css'; // Import the CSS file for styling
import axios from 'axios';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState(null);
  const [inputText, setInputText] = useState(location.state?.inputText || ''); // Initialize with passed state or empty string
  
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    processText(inputText);
  };
  
  const processText = (text) => {
    if (text) {
      // Log that we would normally make a request
      console.log('Would normally make request with:', text);
      
      // Instead of making an API call, create mock data
      const words = text.split(' ');
      const mockResponse = words.map((word, index) => {
        // Clean the word for analysis (remove punctuation)
        const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
        const originalWord = word; // Keep the original word with correct casing
        
        // Function words list (articles, prepositions, conjunctions, etc.)
        const functionWords = [
          'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 
          'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
          'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 
          'that', 'this', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 
          'our', 'their', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
          'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'us', 'them',
          'if', 'then', 'else', 'when', 'who', 'what', 'where', 'why', 'how',
          'as', 'so', 'than', 'such', 'because'
        ];
        
        // Start with type as undefined (no special styling)
        let type = undefined;
        
        // Skip function words - leave type as undefined
        if (functionWords.includes(cleanWord)) {
          // Do nothing, type remains undefined
        }
        // Common verbs list
        else if (['have', 'has', 'had', 'do', 'does', 'did', 'go', 'goes', 'went', 'run', 
                  'runs', 'ran', 'see', 'sees', 'saw', 'walk', 'walks', 'walked',
                  'take', 'takes', 'took', 'get', 'gets', 'got', 'make', 'makes',
                  'made', 'say', 'says', 'said', 'find', 'finds', 'found', 'give',
                  'gives', 'gave', 'know', 'knows', 'knew', 'think', 'thinks', 
                  'thought', 'come', 'comes', 'came', 'work', 'works', 'worked', 'watch', 'love'].includes(cleanWord)) {
          type = 'VERB';
        } 
        // Common adjectives list
        else if (['good', 'bad', 'big', 'small', 'happy', 'sad', 'beautiful', 'ugly',
                  'tall', 'short', 'fat', 'thin', 'red', 'blue', 'green', 'yellow',
                  'old', 'new', 'young', 'high', 'low', 'rich', 'poor', 'easy', 'hard',
                  'early', 'late', 'fast', 'slow', 'hot', 'cold', 'warm', 'cool',
                  'bright', 'dark', 'clean', 'dirty', 'sweet', 'bitter', 'soft', 'hard',
                  'central', 'quick', 'nice', 'great', 'best', 'worst', 'important',
                  'different', 'same', 'other', 'next', 'last', 'long', 'little'].includes(cleanWord)) {
          type = 'ADJECTIVE';
        } 
        // Common adverbs list
        else if (['quickly', 'slowly', 'loudly', 'quietly', 'well', 'badly', 'very',
                  'really', 'almost', 'nearly', 'too', 'enough', 'just', 'only',
                  'even', 'still', 'already', 'soon', 'now', 'then', 'here', 'there',
                  'always', 'never', 'often', 'sometimes', 'usually', 'rarely',
                  'seldom', 'again', 'once', 'twice', 'across', 'perhaps', 'maybe',
                  'definitely', 'certainly', 'probably', 'actually', 'generally',
                  'finally', 'eventually', 'suddenly', 'recently', 'truly', 'through'].includes(cleanWord)) {
          type = 'ADVERB';
        }
        // Check for proper nouns - words that start with capital letters (not at the beginning of a sentence)
        else if ((index !== 0 && /^[A-Z]/.test(originalWord)) || 
                (index === 0 && /^[A-Z]/.test(originalWord) && 
                ['Joe', 'Maya', 'Jaden', 'Alicia', 'Anna', 'Central', 'Park',
                 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 
                 'Sunday', 'January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December',
                 'Netflix', 'Hulu', 'Amazon', 'Google', 'Apple', 'Microsoft', 
                 'Facebook', 'Twitter', 'Instagram', 'Gonzaga University'].includes(originalWord.replace(/[.,!?;:]/g, '')))) {
          type = 'PROPER NOUN';
        }
        // Default to NOUN for everything else that's not a function word
        else {
          type = 'NOUN';
        }
        
        // Special handling for multi-word proper nouns
        // If the previous word was "Central" and this word is "Park", mark it as a proper noun
        if (index > 0 && words[index-1].replace(/[.,!?;:]/g, '') === "Central" && 
            originalWord.replace(/[.,!?;:]/g, '') === "Park") {
          type = 'PROPER NOUN';
        }
        
        // Create a Wiktionary link for each word
        const cleanWordForUrl = originalWord.replace(/[.,!?;:]/g, ''); // Clean punctuation for URL
        const wiktionaryLink = `https://en.wiktionary.org/wiki/${cleanWordForUrl}`;

        
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
      
      const postData = async () => {
        const url = "https://c71sd9neqf.execute-api.us-east-1.amazonaws.com/api/";
        const data = {
            text: "Test text",
            dummy: "1"
        };
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error:", error);
        }
      };
      // Call the function
      postData();
    }
  };

  // Process initial text on component mount
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
        <p style={{ position: 'absolute', top: '110px', textAlign: 'center', fontSize: 'calc(1px + 2vmin)', color: 'black', fontFamily: 'Helvetica, Arial, sans-serif' }}>The Periodic Table of Meaning</p>
        
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
              placeholder="Enter a sentence to analyze..."
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
          
          {responseData ? (
            <div style={{ textAlign: 'center', fontSize: '24px', color: 'black', lineHeight: '1.6' }}>
              {responseData.map((item, index) => {
                // For words without a type or with undefined type, render them as plain text
                if (!item.type) {
                  return (
                    <span key={index} style={{ margin: "0 2px" }}>
                      {item.text}
                    </span>
                  );
                }
                
                // For words with a type (NOUN, VERB, ADJECTIVE, ADVERB, PROPER NOUN), use the colored tooltip
                return (
                  <span
                    key={index}
                    className={`tooltip ${item.type.toLowerCase().replace(' ', '-')}`}
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