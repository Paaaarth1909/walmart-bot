import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './Hero.css';

const Hero = ({ onTryVoiceShopping }) => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Shop Smarter with Voice Shopping</h1>
          <p>Just say "Hey Walmart" and tell us what you need. We'll add it to your cart instantly!</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={onTryVoiceShopping}>
              <FontAwesomeIcon icon={faMicrophone} />
              Try Voice Shopping
            </button>
            <button className="btn btn-secondary">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600" alt="Voice Shopping" />
        </div>
      </div>
    </section>
  );
};

export default Hero; 