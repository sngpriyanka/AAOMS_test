import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiTrash2, FiKey, FiToggleRight, FiX, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function ManageAdmins() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [adminToReset, setAdminToReset] = useState(null);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [adminToToggle, setAdminToToggle] = useState(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    permissions: []
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [admins, searchTerm]);

  const fetchAdmins = async () => {
    try {
      const mockAdmins = [
        { id: 1, name: 'Rajesh Patel', email: 'rajesh@example.com', phone: '+91-98765-43212', status: 'active', createdAt: '2025-12-01', lastActive: '2026-04-14 10:30', permissions: ['users', 'products', 'orders', 'analytics'] },
        { id: 2, name: 'Hari Bahadur', email: 'hari@example.com', phone: '+977-98765-43214', status: 'active', createdAt: '2026-01-01', lastActive: '2026-04-14 09:15', permissions: ['users', 'products', 'orders'] },
        { id: 3, name: 'Pooja Desai', email: 'pooja@example.com', phone: '+91-98765-43216', status: 'inactive', createdAt: '2026-02-10', lastActive: '2026-04-08 15:45', permissions: ['products', 'orders'] },
      ];
      setAdmins(mockAdmins);
      setFilteredAdmins(mockAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = admins;
    if (searchTerm) {
      filtered = filtered.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAdmins(filtered);
  };

  const toggleAdminStatus = (adminId) => {
    const adminData = admins.find(a => a.id === adminId);
    setAdminToToggle(adminData);
    setShowToggleConfirm(true);
  };

  const confirmToggleStatus = () => {
    if (adminToToggle) {
      setAdmins(admins.map(admin => 
        admin.id === adminToToggle.id ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' } : admin
      ));
      if (selectedAdmin?.id === adminToToggle.id) {
        setSelectedAdmin({ ...selectedAdmin, status: selectedAdmin.status === 'active' ? 'inactive' : 'active' });
      }
      const newStatus = adminToToggle.status === 'active' ? 'inactive' : 'active';
      toast.success(`Admin ${adminToToggle.name} is now ${newStatus}`);
      setShowToggleConfirm(false);
      setAdminToToggle(null);
    }
  };

  const resetPassword = (adminId) => {
    const adminData = admins.find(a => a.id === adminId);
    setAdminToReset(adminData);
    setShowResetConfirm(true);
  };

  const confirmResetPassword = () => {
    if (adminToReset) {
      toast.success(`Password reset email sent to ${adminToReset.name}`);
      setShowResetConfirm(false);
      setAdminToReset(null);
    }
  };

  const deleteAdmin = (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== adminId));
      setSelectedAdmin(null);
      setShowModal(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    } else if (admins.some(admin => admin.email === formData.email)) {
      errors.email = 'This email already exists';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    }
    
    if (formData.permissions.length === 0) {
      errors.permissions = 'Select at least one permission';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormInputChange = (e) => {
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

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
    if (formErrors.permissions) {
      setFormErrors(prev => ({
        ...prev,
        permissions: ''
      }));
    }
  };

  const handleAddAdmin = () => {
    if (validateForm()) {
      const newAdmin = {
        id: Math.max(...admins.map(a => a.id), 0) + 1,
        ...formData,
        status: 'active',
        createdAt: new Date().toLocaleDateString('en-CA'),
        lastActive: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2')
      };
      
      setAdmins([...admins, newAdmin]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        permissions: []
      });
      setFormErrors({});
      setShowAddAdminModal(false);
      toast.success(`Admin ${newAdmin.name} has been created successfully!`);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>🛡️ Admin Management</h1>
        <p>Manage admin accounts and permissions</p>
      </div>

      {loading ? (
        <div className="loading">Loading admins...</div>
      ) : (
        <div className="admin-management-container">
          <div className="filters-section">
            <div className="search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="action-btn" style={{ backgroundColor: '#4CAF50' }} onClick={() => setShowAddAdminModal(true)}>
              <FiPlus /> Add Admin
            </button>
          </div>

          <div className="admins-grid">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <div key={admin.id} className="admin-card">
                  <div className="admin-card-header">
                    <div className="admin-info">
                      <h3>{admin.name}</h3>
                      <p>{admin.email}</p>
                    </div>
                    <span className={`badge ${admin.status === 'active' ? 'success' : 'warning'}`}>
                      {admin.status}
                    </span>
                  </div>

                  <div className="admin-card-body">
                    <div className="info-row">
                      <span>Phone:</span>
                      <strong>{admin.phone}</strong>
                    </div>
                    <div className="info-row">
                      <span>Created:</span>
                      <strong>{admin.createdAt}</strong>
                    </div>
                    <div className="info-row">
                      <span>Last Active:</span>
                      <strong>{admin.lastActive}</strong>
                    </div>
                    <div className="info-row">
                      <span>Permissions:</span>
                      <div className="permission-tags">
                        {admin.permissions.map((perm, idx) => (
                          <span key={idx} className="tag">{perm}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="admin-card-actions">
                    <button 
                      className="icon-btn view"
                      onClick={() => { setSelectedAdmin(admin); setShowModal(true); }}
                    >
                      View
                    </button>
                    <button 
                      className="icon-btn reset-password"
                      onClick={() => resetPassword(admin.id)}
                      title="Reset Password"
                    >
                      <FiKey />
                    </button>
                    <button 
                      className="icon-btn deactivate"
                      onClick={() => toggleAdminStatus(admin.id)}
                      title={admin.status === 'active' ? 'Deactivate Admin' : 'Activate Admin'}
                    >
                      <FiToggleRight />
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => deleteAdmin(admin.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>
                No admins found
              </div>
            )}
          </div>

          {showModal && selectedAdmin && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Admin Details - {selectedAdmin.name}</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <div className="user-detail-grid">
                    <div className="detail-item">
                      <label>Name</label>
                      <p>{selectedAdmin.name}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedAdmin.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{selectedAdmin.phone}</p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p>
                        <span className={`badge ${selectedAdmin.status === 'active' ? 'success' : 'warning'}`}>
                          {selectedAdmin.status}
                        </span>
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Created</label>
                      <p>{selectedAdmin.createdAt}</p>
                    </div>
                    <div className="detail-item">
                      <label>Last Active</label>
                      <p>{selectedAdmin.lastActive}</p>
                    </div>
                    <div className="detail-item" style={{ gridColumn: '1/-1' }}>
                      <label>Permissions</label>
                      <div className="permission-tags">
                        {selectedAdmin.permissions.map((perm, idx) => (
                          <span key={idx} className="tag">{perm}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="action-btn reset-password" onClick={() => resetPassword(selectedAdmin.id)}>
                      <FiKey /> Reset Password
                    </button>
                    <button className="action-btn deactivate" onClick={() => toggleAdminStatus(selectedAdmin.id)}>
                      {selectedAdmin.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="action-btn delete" onClick={() => deleteAdmin(selectedAdmin.id)}>
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showResetConfirm && adminToReset && (
        <div className="modal-overlay" onClick={() => { setShowResetConfirm(false); setAdminToReset(null); }}>
          <div className="modal-dialog confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Confirm Password Reset</h2>
              <button className="modal-close" onClick={() => { setShowResetConfirm(false); setAdminToReset(null); }}><FiX /></button>
            </div>
            <div className="modal-body">
              <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '16px' }}>
                Are you sure you want to reset the password for <strong>{adminToReset.name}</strong>?
              </p>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                A password reset email will be sent to <strong>{adminToReset.email}</strong>
              </p>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'center', gap: '10px' }}>
              <button 
                className="action-btn delete" 
                onClick={confirmResetPassword}
                style={{ backgroundColor: '#FF6B6B' }}
              >
                Yes, Reset Password
              </button>
              <button 
                className="action-btn" 
                onClick={() => { setShowResetConfirm(false); setAdminToReset(null); }}
                style={{ backgroundColor: '#95A5A6' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showToggleConfirm && adminToToggle && (
        <div className="modal-overlay" onClick={() => { setShowToggleConfirm(false); setAdminToToggle(null); }}>
          <div className="modal-dialog confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Confirm Status Change</h2>
              <button className="modal-close" onClick={() => { setShowToggleConfirm(false); setAdminToToggle(null); }}><FiX /></button>
            </div>
            <div className="modal-body">
              <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '16px' }}>
                Are you sure you want to <strong>{adminToToggle.status === 'active' ? 'deactivate' : 'activate'}</strong> <strong>{adminToToggle.name}</strong>?
              </p>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                {adminToToggle.status === 'active' 
                  ? 'This admin will no longer be able to access the admin panel.' 
                  : 'This admin will be able to access the admin panel again.'}
              </p>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'center', gap: '10px' }}>
              <button 
                className="action-btn delete" 
                onClick={confirmToggleStatus}
                style={{ backgroundColor: '#FF9800' }}
              >
                Yes, {adminToToggle.status === 'active' ? 'Deactivate' : 'Activate'} Admin
              </button>
              <button 
                className="action-btn" 
                onClick={() => { setShowToggleConfirm(false); setAdminToToggle(null); }}
                style={{ backgroundColor: '#95A5A6' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddAdminModal && (
        <div className="modal-overlay" onClick={() => { setShowAddAdminModal(false); setFormData({ name: '', email: '', phone: '', permissions: [] }); setFormErrors({}); }}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Admin</h2>
              <button className="modal-close" onClick={() => { setShowAddAdminModal(false); setFormData({ name: '', email: '', phone: '', permissions: [] }); setFormErrors({}); }}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Admin Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormInputChange}
                  placeholder="Enter admin name"
                  className={formErrors.name ? 'input-error' : ''}
                />
                {formErrors.name && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '5px' }}>{formErrors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormInputChange}
                  placeholder="Enter email address"
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '5px' }}>{formErrors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormInputChange}
                  placeholder="Enter phone number"
                  className={formErrors.phone ? 'input-error' : ''}
                />
                {formErrors.phone && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '5px' }}>{formErrors.phone}</p>}
              </div>

              <div className="form-group">
                <label>Permissions *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['users', 'products', 'orders', 'analytics'].map(permission => (
                    <label key={permission} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        style={{ marginRight: '8px', cursor: 'pointer' }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{permission}</span>
                    </label>
                  ))}
                </div>
                {formErrors.permissions && <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '5px' }}>{formErrors.permissions}</p>}
              </div>
            </div>
            <div className="modal-actions">
              <button className="action-btn" style={{ backgroundColor: '#4CAF50' }} onClick={handleAddAdmin}>
                Create Admin
              </button>
              <button 
                className="action-btn" 
                onClick={() => { setShowAddAdminModal(false); setFormData({ name: '', email: '', phone: '', permissions: [] }); setFormErrors({}); }}
                style={{ backgroundColor: '#95A5A6' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAdmins;
