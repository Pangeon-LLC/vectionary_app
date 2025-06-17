import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Atom, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

interface WordData {
  ID?: string;
  text: string;
  lemma: string;
  type: string;
  definition: {
    ID?: string;
    pos: string;
    definition: string;
  } | null;
  definition_link: string;
  char_index?: number;
  index?: number;
}

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState<WordData[] | null>(null);
  const [rawApiData, setRawApiData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState(location.state?.inputText || '');
  const [processedText, setProcessedText] = useState(location.state?.inputText || '');
  const CHARACTER_LIMIT = 100;

  // Define the SVG background pattern as a variable
  const backgroundPattern = "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23e2e8f0\" fill-opacity=\"0.3\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= CHARACTER_LIMIT) {
      setInputText(e.target.value);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      setProcessedText(inputText);
    } else {
      setError('Please enter some text to analyze.');
    }
  };

  // Call API only when processedText changes
  useEffect(() => {
    if (!processedText.trim()) return;

    const processText = async (text: string) => {
      setLoading(true);
      setError(null);
      setResponseData(null);
      setRawApiData(null);

      const url =
        'https://cors-anywhere.herokuapp.com/https://us-central1-parsimony-server.cloudfunctions.net/process_text';
      const requestData = { text };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setRawApiData(result);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Failed to process text: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    processText(processedText);
  }, [processedText]);

  // Merge API result with processedText - Enhanced to handle multi-word entities
  useEffect(() => {
    if (!rawApiData || !processedText) return;

    const apiData = rawApiData as WordData[];
    
    // Sort API data by char_index to process in order
    const sortedApiData = [...apiData].sort((a, b) => (a.char_index || 0) - (b.char_index || 0));
    
    const result: WordData[] = [];
    let textIndex = 0;
    let processedChars = 0;

    for (const apiItem of sortedApiData) {
      const itemText = apiItem.text;
      const itemCharIndex = apiItem.char_index || 0;
      
      // Add any unprocessed words before this API item
      while (processedChars < itemCharIndex) {
        const remainingText = processedText.slice(processedChars);
        const wordMatch = remainingText.match(/\b\w+('\w+)?\b/);
        
        if (wordMatch && wordMatch.index !== undefined) {
          const word = wordMatch[0];
          const wordStart = processedChars + wordMatch.index;
          
          if (wordStart < itemCharIndex) {
            // This word comes before the current API item
            result.push({
              text: word,
              lemma: word,
              type: 'UNKNOWN',
              definition: {
                pos: 'UNKNOWN',
                definition: 'No definition available.'
              },
              definition_link: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`
            });
            processedChars = wordStart + word.length;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // Add the API item
      result.push(apiItem);
      processedChars = itemCharIndex + itemText.length;
    }
    
    // Add any remaining words after the last API item
    const remainingText = processedText.slice(processedChars);
    const remainingWords = remainingText.match(/\b\w+('\w+)?\b/g) || [];
    
    for (const word of remainingWords) {
      result.push({
        text: word,
        lemma: word,
        type: 'UNKNOWN',
        definition: {
          pos: 'UNKNOWN',
          definition: 'No definition available.'
        },
        definition_link: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`
      });
    }

    setResponseData(result);
  }, [rawApiData, processedText]);

  const getWordTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('noun')) return 'text-pink-600 border-pink-300 bg-pink-50';
    if (lowerType.includes('verb')) return 'text-orange-600 border-orange-300 bg-orange-50';
    if (lowerType.includes('adj') || lowerType.includes('adv')) return 'text-green-600 border-green-300 bg-green-50';
    if (lowerType.includes('proper')) return 'text-purple-600 border-purple-300 bg-purple-50';
    return 'text-slate-600 border-slate-300 bg-slate-50';
  };

  const getElementColors = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('noun')) return {
      bg: 'from-pink-500 to-pink-600',
      header: 'bg-pink-600',
      arrow: 'border-t-pink-600'
    };
    if (lowerType.includes('verb')) return {
      bg: 'from-orange-500 to-orange-600',
      header: 'bg-orange-600',
      arrow: 'border-t-orange-600'
    };
    if (lowerType.includes('adj') || lowerType.includes('adv')) return {
      bg: 'from-green-500 to-green-600',
      header: 'bg-green-600',
      arrow: 'border-t-green-600'
    };
    if (lowerType.includes('proper')) return {
      bg: 'from-purple-500 to-purple-600',
      header: 'bg-purple-600',
      arrow: 'border-t-purple-600'
    };
    return {
      bg: 'from-slate-500 to-slate-600',
      header: 'bg-slate-600',
      arrow: 'border-t-slate-600'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: backgroundPattern }}
      ></div>
      
      <div className="relative z-10 px-4 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            
            <div className="flex items-center gap-3">
              <Atom className="w-8 h-8" style={{ color: '#486Cff' }} />
              <h1 className="text-3xl font-bold" style={{ color: '#486Cff' }}>
                Vectionary
              </h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Enter a sentence to analyze..."
                  disabled={loading}
                  className="w-full px-6 py-4 pr-16 text-lg bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 transition-all duration-300 placeholder-slate-400 disabled:opacity-50"
                  style={{ 
                    '--tw-ring-color': '#486Cff33'
                  } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#486Cff'}
                  onBlur={(e) => e.target.style.borderColor = inputText ? '#486Cff' : '#e2e8f0'}
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ 
                    background: '#486Cff'
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#3a5ce6')}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#486Cff'}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-3 px-2">
                <div className="text-sm text-slate-500">
                  {loading ? 'Analyzing your text...' : 'Press Enter or click search to analyze'}
                </div>
                <div className={`text-sm font-medium ${
                  inputText.length === CHARACTER_LIMIT ? 'text-red-500' : 'text-slate-500'
                }`}>
                  {inputText.length} / {CHARACTER_LIMIT}
                </div>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Analysis Results</h2>

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#486Cff' }} />
                  <p className="text-lg text-slate-600">Analyzing your text...</p>
                  <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center gap-3 py-8 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                  <p className="text-lg">{error}</p>
                </div>
              )}

              {responseData && !loading && (
                <div className="text-center">
                  <div className="text-2xl leading-relaxed">
                    {responseData.map((item, index) => {
                      const colors = getElementColors(item.type);
                      const wordColors = getWordTypeColor(item.type);
                      const def = item.definition?.definition || 'No definition available.';
                      const defLink = item.definition_link || `https://en.wikipedia.org/wiki/${encodeURIComponent(item.text)}`;
                      
                      // For proper nouns, use the ID; for others, use definition ID or fallback
                      const displayId = item.type.toLowerCase().includes('proper') 
                        ? item.ID || `${item.text}_${item.type}`
                        : item.definition?.ID || `${item.text}_${item.type}_1.1`;

                      // Skip styling for certain word types
                      const skipStyling = ['det', 'prt', 'adp', 'pron', 'conj', 'punct', 'x', 'num', 'unknown'].includes(item.type.toLowerCase());

                      if (skipStyling) {
                        return (
                          <span key={index} className="mx-1 text-slate-700">
                            {item.text}
                          </span>
                        );
                      }

                      return (
                        <span key={index} className="group relative inline-block mx-1">
                          <span className={`cursor-help border-b-2 border-dotted transition-all duration-200 hover:font-semibold ${wordColors}`}>
                            {item.text}
                          </span>

                          {/* Periodic Element Tooltip */}
                          <a
                            href={defLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-1/2 bottom-full transform -translate-x-1/2 mb-3 w-80 transition-all duration-300 z-50 hover:scale-105"
                          >
                            <div className={`bg-gradient-to-br ${colors.bg} rounded-xl overflow-hidden shadow-2xl border-2 border-white/20`}>
                              {/* Arrow */}
                              <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${colors.arrow}`}></div>
                              
                              {/* Display ID */}
                              <div className={`${colors.header} px-4 py-2 text-center`}>
                                <div className="text-white text-sm font-mono">{displayId}</div>
                              </div>
                              
                              {/* Element Symbol */}
                              <div className="px-4 py-6 text-center">
                                <div className="text-white text-4xl font-bold">{item.text}</div>
                              </div>
                              
                              {/* Element Definition */}
                              <div className="px-4 pb-4">
                                <div className="text-white text-sm leading-relaxed">{def}</div>
                              </div>
                            </div>
                          </a>
                        </span>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 text-sm text-slate-600">
                    <p>Hover over colored words to see their linguistic properties</p>
                    <p className="mt-1">Click on the periodic elements to learn more</p>
                  </div>
                </div>
              )}

              {!responseData && !loading && !error && (
                <div className="text-center py-12 text-slate-600">
                  <Atom className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg">Enter a sentence above to see the linguistic analysis</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend/Key - Moved under results and made smaller */}
          {responseData && !loading && (
            <div className="max-w-3xl mx-auto mt-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg shadow-md border border-white/20 p-4">
                <h3 className="text-base font-semibold text-slate-800 mb-3 text-center">Color Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-pink-500 rounded"></div>
                    <span className="text-sm text-slate-700 font-medium">Nouns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-sm text-slate-700 font-medium">Verbs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-slate-700 font-medium">Adj/Adv</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-sm text-slate-700 font-medium">Proper</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 text-center mt-3">
                  Hover over colored words to see their periodic element cards with definitions
                </p>
              </div>
            </div>
          )}

          {/* Footer Links - Positioned at opposite corners */}
          <div className="fixed bottom-6 left-0 right-0 px-6 pointer-events-none">
            <div className="flex justify-between items-end">
              <a
                href="https://rapidapi.com/vectionary-sd11-vectionary-sd11-default/api/vectionary-api1/playground/apiendpoint_37ebbcd8-6050-4cd6-a5c8-261101ae2d1e"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-medium transition-colors duration-200 pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
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
    </div>
  );
}

export default Results;