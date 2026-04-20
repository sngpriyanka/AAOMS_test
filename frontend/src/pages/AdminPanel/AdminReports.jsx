import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiFilter, FiBarChart2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function AdminReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange]);

  const generateReport = () => {
    setLoading(true);

    // Simulated report data
    const reports = {
      sales: {
        title: 'Sales Report',
        totalSales: 125000,
        totalOrders: 45,
        averageOrderValue: 2777,
        topProducts: [
          { name: 'Embroidered Saree', quantity: 15, revenue: 45000 },
          { name: 'Silk Dress', quantity: 12, revenue: 36000 },
          { name: 'Casual Kurta', quantity: 18, revenue: 27000 },
        ],
        salesByDay: [
          { date: '2026-04-08', sales: 8500 },
          { date: '2026-04-09', sales: 12000 },
          { date: '2026-04-10', sales: 15000 },
          { date: '2026-04-11', sales: 18000 },
          { date: '2026-04-12', sales: 22000 },
          { date: '2026-04-13', sales: 25000 },
          { date: '2026-04-14', sales: 24500 },
        ]
      },
      inventory: {
        title: 'Inventory Report',
        totalProducts: 156,
        lowStockItems: 8,
        outOfStock: 2,
        totalValue: 850000,
        byCategory: [
          { category: 'Sarees', quantity: 45, value: 255000 },
          { category: 'Dresses', quantity: 38, value: 228000 },
          { category: 'Kurtis', quantity: 42, value: 210000 },
          { category: 'Accessories', quantity: 31, value: 157000 },
        ],
        lowStockProducts: [
          { name: 'Embroidered Saree - Blue', current: 3, minimum: 10 },
          { name: 'Silk Dress - Red', current: 2, minimum: 10 },
          { name: 'Casual Kurta - White', current: 1, minimum: 15 },
        ]
      },
      customers: {
        title: 'Customer Report',
        totalCustomers: 287,
        newCustomers: 12,
        repeatCustomers: 45,
        retention: '65%',
        topCustomers: [
          { name: 'Krishna Magar', orders: 8, spent: 24000 },
          { name: 'Priya Verma', orders: 6, spent: 18000 },
          { name: 'Ananya Gupta', orders: 7, spent: 21000 },
        ],
        engagement: [
          { metric: 'Email Subscribers', value: '189' },
          { metric: 'Newsletter Opens', value: '42%' },
          { metric: 'Repeat Purchase Rate', value: '35%' },
        ]
      },
      revenue: {
        title: 'Revenue Report',
        totalRevenue: 125000,
        thisMonth: 125000,
        lastMonth: 98000,
        growth: '27.6%',
        revenueByPayment: [
          { method: 'Credit Card', amount: 67500, percentage: '54%' },
          { method: 'Debit Card', amount: 45000, percentage: '36%' },
          { method: 'COD', amount: 12500, percentage: '10%' },
        ],
        monthlyTrend: [
          { month: 'January', revenue: 65000 },
          { month: 'February', revenue: 78000 },
          { month: 'March', revenue: 92000 },
          { month: 'April', revenue: 125000 },
        ]
      },
    };

    setTimeout(() => {
      setReportData(reports[reportType] || {});
      setLoading(false);
    }, 500);
  };

  const downloadReport = () => {
    if (!reportData.title) {
      toast.warning('No report data to export');
      return;
    }

    let textContent = `=====================================\n`;
    textContent += `${reportData.title}\n`;
    textContent += `Generated: ${new Date().toLocaleString()}\n`;
    textContent += `Date Range: ${dateRange}\n`;
    textContent += `=====================================\n\n`;

    // Add Statistics Section
    textContent += `SUMMARY STATISTICS\n`;
    textContent += `-------------------\n`;

    if (reportData.totalRevenue) {
      textContent += `Total Revenue: Rs. ${reportData.totalRevenue.toLocaleString()}\n`;
    }
    if (reportData.totalSales) {
      textContent += `Total Sales: Rs. ${reportData.totalSales.toLocaleString()}\n`;
    }
    if (reportData.totalOrders) {
      textContent += `Total Orders: ${reportData.totalOrders}\n`;
    }
    if (reportData.averageOrderValue) {
      textContent += `Average Order Value: Rs. ${reportData.averageOrderValue.toLocaleString()}\n`;
    }
    if (reportData.totalCustomers) {
      textContent += `Total Customers: ${reportData.totalCustomers}\n`;
    }
    if (reportData.newCustomers) {
      textContent += `New Customers: ${reportData.newCustomers}\n`;
    }
    if (reportData.repeatCustomers) {
      textContent += `Repeat Customers: ${reportData.repeatCustomers}\n`;
    }
    if (reportData.retention) {
      textContent += `Retention Rate: ${reportData.retention}\n`;
    }
    if (reportData.totalProducts) {
      textContent += `Total Products: ${reportData.totalProducts}\n`;
    }
    if (reportData.lowStockItems) {
      textContent += `Low Stock Items: ${reportData.lowStockItems}\n`;
    }
    if (reportData.outOfStock) {
      textContent += `Out of Stock: ${reportData.outOfStock}\n`;
    }
    if (reportData.totalValue) {
      textContent += `Total Inventory Value: Rs. ${reportData.totalValue.toLocaleString()}\n`;
    }
    if (reportData.growth) {
      textContent += `Growth: ${reportData.growth}\n`;
    }
    if (reportData.thisMonth) {
      textContent += `This Month: Rs. ${reportData.thisMonth.toLocaleString()}\n`;
    }
    if (reportData.lastMonth) {
      textContent += `Last Month: Rs. ${reportData.lastMonth.toLocaleString()}\n`;
    }

    textContent += `\n`;

    // Add Top Products Section
    if (reportData.topProducts && reportData.topProducts.length > 0) {
      textContent += `TOP PRODUCTS\n`;
      textContent += `-------------------\n`;
      reportData.topProducts.forEach((product, idx) => {
        textContent += `${idx + 1}. ${product.name}\n`;
        textContent += `   Quantity: ${product.quantity}, Revenue: Rs. ${product.revenue.toLocaleString()}\n`;
      });
      textContent += `\n`;
    }

    // Add Sales by Day Section
    if (reportData.salesByDay && reportData.salesByDay.length > 0) {
      textContent += `SALES BY DAY\n`;
      textContent += `-------------------\n`;
      reportData.salesByDay.forEach(day => {
        textContent += `${day.date}: Rs. ${day.sales.toLocaleString()}\n`;
      });
      textContent += `\n`;
    }

    // Add Inventory by Category Section
    if (reportData.byCategory && reportData.byCategory.length > 0) {
      textContent += `INVENTORY BY CATEGORY\n`;
      textContent += `-------------------\n`;
      reportData.byCategory.forEach(cat => {
        textContent += `${cat.category}: ${cat.quantity} units, Value: Rs. ${cat.value.toLocaleString()}\n`;
      });
      textContent += `\n`;
    }

    // Add Low Stock Products Section
    if (reportData.lowStockProducts && reportData.lowStockProducts.length > 0) {
      textContent += `LOW STOCK PRODUCTS\n`;
      textContent += `-------------------\n`;
      reportData.lowStockProducts.forEach(product => {
        textContent += `${product.name}\n`;
        textContent += `   Current: ${product.current}, Minimum: ${product.minimum}\n`;
      });
      textContent += `\n`;
    }

    // Add Top Customers Section
    if (reportData.topCustomers && reportData.topCustomers.length > 0) {
      textContent += `TOP CUSTOMERS\n`;
      textContent += `-------------------\n`;
      reportData.topCustomers.forEach((customer, idx) => {
        textContent += `${idx + 1}. ${customer.name}\n`;
        textContent += `   Orders: ${customer.orders}, Spent: Rs. ${customer.spent.toLocaleString()}\n`;
      });
      textContent += `\n`;
    }

    // Add Engagement Section
    if (reportData.engagement && reportData.engagement.length > 0) {
      textContent += `CUSTOMER ENGAGEMENT\n`;
      textContent += `-------------------\n`;
      reportData.engagement.forEach(item => {
        textContent += `${item.metric}: ${item.value}\n`;
      });
      textContent += `\n`;
    }

    // Add Revenue by Payment Section
    if (reportData.revenueByPayment && reportData.revenueByPayment.length > 0) {
      textContent += `REVENUE BY PAYMENT METHOD\n`;
      textContent += `-------------------\n`;
      reportData.revenueByPayment.forEach(payment => {
        textContent += `${payment.method}: Rs. ${payment.amount.toLocaleString()} (${payment.percentage})\n`;
      });
      textContent += `\n`;
    }

    // Add Monthly Trend Section
    if (reportData.monthlyTrend && reportData.monthlyTrend.length > 0) {
      textContent += `MONTHLY REVENUE TREND\n`;
      textContent += `-------------------\n`;
      reportData.monthlyTrend.forEach(month => {
        textContent += `${month.month}: Rs. ${month.revenue.toLocaleString()}\n`;
      });
      textContent += `\n`;
    }

    textContent += `=====================================\n`;
    textContent += `End of Report\n`;
    textContent += `=====================================\n`;

    // Create and download file
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>Reports & Analytics</h1>
        <p>Generate detailed business reports</p>
      </div>

      {/* Report Selection */}
      <div className="report-controls">
        <div className="report-types">
          <button 
            className={`report-btn ${reportType === 'sales' ? 'active' : ''}`}
            onClick={() => setReportType('sales')}
          >
            📊 Sales
          </button>
          <button 
            className={`report-btn ${reportType === 'inventory' ? 'active' : ''}`}
            onClick={() => setReportType('inventory')}
          >
            📦 Inventory
          </button>
          <button 
            className={`report-btn ${reportType === 'customers' ? 'active' : ''}`}
            onClick={() => setReportType('customers')}
          >
            👥 Customers
          </button>
          <button 
            className={`report-btn ${reportType === 'revenue' ? 'active' : ''}`}
            onClick={() => setReportType('revenue')}
          >
            💰 Revenue
          </button>
        </div>

        <div className="report-filters">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="action-btn" onClick={downloadReport}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Generating report...</div>
      ) : (
        <div className="report-container">
          {/* Header Stats */}
          {reportData.title && (
            <>
              <h2>{reportData.title}</h2>

              <div className="report-stats">
                {reportData.totalRevenue && (
                  <div className="stat-box">
                    <h4>Total Revenue</h4>
                    <p className="stat-value">Rs. {reportData.totalRevenue.toLocaleString()}</p>
                    {reportData.growth && <small>↑ {reportData.growth} this month</small>}
                  </div>
                )}
                {reportData.totalSales && (
                  <div className="stat-box">
                    <h4>Total Sales</h4>
                    <p className="stat-value">Rs. {reportData.totalSales.toLocaleString()}</p>
                  </div>
                )}
                {reportData.totalOrders && (
                  <div className="stat-box">
                    <h4>Total Orders</h4>
                    <p className="stat-value">{reportData.totalOrders}</p>
                  </div>
                )}
                {reportData.averageOrderValue && (
                  <div className="stat-box">
                    <h4>Average Order Value</h4>
                    <p className="stat-value">Rs. {reportData.averageOrderValue.toLocaleString()}</p>
                  </div>
                )}
                {reportData.totalCustomers && (
                  <div className="stat-box">
                    <h4>Total Customers</h4>
                    <p className="stat-value">{reportData.totalCustomers}</p>
                  </div>
                )}
                {reportData.totalProducts && (
                  <div className="stat-box">
                    <h4>Total Products</h4>
                    <p className="stat-value">{reportData.totalProducts}</p>
                  </div>
                )}
              </div>

              {/* Detailed Report Sections */}
              <div className="report-sections">
                {reportData.topProducts && (
                  <div className="report-section">
                    <h3>Top Products</h3>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Quantity Sold</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.topProducts.map((product, idx) => (
                          <tr key={idx}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>Rs. {product.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportData.byCategory && (
                  <div className="report-section">
                    <h3>Inventory by Category</h3>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.byCategory.map((cat, idx) => (
                          <tr key={idx}>
                            <td>{cat.category}</td>
                            <td>{cat.quantity}</td>
                            <td>Rs. {cat.value.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportData.topCustomers && (
                  <div className="report-section">
                    <h3>Top Customers</h3>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Orders</th>
                          <th>Total Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.topCustomers.map((customer, idx) => (
                          <tr key={idx}>
                            <td>{customer.name}</td>
                            <td>{customer.orders}</td>
                            <td>Rs. {customer.spent.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportData.monthlyTrend && (
                  <div className="report-section">
                    <h3>Monthly Revenue Trend</h3>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.monthlyTrend.map((month, idx) => (
                          <tr key={idx}>
                            <td>{month.month}</td>
                            <td>Rs. {month.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminReports;
