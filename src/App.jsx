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
    alert('Checkout functionality would be implemented here!');
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
      />
      <Footer />
    </div>
  );
}

export default App; 