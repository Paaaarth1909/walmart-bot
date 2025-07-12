import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faArrowLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './CartPage.css';

const CartPage = ({ 
  cartItems, 
  total, 
  onRemoveItem, 
  onUpdateQuantity, 
  onBackToHome,
  onCheckout 
}) => {
  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    onUpdateQuantity(itemId, newQuantity);
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={onBackToHome}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Shopping</span>
          </button>
          <h1 className="cart-title">
            <FontAwesomeIcon icon={faShoppingCart} />
            Your Cart ({cartItems.reduce((count, item) => count + item.quantity, 0)} items)
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart</p>
            <button className="start-shopping-btn" onClick={onBackToHome}>
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <div className="item-placeholder">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <div className="item-total">
                    <p className="item-total-price">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8.25%):</span>
                <span>{formatPrice(total * 0.0825)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>{formatPrice(total * 1.0825)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button className="checkout-btn" onClick={onCheckout}>
                Proceed to Checkout
              </button>
              <button className="continue-shopping-btn" onClick={onBackToHome}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage; 