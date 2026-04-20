// pages/Checkout/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaChevronLeft,
  FaLock,
  FaTruck,
  FaShieldAlt,
  FaTag,
  FaTimes,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './CheckoutPage.css';

// ==================== ESEWA CONFIG ====================
const ESEWA_CONFIG = {
  merchantId: 'EPAYTEST',               // Replace with your merchant ID
  successUrl: 'https://aaoms-test.onrender.com/payment/success',
  failureUrl: 'https://aaoms-test.onrender.com/payment/failure',
  esewaPaymentUrl: 'https://uat.esewa.com.np/epay/main',  // Test URL
  // Production: 'https://esewa.com.np/epay/main'
};

// ==================== KHALTI CONFIG ====================
const KHALTI_CONFIG = {
  publicKey: 'test_public_key_xxxxxxxxxxxxxxx',  // Replace with your public key
  productIdentity: 'bombay_trooper_order',
  productName: 'Bombay Trooper Order',
  productUrl: 'https://aaoms-test.onrender.com',
  // For production, use live public key
};

// ==================== NEPAL PROVINCES ====================
const nepalProvinces = [
  { value: '', label: 'Select Province' },
  { value: 'koshi', label: 'Koshi Pradesh' },
  { value: 'madhesh', label: 'Madhesh Pradesh' },
  { value: 'bagmati', label: 'Bagmati Pradesh' },
  { value: 'gandaki', label: 'Gandaki Pradesh' },
  { value: 'lumbini', label: 'Lumbini Pradesh' },
  { value: 'karnali', label: 'Karnali Pradesh' },
  { value: 'sudurpashchim', label: 'Sudurpashchim Pradesh' },
];

