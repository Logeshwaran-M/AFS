import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../services/orderService';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
  FaLock, 
  FaTruck, 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaUser,
  FaArrowLeft,
  FaMoneyBillWave
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {

  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
const auth = getAuth();
const [user, setUser] = useState(null);
const [loadingUser, setLoadingUser] = useState(true);

useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

    if (!currentUser) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      setUser(currentUser);

      setFormData(prev => ({
        ...prev,
        email: currentUser.email || ''
      }));
    }

    setLoadingUser(false);

  });

  return () => unsubscribe();

}, []);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: 'KA',
    pincode: '',
    phone: '',
    paymentMethod: 'razorpay',
    shippingMethod: 'standard'
  });

  const [discountCode, setDiscountCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [codAvailable, setCodAvailable] = useState(true);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    const total = getCartTotal();
    setCodAvailable(total <= 5000);
  }, [getCartTotal]);

  useEffect(() => {
    setShippingCost(formData.shippingMethod === 'express' ? 100 : 0);
  }, [formData.shippingMethod]);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {

    if (!formData.email) {
      toast.error("Email required");
      return false;
    }

    if (!formData.firstName || !formData.lastName) {
      toast.error("Enter full name");
      return false;
    }

    if (!formData.address1) {
      toast.error("Address required");
      return false;
    }

    if (!formData.city) {
      toast.error("City required");
      return false;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Invalid PIN code");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Invalid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;
  if (!user || !user.uid) {
    toast.error("User not logged in");
    return;
  }

  setIsProcessing(true);
console.log("Current User UID from Auth:", user.uid);
  try {
    const subtotal = getCartTotal();
    const total = subtotal + shippingCost;

    const safeCartItems = cartItems.map(item => ({
      id: item.id || '',
      name: item.name || '',
      price: item.price || 0,
      quantity: item.quantity || 1,
      image: item.image || ''
    }));

    const orderData = {
      userId: user.uid,
      orderNumber: `ORD-${Date.now()}`,
      customer: {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone
      },
      shipping: {
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        method: formData.shippingMethod,
        cost: shippingCost
      },
      items: safeCartItems,
      payment: {
        method: formData.paymentMethod,
        status: formData.paymentMethod === "cod" ? "pending" : "paid",
        subtotal,
        shipping: shippingCost,
        total
      },
      status: "pending",
      createdAt: new Date().toISOString()
    };

const savedOrder = await saveOrder(user, orderData); 

if (savedOrder) {
  toast.success("Order placed successfully");
  clearCart();
  navigate("/order-confirmation", {
    state: { orderId: savedOrder.id }
  });
} else {
  throw new Error("Order could not be saved");
}
  } catch (error) {
    console.error(error);
    toast.error("Order failed");
  } finally {
    setIsProcessing(false);
  }
};



  const total = getCartTotal() + shippingCost;

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-form">

          <button className="back-to-cart" onClick={() => navigate('/cart')}>
            <FaArrowLeft /> Back to Cart
          </button>

          <h1>Checkout</h1>

          <div className="contact-section">
            <h2><FaUser /> Contact</h2>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="delivery-section">

            <h2><FaMapMarkerAlt /> Delivery</h2>

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address1"
              placeholder="Address"
              value={formData.address1}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>

          <button
            className="submit-order"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay ₹${total}`}
          </button>

          <div className="security-footer">
            <FaLock />
            <span>Secure Checkout</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;