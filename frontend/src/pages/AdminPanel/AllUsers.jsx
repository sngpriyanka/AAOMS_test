import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiSearch, FiArrowLeft, FiShield, FiX, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function AllUsers() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // view, promote, demote, delete

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, roleFilter]);

  const fetchAllUsers = async () => {
    try {
      const response = await userAPI.getAll({ limit: 1000 });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      await userAPI.promoteToAdmin(userId);
      toast.success('User promoted to admin successfully');
      fetchAllUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Error promoting user: ' + error.message);
    }
  };

  const handleDemoteUser = async (userId) => {
    try {
      await userAPI.demoteAdmin(userId);
      toast.success('User demoted successfully');
      fetchAllUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Error demoting user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchAllUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Error deleting user: ' + error.message);
    }
  };

  const openModal = (type, user) => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType('view');
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'super_admin': return '#ff6b6b';
      case 'admin': return '#4c6ef5';
      case 'user': return '#51cf66';
      default: return '#666';
    }
  };

  if (!hasRole('super_admin')) {
    return <div className="admin-unauthorized">Not authorized</div>;
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <button className="btn-back" onClick={() => navigate('/super-admin')}>
          <FiArrowLeft /> Back to Dashboard
        </button>
        <h1>👥 All Users</h1>
        <div className="header-counter">Total: {users.length} users</div>
      </div>

      {/* Filters */}
      <div className="admin-toolbar">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-bar">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">Regular Users</option>
          </select>
        </div>

        <div className="result-counter">
          {filteredUsers.length} results
        </div>
      </div>

      {/* Users Grid/List */}
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} onClick={() => openModal('view', user)} style={{ cursor: 'pointer' }}>
                  <td className="table-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <span className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                      {user.role === 'super_admin' ? '👑' : user.role === 'admin' ? '🔐' : '👤'}
                      {' '}
                      {typeof user.role === 'string' ? user.role.replace('_', ' ').toUpperCase() : 'USER'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="table-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="action-btn edit"
                      onClick={() => openModal('view', user)}
                      title="View"
                    >
                      👁️
                    </button>
                    {user.role === 'user' && (
                      <button
                        className="action-btn promote"
                        onClick={() => openModal('promote', user)}
                        title="Promote to Admin"
                      >
                        <FiShield />
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button
                        className="action-btn demote"
                        onClick={() => openModal('demote', user)}
                        title="Demote"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={() => openModal('delete', user)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="admin-form-container">
          <div className="admin-form-overlay" onClick={closeModal}></div>
          <div className="admin-form modal-dialog">
            <div className="form-header">
              <h2>
                {modalType === 'view' && `User Details - ${selectedUser.name}`}
                {modalType === 'promote' && `Promote ${selectedUser.name} to Admin?`}
                {modalType === 'demote' && `Demote ${selectedUser.name}?`}
                {modalType === 'delete' && `Delete ${selectedUser.name}?`}
              </h2>
              <button className="form-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            {modalType === 'view' && (
              <div className="modal-body">
                <div className="user-detail">
                  <label>Name:</label>
                  <p>{selectedUser.name}</p>
                </div>
                <div className="user-detail">
                  <label>Email:</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="user-detail">
                  <label>Phone:</label>
                  <p>{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div className="user-detail">
                  <label>Address:</label>
                  <p>{selectedUser.address || 'Not provided'}</p>
                </div>
                <div className="user-detail">
                  <label>Role:</label>
                  <p>
                    <span className="role-badge" style={{ backgroundColor: getRoleColor(selectedUser.role) }}>
                      {typeof selectedUser.role === 'string' ? selectedUser.role.replace('_', ' ').toUpperCase() : 'USER'}
                    </span>
                  </p>
                </div>
                <div className="user-detail">
                  <label>Status:</label>
                  <p>
                    <span className={`status-badge ${selectedUser.isActive ? 'active' : 'inactive'}`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="user-detail">
                  <label>Joined:</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </div>
            )}

            {modalType === 'promote' && (
              <div className="modal-body">
                <div className="modal-warning">
                  <FiAlertCircle /> This user will be promoted to Admin role with management privileges.
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button 
                    className="btn-primary" 
                    onClick={() => handlePromoteUser(selectedUser.id)}
                  >
                    Promote to Admin
                  </button>
                </div>
              </div>
            )}

            {modalType === 'demote' && (
              <div className="modal-body">
                <div className="modal-warning">
                  <FiAlertCircle /> This user will be demoted to regular user role.
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button 
                    className="btn-primary" 
                    onClick={() => handleDemoteUser(selectedUser.id)}
                  >
                    Demote User
                  </button>
                </div>
              </div>
            )}

            {modalType === 'delete' && (
              <div className="modal-body">
                <div className="modal-warning modal-danger">
                  <FiAlertCircle /> This action cannot be undone. The user account and all associated data will be permanently deleted.
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUsers;
