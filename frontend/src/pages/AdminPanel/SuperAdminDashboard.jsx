import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUsers, FiBox, FiBarChart2, FiSettings, FiHome, FiMenu, FiX, FiSearch, FiShield, FiActivity, FiCreditCard, FiTrendingUp, FiFileText, FiLock, FiAlertCircle, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import './AdminPanel.css';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    systemHealth: '95%'
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        orderAPI.getAllOrders({ limit: 100 }),
        userAPI.getAll({ limit: 100 }),
        productAPI.getAll({ limit: 100 })
      ]);

      const orders = ordersRes.data.data || [];
      const users = usersRes.data.data || [];
      const products = productsRes.data.data || [];
      const admins = users.filter(u => u.role === 'admin' || u.role === 'super_admin');

      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalUsers: users.length,
        totalAdmins: admins.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        revenue: totalRevenue,
        systemHealth: '95%'
      });

      // Sales data (daily)
      setSalesData([
        { date: '2026-04-08', sales: 8500 },
        { date: '2026-04-09', sales: 12000 },
        { date: '2026-04-10', sales: 15000 },
        { date: '2026-04-11', sales: 18000 },
        { date: '2026-04-12', sales: 22000 },
        { date: '2026-04-13', sales: 25000 },
        { date: '2026-04-14', sales: 24500 }
      ]);

      // Payment methods
      setPaymentMethods([
        { method: 'eSewa', amount: 45000, percentage: 36 },
        { method: 'Khalti', amount: 38500, percentage: 31 },
        { method: 'Bank Transfer', amount: 28000, percentage: 22 },
        { method: 'Cash on Delivery', amount: 14000, percentage: 11 }
      ]);

      // Top products
      setTopProducts([
        { name: 'Embroidered Saree', sales: 156, revenue: 46800 },
        { name: 'Silk Dress', sales: 124, revenue: 37200 },
        { name: 'Casual Kurta', sales: 89, revenue: 13350 },
        { name: 'Cotton Dupatta', sales: 76, revenue: 7600 },
        { name: 'Formal Suit', sales: 45, revenue: 13500 }
      ]);

      // Top customers
      setTopCustomers([
        { name: 'Krishna Magar', orders: 8, spent: 24000 },
        { name: 'Priya Verma', orders: 6, spent: 18000 },
        { name: 'Ananya Gupta', orders: 7, spent: 21000 },
        { name: 'Rajesh Patel', orders: 5, spent: 15000 },
        { name: 'Nisha Singh', orders: 4, spent: 12000 }
      ]);

      // Simulate activities
      setActivities([
        { type: '👤', action: 'New user registered', time: '5 minutes ago' },
        { type: '📦', action: 'New product added', time: '1 hour ago' },
        { type: '📋', action: 'Order #12345 completed', time: '2 hours ago' },
        { type: '🔒', action: 'User promoted to admin', time: '3 hours ago' }
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

  // Check authorization - Super Admin only (exact match, not admin)
  if (user?.role !== 'super_admin') {
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
          <p>Super Admin access required. Your current role: {user?.role}</p>
          <a href={user?.role === 'admin' ? '/admin' : '/'} style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            background: '#c9a227',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            {user?.role === 'admin' ? 'Go to Admin Panel' : 'Go to Home'}
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
          <h2>👑 Super Admin</h2>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item active">
            <FiHome /> Dashboard
          </a>
          <div className="nav-section-title">Management</div>
          <a href="#users" className="nav-item" onClick={() => navigate('/super-admin/users')}>
            <FiUsers /> User Management
          </a>
          <a href="#admins" className="nav-item" onClick={() => navigate('/super-admin/admins')}>
            <FiShield /> Admin Management
          </a>
          <a href="#products" className="nav-item" onClick={() => navigate('/super-admin/products')}>
            <FiBox /> Product Management
          </a>
          <a href="#orders" className="nav-item" onClick={() => navigate('/super-admin/orders')}>
            <FiFileText /> Order Management
          </a>
          <div className="nav-section-title">Finance & Analytics</div>
          <a href="#payments" className="nav-item" onClick={() => navigate('/super-admin/payments')}>
            <FiCreditCard /> Payments & Revenue
          </a>
          <a href="#purchases" className="nav-item" onClick={() => navigate('/super-admin/purchases')}>
            📊 Purchase History
          </a>
          <a href="#reports" className="nav-item" onClick={() => navigate('/super-admin/reports')}>
            <FiBarChart2 /> Reports & Analytics
          </a>
          <a href="#audit" className="nav-item" onClick={() => navigate('/super-admin/audit')}>
            <FiActivity /> Audit Logs
          </a>
          <a href="#settings" className="nav-item" onClick={() => navigate('/super-admin/settings')}>
            <FiSettings /> System Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👑</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <small className="user-role">Super Admin</small>
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
            <h1>Super Admin Dashboard</h1>
            <p>Full system access and control</p>
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
            {/* Key Metrics */}
            <div className="stats-grid">
              <div className="stat-card" style={{ borderLeftColor: '#4CAF50' }}>
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#2196F3' }}>
                <div className="stat-icon">🛡️</div>
                <div className="stat-info">
                  <h3>{stats.totalAdmins}</h3>
                  <p>Admin Users</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#FF9800' }}>
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#9C27B0' }}>
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#F44336' }}>
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>Rs. {stats.revenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#00BCD4' }}>
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h3>{stats.systemHealth}</h3>
                  <p>System Health</p>
                </div>
              </div>
            </div>

            {/* Sales Graph */}
            <div className="admin-section">
              <h2>📊 Daily Sales (Last 7 Days)</h2>
              <div className="sales-chart">
                {salesData.map((data, idx) => {
                  const maxSales = Math.max(...salesData.map(d => d.sales));
                  const height = (data.sales / maxSales) * 200;
                  return (
                    <div key={idx} className="chart-bar">
                      <div className="bar" style={{ height: `${height}px` }} />
                      <label>{data.date.split('-')[2]}</label>
                      <span>Rs. {(data.sales / 1000).toFixed(0)}K</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Grid - 3 Column Layout */}
            <div className="dashboard-grid-3">
              {/* Payment Methods */}
              <div className="admin-section">
                <h2>💳 Payment Methods</h2>
                <div className="payment-methods">
                  {paymentMethods.map((method, idx) => (
                    <div key={idx} className="payment-item">
                      <div className="payment-info">
                        <h4>{method.method}</h4>
                        <p>Rs. {method.amount.toLocaleString()}</p>
                      </div>
                      <div className="payment-bar">
                        <div className="progress" style={{ width: `${method.percentage}%` }} />
                      </div>
                      <span className="percentage">{method.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="admin-section">
                <h2>🏆 Best-Selling Products</h2>
                <div className="product-list">
                  {topProducts.slice(0, 5).map((product, idx) => (
                    <div key={idx} className="product-item">
                      <span className="rank">#{idx + 1}</span>
                      <div className="product-details">
                        <h4>{product.name}</h4>
                        <small>{product.sales} sold</small>
                      </div>
                      <p className="revenue">Rs. {product.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Customers */}
              <div className="admin-section">
                <h2>👥 Top Customers</h2>
                <div className="customer-list">
                  {topCustomers.slice(0, 5).map((customer, idx) => (
                    <div key={idx} className="customer-item">
                      <div className="customer-avatar">{customer.name[0]}</div>
                      <div className="customer-details">
                        <h4>{customer.name}</h4>
                        <small>{customer.orders} orders</small>
                      </div>
                      <p className="spent">Rs. {customer.spent.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Activities */}
            <div className="admin-section">
              <h2>⚡ Recent System Activities</h2>
              <div className="activities-list">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">{activity.type}</div>
                    <div className="activity-content">
                      <p>{activity.action}</p>
                      <small>{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Menu */}
            <div className="admin-section">
              <h2>🚀 Quick Access</h2>
              <div className="quick-access-grid">
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/users')} title="User Management">
                  <FiUsers size={24} />
                  <span>Manage<br/>Users</span>
                </button>
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/admins')} title="Admin Management">
                  <FiShield size={24} />
                  <span>Manage<br/>Admins</span>
                </button>
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/products')} title="Product Management">
                  <FiBox size={24} />
                  <span>Manage<br/>Products</span>
                </button>
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/orders')} title="Order Management">
                  <FiFileText size={24} />
                  <span>Manage<br/>Orders</span>
                </button>
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/payments')} title="Payments">
                  <FiCreditCard size={24} />
                  <span>Payments &<br/>Revenue</span>
                </button>
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/purchases')} title="Purchase History">
                  <span style={{ fontSize: '24px' }}>📊</span>
                  <span>Purchase<br/>History</span>
                </button>
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/reports')} title="Reports">
                  <FiBarChart2 size={24} />
                  <span>Reports &<br/>Analytics</span>
                </button>
                <button className="quick-access-btn" onClick={() => navigate('/super-admin/settings')} title="System Settings">
                  <FiSettings size={24} />
                  <span>System<br/>Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
