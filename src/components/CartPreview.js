import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import './CartPreview.css';

const CartPreview = ({ items, total, onRemoveItem, onUpdateQuantity }) => {
  return (
    <section className="cart-preview">
      <div className="container">
        <h2>Your Cart</h2>
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>${item.price.toFixed(2)} each</p>
              </div>
              <div className="item-quantity">
                <button 
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className="item-total">
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  className="remove-btn"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <span>Total: ${total.toFixed(2)}</span>
          <button className="btn btn-primary">Checkout</button>
        </div>
      </div>
    </section>
  );
};

export default CartPreview; 