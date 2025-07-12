import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faTimes, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './VoiceBot.css';

const VoiceBot = ({ isOpen, onToggle, onAddToCart }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const countdownRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setBotResponse('Listening... Say "Hey Walmart" to start shopping!');
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setBotResponse('Sorry, I had trouble hearing you. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (isListening && timeLeft > 0) {
      countdownRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopListening();
    }
    
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [isListening, timeLeft]);

  const startListening = async () => {
    try {
      // Start voice session with backend
      const response = await fetch('http://localhost:5000/api/voice/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      const data = await response.json();
      if (data.success) {
        setSessionId(data.session_id);
        setBotResponse(data.message);
        setConversationHistory([]);
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setTimeLeft(30);
      }
    } catch (error) {
      console.error('Error starting voice session:', error);
      setBotResponse('Sorry, I cannot connect to the voice service right now.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setTimeLeft(30);
    clearTimeout(timeoutRef.current);
  };

  const processVoiceCommand = async (command) => {
    if (!sessionId) return;
    
    setIsProcessing(true);
    setBotResponse('Processing your request...');
    
    try {
      const response = await fetch('http://localhost:5000/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
          session_id: sessionId,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBotResponse(data.message);
        
        // Add to conversation history
        setConversationHistory(prev => [...prev, {
          user: command,
          bot: data.message,
          timestamp: new Date().toLocaleTimeString()
        }]);
        
        // Handle cart actions
        if (data.action === 'add_to_cart' && data.product) {
          onAddToCart({
            id: Date.now(),
            name: data.product.name,
            price: data.product.price,
            quantity: data.product.quantity
          });
        }
      } else {
        setBotResponse(data.message);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      setBotResponse('Sorry, I had trouble processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      stopListening();
      setTranscript('');
      setBotResponse('');
      setSessionId(null);
      setConversationHistory([]);
    }
    onToggle();
  };

  if (!isOpen) return null;

  return (
    <div className="voice-bot-overlay">
      <div className="voice-bot-modal">
        <div className="voice-bot-header">
          <h3>Walmart Voice Assistant</h3>
          <button className="close-btn" onClick={handleToggle}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="voice-bot-content">
          <div className="voice-status">
            <div className={`mic-button ${isListening ? 'listening' : ''}`}>
              <FontAwesomeIcon 
                icon={isListening ? faMicrophone : faMicrophoneSlash} 
                className="mic-icon"
              />
            </div>
            <div className="status-text">
              {isListening ? 'Listening...' : 'Voice Assistant Ready'}
            </div>
            {isListening && (
              <div className="countdown">
                {timeLeft}s remaining
              </div>
            )}
          </div>
          
          <div className="transcript-area">
            <div className="transcript-label">You said:</div>
            <div className="transcript-text">
              {transcript || 'Say "Hey Walmart" to start shopping...'}
            </div>
          </div>
          
          <div className="bot-response">
            <div className="response-label">
              <FontAwesomeIcon icon={faVolumeUp} className="volume-icon" />
              Assistant:
            </div>
            <div className="response-text">
              {isProcessing ? 'Processing...' : botResponse}
            </div>
          </div>
          
          <div className="conversation-history">
            <h4>Conversation History</h4>
            <div className="history-list">
              {conversationHistory.map((msg, index) => (
                <div key={index} className="history-item">
                  <div className="history-time">{msg.timestamp}</div>
                  <div className="history-user">You: {msg.user}</div>
                  <div className="history-bot">Assistant: {msg.bot}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="voice-bot-footer">
          <button 
            className={`voice-btn ${isListening ? 'stop' : 'start'}`}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
          >
            {isListening ? 'Stop Listening' : 'Start Voice Shopping'}
          </button>
          
          <div className="voice-tips">
            <p>Try saying:</p>
            <ul>
              <li>"Add milk to my cart"</li>
              <li>"Add 2 cans of diet coke"</li>
              <li>"Remove bread from my cart"</li>
              <li>"Show my cart"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceBot; 