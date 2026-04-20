// pages/Orders/Orders.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Orders.css';

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample orders data
  const orders = [];

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'processing', label: 'Processing' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle />;
      case 'in-transit': return <FiTruck />;
      case 'processing': return <FiClock />;
      case 'cancelled': return <FiXCircle />;
      default: return <FiPackage />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#4caf50';
      case 'in-transit': return '#ff9800';
      case 'processing': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <>
      <Navbar alwaysSolid />
      
      <main className="orders">
        <div className="orders__container">
          {/* Header */}
          <div className="orders__header">
            <div className="orders__header-content">
              <h1>MY ORDERS</h1>
              <p>Track and manage your orders</p>
            </div>
            {/* <Link to="/track-order" className="orders__track-btn">
              <FiPackage /> Track Order
            </Link> */}
          </div>

          {/* Filters & Search */}
          <div className="orders__toolbar">
            <div className="orders__filters">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  className={`orders__filter-btn ${activeFilter === option.value ? 'active' : ''}`}
                  onClick={() => setActiveFilter(option.value)}
                >
                  {option.label}
                  {option.value !== 'all' && (
                    <span className="orders__filter-count">
                      {orders.filter(o => o.status === option.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="orders__search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="orders__empty">
              <BsBoxSeam />
              <h3>No orders found</h3>
              <p>
                {activeFilter === 'all' 
                  ? "You haven't placed any orders yet" 
                  : `No ${activeFilter.replace('-', ' ')} orders`}
              </p>
              <Link to="/collection">START SHOPPING</Link>
            </div>
          ) : (
            <div className="orders__list">
              {filteredOrders.map(order => (
                <div key={order.id} className={`orders__card ${expandedOrder === order.id ? 'expanded' : ''}`}>
                  {/* Order Header */}
                  <div className="orders__card-header" onClick={() => toggleOrderDetails(order.id)}>
                    <div className="orders__card-info">
                      <div className="orders__card-id">
                        <span>Order #{order.id}</span>
                        <span className="orders__card-date">Placed on {order.date}</span>
                      </div>
                      <div className="orders__card-items-preview">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <img key={idx} src={item.image} alt={item.name} />
                        ))}
                        {order.items.length > 3 && (
                          <span className="orders__more-items">+{order.items.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div className="orders__card-status">
                      <span 
                        className="orders__status-badge"
                        style={{ 
                          backgroundColor: `${getStatusColor(order.status)}15`,
                          color: getStatusColor(order.status)
                        }}
                      >
                        {getStatusIcon(order.status)}
                        {order.statusText}
                      </span>
                      <span className="orders__card-total">Rs. {order.total.toLocaleString()}</span>
                    </div>
                    <button className="orders__expand-btn">
                      {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>

                  {/* Order Details (Expanded) */}
                  <div className="orders__card-details">
                    {/* Timeline */}
                    {order.status !== 'cancelled' && (
                      <div className="orders__timeline">
                        <div className={`orders__timeline-step ${['processing', 'in-transit', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                          <div className="orders__timeline-icon"><FiCheckCircle /></div>
                          <span>Order Placed</span>
                        </div>
                        <div className={`orders__timeline-step ${['in-transit', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                          <div className="orders__timeline-icon"><FiPackage /></div>
                          <span>Shipped</span>
                        </div>
                        <div className={`orders__timeline-step ${order.status === 'in-transit' ? 'current' : ''} ${order.status === 'delivered' ? 'completed' : ''}`}>
                          <div className="orders__timeline-icon"><FiTruck /></div>
                          <span>In Transit</span>
                        </div>
                        <div className={`orders__timeline-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                          <div className="orders__timeline-icon"><FiCheckCircle /></div>
                          <span>Delivered</span>
                        </div>
                      </div>
                    )}

                    {/* Cancelled Info */}
                    {order.status === 'cancelled' && (
                      <div className="orders__cancelled-info">
                        <FiXCircle />
                        <div>
                          <strong>Order Cancelled</strong>
                          <p>Cancelled on {order.cancelledDate}</p>
                          <p>Reason: {order.cancellationReason}</p>
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="orders__items">
                      <h4>Order Items</h4>
                      {order.items.map(item => (
                        <div key={item.id} className="orders__item">
                          <img src={item.image} alt={item.name} />
                          <div className="orders__item-info">
                            <Link to={`/product/${item.id}`} className="orders__item-name">
                              {item.name}
                            </Link>
                            <p>Size: {item.size} | Color: {item.color}</p>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <div className="orders__item-price">
                            Rs.{item.price.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="orders__summary-details">
                      <div className="orders__summary-row">
                        <span>Subtotal</span>
                        <span>Rs. {order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="orders__summary-row">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? 'FREE' : `Rs. ${order.shipping}`}</span>
                      </div>
                      <div className="orders__summary-row total">
                        <span>Total</span>
                        <span>Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="orders__extra-info">
                      <div className="orders__shipping-info">
                        <h5>Shipping Address</h5>
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      </div>
                      <div className="orders__payment-info">
                        <h5>Payment Method</h5>
                        <p>{order.paymentMethod}</p>
                        {order.trackingNumber && (
                          <>
                            <h5>Tracking</h5>
                            <p>{order.courier}: {order.trackingNumber}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="orders__actions">
                      {order.status === 'delivered' && (
                        <>
                          <button className="orders__action-btn">
                            <BsBoxSeam /> Return / Exchange
                          </button>
                          <button className="orders__action-btn">
                            <FiRefreshCw /> Buy Again
                          </button>
                        </>
                      )}
                      {order.status === 'in-transit' && (
                        <Link to={`/track-order?order=${order.id}`} className="orders__action-btn primary">
                          <FiTruck /> Track Shipment
                        </Link>
                      )}
                      <button className="orders__action-btn">
                        <FiDownload /> Download Invoice
                      </button>
                      <Link to="/contact" className="orders__action-btn">
                        Need Help?
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Orders;