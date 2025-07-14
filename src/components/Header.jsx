import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import walmartLogo from '../assets/walmart-logo.png';

const Header = ({ cartCount, onCartClick }) => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="location-selector">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Deliver to</span>
              <select>
                <option>New York, NY 10001</option>
                <option>Los Angeles, CA 90210</option>
                <option>Chicago, IL 60601</option>
              </select>
            </div>
            <div className="header-links">
              <a href="#">Help</a>
              <a href="#">Reorder</a>
              <a href="#">Lists</a>
              <a href="#">Sign In</a>
            </div>
          </div>
        </div>
      </div>
      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <div className="search-bar">
              <input type="text" placeholder="Search everything at Walmart online and in store" />
              <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div className="header-actions">
              <button className="cart-icon" onClick={onCartClick}>
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="cart-count">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav className="navigation">
        <div className="container">
          <ul className="nav-menu">
            <li><a href="#">Departments</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Account</a></li>
            <li><button onClick={onCartClick}>Cart</button></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header; 