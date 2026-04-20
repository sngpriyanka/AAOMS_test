// pages/Account/Account.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiPackage, 
  FiHeart, 
  FiMapPin, 
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiEdit2,
  FiPlus,
  FiEye,
  FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import './Account.css';

// Nepal Provinces (7 Official Provinces)
const NEPAL_PROVINCES = [
  'Kosi Pradesh',
  'Madhesh Pradesh',
  'Bagmati Pradesh',
  'Gandaki Pradesh',
  'Lumbini Pradesh',
  'Karnali Pradesh',
  'Sudurpashchim Pradesh'
];

const Account = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, updateUser } = useAuth();
  const { addToCart, isItemInCart } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  // Settings form state
  const [settingsData, setSettingsData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Parse authenticated user data
  const parseName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  };

  const { firstName, lastName } = parseName(authUser?.name);
  
  const user = {
    firstName: firstName,
    lastName: lastName,
    email: authUser?.email || 'user@example.com',
    phone: authUser?.phone || '',
    avatar: null
  };

  // Initialize settings form with user data
  useEffect(() => {
    if (authUser) {
      setSettingsData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? user.phone.replace(/^\+977/, '') : ''
      }));
    }
  }, [authUser]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const response = await api.get('/orders');
        if (response.data.success) {
          setOrders(response.data.data || []);
        } else {
          setOrdersError('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrdersError('Unable to load orders. Please try again later.');
      } finally {
        setOrdersLoading(false);
      }
    };

    if (authUser?.id) {
      fetchOrders();
    }
  }, [authUser?.id]);

  // Fetch user wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      setWishlistLoading(true);
      setWishlistError(null);
      try {
        const response = await api.get('/wishlist');
        if (response.data.success) {
          setWishlist(response.data.data?.items || []);
        } else {
          setWishlistError('Failed to load wishlist');
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlistError('Unable to load wishlist. Please try again later.');
      } finally {
        setWishlistLoading(false);
      }
    };

    if (authUser?.id) {
      fetchWishlist();
    }
  }, [authUser?.id]);

  // Fetch addresses
  useEffect(() => {
    if (!authUser?.id) return;
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/addresses');
        if (response.data.success) setAddresses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddresses();
  }, [authUser?.id]);

  // Handle form input
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit address (add or update)
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      
      if (editingAddressId) {
        // Update existing address
        response = await api.put(`/addresses/${editingAddressId}`, formData);
      } else {
        // Create new address
        response = await api.post('/addresses', formData);
      }
      
      if (response.data.success) {
        setAddresses(response.data.data || []);
        setShowAddressModal(false);
        setEditingAddressId(null);
        setFormData({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
        toast.success(editingAddressId ? 'Address updated successfully' : 'Address added successfully');
      }
    } catch (error) {
      toast.error(editingAddressId ? 'Failed to update address' : 'Failed to add address');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal for address
  const handleEditAddress = (address) => {
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone
    });
    setEditingAddressId(address.id);
    setShowAddressModal(true);
  };

  // Close address modal
  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddressId(null);
    setFormData({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await api.delete(`/addresses/${addressId}`);
      if (response.data.success) {
        setAddresses(response.data.data || []);
        toast.success('Address deleted');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    try {
      const response = await api.post(`/addresses/${addressId}/default`);
      if (response.data.success) {
        setAddresses(response.data.data || []);
        toast.success('Default address updated');
      }
    } catch (error) {
      toast.error('Failed to set default');
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await api.delete(`/wishlist/${itemId}`);
      if (response.data.success) {
        setWishlist(response.data.data?.items || []);
        toast.success('Item removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  // Add item from wishlist to cart
  const isProductInCart = (productId, sizeValue) => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return false;
      const cartItems = JSON.parse(savedCart);
      return cartItems.some(item => item.id === productId && item.size === sizeValue);
    } catch (err) {
      console.error('Error checking cart:', err);
      return false;
    }
  };

  const handleAddWishlistToCart = async (item) => {
    // Check if item already in cart with same size
    const itemSize = item.size || '';
    const productId = item.id || item.productId;

    if (isProductInCart(productId, itemSize)) {
      toast.error('This product with selected size is already in cart');
      return;
    }

    try {
      const cartData = {
        productId: productId,
        quantity: 1,
        size: itemSize,
        color: item.color || '',
        price: item.price,
        name: item.name,
        image: item.image,
        customization: {}
      };

      const response = await api.post('/cart/add', cartData);
      
      if (response.data.success) {
        // Update local cart context
        addToCart({
          id: productId,
          name: item.name,
          price: item.price,
          image: item.image,
          colors: [{ name: item.color || '' }]
        }, itemSize, 1, item.color);
        
        toast.success(`${item.name} added to cart!`);
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
    }
  };

  // Handle settings form input change
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettingsData(prev => ({ ...prev, [name]: value }));
  };

  // Handle save settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!settingsData.firstName || !settingsData.lastName || !settingsData.email || !settingsData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate Nepal phone format (10 digits)
    if (!/^\d{10}$/.test(settingsData.phone.replace(/\D/g, ''))) {
      toast.error('Phone must be 10 digits (Nepal format)');
      return;
    }

    // If password change is attempted, validate it
    if (settingsData.newPassword || settingsData.currentPassword) {
      if (!settingsData.currentPassword) {
        toast.error('Current password is required to change password');
        return;
      }
      if (settingsData.newPassword !== settingsData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      if (settingsData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
    }

    setSettingsSaving(true);
    try {
      // Combine first and last name
      const fullName = `${settingsData.firstName} ${settingsData.lastName}`;
      
      // Add +977 prefix to phone for storage
      const phoneWithPrefix = `+977${settingsData.phone}`;
      
      const updateData = {
        name: fullName,
        phone: phoneWithPrefix,
        email: settingsData.email
      };

      const response = await api.put(`/users/profile/${authUser.id}`, updateData);
      
      if (response.data.success) {
        // Update auth context with new user data
        const updatedUserData = {
          name: fullName,
          phone: phoneWithPrefix,
          email: settingsData.email
        };
        updateUser(updatedUserData);
        
        // Reset password fields on success
        setSettingsData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        logout();
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save changes');
      }
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    if (!status) return '#666';
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered': return '#4caf50';
      case 'in transit': return '#ff9800';
      case 'in_transit': return '#ff9800';
      case 'processing': return '#2196f3';
      case 'pending': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'settings', label: 'Account Settings', icon: FiSettings },
  ];

  return (
    <>
      <Navbar alwaysSolid />
      
      <main className="account">
        <div className="account__container">
          {/* Sidebar */}
          <aside className="account__sidebar">
            <div className="account__user">
              <div className="account__avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.firstName} />
                ) : (
                  <span>{user.firstName[0]}{user.lastName[0]}</span>
                )}
              </div>
              <div className="account__user-info">
                <h3>{user.firstName} {user.lastName}</h3>
                <p>{user.email}</p>
              </div>
            </div>

            <nav className="account__nav">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`account__nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  <FiChevronRight className="account__nav-arrow" />
                </button>
              ))}
              
              <button className="account__nav-item account__logout" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="account__content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="account__overview">
                <h2>Welcome back, {user.firstName}!</h2>
                
                <div className="account__stats">
                  <div className="account__stat">
                    <FiPackage />
                    <div>
                      <span className="number">{orders.length}</span>
                      <span className="label">Orders</span>
                    </div>
                  </div>
                  <div className="account__stat">
                    <FiHeart />
                    <div>
                      <span className="number">{wishlist.length}</span>
                      <span className="label">Wishlist Items</span>
                    </div>
                  </div>
                  <div className="account__stat">
                    <FiMapPin />
                    <div>
                      <span className="number">{addresses.length}</span>
                      <span className="label">Addresses</span>
                    </div>
                  </div>
                </div>

                <div className="account__recent-orders">
                  <div className="account__section-header">
                    <h3>Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')}>View All</button>
                  </div>
                  
                  {ordersLoading ? (
                    <div className="account__loading">Loading orders...</div>
                  ) : ordersError ? (
                    <div className="account__error">
                      <FiAlertCircle /> {ordersError}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="account__empty-small">
                      <p>No orders yet. <Link to="/collection">Start shopping</Link></p>
                    </div>
                  ) : (
                    orders.slice(0, 2).map(order => (
                      <div key={order.id} className="account__order-card">
                        <div className="account__order-header">
                          <div>
                            <span className="order-id">Order #{order.trackingNumber || order.id}</span>
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                          </div>
                          <span 
                            className="order-status"
                            style={{ color: getStatusColor(order.status) }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="account__order-items">
                          {order.items && order.items.slice(0, 3).map((item, idx) => (
                            <img 
                              key={idx} 
                              src={item.image || 'https://via.placeholder.com/60'} 
                              alt={item.name}
                              title={item.name}
                            />
                          ))}
                          {order.items && order.items.length > 3 && (
                            <span className="order-more">+{order.items.length - 3}</span>
                          )}
                          <span className="order-total">Rs. {(order.total || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="account__orders">
                <h2>My Orders</h2>
                
                {ordersLoading ? (
                  <div className="account__loading">
                    <FiPackage />
                    <p>Loading your orders...</p>
                  </div>
                ) : ordersError ? (
                  <div className="account__error">
                    <FiAlertCircle />
                    <h3>Error Loading Orders</h3>
                    <p>{ordersError}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="account__empty">
                    <FiPackage />
                    <h3>No orders yet</h3>
                    <p>When you place orders, they will appear here</p>
                    <Link to="/collection">START SHOPPING</Link>
                  </div>
                ) : (
                  <div className="account__orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="account__order-detail">
                        <div className="account__order-detail-header">
                          <div className="order-info">
                            <h4>Order #{order.trackingNumber || order.id}</h4>
                            <p>Placed on {formatDate(order.createdAt)}</p>
                          </div>
                          <div className="order-actions">
                            <span 
                              className="order-status-badge"
                              style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        {order.items && order.items.length > 0 ? (
                          <div className="account__order-items-list">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="account__order-item">
                                <img 
                                  src={item.image || 'https://via.placeholder.com/80'} 
                                  alt={item.name}
                                />
                                <div className="item-info">
                                  <h5>{item.name}</h5>
                                  <p>
                                    {item.size && `Size: ${item.size}`}
                                    {item.color && ` | Color: ${item.color}`}
                                    {item.quantity && ` | Qty: ${item.quantity}`}
                                  </p>
                                </div>
                                <span className="item-price">Rs. {(item.price || 0).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="account__no-items">
                            <p>No items in this order</p>
                          </div>
                        )}

                        <div className="account__order-footer">
                          <span className="order-total">
                            Total: <strong>Rs. {(order.total || 0).toLocaleString()}</strong>
                          </span>
                          <div className="order-footer-actions">
                            <button className="btn-secondary" disabled>
                              <FiEye /> View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="account__wishlist">
                <h2>My Wishlist</h2>
                
                {wishlistLoading ? (
                  <div className="account__loading">
                    <FiHeart />
                    <p>Loading your wishlist...</p>
                  </div>
                ) : wishlistError ? (
                  <div className="account__error">
                    <FiAlertCircle />
                    <h3>Error Loading Wishlist</h3>
                    <p>{wishlistError}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="account__empty">
                    <FiHeart />
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love to your wishlist</p>
                    <Link to="/collection">EXPLORE PRODUCTS</Link>
                  </div>
                ) : (
                  <div className="account__wishlist-grid">
                    {wishlist.map(item => (
                      <div key={item.id} className="account__wishlist-item">
                        <Link to={`/product/${item.productId}`} className="wishlist-image">
                          <img 
                            src={item.image || 'https://via.placeholder.com/200'} 
                            alt={item.name}
                          />
                        </Link>
                        <div className="wishlist-info">
                          <Link to={`/product/${item.productId}`} className="wishlist-name">
                            {item.name}
                          </Link>
                          <p className="wishlist-price">Rs. {(item.price || 0).toLocaleString()}</p>
                          <div className="wishlist-actions">
                            <button 
                              className="add-to-cart-btn"
                              onClick={() => handleAddWishlistToCart(item)}
                            >
                              ADD TO CART
                            </button>
                            <button 
                              className="remove-btn"
                              onClick={() => handleRemoveFromWishlist(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="account__addresses">
                <div className="account__section-header">
                  <h2>Saved Addresses</h2>
                  <button className="add-address-btn" onClick={() => setShowAddressModal(true)}>
                    <FiPlus /> Add New Address
                  </button>
                </div>
                
                <div className="account__addresses-grid">
                  {addresses && addresses.length > 0 ? (
                    addresses.map(address => (
                      <div key={address.id} className="account__address-card">
                        {address.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                        <h4>{address.name}</h4>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p>{address.phone}</p>
                        <div className="address-actions">
                          <button onClick={() => handleEditAddress(address)}><FiEdit2 /> Edit</button>
                          {!address.isDefault && <button onClick={() => handleSetDefault(address.id)}>Set as Default</button>}
                          <button className="delete" onClick={() => handleDeleteAddress(address.id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-address-message">
                      <p>No saved addresses yet. Add your first address to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="account__settings">
                <h2>Account Settings</h2>
                
                <form className="account__settings-form" onSubmit={handleSaveSettings}>
                  <div className="settings-section">
                    <h3>Personal Information</h3>
                    <div className="form-row">
                      <div className="form-field">
                        <label>FIRST NAME</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={settingsData.firstName}
                          onChange={handleSettingsChange}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label>LAST NAME</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={settingsData.lastName}
                          onChange={handleSettingsChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>EMAIL</label>
                      <input 
                        type="email" 
                        name="email"
                        value={settingsData.email}
                        onChange={handleSettingsChange}
                        required
                      />
                    </div>
                    <div className="form-field phone-field-nepal">
                      <label>PHONE (NEPAL)</label>
                      <div className="phone-input-group">
                        <span className="phone-prefix">+977</span>
                        <input 
                          type="tel" 
                          name="phone"
                          value={settingsData.phone}
                          onChange={handleSettingsChange}
                          placeholder="9XXXXXXXXX"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3>Change Password</h3>
                    <div className="form-field">
                      <label>CURRENT PASSWORD</label>
                      <input 
                        type="password" 
                        name="currentPassword"
                        value={settingsData.currentPassword}
                        onChange={handleSettingsChange}
                        placeholder="Enter current password" 
                      />
                    </div>
                    <div className="form-field">
                      <label>NEW PASSWORD</label>
                      <input 
                        type="password" 
                        name="newPassword"
                        value={settingsData.newPassword}
                        onChange={handleSettingsChange}
                        placeholder="Enter new password" 
                      />
                    </div>
                    <div className="form-field">
                      <label>CONFIRM NEW PASSWORD</label>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        value={settingsData.confirmPassword}
                        onChange={handleSettingsChange}
                        placeholder="Confirm new password" 
                      />
                    </div>
                  </div>

                  <div className="settings-actions">
                    <button type="submit" className="save-btn" disabled={settingsSaving}>
                      {settingsSaving ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                  </div>
                </form>

                <div className="account__danger-zone">
                  <h3>Danger Zone</h3>
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="delete-account-btn">DELETE ACCOUNT</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={handleCloseAddressModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <FiMapPin className="modal-icon" />
                <h2>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h2>
              </div>
              <button className="modal-close" onClick={handleCloseAddressModal}>×</button>
            </div>
            <form onSubmit={handleSaveAddress} className="address-form">
              <div className="form-row-two">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleFormChange} 
                    placeholder="Enter your full name"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number <span className="required">*</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleFormChange} 
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Address <span className="required">*</span></label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleFormChange} 
                  placeholder="Enter street address, building name etc."
                  required
                ></textarea>
              </div>
              
              <div className="form-row-two">
                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleFormChange} 
                    placeholder="Enter city"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Province <span className="required">*</span></label>
                  <select 
                    name="state" 
                    value={formData.state} 
                    onChange={handleFormChange}
                    required 
                  >
                    <option value="">Select a province</option>
                    {NEPAL_PROVINCES.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Pincode</label>
                <input 
                  type="text" 
                  name="pincode" 
                  value={formData.pincode} 
                  onChange={handleFormChange} 
                  placeholder="Enter postal code (optional)"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseAddressModal} className="btn-cancel">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-submit">
                  {isSubmitting ? (editingAddressId ? 'Updating...' : 'Adding...') : (editingAddressId ? 'Update Address' : 'Save Address')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Account;