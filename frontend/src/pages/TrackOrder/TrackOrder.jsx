// pages/TrackOrder/TrackOrder.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiMapPin,
  FiSearch,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import { BsBox, BsBoxSeam } from 'react-icons/bs';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './TrackOrder.css';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('track'); // 'track' or 'return'

  // Sample order data - replace with API call
  const sampleOrderData = {
    orderNumber: 'BT-2024-78945',
    orderDate: '15 Jan 2024',
    estimatedDelivery: '20 Jan 2024',
    status: 'in-transit',
    items: [
      {
        id: 1,
        name: 'Burnt Sienna: Active Mesh T-Shirt',
        size: 'M',
        color: 'Burnt Sienna',
        quantity: 1,
        price: 1275,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100'
      },
      {
        id: 2,
        name: 'TrooperGo: 2-in-1 Utility Cargo Pants',
        size: '32',
        color: 'Olive',
        quantity: 1,
        price: 4250,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210'
    },
    timeline: [
      {
        status: 'Order Placed',
        date: '15 Jan 2024, 10:30 AM',
        description: 'Your order has been placed successfully',
        completed: true
      },
      {
        status: 'Order Confirmed',
        date: '15 Jan 2024, 11:00 AM',
        description: 'Your order has been confirmed',
        completed: true
      },
      {
        status: 'Shipped',
        date: '16 Jan 2024, 02:30 PM',
        description: 'Your order has been shipped via BlueDart',
        completed: true
      },
      {
        status: 'In Transit',
        date: '17 Jan 2024, 09:00 AM',
        description: 'Your order is on the way',
        completed: true,
        current: true
      },
      {
        status: 'Out for Delivery',
        date: 'Expected: 20 Jan 2024',
        description: 'Your order will be delivered soon',
        completed: false
      },
      {
        status: 'Delivered',
        date: 'Expected: 20 Jan 2024',
        description: 'Your order has been delivered',
        completed: false
      }
    ],
    courier: {
      name: 'BlueDart',
      trackingNumber: 'BD123456789IN',
      trackingUrl: 'https://www.bluedart.com/tracking'
    }
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setError('');
    
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both order number and email');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo, show sample data
      if (orderNumber.toUpperCase() === 'BT-2024-78945') {
        setOrderData(sampleOrderData);
      } else {
        setError('Order not found. Please check your order number and email.');
      }
    }, 1500);
  };

  const getStatusIcon = (status, completed, current) => {
    if (completed && !current) {
      return <FiCheckCircle className="timeline-icon completed" />;
    }
    if (current) {
      return <FiTruck className="timeline-icon current" />;
    }
    return <div className="timeline-icon pending" />;
  };

  return (
    <>
      <Navbar alwaysSolid />
      
      <main className="track-order">
        <div className="track-order__container">
          {/* Header */}
          <div className="track-order__header">
            <h1>TRACK ORDER & RETURNS</h1>
            <p>Track your order or initiate a return</p>
          </div>

          {/* Tabs */}
          <div className="track-order__tabs">
            <button 
              className={`track-order__tab ${activeTab === 'track' ? 'active' : ''}`}
              onClick={() => setActiveTab('track')}
            >
              <FiPackage /> Track Order
            </button>
            <button 
              className={`track-order__tab ${activeTab === 'return' ? 'active' : ''}`}
              onClick={() => setActiveTab('return')}
            >
              <BsBoxSeam /> Return / Exchange
            </button>
          </div>

          {/* Track Order Tab */}
          {activeTab === 'track' && (
            <div className="track-order__content">
              {!orderData ? (
                <div className="track-order__form-section">
                  <div className="track-order__form-card">
                    <h2>Track Your Order</h2>
                    <p>Enter your order details to track your shipment</p>

                    {error && <div className="track-order__error">{error}</div>}

                    <form onSubmit={handleTrackOrder} className="track-order__form">
                      <div className="track-order__field">
                        <label>ORDER NUMBER</label>
                        <input
                          type="text"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          placeholder="e.g., BT-2024-78945"
                        />
                      </div>

                      <div className="track-order__field">
                        <label>EMAIL ADDRESS</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email used for order"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="track-order__submit"
                        disabled={isLoading}
                      >
                        {isLoading ? 'TRACKING...' : 'TRACK ORDER'}
                      </button>
                    </form>

                    <div className="track-order__help">
                      <p>Can't find your order number?</p>
                      <p>Check your order confirmation email or <Link to="/contact">contact us</Link></p>
                    </div>
                  </div>

                  <div className="track-order__info-card">
                    <h3>How to Track Your Order</h3>
                    <ul>
                      <li>
                        <span className="step">1</span>
                        <div>
                          <strong>Find Your Order Number</strong>
                          <p>Check your order confirmation email</p>
                        </div>
                      </li>
                      <li>
                        <span className="step">2</span>
                        <div>
                          <strong>Enter Details</strong>
                          <p>Enter order number and email above</p>
                        </div>
                      </li>
                      <li>
                        <span className="step">3</span>
                        <div>
                          <strong>Track in Real-time</strong>
                          <p>View your order status and delivery updates</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="track-order__result">
                  {/* Order Summary */}
                  <div className="track-order__summary">
                    <div className="track-order__summary-header">
                      <div>
                        <h2>Order #{orderData.orderNumber}</h2>
                        <p>Placed on {orderData.orderDate}</p>
                      </div>
                      <button 
                        className="track-order__new-search"
                        onClick={() => {
                          setOrderData(null);
                          setOrderNumber('');
                          setEmail('');
                        }}
                      >
                        <FiSearch /> Track Another Order
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className="track-order__status-badge">
                      <FiTruck />
                      <span>In Transit - Estimated Delivery: {orderData.estimatedDelivery}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="track-order__timeline-section">
                    <h3>Shipment Progress</h3>
                    <div className="track-order__timeline">
                      {orderData.timeline.map((item, index) => (
                        <div 
                          key={index} 
                          className={`track-order__timeline-item ${item.completed ? 'completed' : ''} ${item.current ? 'current' : ''}`}
                        >
                          {getStatusIcon(item.status, item.completed, item.current)}
                          <div className="track-order__timeline-content">
                            <h4>{item.status}</h4>
                            <p className="date">{item.date}</p>
                            <p className="description">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Courier Info */}
                    <div className="track-order__courier">
                      <p>
                        <strong>Courier:</strong> {orderData.courier.name}
                      </p>
                      <p>
                        <strong>Tracking Number:</strong> {orderData.courier.trackingNumber}
                      </p>
                      <a 
                        href={orderData.courier.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="track-order__courier-link"
                      >
                        Track on {orderData.courier.name} →
                      </a>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="track-order__items-section">
                    <h3>Order Items</h3>
                    <div className="track-order__items">
                      {orderData.items.map(item => (
                        <div key={item.id} className="track-order__item">
                          <img src={item.image} alt={item.name} />
                          <div className="track-order__item-info">
                            <h4>{item.name}</h4>
                            <p>Size: {item.size} | Color: {item.color}</p>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <span className="track-order__item-price">
                            Rs.{item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="track-order__address-section">
                    <h3>Shipping Address</h3>
                    <div className="track-order__address">
                      <FiMapPin />
                      <div>
                        <p><strong>{orderData.shippingAddress.name}</strong></p>
                        <p>{orderData.shippingAddress.address}</p>
                        <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}</p>
                        <p>{orderData.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="track-order__actions">
                    <Link to="/contact" className="track-order__action-btn">
                      <FiMail /> Contact Support
                    </Link>
                    <button className="track-order__action-btn">
                      <BsBoxSeam /> Initiate Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Return Tab */}
          {activeTab === 'return' && (
            <div className="track-order__content">
              <div className="track-order__return-section">
                <div className="track-order__return-card">
                  <BsBox className="track-order__return-icon" />
                  <h2>Return & Exchange Policy</h2>
                  <p>We offer easy returns within 15 days of delivery</p>

                  <div className="track-order__return-steps">
                    <div className="track-order__return-step">
                      <span>1</span>
                      <h4>Initiate Return</h4>
                      <p>Login to your account and select the item you wish to return</p>
                    </div>
                    <div className="track-order__return-step">
                      <span>2</span>
                      <h4>Schedule Pickup</h4>
                      <p>Choose a convenient date for pickup</p>
                    </div>
                    <div className="track-order__return-step">
                      <span>3</span>
                      <h4>Get Refund</h4>
                      <p>Refund will be processed within 5-7 business days</p>
                    </div>
                  </div>

                  <div className="track-order__return-actions">
                    <Link to="/login" className="track-order__return-btn primary">
                      LOGIN TO INITIATE RETURN
                    </Link>
                    <Link to="/faq" className="track-order__return-btn secondary">
                      VIEW RETURN POLICY
                    </Link>
                  </div>

                  <div className="track-order__return-note">
                    <h4>Please Note:</h4>
                    <ul>
                      <li>Items must be unused with original tags attached</li>
                      <li>Innerwear and accessories are non-returnable</li>
                    </ul>
                  </div>
                </div>

                <div className="track-order__contact-card">
                  <h3>Need Help?</h3>
                  <p>Our support team is here to assist you</p>
                  <div className="track-order__contact-options">
                    <a href="tel:+919876543210" className="track-order__contact-option">
                      <FiPhone />
                      <div>
                        <strong>Call Us</strong>
                        <span>+91 98765 43210</span>
                      </div>
                    </a>
                    <a href="mailto:support@aaoms.com" className="track-order__contact-option">
                      <FiMail />
                      <div>
                        <strong>Email Us</strong>
                        <span>support@aaoms.com</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TrackOrder;