// ==================== CHECKOUT COMPONENT ====================
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems: contextCartItems, updateQuantity, removeFromCart } = useCart();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Please login to checkout');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Use real cart items from context, fallback to empty array
  const [cartItems, setCartItems] = useState([]);

  // Sync cart items from context
  useEffect(() => {
    if (contextCartItems && contextCartItems.length > 0) {
      setCartItems(contextCartItems);
    }
  }, [contextCartItems]);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    saveInfo: true,
    orderNotes: ''
  });

  // Other states
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for payment callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const esewaOid = urlParams.get('oid');
    const esewaRefId = urlParams.get('refId');
    const esewaAmt = urlParams.get('amt');

    if (esewaOid && esewaRefId) {
      verifyEsewaPayment(esewaOid, esewaRefId, esewaAmt);
    }
  }, []);

  // ==================== CALCULATIONS ====================
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shippingCost;

  // ==================== HANDLERS ====================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      const newQty = Math.max(1, item.quantity + change);
      updateQuantity(itemId, newQty, item.size);
      setCartItems(prev => prev.map(cartItem => {
        if (cartItem.id === itemId) {
          return { ...cartItem, quantity: newQty };
        }
        return cartItem;
      }));
    }
  };

  const handleRemoveItem = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      removeFromCart(itemId, item.size);
      setCartItems(prev => prev.filter(cartItem => cartItem.id !== itemId));
    }
  };

  // ==================== VALIDATION ====================
  const validateShipping = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^(98|97|96)\d{8}$/.test(formData.phone)) newErrors.phone = 'Invalid Nepal phone number';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.province) newErrors.province = 'Province is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (!paymentMethod) {
      setErrors({ payment: 'Please select a payment method' });
      return false;
    }
    return true;
  };

  // ==================== STEP NAVIGATION ====================
  const goToPayment = () => {
    if (validateShipping()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const goBackToShipping = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  // ==================== GENERATE ORDER ID ====================
  const generateOrderId = () => {
    return 'BT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  // ==================== ESEWA PAYMENT ====================
  const initiateEsewaPayment = () => {
    const orderId = generateOrderId();
    const amount = total;
    const taxAmount = 0;
    const serviceCharge = 0;
    const deliveryCharge = shippingCost;
    const totalAmount = amount;

    // Save order details to localStorage before redirect
    localStorage.setItem('pendingOrder', JSON.stringify({
      orderId,
      items: cartItems,
      shipping: formData,
      paymentMethod: 'esewa',
      subtotal,
      shippingCost,
      total: totalAmount
    }));

    // Create form and submit to eSewa
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ESEWA_CONFIG.esewaPaymentUrl;

    const params = {
      amt: amount - taxAmount - serviceCharge - deliveryCharge,
      psc: serviceCharge,
      pdc: deliveryCharge,
      txAmt: taxAmount,
      tAmt: totalAmount,
      pid: orderId,
      scd: ESEWA_CONFIG.merchantId,
      su: ESEWA_CONFIG.successUrl,
      fu: ESEWA_CONFIG.failureUrl
    };

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  // ==================== VERIFY ESEWA PAYMENT ====================
  const verifyEsewaPayment = async (orderId, refId, amount) => {
    try {
      // In production, verify on your backend
      // const response = await fetch('/api/verify-esewa', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ oid: orderId, refId, amt: amount })
      // });

      // For now, mark as success
      const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
      if (pendingOrder) {
        setPaymentSuccess(true);
        localStorage.removeItem('pendingOrder');
        localStorage.setItem('lastOrder', JSON.stringify({
          ...pendingOrder,
          paymentRef: refId,
          status: 'confirmed'
        }));
      }
    } catch (error) {
      console.error('eSewa verification failed:', error);
    }
  };

  // ==================== KHALTI PAYMENT ====================
  const initiateKhaltiPayment = () => {
    const orderId = generateOrderId();

    // Save order details
    localStorage.setItem('pendingOrder', JSON.stringify({
      orderId,
      items: cartItems,
      shipping: formData,
      paymentMethod: 'khalti',
      subtotal,
      shippingCost,
      total
    }));

    // Khalti Web Checkout
    // Method 1: Using Khalti Web SDK
    if (window.KhaltiCheckout) {
      const config = {
        publicKey: KHALTI_CONFIG.publicKey,
        productIdentity: orderId,
        productName: KHALTI_CONFIG.productName,
        productUrl: KHALTI_CONFIG.productUrl,
        amount: total * 100, // Khalti uses paisa
        eventHandler: {
          onSuccess(payload) {
            // Verify on backend
            verifyKhaltiPayment(payload, orderId);
          },
          onError(error) {
            console.error('Khalti error:', error);
            setIsProcessing(false);
            toast.error('Payment failed. Please try again.');
          },
          onClose() {
            setIsProcessing(false);
          }
        },
        paymentPreference: [
          'KHALTI',
          'EBANKING',
          'MOBILE_BANKING',
          'CONNECT_IPS',
          'SCT'
        ]
      };

      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ amount: total * 100 });
    } else {
      // Method 2: Khalti e-Payment API (redirect method)
      initiateKhaltiEpayment(orderId);
    }
  };

  // Khalti e-Payment (new API)
  const initiateKhaltiEpayment = async (orderId) => {
    try {
      // In production, make this request from your backend
      const payload = {
        return_url: `${window.location.origin}/payment/success`,
        website_url: window.location.origin,
        amount: total * 100,
        purchase_order_id: orderId,
        purchase_order_name: 'Bombay Trooper Order',
        customer_info: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        }
      };

      // This should be done from backend
      // const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'key YOUR_SECRET_KEY',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // });
      // const data = await response.json();
      // window.location.href = data.payment_url;

      // For demo - simulate success
      simulatePaymentSuccess(orderId, 'khalti');

    } catch (error) {
      console.error('Khalti initiation failed:', error);
      setIsProcessing(false);
    }
  };

  // Verify Khalti Payment
  const verifyKhaltiPayment = async (payload, orderId) => {
    try {
      // In production, verify on backend
      // const response = await fetch('/api/verify-khalti', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: payload.token, amount: total * 100 })
      // });

      setPaymentSuccess(true);
      localStorage.removeItem('pendingOrder');
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId,
        items: cartItems,
        shipping: formData,
        paymentMethod: 'khalti',
        paymentRef: payload.token || payload.pidx,
        total,
        status: 'confirmed'
      }));
    } catch (error) {
      console.error('Khalti verification failed:', error);
    }
  };

  // Simulate payment for demo
  const simulatePaymentSuccess = (orderId, method) => {
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      localStorage.removeItem('pendingOrder');
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId,
        items: cartItems,
        shipping: formData,
        paymentMethod: method,
        paymentRef: 'DEMO-' + Date.now(),
        subtotal,
        shippingCost,
        total,
        status: 'confirmed',
        date: new Date().toISOString()
      }));
    }, 2000);
  };

  // ==================== PLACE ORDER ====================
  const handlePlaceOrder = () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    if (paymentMethod === 'esewa') {
      initiateEsewaPayment();
    } else if (paymentMethod === 'khalti') {
      initiateKhaltiPayment();
    } else if (paymentMethod === 'cod') {
      // Cash on Delivery
      const orderId = generateOrderId();
      simulatePaymentSuccess(orderId, 'cod');
    }
  };

  // ==================== PAYMENT SUCCESS VIEW ====================
  if (paymentSuccess) {
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || {};
    return (
      <>
        <Navbar alwaysSolid />
        <div className="checkout-success">
          <div className="checkout-success__icon">
            <FaCheckCircle />
          </div>
          <h1 className="checkout-success__title">ORDER CONFIRMED!</h1>
          <p className="checkout-success__order-id">Order ID: {lastOrder.orderId}</p>
          <p className="checkout-success__text">
            Thank you for your purchase! We've sent a confirmation to <strong>{lastOrder.shipping?.email}</strong>
          </p>

          <div className="checkout-success__details">
            <div className="checkout-success__detail-row">
              <span>Payment Method</span>
              <span className="checkout-success__method">
                {lastOrder.paymentMethod === 'esewa' && '🟢 eSewa'}
                {lastOrder.paymentMethod === 'khalti' && '🟣 Khalti'}
                {lastOrder.paymentMethod === 'cod' && '📦 Cash on Delivery'}
              </span>
            </div>
            <div className="checkout-success__detail-row">
              <span>Reference</span>
              <span>{lastOrder.paymentRef}</span>
            </div>
            <div className="checkout-success__detail-row">
              <span>Total Paid</span>
              <span className="checkout-success__total">Rs. {lastOrder.total?.toLocaleString()}</span>
            </div>
          </div>

          <div className="checkout-success__actions">
            <Link to="/" className="checkout-success__btn checkout-success__btn--primary">
              CONTINUE SHOPPING
            </Link>
            <Link to="/orders" className="checkout-success__btn checkout-success__btn--secondary">
              VIEW ORDERS
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ==================== EMPTY CART ====================
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar alwaysSolid />
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart to checkout</p>
          <Link to="/" className="checkout-empty__btn">CONTINUE SHOPPING</Link>
        </div>
        <Footer />
      </>
    );
  }

  // ==================== MAIN RENDER ====================
  // Show empty cart message if no items
  if (!isAuthenticated() || cartItems.length === 0) {
    return (
      <>
        <Navbar alwaysSolid />
        <main className="checkout">
          <div className="checkout__container">
            <div className="checkout__empty" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>Your cart is empty</h2>
              <p style={{ marginBottom: '30px', color: '#666' }}>
                {!isAuthenticated() ? 'Please login to start shopping' : 'Add items to your cart to proceed with checkout'}
              </p>
              <Link 
                to={!isAuthenticated() ? '/login' : '/collection'} 
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  backgroundColor: '#000',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                {!isAuthenticated() ? 'Go to Login' : 'Continue Shopping'}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar alwaysSolid />

      <main className="checkout">
        {/* Mobile Order Summary Toggle */}
        <button
          className="checkout__mobile-summary-toggle"
          onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
        >
          <span>
            {orderSummaryOpen ? <FaChevronUp /> : <FaChevronDown />}
            {orderSummaryOpen ? ' Hide' : ' Show'} order summary
          </span>
          <span className="checkout__mobile-total">Rs. {total.toLocaleString()}</span>
        </button>

        <div className="checkout__container">
          {/* ===== LEFT SIDE - FORMS ===== */}
          <div className="checkout__left">
            {/* Logo / Breadcrumb */}
            <div className="checkout__header">
              <Link to="/" className="checkout__logo">BOMBAY TROOPER</Link>
              <div className="checkout__breadcrumb">
                <span className={currentStep >= 1 ? 'active' : ''}>Cart</span>
                <span className="checkout__breadcrumb-sep">›</span>
                <span className={currentStep >= 1 ? 'active' : ''}>Information</span>
                <span className="checkout__breadcrumb-sep">›</span>
                <span className={currentStep >= 2 ? 'active' : ''}>Payment</span>
              </div>
            </div>

            {/* ===== STEP 1: SHIPPING ===== */}
            {currentStep === 1 && (
              <div className="checkout__step">
                {/* Contact */}
                <div className="checkout__section">
                  <h2 className="checkout__section-title">CONTACT INFORMATION <span style={{color: '#d32f2f', marginLeft: '4px'}}>*</span></h2>
                  <div className="checkout__field">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      required
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="checkout__error">{errors.email}</span>}
                  </div>
                  <div className="checkout__field">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number (98XXXXXXXX)"
                      required
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="checkout__error">{errors.phone}</span>}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="checkout__section">
                  <h2 className="checkout__section-title">SHIPPING ADDRESS <span style={{color: '#d32f2f', marginLeft: '4px'}}>*</span></h2>

                  <div className="checkout__field-row">
                    <div className="checkout__field">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        required
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="checkout__error">{errors.firstName}</span>}
                    </div>
                    <div className="checkout__field">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        required
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="checkout__error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="checkout__field">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      required
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="checkout__error">{errors.address}</span>}
                  </div>

                  <div className="checkout__field">
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="checkout__field-row checkout__field-row--three">
                    <div className="checkout__field">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="checkout__error">{errors.city}</span>}
                    </div>
                    <div className="checkout__field">
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        required
                        className={errors.province ? 'error' : ''}
                      >
                        {nepalProvinces.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                      {errors.province && <span className="checkout__error">{errors.province}</span>}
                    </div>
                    <div className="checkout__field">
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal code (optional)"
                      />
                    </div>
                  </div>

                  {/* Save Info */}
                  <label className="checkout__checkbox">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                    />
                    <span>Save this information for next time</span>
                  </label>

                  {/* Order Notes */}
                  <div className="checkout__field" style={{ marginTop: '15px' }}>
                    <textarea
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Order notes (optional)"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="checkout__nav">
                  <Link to="/cart" className="checkout__back">
                    <FaChevronLeft /> Return to cart
                  </Link>
                  <button className="checkout__continue" onClick={goToPayment}>
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            )}

            {/* ===== STEP 2: PAYMENT ===== */}
            {currentStep === 2 && (
              <div className="checkout__step">
                {/* Shipping Summary */}
                <div className="checkout__info-summary">
                  <div className="checkout__info-row">
                    <span className="checkout__info-label">Contact</span>
                    <span className="checkout__info-value">{formData.email}</span>
                    <button className="checkout__info-change" onClick={goBackToShipping}>Change</button>
                  </div>
                  <div className="checkout__info-row">
                    <span className="checkout__info-label">Ship to</span>
                    <span className="checkout__info-value">
                      {formData.address}, {formData.city}, {formData.province}
                    </span>
                    <button className="checkout__info-change" onClick={goBackToShipping}>Change</button>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="checkout__section">
                  <h2 className="checkout__section-title">SHIPPING METHOD</h2>
                  <div className="checkout__shipping-method">
                    <div className="checkout__shipping-option active">
                      <FaTruck />
                      <div className="checkout__shipping-details">
                        <span className="checkout__shipping-name">
                          {shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping'}
                        </span>
                        <span className="checkout__shipping-time">3-5 business days</span>
                      </div>
                      <span className="checkout__shipping-price">
                        {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="checkout__section">
                  <h2 className="checkout__section-title">PAYMENT METHOD</h2>
                  <p className="checkout__section-subtitle">All transactions are secure and encrypted.</p>

                  {errors.payment && (
                    <div className="checkout__payment-error">{errors.payment}</div>
                  )}

                  <div className="checkout__payment-methods">
                    {/* eSewa */}
                    <div
                      className={`checkout__payment-option ${paymentMethod === 'esewa' ? 'active' : ''}`}
                      onClick={() => { setPaymentMethod('esewa'); setErrors({}); }}
                    >
                      <div className="checkout__payment-radio">
                        <div className={`checkout__radio ${paymentMethod === 'esewa' ? 'checked' : ''}`} />
                      </div>
                      <div className="checkout__payment-content">
                        <div className="checkout__payment-header">
                          <div className="checkout__payment-label">
                            <img
                              src="/images/payments/esewa-logo.png"
                              alt="eSewa"
                              className="checkout__payment-logo"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="checkout__payment-name">eSewa</span>
                          </div>
                          <div className="checkout__payment-badge checkout__payment-badge--esewa">
                            Pay with eSewa
                          </div>
                        </div>
                        {paymentMethod === 'esewa' && (
                          <div className="checkout__payment-info">
                            <div className="checkout__payment-info-box checkout__payment-info-box--esewa">
                              <img src="/images/payments/esewa-icon.png" alt="eSewa"
                                onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }} />
                              <p>You will be redirected to eSewa to complete your payment securely.</p>
                              <ul>
                                <li>✓ Pay with eSewa wallet balance</li>
                                <li>✓ Link your bank account</li>
                                <li>✓ Instant confirmation</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Khalti */}
                    <div
                      className={`checkout__payment-option ${paymentMethod === 'khalti' ? 'active' : ''}`}
                      onClick={() => { setPaymentMethod('khalti'); setErrors({}); }}
                    >
                      <div className="checkout__payment-radio">
                        <div className={`checkout__radio ${paymentMethod === 'khalti' ? 'checked' : ''}`} />
                      </div>
                      <div className="checkout__payment-content">
                        <div className="checkout__payment-header">
                          <div className="checkout__payment-label">
                            <img
                              src="/images/payments/khalti-logo.png"
                              alt="Khalti"
                              className="checkout__payment-logo"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="checkout__payment-name">Khalti</span>
                          </div>
                          <div className="checkout__payment-badge checkout__payment-badge--khalti">
                            Pay with Khalti
                          </div>
                        </div>
                        {paymentMethod === 'khalti' && (
                          <div className="checkout__payment-info">
                            <div className="checkout__payment-info-box checkout__payment-info-box--khalti">
                              <img src="/images/payments/khalti-icon.png" alt="Khalti"
                                onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }} />
                              <p>You will be redirected to Khalti to complete your payment securely.</p>
                              <ul>
                                <li>✓ Khalti Wallet</li>
                                <li>✓ E-Banking / Mobile Banking</li>
                                <li>✓ Connect IPS / SCT</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      className={`checkout__payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => { setPaymentMethod('cod'); setErrors({}); }}
                    >
                      <div className="checkout__payment-radio">
                        <div className={`checkout__radio ${paymentMethod === 'cod' ? 'checked' : ''}`} />
                      </div>
                      <div className="checkout__payment-content">
                        <div className="checkout__payment-header">
                          <div className="checkout__payment-label">
                            <span className="checkout__payment-cod-icon">📦</span>
                            <span className="checkout__payment-name">Cash on Delivery</span>
                          </div>
                        </div>
                        {paymentMethod === 'cod' && (
                          <div className="checkout__payment-info">
                            <div className="checkout__payment-info-box checkout__payment-info-box--cod">
                              <p>Pay when your order is delivered to your doorstep.</p>
                              <p className="checkout__cod-note">
                                ⚠️ Additional Rs. 50 COD charge applies
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="checkout__security">
                  <FaLock />
                  <span>Your payment information is processed securely. We do not store your payment details.</span>
                </div>

                {/* Navigation */}
                <div className="checkout__nav">
                  <button className="checkout__back" onClick={goBackToShipping}>
                    <FaChevronLeft /> Return to shipping
                  </button>
                  <button
                    className="checkout__place-order"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="checkout__processing">
                        <span className="checkout__spinner"></span>
                        PROCESSING...
                      </span>
                    ) : (
                      <>
                        <FaLock />
                        PAY Rs. {total.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="checkout__trust">
              <div className="checkout__trust-item">
                <FaTruck />
                <span>Free shipping over Rs. 2000</span>
              </div>
              <div className="checkout__trust-item">
                <FaShieldAlt />
                <span>Secure payment</span>
              </div>
              <div className="checkout__trust-item">
                <FaTag />
                <span>Easy returns</span>
              </div>
            </div>
          </div>

          {/* ===== RIGHT SIDE - ORDER SUMMARY ===== */}
          <div className={`checkout__right ${orderSummaryOpen ? 'checkout__right--open' : ''}`}>
            <div className="checkout__summary">
              <h3 className="checkout__summary-title">ORDER SUMMARY</h3>

              {/* Cart Items */}
              <div className="checkout__items">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout__item">
                    <div className="checkout__item-image">
                      <img src={item.image} alt={item.name}
                        onError={(e) => { e.target.src = '/images/placeholder.png'; }} />
                      <span className="checkout__item-qty">{item.quantity}</span>
                    </div>
                    <div className="checkout__item-details">
                      <h4 className="checkout__item-name">{item.name}</h4>
                      <p className="checkout__item-variant">Size: {item.size}</p>
                      <div className="checkout__item-quantity">
                        <button onClick={() => handleQuantityChange(item.id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                        <button className="checkout__item-remove" onClick={() => handleRemoveItem(item.id)}>
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                    <span className="checkout__item-price">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              {/* Totals */}
              <div className="checkout__totals">
                <div className="checkout__total-row">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="checkout__total-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}</span>
                </div>

                <div className="checkout__total-row checkout__total-row--final">
                  <span>Total</span>
                  <span className="checkout__grand-total">
                    <small>NPR</small> Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Icons */}
              <div className="checkout__payment-icons">
                <img src="/images/esewa.png" alt="eSewa" className="checkout__payment-icon checkout__payment-icon--esewa" />
                <img src="/images/khaltilogo.png" alt="Khalti" className="checkout__payment-icon checkout__payment-icon--khalti" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;