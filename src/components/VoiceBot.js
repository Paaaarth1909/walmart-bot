import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faTimes, faRobot } from '@fortawesome/free-solid-svg-icons';
import './VoiceBot.css';

const VoiceBot = ({ isOpen, onToggle, onAddToCart }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your Walmart voice shopping assistant. Say 'Hey Walmart' followed by what you'd like to add to your cart."
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Product database
  const products = {
    'diet coke': { id: 'diet-coke-1', name: 'Coca-Cola Diet Coke 12 oz Can', price: 1.48, quantity: 1 },
    'coke': { id: 'coke-1', name: 'Coca-Cola Classic 12 oz Can', price: 1.48, quantity: 1 },
    'milk': { id: 'milk-1', name: 'Great Value Whole Milk 1 Gallon', price: 3.48, quantity: 1 },
    'bread': { id: 'bread-1', name: 'Great Value White Bread 20 oz', price: 1.48, quantity: 1 },
    'eggs': { id: 'eggs-1', name: 'Great Value Large Eggs 12 Count', price: 2.98, quantity: 1 },
    'butter': { id: 'butter-1', name: 'Great Value Salted Butter 16 oz', price: 2.48, quantity: 1 },
    'cheese': { id: 'cheese-1', name: 'Great Value Cheddar Cheese 8 oz', price: 2.18, quantity: 1 },
    'bananas': { id: 'bananas-1', name: 'Great Value Bananas 1 lb', price: 0.58, quantity: 1 },
    'apples': { id: 'apples-1', name: 'Great Value Gala Apples 3 lb', price: 3.98, quantity: 1 },
    'chicken': { id: 'chicken-1', name: 'Great Value Chicken Breast 1 lb', price: 4.98, quantity: 1 }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        addMessage('bot', 'Listening...');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        addMessage('user', transcript);
        processVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addMessage('bot', 'Sorry, I had trouble understanding. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processVoiceCommand = (transcript) => {
    // Check for wake phrase
    if (!transcript.includes('hey walmart') && !transcript.includes('hello walmart')) {
      addMessage('bot', 'Please say "Hey Walmart" to activate voice shopping.');
      return;
    }

    // Extract product and quantity
    const words = transcript.split(' ');
    let quantity = 1;
    let productName = '';

    // Look for quantity indicators
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word === 'a' || word === 'an' || word === 'one' || word === '1') {
        quantity = 1;
      } else if (word === 'two' || word === '2') {
        quantity = 2;
      } else if (word === 'three' || word === '3') {
        quantity = 3;
      } else if (word === 'four' || word === '4') {
        quantity = 4;
      } else if (word === 'five' || word === '5') {
        quantity = 5;
      }
    }

    // Extract product name
    const addIndex = words.indexOf('add');
    if (addIndex !== -1) {
      productName = words.slice(addIndex + 1).join(' ').replace(/to my cart/g, '').trim();
    }

    // Find matching product
    const matchedProduct = Object.keys(products).find(key => 
      productName.includes(key) || key.includes(productName)
    );

    if (matchedProduct) {
      const product = { ...products[matchedProduct], quantity };
      onAddToCart(product);
      addMessage('bot', `Perfect! I've added ${quantity} ${product.name} to your cart for $${(product.price * quantity).toFixed(2)}.`);
    } else {
      addMessage('bot', `I'm sorry, I couldn't find "${productName}" in our inventory. Please try a different product.`);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      addMessage('bot', 'Speech recognition is not supported in this browser. Please use the text input instead.');
    }
  };

  const handleTextInput = (e) => {
    if (e.key === 'Enter' && textInput.trim()) {
      addMessage('user', textInput);
      processVoiceCommand(textInput.toLowerCase());
      setTextInput('');
    }
  };

  return (
    <div className="voice-bot">
      <div className="bot-button" onClick={onToggle}>
        <FontAwesomeIcon icon={faMicrophone} />
        <span className="bot-label">Voice Shop</span>
      </div>
      {isOpen && (
        <div className="bot-interface">
          <div className="bot-header">
            <h3>Walmart Voice Assistant</h3>
            <button className="close-btn" onClick={onToggle}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="bot-content">
            <div className="bot-messages">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.type}-message`}>
                  {message.type === 'bot' && <FontAwesomeIcon icon={faRobot} />}
                  <div className="message-content">
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="bot-input">
              <button 
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                disabled={isListening}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleTextInput}
                placeholder="Or type your request here..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceBot; 