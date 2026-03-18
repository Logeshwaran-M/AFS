import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart section-p1">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button className="btn-primary" onClick={() => window.location.href = '/'}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="cart-section section-p1">
      <h2>Shopping Cart</h2>
      
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map(item => (
            <motion.div 
              key={item.id}
              className="cart-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹ {item.price}</p>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="item-total">
                <p>₹ {item.price * item.quantity}</p>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Subtotal ({getCartCount()} items)</span>
            <span>₹ {getCartTotal()}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-item total">
            <span>Total</span>
            <span>₹ {getCartTotal()}</span>
          </div>
          <button 
            className="btn-primary checkout-btn" 
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;