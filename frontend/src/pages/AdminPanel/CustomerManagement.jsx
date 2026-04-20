import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiFilter, FiEdit2, FiTrash2, FiLock, FiUnlock, FiUserPlus, FiDownload, FiX, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import './AdminPanel.css';

function CustomerManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteUserId, setPromoteUserId] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockUserId, setBlockUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Mock purchase data
  const mockPurchaseData = {
    1: [ // Krishna Magar
      { id: 1, orderId: '#ORD001', productName: 'BOLD HORIZONS: CLASSIC OVERSIZED T-SHIRT', quantity: 2, unitPrice: 1199, totalPrice: 2398, date: '2026-04-14', status: 'delivered' },
      { id: 2, orderId: '#ORD002', productName: 'RELAXED FIT JEANS', quantity: 1, unitPrice: 2499, totalPrice: 2499, date: '2026-04-10', status: 'delivered' },
      { id: 3, orderId: '#ORD003', productName: 'WHITE POLO SHIRT', quantity: 3, unitPrice: 899, totalPrice: 2697, date: '2026-04-05', status: 'in-transit' },
      { id: 4, orderId: '#ORD004', productName: 'LEATHER BELT', quantity: 1, unitPrice: 1299, totalPrice: 1299, date: '2026-03-28', status: 'delivered' },
      { id: 5, orderId: '#ORD005', productName: 'CASUAL SHORTS', quantity: 2, unitPrice: 799, totalPrice: 1598, date: '2026-03-15', status: 'delivered' },
    ],
    2: [ // Priya Verma
      { id: 6, orderId: '#ORD006', productName: 'FLORAL DRESS', quantity: 1, unitPrice: 1899, totalPrice: 1899, date: '2026-04-12', status: 'delivered' },
      { id: 7, orderId: '#ORD007', productName: 'SILK SCARF', quantity: 2, unitPrice: 599, totalPrice: 1198, date: '2026-04-08', status: 'delivered' },
      { id: 8, orderId: '#ORD008', productName: 'HANDBAG', quantity: 1, unitPrice: 2499, totalPrice: 2499, date: '2026-03-22', status: 'delivered' },
    ],
    4: [ // Ananya Gupta
      { id: 9, orderId: '#ORD009', productName: 'EVENING GOWN', quantity: 1, unitPrice: 3499, totalPrice: 3499, date: '2026-04-11', status: 'delivered' },
      { id: 10, orderId: '#ORD010', productName: 'SHOES', quantity: 2, unitPrice: 1999, totalPrice: 3998, date: '2026-04-09', status: 'delivered' },
      { id: 11, orderId: '#ORD011', productName: 'MAKEUP SET', quantity: 1, unitPrice: 2999, totalPrice: 2999, date: '2026-04-03', status: 'delivered' },
      { id: 12, orderId: '#ORD012', productName: 'JEWELRY SET', quantity: 1, unitPrice: 4999, totalPrice: 4999, date: '2026-03-20', status: 'in-transit' },
      { id: 13, orderId: '#ORD013', productName: 'WATCH', quantity: 1, unitPrice: 5999, totalPrice: 5999, date: '2026-03-10', status: 'delivered' },
      { id: 14, orderId: '#ORD014', productName: 'SUNGLASSES', quantity: 2, unitPrice: 999, totalPrice: 1998, date: '2026-02-25', status: 'delivered' },
      { id: 15, orderId: '#ORD015', productName: 'PERFUME', quantity: 1, unitPrice: 1799, totalPrice: 1799, date: '2026-02-15', status: 'delivered' },
    ],
    6: [ // Nisha Singh
      { id: 16, orderId: '#ORD016', productName: 'CASUAL T-SHIRT', quantity: 2, unitPrice: 699, totalPrice: 1398, date: '2026-04-13', status: 'delivered' },
      { id: 17, orderId: '#ORD017', productName: 'SWEATER', quantity: 1, unitPrice: 1599, totalPrice: 1599, date: '2026-04-06', status: 'delivered' },
      { id: 18, orderId: '#ORD018', productName: 'SNEAKERS', quantity: 1, unitPrice: 2299, totalPrice: 2299, date: '2026-03-25', status: 'delivered' },
      { id: 19, orderId: '#ORD019', productName: 'CARDIGAN', quantity: 1, unitPrice: 1899, totalPrice: 1899, date: '2026-03-18', status: 'delivered' },
    ],
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      const mockUsers = [
        { id: 1, name: 'Krishna Magar', email: 'krishna@example.com', phone: '+977-98765-43210', role: 'customer', status: 'active', joinDate: '2026-01-15', orders: 5, spent: 15000 },
        { id: 2, name: 'Priya Verma', email: 'priya@example.com', phone: '+91-98765-43211', role: 'customer', status: 'active', joinDate: '2026-02-20', orders: 3, spent: 8500 },
        { id: 3, name: 'Rajesh Patel', email: 'rajesh@example.com', phone: '+91-98765-43212', role: 'admin', status: 'active', joinDate: '2025-12-01', orders: 0, spent: 0 },
        { id: 4, name: 'Ananya Gupta', email: 'ananya@example.com', phone: '+91-98765-43213', role: 'customer', status: 'blocked', joinDate: '2025-12-10', orders: 7, spent: 21000 },
        { id: 5, name: 'Hari Bahadur', email: 'hari@example.com', phone: '+977-98765-43214', role: 'admin', status: 'active', joinDate: '2026-01-01', orders: 0, spent: 0 },
        { id: 6, name: 'Nisha Singh', email: 'nisha@example.com', phone: '+91-98765-43215', role: 'customer', status: 'active', joinDate: '2026-02-05', orders: 4, spent: 12300 },
        { id: 7, name: 'Karan Thapa', email: 'karan@example.com', phone: '+977-98765-43216', role: 'customer', status: 'inactive', joinDate: '2025-11-15', orders: 2, spent: 5000 },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm)
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => u.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const toggleUserRole = (userId, currentRole) => {
    setPromoteUserId(userId);
    setShowPromoteModal(true);
  };

  const confirmPromoteUser = () => {
    const user = users.find(u => u.id === promoteUserId);
    const newRole = user.role === 'customer' ? 'admin' : 'customer';
    setUsers(users.map(u => u.id === promoteUserId ? { ...u, role: newRole } : u));
    if (selectedUser?.id === promoteUserId) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
    setShowPromoteModal(false);
    setPromoteUserId(null);
  };

  const blockUnblockUser = (userId) => {
    setBlockUserId(userId);
    setShowBlockModal(true);
  };

  const confirmBlockUser = () => {
    const user = users.find(u => u.id === blockUserId);
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    setUsers(users.map(u => u.id === blockUserId ? { ...u, status: newStatus } : u));
    if (selectedUser?.id === blockUserId) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
    setShowBlockModal(false);
    setBlockUserId(null);
  };

  const deleteUser = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    setUsers(users.filter(u => u.id !== deleteUserId));
    setSelectedUser(null);
    setShowDeleteModal(false);
    setDeleteUserId(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.email.includes('@')) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddUser = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...formData,
      orders: 0,
      spent: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUser]);
    setShowAddUserModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active'
    });
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? '#FF6B6B' : '#4CAF50';
  };

  const getStatusColor = (status) => {
    const colors = { active: '#4CAF50', inactive: '#FF9800', blocked: '#F44336' };
    return colors[status] || '#999';
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>👥 Customer Management</h1>
        <p>View, manage, and control all customer accounts</p>
      </div>

      {loading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <div className="user-management-container">
          {/* Search & Filters */}
          <div className="filters-section">
            <div className="search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>

            <button 
              className="action-btn"
              onClick={() => setShowAddUserModal(true)}
              style={{ backgroundColor: '#2196F3', marginLeft: 'auto' }}
            >
              <FiUserPlus /> Add New User
            </button>
          </div>

          {/* Users Table */}
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Join Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((usr) => (
                    <tr key={usr.id}>
                      <td><strong>{usr.name}</strong></td>
                      <td>{usr.email}</td>
                      <td>{usr.phone}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getRoleColor(usr.role) }}>
                          {usr.role}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getStatusColor(usr.status) }}>
                          {usr.status}
                        </span>
                      </td>
                      <td>{usr.orders}</td>
                      <td>Rs. {usr.spent.toLocaleString()}</td>
                      <td>{usr.joinDate}</td>
                      <td>
                        <button 
                          className="icon-btn"
                          onClick={() => { setSelectedUser(usr); setShowModal(true); }}
                          title="View Details"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Stats Footer */}
          <div className="stats-info">
            <p>Total Users: <strong>{users.length}</strong> | Active: <strong>{users.filter(u => u.status === 'active').length}</strong> | Blocked: <strong>{users.filter(u => u.status === 'blocked').length}</strong> | Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong></p>
          </div>

          {/* User Detail Modal */}
          {showModal && selectedUser && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>User Details</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <div className="user-detail-grid">
                    <div className="detail-item">
                      <label>Name</label>
                      <p>{selectedUser.name}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedUser.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{selectedUser.phone}</p>
                    </div>
                    <div className="detail-item">
                      <label>Role</label>
                      <p>
                        <span className="badge" style={{ backgroundColor: getRoleColor(selectedUser.role) }}>
                          {selectedUser.role}
                        </span>
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p>
                        <span className="badge" style={{ backgroundColor: getStatusColor(selectedUser.status) }}>
                          {selectedUser.status}
                        </span>
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Total Orders</label>
                      <p>{selectedUser.orders}</p>
                    </div>
                    <div className="detail-item">
                      <label>Total Spent</label>
                      <p>Rs. {selectedUser.spent.toLocaleString()}</p>
                    </div>
                    <div className="detail-item">
                      <label>Member Since</label>
                      <p>{selectedUser.joinDate}</p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button 
                      className="action-btn purchase"
                      onClick={() => setShowPurchaseModal(true)}
                      title="View Purchase History"
                    >
                      <FiShoppingCart /> View Purchases
                    </button>
                    <button 
                      className="action-btn promote"
                      onClick={() => toggleUserRole(selectedUser.id, selectedUser.role)}
                    >
                      {selectedUser.role === 'admin' ? '👤 Demote to Customer' : '🛡️ Promote to Admin'}
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => blockUnblockUser(selectedUser.id)}
                      style={{ backgroundColor: selectedUser.status === 'blocked' ? '#4CAF50' : '#FF9800' }}
                    >
                      {selectedUser.status === 'blocked' ? <FiUnlock /> : <FiLock />}
                      {selectedUser.status === 'blocked' ? ' Unblock User' : ' Block User'}
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => {
                        deleteUser(selectedUser.id);
                        setShowModal(false);
                      }}
                    >
                      <FiTrash2 /> Delete User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Purchase History Modal */}
          {showPurchaseModal && selectedUser && mockPurchaseData[selectedUser.id] && (
            <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
              <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>🛍️ Purchase History - {selectedUser.name}</h2>
                  <button className="modal-close" onClick={() => setShowPurchaseModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <div className="purchase-summary">
                    <div className="summary-card">
                      <h3>Total Orders</h3>
                      <p className="summary-value">{mockPurchaseData[selectedUser.id].length}</p>
                    </div>
                    <div className="summary-card">
                      <h3>Total Spent</h3>
                      <p className="summary-value">Rs. {mockPurchaseData[selectedUser.id].reduce((sum, p) => sum + p.totalPrice, 0).toLocaleString()}</p>
                    </div>
                    <div className="summary-card">
                      <h3>Total Items</h3>
                      <p className="summary-value">{mockPurchaseData[selectedUser.id].reduce((sum, p) => sum + p.quantity, 0)}</p>
                    </div>
                  </div>

                  <div className="purchase-table-container" style={{ marginTop: '20px' }}>
                    <table className="purchase-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPurchaseData[selectedUser.id].map((purchase) => (
                          <tr key={purchase.id}>
                            <td><strong>{purchase.orderId}</strong></td>
                            <td>{purchase.productName}</td>
                            <td style={{ textAlign: 'center' }}>{purchase.quantity}</td>
                            <td>Rs. {purchase.unitPrice.toLocaleString()}</td>
                            <td><strong>Rs. {purchase.totalPrice.toLocaleString()}</strong></td>
                            <td>{purchase.date}</td>
                            <td>
                              <span 
                                className={`status-badge ${getStatusClass(purchase.status)}`}
                              >
                                {purchase.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Purchase History Message */}
          {showPurchaseModal && selectedUser && !mockPurchaseData[selectedUser.id] && (
            <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>🛍️ Purchase History - {selectedUser.name}</h2>
                  <button className="modal-close" onClick={() => setShowPurchaseModal(false)}><FiX /></button>
                </div>
                <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: '#999', fontSize: '16px' }}>This user has no purchase history yet.</p>
                </div>
              </div>
            </div>
          )}

          {/* Add New User Modal */}
          {showAddUserModal && (
            <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Add New User</h2>
                  <button className="modal-close" onClick={() => setShowAddUserModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={formErrors.name ? 'error' : ''}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: formErrors.name ? '2px solid #f44336' : '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.name && <small style={{ color: '#f44336', marginTop: '3px' }}>{formErrors.name}</small>}
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? 'error' : ''}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: formErrors.email ? '2px solid #f44336' : '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.email && <small style={{ color: '#f44336', marginTop: '3px' }}>{formErrors.email}</small>}
                    </div>

                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={formErrors.phone ? 'error' : ''}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: formErrors.phone ? '2px solid #f44336' : '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.phone && <small style={{ color: '#f44336', marginTop: '3px' }}>{formErrors.phone}</small>}
                    </div>

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-actions" style={{ marginTop: '20px' }}>
                    <button
                      className="action-btn"
                      onClick={handleAddUser}
                      style={{ backgroundColor: '#4CAF50' }}
                    >
                      <FiUserPlus /> Add User
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => setShowAddUserModal(false)}
                      style={{ backgroundColor: '#999' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                  <h2>🗑️ Delete User</h2>
                  <button className="modal-close" onClick={() => setShowDeleteModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', marginBottom: '20px' }}>
                    Are you sure you want to delete <strong>{users.find(u => u.id === deleteUserId)?.name}</strong>? 
                    <br /><br />
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', gap: '10px' }}>
                  <button
                    className="action-btn"
                    onClick={confirmDeleteUser}
                    style={{ backgroundColor: '#F44336' }}
                  >
                    Delete User
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setShowDeleteModal(false)}
                    style={{ backgroundColor: '#999' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Promote to Admin Confirmation Modal */}
          {showPromoteModal && promoteUserId && (
            <div className="modal-overlay" onClick={() => setShowPromoteModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                  <h2>⭐ Promote to Admin</h2>
                  <button className="modal-close" onClick={() => setShowPromoteModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', marginBottom: '20px' }}>
                    Promote <strong>{users.find(u => u.id === promoteUserId)?.name}</strong> to <strong>Admin</strong>?
                    <br /><br />
                    They will have full access to the admin panel.
                  </p>
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', gap: '10px' }}>
                  <button
                    className="action-btn"
                    onClick={confirmPromoteUser}
                    style={{ backgroundColor: '#FF9800' }}
                  >
                    Promote to Admin
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setShowPromoteModal(false)}
                    style={{ backgroundColor: '#999' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Block User Confirmation Modal */}
          {showBlockModal && blockUserId && (
            <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                  <h2>🚫 Block User</h2>
                  <button className="modal-close" onClick={() => setShowBlockModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6', marginBottom: '20px' }}>
                    {users.find(u => u.id === blockUserId)?.status === 'blocked' 
                      ? `Unblock ${users.find(u => u.id === blockUserId)?.name}? They will regain access to their account.`
                      : `Block ${users.find(u => u.id === blockUserId)?.name}? They will not be able to access their account.`
                    }
                  </p>
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', gap: '10px' }}>
                  <button
                    className="action-btn"
                    onClick={confirmBlockUser}
                    style={{ backgroundColor: users.find(u => u.id === blockUserId)?.status === 'blocked' ? '#4CAF50' : '#F44336' }}
                  >
                    {users.find(u => u.id === blockUserId)?.status === 'blocked' ? 'Unblock User' : 'Block User'}
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setShowBlockModal(false)}
                    style={{ backgroundColor: '#999' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
