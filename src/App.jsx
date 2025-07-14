import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Categories from './components/Categories.jsx';
import VoiceDemo from './components/VoiceDemo.jsx';
import CartPreview from './components/CartPreview.jsx';
import VoiceBot from './components/VoiceBot.jsx';
import CartPage from './components/CartPage.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [orderDetails, setOrderDetails] = useState(null);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = () => {
    const order = {
      items: cartItems,
      total: cartTotal,
      date: new Date().toLocaleString(),
      orderId: Math.floor(Math.random() * 1000000)
    };
    setOrderDetails(order);
    setCartItems([]);
    setCurrentPage('thankyou');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            total={cartTotal}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onBackToHome={() => setCurrentPage('home')}
            onCheckout={handleCheckout}
          />
        );
      case 'thankyou':
        return (
          <main className="main-content">
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <h1>Thank you for shopping from Walmart!</h1>
              <h2>Your order is confirmed.</h2>
              {orderDetails && (
                <div style={{ margin: '32px auto', maxWidth: '400px', background: '#1e1e1e', padding: '24px', borderRadius: '16px' }}>
                  <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                  <p><strong>Date:</strong> {orderDetails.date}</p>
                  <h3>Order Details:</h3>
                  <ul style={{ textAlign: 'left' }}>
                    {orderDetails.items.map(item => (
                      <li key={item.id}>{item.quantity} x {item.name} (${item.price.toFixed(2)} each)</li>
                    ))}
                  </ul>
                  <p><strong>Total:</strong> ${orderDetails.total.toFixed(2)}</p>
                </div>
              )}
              <button className="btn btn-primary" onClick={() => setCurrentPage('home')}>Back to Home</button>
            </div>
          </main>
        );
      default:
        return (
          <main className="main-content">
            <Hero onTryVoiceShopping={() => setIsBotOpen(true)} />
            <Categories />
            <VoiceDemo />
            {cartItems.length > 0 && (
              <CartPreview 
                items={cartItems} 
                total={cartTotal}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            )}
          </main>
        );
    }
  };

  return (
    <div className="App">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setCurrentPage('cart')}
      />
      {renderPage()}
      <VoiceBot 
        isOpen={isBotOpen}
        onToggle={() => setIsBotOpen(!isBotOpen)}
        onAddToCart={addToCart}
        onProceedToCheckout={handleCheckout}
      />
      <Footer />
    </div>
  );
}

export default App; 