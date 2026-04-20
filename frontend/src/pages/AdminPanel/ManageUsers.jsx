import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function ManageUsers() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll({ limit: 100 });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Error deleting user: ' + error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || ''
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await userAPI.updateProfile(editingId, formData);
        setUsers(users.map(u => u.id === editingId ? response.data.data : u));
        toast.success('User updated successfully');
      } else {
        toast.info('User creation from admin panel requires additional backend endpoint');
      }
      setShowAddForm(false);
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  if (!hasRole('admin')) {
    return <div className="admin-unauthorized">Not authorized</div>;
  }

  return (
    <div className="admin-layout">
      <div className="admin-main" style={{ marginLeft: '0' }}>
        <div className="admin-header" style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
          <button className="back-btn" onClick={() => navigate('/admin')}>
            <FiArrowLeft /> Back
          </button>
          <h1>Manage Users</h1>
        </div>

        <div className="admin-content" style={{ padding: '20px' }}>
          {/* Search and Add Button */}
          <div className="users-header">
            <div className="search-bar">
              <FiSearch />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-btn" onClick={() => setShowAddForm(true)}>
              <FiPlus /> Add User
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="form-modal" style={{ display: 'block' }}>
              <div className="form-content">
                <h2>{editingId ? 'Edit User' : 'Add User'}</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!!editingId}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <div className="form-buttons">
                    <button type="submit" className="btn-save">Save</button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users Table */}
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(user)}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user.id)}
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
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
