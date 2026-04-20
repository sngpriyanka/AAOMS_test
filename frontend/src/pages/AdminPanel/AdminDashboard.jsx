import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUsers, FiBox, FiBarChart2, FiSettings, FiHome, FiMenu, FiX, FiSearch, FiShoppingCart, FiMessageSquare, FiBell, FiTrendingUp, FiCreditCard, FiFileText, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import './AdminPanel.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    dailySales: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        orderAPI.getAllOrders({ limit: 100 }),
        userAPI.getAll({ limit: 100 }),
        productAPI.getAll({ limit: 100 })
      ]);

      const orders = ordersRes.data.data || [];
      const users = usersRes.data.data || [];
      const products = productsRes.data.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const today = new Date().toISOString().split('T')[0];
      const todaysSales = orders
        .filter(o => o.createdAt && o.createdAt.split('T')[0] === today)
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        dailySales: todaysSales,
        revenue: totalRevenue
      });

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
      
      // Mock pending reviews
      setPendingReviews([
        { id: 1, product: 'Embroidered Saree', reviewer: 'Krishna Magar', rating: 4, status: 'pending' },
        { id: 2, product: 'Silk Dress', reviewer: 'Priya Verma', rating: 5, status: 'pending' }
      ]);
      
      // Mock recent notifications
      setRecentNotifications([
        { id: 1, type: 'order', message: 'New order #ORD-001 received', timestamp: new Date() },
        { id: 2, type: 'review', message: 'New product review pending approval', timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check authorization - Admin only (not super_admin)
  if (user?.role !== 'admin') {
    return (
      <div className="admin-unauthorized" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{
          background: '#fff',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#d32f2f' }}>Access Denied</h2>
          <p>You are {user?.role === 'super_admin' ? 'a Super Admin' : 'not an Admin'}. Please use the appropriate panel.</p>
          <a href={user?.role === 'super_admin' ? '/super-admin' : '/'} style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            background: '#c9a227',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            {user?.role === 'super_admin' ? 'Go to Super Admin Panel' : 'Go to Home'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>🔐 Admin Panel</h2>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item active">
            <FiHome /> Dashboard
          </a>
          <div className="nav-section-title">Management</div>
          <a href="#products" className="nav-item" onClick={() => navigate('/admin/products')}>
            <FiBox /> Product Management
          </a>
          <a href="#orders" className="nav-item" onClick={() => navigate('/admin/orders')}>
            <FiShoppingCart /> Order Management
          </a>
          <a href="#customers" className="nav-item" onClick={() => navigate('/admin/customers')}>
            <FiUsers /> Customer Management
          </a>
          <div className="nav-section-title">Finance & Analytics</div>
          <a href="#payments" className="nav-item" onClick={() => navigate('/admin/payments')}>
            <FiCreditCard /> Payments & Revenue
          </a>
          <a href="#purchases" className="nav-item" onClick={() => navigate('/admin/purchases')}>
            📊 Purchase History
          </a>
          <a href="#reports" className="nav-item" onClick={() => navigate('/admin/reports')}>
            <FiBarChart2 /> Reports & Analytics
          </a>
          <a href="#audit" className="nav-item" onClick={() => navigate('/admin/audit')}>
            <FiActivity /> Audit Logs
          </a>
          <div className="nav-section-title">Operations</div>
          <a href="#reviews" className="nav-item" onClick={() => navigate('/admin/reviews')}>
            <FiMessageSquare /> Reviews & Feedback
          </a>
          <a href="#notifications" className="nav-item" onClick={() => navigate('/admin/notifications')}>
            <FiBell /> Notifications
          </a>
          <a href="#settings" className="nav-item" onClick={() => navigate('/admin/settings')}>
            <FiSettings /> Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <small className="user-role">Admin</small>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </button>
          <div className="admin-title">
            <h1>📊 Dashboard</h1>
            <p>Welcome back, {user?.name}! Manage your store efficiently.</p>
          </div>
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <div className="admin-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#2196F3' }}>📋</div>
                <div className="stat-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#FF9800' }}>📦</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>📈</div>
                <div className="stat-info">
                  <h3>Rs. {stats.dailySales.toLocaleString()}</h3>
                  <p>Today's Sales</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#9C27B0' }}>👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Customers</p>
                </div>
              </div>
            </div>

            {/* Main Sections Grid */}
            <div className="dashboard-grid">
              {/* Recent Orders */}
              <div className="admin-section">
                <div className="section-header">
                  <h2><FiShoppingCart /> Recent Orders</h2>
                  <button className="view-all-btn" onClick={() => navigate('/admin/orders')}>View All</button>
                </div>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="order-id">
                              {typeof order.id === 'string' ? order.id.substring(0, 8) : String(order.id).substring(0, 8)}...
                            </td>
                            <td>
                              {typeof order.userId === 'string' ? order.userId.substring(0, 8) : String(order.userId).substring(0, 8)}...
                            </td>
                            <td>Rs. {(order.total || 0).toFixed(2)}</td>
                            <td>
                              <span className={`status-badge status-${order.status}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No orders yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Reviews */}
              <div className="admin-section">
                <div className="section-header">
                  <h2><FiMessageSquare /> Pending Reviews</h2>
                  <button className="view-all-btn" onClick={() => navigate('/admin/reviews')}>View All</button>
                </div>
                <div className="reviews-list">
                  {pendingReviews.length > 0 ? (
                    pendingReviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <h4>{review.product}</h4>
                          <span className="rating">⭐ {review.rating}</span>
                        </div>
                        <p className="reviewer">By {review.reviewer}</p>
                        <div className="review-actions">
                          <button className="action-btn" style={{ backgroundColor: '#4CAF50' }}>Approve</button>
                          <button className="action-btn" style={{ backgroundColor: '#F44336' }}>Reject</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>No pending reviews</p>
                  )}
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="admin-section">
                <div className="section-header">
                  <h2><FiBell /> Recent Notifications</h2>
                  <button className="view-all-btn" onClick={() => navigate('/admin/notifications')}>View All</button>
                </div>
                <div className="notifications-list">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notif) => (
                      <div key={notif.id} className="notification-item">
                        <span className="notif-type">{notif.type === 'order' ? '📦' : '⭐'}</span>
                        <p>{notif.message}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>No recent notifications</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-section">
              <h2>⚡ Quick Actions</h2>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => navigate('/admin/products')}>
                  ➕ Add/Edit Products
                </button>
                <button className="action-btn" onClick={() => navigate('/admin/orders')}>
                  📦 View Orders
                </button>
                <button className="action-btn" onClick={() => navigate('/admin/users')}>
                  👥 Manage Customers
                </button>
                <button className="action-btn" onClick={() => navigate('/admin/reviews')}>
                  ⭐ Approve Reviews
                </button>
                <button className="action-btn" onClick={() => navigate('/admin/notifications')}>
                  📢 Send Announcements
                </button>
                <button className="action-btn" onClick={() => navigate('/admin/analytics')}>
                  📊 View Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
