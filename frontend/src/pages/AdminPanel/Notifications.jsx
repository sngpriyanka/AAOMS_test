import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBell, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const mockNotifications = [
        { id: 1, type: 'system', title: 'System Maintenance', message: 'Database maintenance scheduled for tonight 2 AM', timestamp: '2026-04-14 14:30:00', read: false },
        { id: 2, type: 'alert', title: 'Low Stock Alert', message: 'Product XYZ stock is below minimum threshold', timestamp: '2026-04-14 13:15:00', read: false },
        { id: 3, type: 'warning', title: 'Failed Payment', message: 'Order #123 payment failed. Customer intervention needed.', timestamp: '2026-04-14 12:00:00', read: true },
        { id: 4, type: 'info', title: 'New User Registration', message: '5 new users registered today', timestamp: '2026-04-14 11:30:00', read: true },
        { id: 5, type: 'success', title: 'Backup Complete', message: 'Daily backup completed successfully', timestamp: '2026-04-14 10:00:00', read: true },
        { id: 6, type: 'alert', title: 'High Traffic Detected', message: 'Server load at 85%. Monitor performance.', timestamp: '2026-04-14 09:45:00', read: false },
        { id: 7, type: 'system', title: 'API Integration Update', message: 'Payment gateway API updated to v2.0', timestamp: '2026-04-13 16:20:00', read: true },
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getFilteredNotifications = () => {
    if (filterType === 'all') return notifications;
    if (filterType === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filterType);
  };

  const getNotificationColor = (type) => {
    const colors = {
      system: '#2196F3',
      alert: '#FF9800',
      warning: '#F44336',
      info: '#2196F3',
      success: '#4CAF50'
    };
    return colors[type] || '#666';
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>Notifications</h1>
        <p>System alerts and notifications</p>
      </div>

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : (
        <div className="admin-section">
          {/* Controls */}
          <div className="notification-controls">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All ({notifications.length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'unread' ? 'active' : ''}`}
                onClick={() => setFilterType('unread')}
              >
                Unread ({notifications.filter(n => !n.read).length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'alert' ? 'active' : ''}`}
                onClick={() => setFilterType('alert')}
              >
                Alerts
              </button>
              <button 
                className={`filter-btn ${filterType === 'system' ? 'active' : ''}`}
                onClick={() => setFilterType('system')}
              >
                System
              </button>
            </div>
            {notifications.some(n => !n.read) && (
              <button className="action-btn" onClick={markAllAsRead}>
                <FiCheck /> Mark All as Read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`} style={{ borderLeftColor: getNotificationColor(notif.type) }}>
                  <div className="notification-header">
                    <h3>{notif.title}</h3>
                    <span className={`notification-badge ${notif.type}`}>{notif.type}</span>
                  </div>
                  <p className="notification-message">{notif.message}</p>
                  <div className="notification-footer">
                    <small>{notif.timestamp}</small>
                    <div className="notification-actions">
                      {!notif.read && (
                        <button className="icon-btn" onClick={() => markAsRead(notif.id)} title="Mark as read">
                          <FiCheck />
                        </button>
                      )}
                      <button className="icon-btn delete" onClick={() => deleteNotification(notif.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <FiBell size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
