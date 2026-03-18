import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaEye,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const { 
    searchedOrders, 
    searchOrders, 
    clearSearch,
    cancelOrder,
    trackOrder 
  } = useOrders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMethod, setSearchMethod] = useState('email'); // 'email' or 'phone'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error(`Please enter your ${searchMethod === 'email' ? 'email' : 'phone number'}`);
      return;
    }

    setLoading(true);
    setSearched(true);

    // Simulate loading
    setTimeout(() => {
      if (searchMethod === 'email') {
        searchOrders(searchTerm);
      } else {
        searchOrders(searchTerm);
      }
      setLoading(false);
    }, 500);
  };

  // Filter orders based on status
  const filteredOrders = searchedOrders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <FaClock className="status-icon confirmed" />;
      case 'processing': return <FaBox className="status-icon processing" />;
      case 'shipped': return <FaTruck className="status-icon shipped" />;
      case 'delivered': return <FaCheckCircle className="status-icon delivered" />;
      case 'cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaBox className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
      // Refresh search results
      handleSearch();
    }
  };

  const handleTrackOrder = (orderId) => {
    const timeline = trackOrder(orderId);
    const latestEvent = timeline[timeline.length - 1];
    toast.success(
      <div>
        <strong>Order Tracking</strong>
        <br />
        <small>{latestEvent?.description || 'Order placed'}</small>
        <br />
        <small>{new Date(latestEvent?.date).toLocaleString()}</small>
      </div>,
      { duration: 4000 }
    );
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearched(false);
    clearSearch();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="my-orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Enter your email or phone number to view your orders</p>
      </div>

      {/* Search Section */}
      <div className="orders-search-section">
        <div className="search-methods">
          <button 
            className={`method-btn ${searchMethod === 'email' ? 'active' : ''}`}
            onClick={() => setSearchMethod('email')}
          >
            <FaEnvelope /> Search by Email
          </button>
          <button 
            className={`method-btn ${searchMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setSearchMethod('phone')}
          >
            <FaPhone /> Search by Phone
          </button>
        </div>

        <div className="search-box">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type={searchMethod === 'email' ? 'email' : 'tel'}
              placeholder={searchMethod === 'email' 
                ? 'Enter your email address' 
                : 'Enter your 10-digit phone number'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Orders'}
          </button>
        </div>

        {searched && (
          <div className="search-results-info">
            <span>
              Found {searchedOrders.length} order{searchedOrders.length !== 1 ? 's' : ''}
            </span>
            <button className="clear-search" onClick={handleClearSearch}>
              Clear Search
            </button>
          </div>
        )}
      </div>

      {searched ? (
        <>
          {/* Filters - Show only if orders exist */}
          {filteredOrders.length > 0 && (
            <div className="orders-filters">
              <div className="filter-dropdown">
                <FaFilter className="filter-icon" />
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          )}

          {/* Orders List */}
          <div className="orders-list">
            <AnimatePresence>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    className={`order-card ${getStatusClass(order.status)}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-id">
                          <strong>Order:</strong> {order.id}
                        </div>
                        <div className="order-date">
                          <strong>Placed:</strong> {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </div>

                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="preview-item">
                          <img src={item.image} alt={item.name} />
                          <div className="preview-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="more-items">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <strong>₹{order.payment.total}</strong>
                      </div>
                      
                      <div className="order-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => handleViewOrder(order)}
                        >
                          <FaEye /> View
                        </button>
                        
                        <button 
                          className="action-btn track"
                          onClick={() => handleTrackOrder(order.id)}
                        >
                          <FaTruck /> Track
                        </button>
                        
                        {order.status === 'confirmed' && (
                          <button 
                            className="action-btn cancel"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <FaTimesCircle /> Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`payment-badge ${order.payment.method}`}>
                      {order.payment.method === 'cod' ? '💵 COD' : '💳 Paid'}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="no-orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <img src="/images/no-orders.svg" alt="No orders" />
                  <h2>No orders found</h2>
                  <p>We couldn't find any orders with this {searchMethod}</p>
                  <button 
                    className="shop-now-btn"
                    onClick={() => navigate('/')}
                  >
                    Start Shopping
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* Initial State - No Search Yet */
        <motion.div 
          className="no-search-yet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img src="/images/search-orders.svg" alt="Search orders" />
          <h2>Find Your Orders</h2>
          <p>Enter your email or phone number to view your order history</p>
          <div className="example-text">
            <small>Example: john@example.com or 9876543210</small>
          </div>
        </motion.div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="order-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              className="order-modal"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Order Details</h2>
                <button 
                  className="close-modal"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="order-summary-section">
                  <div className="summary-row">
                    <span>Order ID:</span>
                    <strong>{selectedOrder.id}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Order Date:</span>
                    <strong>{new Date(selectedOrder.createdAt).toLocaleString()}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Payment Method:</span>
                    <strong className={selectedOrder.payment.method}>
                      {selectedOrder.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Payment Status:</span>
                    <strong className={selectedOrder.payment.status}>
                      {selectedOrder.payment.status}
                    </strong>
                  </div>
                </div>

                <div className="shipping-details">
                  <h3>Shipping Address</h3>
                  <p>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p>{selectedOrder.shipping.address1}</p>
                  {selectedOrder.shipping.address2 && <p>{selectedOrder.shipping.address2}</p>}
                  <p>{selectedOrder.shipping.city}, {selectedOrder.shipping.state} - {selectedOrder.shipping.pincode}</p>
                  <p>Phone: {selectedOrder.customer.phone}</p>
                  <p>Email: {selectedOrder.customer.email}</p>
                </div>

                <div className="order-items-detailed">
                  <h3>Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="detailed-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                        {item.customName && <p>Name: {item.customName}</p>}
                        {item.customDesignation && <p>Designation: {item.customDesignation}</p>}
                      </div>
                      <div className="item-pricing">
                        <p>₹{item.price} x {item.quantity}</p>
                        <strong>₹{item.price * item.quantity}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.payment.subtotal}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.payment.shipping}</span>
                  </div>
                  <div className="breakdown-row total">
                    <span>Total:</span>
                    <strong>₹{selectedOrder.payment.total}</strong>
                  </div>
                </div>

                <div className="order-timeline">
                  <h3>Order Timeline</h3>
                  {selectedOrder.timeline.map((event, index) => (
                    <div key={index} className="timeline-event">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <p className="event-status">{getStatusText(event.status)}</p>
                        <p className="event-date">{new Date(event.date).toLocaleString()}</p>
                        {event.description && (
                          <p className="event-description">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="action-btn track"
                  onClick={() => {
                    handleTrackOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                >
                  <FaTruck /> Track Order
                </button>
                {selectedOrder.status === 'confirmed' && (
                  <button 
                    className="action-btn cancel"
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                  >
                    <FaTimesCircle /> Cancel Order
                  </button>
                )}
                <button 
                  className="action-btn close"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;