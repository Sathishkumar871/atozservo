// SearchBar.tsx
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;
import  { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import './SearchBar.css';
import { RiMic2Fill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';

let recognition: SpeechRecognition | null = null;
if ('webkitSpeechRecognition' in window) {
  const WebkitRecognition = (window as any).webkitSpeechRecognition;
  recognition = new WebkitRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-IN';
}

function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [allServices, setAllServices] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔃 Fetch services once
  useEffect(() => {
    axios.get('/api/services')
      .then((res) => setAllServices(res.data))
      .catch((err) => console.error('Service fetch error:', err));
  }, []);

  // 🔍 Deduplicate by service name (for display only once)
  const handleSearch = () => {
    if (!keyword.trim()) return;

    const fuse = new Fuse(allServices, {
      keys: ['name'],
      threshold: 0.4,
    });

    const matches = fuse.search(keyword).map(result => result.item);

    // 👇 Remove duplicates by name
    const uniqueByName = matches.filter(
      (obj, index, self) => index === self.findIndex(o => o.name === obj.name)
    );

    setResults(uniqueByName);
    setShowSuggestions(true);
  };

  // 🎤 Mic logic
  const handleMicClick = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const speech = e.results[0][0].transcript;
        setKeyword(speech);
        handleSearch();
      };
      recognition.onend = () => setIsListening(false);
    }
  };

  // ❌ Clear
  const clearInput = () => {
    setKeyword('');
    setResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // ⏱ Debounce
  useEffect(() => {
    if (keyword.trim()) {
      const delay = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setResults([]);
      setShowSuggestions(false);
    }
  }, [keyword]);

  return (
    <div className="search-container">
      <div className="search-wrapper">
        {/* 🔍 Icon */}
        <svg className="gradient-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="17" height="16">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A90E2" />
              <stop offset="100%" stopColor="#7B61FF" />
            </linearGradient>
          </defs>
          <path fill="url(#grad)" d="M505 442.7L405.3 343c28.4-34.9 45.7-79.2 
            45.7-127C451 103.5 349.5 2 225.5 2S0 103.5 0 
            216.1s101.5 214.1 225.5 214.1c48 0 92.3-17.3 
            127.2-45.7l99.7 99.7c9.4 9.4 24.6 9.4 
            33.9 0l18.6-18.6c9.4-9.3 9.4-24.5.1-33.9zM225.5 
            370.2c-84.9 0-154.1-69.2-154.1-154.1S140.6 
            61.9 225.5 61.9s154.1 69.2 154.1 154.1-69.2 
            154.2-154.1 154.2z" />
        </svg>

        {/* 🔤 Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search services..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        {/* ❌ Clear */}
        {keyword && (
          <button className="clear-button" onClick={clearInput} title="Clear">
            <IoClose size={18} />
          </button>
        )}

        {/* 🎤 Mic */}
        {!keyword && (
          <button className="mic-button" onClick={handleMicClick} title="Voice Search">
            <RiMic2Fill size={18} color={isListening ? 'red' : 'black'} />
          </button>
        )}
      </div>

      {/* 📋 Suggestions */}
      {keyword && showSuggestions && (
        <ul className="search-results fade-in">
          {results.length > 0 ? (
            results.map((service) => (
              <li
                key={service.name}
                onClick={() => window.location.href = `/services?type=${encodeURIComponent(service.name)}`}
              >
                <img src={service.image} alt={service.name} width="30" />
                <span>{service.name}</span>
              </li>
            ))
          ) : (
            <li className="no-results">❌ No matching services.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;