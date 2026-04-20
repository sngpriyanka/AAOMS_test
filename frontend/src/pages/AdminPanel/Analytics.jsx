import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrendingUp, FiUsers, FiBox, FiShoppingCart, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function Analytics() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    avgOrderValue: 0,
    topProducts: [],
    topCategories: [],
    monthlyRevenue: [],
    ordersByStatus: {}
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        orderAPI.getAllOrders({ limit: 1000 }),
        userAPI.getAll({ limit: 1000 }),
        productAPI.getAll({ limit: 1000 })
      ]);

      const orders = ordersRes.data.data || [];
      const users = usersRes.data.data || [];
      const products = productsRes.data.data || [];

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      // Calculate average order value
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      // Get top products
      const productCounts = {};
      const productRevenue = {};
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
            productRevenue[item.name] = (productRevenue[item.name] || 0) + (item.price * item.quantity);
          });
        }
      });

      const topProducts = Object.keys(productCounts)
        .map(name => ({
          name,
          quantity: productCounts[name],
          revenue: productRevenue[name]
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Get orders by status
      const ordersByStatus = {};
      orders.forEach(order => {
        const status = order.status || 'pending';
        ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      });

      // Get top categories
      const categoryRevenue = {};
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const cat = item.category || 'Uncategorized';
            categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.price * item.quantity);
          });
        }
      });

      const topCategories = Object.keys(categoryRevenue)
        .map(category => ({
          name: category,
          revenue: categoryRevenue[category]
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate monthly revenue
      const monthlyRevenue = {};
      orders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (order.total || 0);
      });

      const monthlyRevenueArray = Object.keys(monthlyRevenue)
        .sort()
        .slice(-12)
        .map(month => ({
          month,
          revenue: monthlyRevenue[month]
        }));

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        revenue: totalRevenue,
        avgOrderValue,
        topProducts,
        topCategories,
        monthlyRevenue: monthlyRevenueArray,
        ordersByStatus
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (!hasRole('admin')) {
    return <div className="admin-unauthorized">Not authorized</div>;
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <button className="btn-back" onClick={() => navigate('/admin')}>
          <FiArrowLeft /> Back to Dashboard
        </button>
        <h1>📊 Analytics & Reports</h1>
      </div>

      {/* Date Range Filter */}
      <div className="analytics-filters">
        <div className="filter-group">
          <label><FiCalendar /> Start Date</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
          />
        </div>
        <div className="filter-group">
          <label><FiCalendar /> End Date</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="card-icon users">
                <FiUsers />
              </div>
              <div className="card-content">
                <h3>Total Users</h3>
                <p className="card-value">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon products">
                <FiBox />
              </div>
              <div className="card-content">
                <h3>Total Products</h3>
                <p className="card-value">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon orders">
                <FiShoppingCart />
              </div>
              <div className="card-content">
                <h3>Total Orders</h3>
                <p className="card-value">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon revenue">
                <FiTrendingUp />
              </div>
              <div className="card-content">
                <h3>Total Revenue</h3>
                <p className="card-value">Rs. {(stats.revenue || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="card-icon average">
                <FiBarChart2 />
              </div>
              <div className="card-content">
                <h3>Avg Order Value</h3>
                <p className="card-value">Rs. {(stats.avgOrderValue || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Orders by Status */}
          <div className="analytics-section">
            <h2>Orders by Status</h2>
            <div className="status-grid">
              {Object.keys(stats.ordersByStatus || {}).map(status => (
                <div key={status} className="status-card">
                  <div className="status-name">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
                  <div className="status-count">{stats.ordersByStatus[status]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="analytics-section">
            <h2>Top 5 Products by Revenue</h2>
            <div className="product-list">
              {stats.topProducts && stats.topProducts.length > 0 ? (
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>Rs. {(product.revenue || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-message">No product data available</p>
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="analytics-section">
            <h2>Top 5 Categories by Revenue</h2>
            <div className="category-list">
              {stats.topCategories && stats.topCategories.length > 0 ? (
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Revenue</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topCategories.map((category, index) => (
                      <tr key={index}>
                        <td>{category.name}</td>
                        <td>Rs. {(category.revenue || 0).toFixed(2)}</td>
                        <td>{stats.revenue > 0 ? ((category.revenue / stats.revenue) * 100).toFixed(1) : 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-message">No category data available</p>
              )}
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="analytics-section">
            <h2>Monthly Revenue Trend</h2>
            <div className="revenue-list">
              {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.monthlyRevenue.map((item, index) => (
                      <tr key={index}>
                        <td>{item.month}</td>
                        <td>Rs. {(item.revenue || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-message">No revenue data available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
