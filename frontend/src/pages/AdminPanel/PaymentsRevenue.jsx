import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiDownload, FiX, FiTrendingUp, FiCreditCard } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function PaymentsRevenue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, searchTerm, filterStatus]);

  const fetchPayments = async () => {
    try {
      const mockPayments = [
        { id: 'TXN001', orderId: 'ORD-001', amount: 3000, method: 'Credit Card', status: 'completed', date: '2026-04-14', customer: 'Krishna Magar', reference: 'CC-4532' },
        { id: 'TXN002', orderId: 'ORD-002', amount: 5500, method: 'Bank Transfer', status: 'completed', date: '2026-04-13', customer: 'Priya Verma', reference: 'BT-4821' },
        { id: 'TXN003', orderId: 'ORD-003', amount: 2200, method: 'Online Wallet', status: 'pending', date: '2026-04-13', customer: 'Nisha Singh', reference: 'EW-7284' },
        { id: 'TXN004', orderId: 'ORD-004', amount: 7500, method: 'Credit Card', status: 'completed', date: '2026-04-12', customer: 'Ananya Gupta', reference: 'CC-8765' },
        { id: 'TXN005', orderId: 'ORD-005', amount: 1800, method: 'Cash on Delivery', status: 'pending', date: '2026-04-12', customer: 'Rajesh Patel', reference: 'COD-5432' },
      ];
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    setFilteredPayments(filtered);
  };

  const getTotalRevenue = () => {
    return payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  };

  const getRevenueThisMonth = () => {
    return payments.filter(p => p.status === 'completed' && p.date.includes('2026-04')).reduce((sum, p) => sum + p.amount, 0);
  };

  const getStatusColor = (status) => {
    const colors = { completed: '#4CAF50', pending: '#FF9800', failed: '#F44336', refunded: '#2196F3' };
    return colors[status] || '#999';
  };

  const downloadStatement = () => {
    // Generate comprehensive revenue statement
    const totalRevenue = getTotalRevenue();
    const monthlyRevenue = getRevenueThisMonth();
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
    const completedCount = payments.filter(p => p.status === 'completed').length;
    
    const statementContent = `
=====================================
      REVENUE & PAYMENT STATEMENT
=====================================

Generated on: ${new Date().toLocaleString()}
Report Period: April 2026

EXECUTIVE SUMMARY
=====================================
Total Revenue:             Rs. ${totalRevenue.toLocaleString()}
This Month Revenue:        Rs. ${monthlyRevenue.toLocaleString()}
Pending Payments:          Rs. ${pendingAmount.toLocaleString()}
Completed Transactions:    ${completedCount}

PAYMENT METHODS BREAKDOWN
=====================================
`;

    // Add payment methods summary
    const paymentMethodsSummary = {};
    payments.forEach(p => {
      if (!paymentMethodsSummary[p.method]) {
        paymentMethodsSummary[p.method] = { count: 0, total: 0 };
      }
      paymentMethodsSummary[p.method].count++;
      paymentMethodsSummary[p.method].total += p.amount;
    });

    let statementWithMethods = statementContent;
    Object.entries(paymentMethodsSummary).forEach(([method, data]) => {
      statementWithMethods += `${method}: ${data.count} transaction(s) - Rs. ${data.total.toLocaleString()}\n`;
    });

    // Add individual transaction details
    statementWithMethods += `\n\nDETAILED TRANSACTIONS:\n`;
    statementWithMethods += `${'ID'.padEnd(12)} ${'Order'.padEnd(12)} ${'Customer'.padEnd(20)} ${'Amount'.padEnd(12)} ${'Method'.padEnd(18)} ${'Status'.padEnd(10)} ${'Date'.padEnd(12)}\n`;
    statementWithMethods += `${'-'.repeat(96)}\n`;
    
    payments.forEach(p => {
      statementWithMethods += `${p.id.padEnd(12)} ${p.orderId.padEnd(12)} ${p.customer.substring(0, 19).padEnd(20)} Rs. ${p.amount.toString().padEnd(10)} ${p.method.substring(0, 16).padEnd(18)} ${p.status.padEnd(10)} ${p.date.padEnd(12)}\n`;
    });

    statementWithMethods += `\n${'='.repeat(96)}\n`;
    statementWithMethods += `TOTAL: Rs. ${totalRevenue.toLocaleString()}\n`;
    statementWithMethods += `${'='.repeat(96)}\n\n`;
    statementWithMethods += `This is an official revenue statement. For inquiries, contact admin@aaxoms.com\n`;

    // Create and download the file
    const element = document.createElement('a');
    const file = new Blob([statementWithMethods], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Revenue_Statement_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadReceipt = (payment) => {
    // Create a receipt content
    const receiptContent = `
=====================================
           PAYMENT RECEIPT
=====================================

Transaction ID: ${payment.id}
Order ID: ${payment.orderId}
Date: ${payment.date}

Customer Information:
  Name: ${payment.customer}
  Reference: ${payment.reference}

Payment Details:
  Amount: Rs. ${payment.amount.toLocaleString()}
  Method: ${payment.method}
  Status: ${payment.status.toUpperCase()}

=====================================
Generated on: ${new Date().toLocaleString()}
=====================================
    `.trim();

    // Create a blob and download
    const element = document.createElement('a');
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Receipt_${payment.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const viewOrder = (orderId) => {
    // Mock order data - in production, fetch from API
    const mockOrders = {
      'ORD-001': {
        id: 'ORD-001',
        customer: 'Ahmed Ali',
        email: 'ahmed@example.com',
        phone: '+92-300-3456789',
        totalAmount: 3000,
        status: 'delivered',
        date: '2026-04-14',
        estimatedDelivery: '2026-04-18',
        items: [
          { name: 'Embroidered Saree', quantity: 1, price: 2000, subtotal: 2000 },
          { name: 'Matching Dupatta', quantity: 1, price: 1000, subtotal: 1000 }
        ],
        shippingAddress: '123 Main Street, Karachi, Pakistan',
        billingAddress: '123 Main Street, Karachi, Pakistan',
        shippingCost: 0,
        tax: 0,
        discount: 0
      },
      'ORD-002': {
        id: 'ORD-002',
        customer: 'Fatima Khan',
        email: 'fatima@example.com',
        phone: '+92-300-5678901',
        totalAmount: 5500,
        status: 'processing',
        date: '2026-04-13',
        estimatedDelivery: '2026-04-20',
        items: [
          { name: 'Silk Dress', quantity: 2, price: 2500, subtotal: 5000 },
          { name: 'Accessories', quantity: 1, price: 500, subtotal: 500 }
        ],
        shippingAddress: '456 Garden Road, Lahore, Pakistan',
        billingAddress: '456 Garden Road, Lahore, Pakistan',
        shippingCost: 0,
        tax: 0,
        discount: 0
      },
      'ORD-003': {
        id: 'ORD-003',
        customer: 'Ali Raza',
        email: 'ali@example.com',
        phone: '+92-300-7894561',
        totalAmount: 2200,
        status: 'pending',
        date: '2026-04-13',
        estimatedDelivery: '2026-04-22',
        items: [
          { name: 'Casual Kurta', quantity: 1, price: 1200, subtotal: 1200 },
          { name: 'Trousers', quantity: 1, price: 1000, subtotal: 1000 }
        ],
        shippingAddress: '789 Market Plaza, Islamabad, Pakistan',
        billingAddress: '789 Market Plaza, Islamabad, Pakistan',
        shippingCost: 0,
        tax: 0,
        discount: 0
      }
    };

    const order = mockOrders[orderId];
    if (order) {
      setSelectedOrder(order);
      setShowOrderModal(true);
      toast.info(`Loading order details for ${orderId}`);
    } else {
      toast.error('Order not found');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>💰 Payments & Revenue</h1>
        <p>Track transactions and revenue analytics</p>
      </div>

      {loading ? (
        <div className="loading">Loading payments...</div>
      ) : (
        <>
          {/* Revenue Stats */}
          <div className="revenue-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>💵</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">Rs. {getTotalRevenue().toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#2196F3' }}>📈</div>
              <div className="stat-content">
                <h3>This Month</h3>
                <p className="stat-value">Rs. {getRevenueThisMonth().toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#FF9800' }}>⏳</div>
              <div className="stat-content">
                <h3>Pending</h3>
                <p className="stat-value">Rs. {payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#9C27B0' }}>✅</div>
              <div className="stat-content">
                <h3>Completed</h3>
                <p className="stat-value">{payments.filter(p => p.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by Order ID, Reference, or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <button className="action-btn" onClick={downloadStatement} style={{ backgroundColor: '#2196F3' }}>
              <FiDownload /> Download Statement
            </button>
          </div>

          {/* Payments Table */}
          <div className="payments-table">
            {filteredPayments.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Reference</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td><strong>{payment.id}</strong></td>
                      <td>{payment.orderId}</td>
                      <td>{payment.customer}</td>
                      <td>Rs. {payment.amount.toLocaleString()}</td>
                      <td>{payment.method}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getStatusColor(payment.status) }}>
                          {payment.status}
                        </span>
                      </td>
                      <td>{payment.date}</td>
                      <td>{payment.reference}</td>
                      <td>
                        <button 
                          className="icon-btn"
                          onClick={() => { setSelectedPayment(payment); setShowModal(true); }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                No payments found
              </div>
            )}
          </div>

          {/* Payment Detail Modal */}
          {showModal && selectedPayment && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Payment Details - {selectedPayment.id}</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
                </div>
                <div className="modal-body">
                  <div className="payment-detail-grid">
                    <div className="detail-item">
                      <label>Transaction ID</label>
                      <p>{selectedPayment.id}</p>
                    </div>
                    <div className="detail-item">
                      <label>Order ID</label>
                      <p>{selectedPayment.orderId}</p>
                    </div>
                    <div className="detail-item">
                      <label>Customer</label>
                      <p>{selectedPayment.customer}</p>
                    </div>
                    <div className="detail-item">
                      <label>Amount</label>
                      <p><strong>Rs. {selectedPayment.amount.toLocaleString()}</strong></p>
                    </div>
                    <div className="detail-item">
                      <label>Payment Method</label>
                      <p>{selectedPayment.method}</p>
                    </div>
                    <div className="detail-item">
                      <label>Reference</label>
                      <p>{selectedPayment.reference}</p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p>
                        <span className="badge" style={{ backgroundColor: getStatusColor(selectedPayment.status) }}>
                          {selectedPayment.status}
                        </span>
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Date</label>
                      <p>{selectedPayment.date}</p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button 
                      className="action-btn" 
                      onClick={() => downloadReceipt(selectedPayment)}
                      style={{ backgroundColor: '#FF6B6B' }}
                    >
                      <FiDownload /> Download Receipt
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => viewOrder(selectedPayment.orderId)}
                      style={{ backgroundColor: '#2196F3' }}
                    >
                      View Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {showOrderModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📦 Order Details - {selectedOrder.id}</h2>
                <button className="modal-close" onClick={() => setShowOrderModal(false)}><FiX /></button>
              </div>
              <div className="modal-body">
                {/* Order Status and Basic Info */}
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666' }}>Order Status</label>
                      <p style={{ margin: '5px 0', fontSize: '14px', textTransform: 'capitalize', fontWeight: 'bold', color: selectedOrder.status === 'delivered' ? '#4CAF50' : selectedOrder.status === 'processing' ? '#FF9800' : '#2196F3' }}>
                        {selectedOrder.status}
                      </p>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666' }}>Order Date</label>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>{selectedOrder.date}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666' }}>Estimated Delivery</label>
                      <p style={{ margin: '5px 0', fontSize: '14px' }}>{selectedOrder.estimatedDelivery}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666' }}>Total Amount</label>
                      <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold', color: '#2196F3' }}>Rs. {selectedOrder.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>👤 Customer Information</h3>
                  <div className="payment-detail-grid">
                    <div className="detail-item">
                      <label>Name</label>
                      <p>{selectedOrder.customer}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedOrder.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{selectedOrder.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>🛍️ Order Items</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px', fontWeight: '600' }}>Product</th>
                        <th style={{ textAlign: 'center', padding: '10px', fontSize: '12px', fontWeight: '600' }}>Qty</th>
                        <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', fontWeight: '600' }}>Price</th>
                        <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px', fontWeight: '600' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px', fontSize: '13px' }}>{item.name}</td>
                          <td style={{ textAlign: 'center', padding: '10px', fontSize: '13px' }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right', padding: '10px', fontSize: '13px' }}>Rs. {item.price.toLocaleString()}</td>
                          <td style={{ textAlign: 'right', padding: '10px', fontSize: '13px', fontWeight: '600' }}>Rs. {item.subtotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Summary */}
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>📋 Order Summary</h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>Subtotal:</span>
                      <span>Rs. {selectedOrder.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}</span>
                    </div>
                    {selectedOrder.shippingCost > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>Shipping:</span>
                        <span>Rs. {selectedOrder.shippingCost.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.tax > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>Tax:</span>
                        <span>Rs. {selectedOrder.tax.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4CAF50' }}>
                        <span>Discount:</span>
                        <span>-Rs. {selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                      <span>Total:</span>
                      <span>Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping & Billing Address */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>📍 Address Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>Shipping Address</label>
                      <p style={{ margin: '5px 0', fontSize: '13px' }}>{selectedOrder.shippingAddress}</p>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>Billing Address</label>
                      <p style={{ margin: '5px 0', fontSize: '13px' }}>{selectedOrder.billingAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  className="action-btn" 
                  style={{ backgroundColor: '#4CAF50' }}
                  onClick={() => {
                    toast.success('Order printed successfully!');
                    window.print();
                  }}
                >
                  🖨️ Print Order
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => setShowOrderModal(false)}
                  style={{ backgroundColor: '#95A5A6' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}

export default PaymentsRevenue;
