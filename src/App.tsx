import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Atom, ExternalLink } from 'lucide-react';
import Results from './components/Results';

function Home() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const CHARACTER_LIMIT = 100;

  // Extract the SVG pattern to avoid parsing issues
  const backgroundPattern = "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23e2e8f0\" fill-opacity=\"0.3\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      navigate('/results', { state: { inputText } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-40`} style={{ backgroundImage: backgroundPattern }}></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Atom className="w-12 h-12 mr-3" style={{ color: '#486Cff' }} />
            <h1 className="text-6xl font-bold" style={{ color: '#486Cff' }}>
              Vectionary
            </h1>
          </div>
          <p className="text-xl text-slate-600 font-medium">
            The Periodic Table of Meaning
          </p>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Discover the linguistic elements that make up your text with interactive word analysis
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-2xl mb-16">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                  if (e.target.value.length <= CHARACTER_LIMIT) {
                    setInputText(e.target.value);
                  }
                }}
                placeholder="Enter a sentence to analyze..."
                className="w-full px-6 py-4 pr-16 text-lg bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 transition-all duration-300 placeholder-slate-400"
                style={{ 
                  '--tw-ring-color': '#486Cff33',
                  borderColor: inputText ? '#486Cff' : undefined
                } as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = '#486Cff'}
                onBlur={(e) => e.target.style.borderColor = inputText ? '#486Cff' : '#e2e8f0'}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: '#486Cff',
                  /* Use onMouseEnter and onMouseLeave for hover effects */
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#3a5ce6'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#486Cff'}
                disabled={!inputText.trim()}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            
            {/* Character Counter */}
            <div className="flex justify-between items-center mt-3 px-2">
              <div className="text-sm text-slate-500">
                Press Enter or click search to analyze
              </div>
              <div className={`text-sm font-medium ${
                inputText.length === CHARACTER_LIMIT ? 'text-red-500' : 'text-slate-500'
              }`}>
                {inputText.length} / {CHARACTER_LIMIT}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Links - Positioned at opposite corners */}
        <div className="fixed bottom-6 left-0 right-0 px-6 pointer-events-none">
          <div className="flex justify-between items-end">
            <a
              href="https://rapidapi.com/vectionary-sd11-vectionary-sd11-default/api/vectionary-api1/playground/apiendpoint_37ebbcd8-6050-4cd6-a5c8-261101ae2d1e"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium transition-colors duration-200 pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-xl"
              style={{ color: '#486Cff' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3a5ce6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#486Cff'}
            >
              <ExternalLink className="w-4 h-4" />
              Looking for the API?
            </a>
            <a
              href="https://www.pangeon.com/parsimony"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 pointer-events-auto shadow-lg"
            >
              P7Y
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;