import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiFilter, FiPrinter, FiDownload, FiCheck, FiTruck, FiCheckCircle, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import './AdminPanel.css';

function OrderManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, filterStatus]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders({ limit: 100 });
      const mockOrders = [
        { 
          id: '#ORD001', 
          customerName: 'Krishna Magar', 
          email: 'krishna@example.com', 
          items: 3, 
          total: 4500, 
          status: 'pending', 
          paymentStatus: 'paid', 
          shippingStatus: 'not-shipped', 
          date: '2026-04-14', 
          address: '123 Main St, Kathmandu',
          orderItems: [
            { name: 'Embroidered Saree', quantity: 1, unitPrice: 1800, image: '👗' },
            { name: 'Silk Shawl', quantity: 1, unitPrice: 1200, image: '🧣' },
            { name: 'Beaded Dupatta', quantity: 1, unitPrice: 1500, image: '✨' }
          ]
        },
        { 
          id: '#ORD002', 
          customerName: 'Priya Verma', 
          email: 'priya@example.com', 
          items: 1, 
          total: 2500, 
          status: 'confirmed', 
          paymentStatus: 'paid', 
          shippingStatus: 'shipped', 
          date: '2026-04-13', 
          address: '456 Oak Ave, Mumbai',
          orderItems: [
            { name: 'Premium Cotton Kurta', quantity: 1, unitPrice: 2500, image: '👚' }
          ]
        },
        { 
          id: '#ORD003', 
          customerName: 'Rajesh Patel', 
          email: 'rajesh@example.com', 
          items: 2, 
          total: 3800, 
          status: 'shipped', 
          paymentStatus: 'paid', 
          shippingStatus: 'in-transit', 
          date: '2026-04-12', 
          address: '789 Pine Rd, Delhi',
          orderItems: [
            { name: 'Casual Shirt', quantity: 2, unitPrice: 1900, image: '👔' }
          ]
        },
        { 
          id: '#ORD004', 
          customerName: 'Ananya Gupta', 
          email: 'ananya@example.com', 
          items: 4, 
          total: 5200, 
          status: 'delivered', 
          paymentStatus: 'paid', 
          shippingStatus: 'delivered', 
          date: '2026-04-10', 
          address: '321 Elm St, Bangalore',
          orderItems: [
            { name: 'Traditional Saree', quantity: 1, unitPrice: 2200, image: '👗' },
            { name: 'Beaded Necklace', quantity: 1, unitPrice: 1500, image: '💎' },
            { name: 'Gold Bangles', quantity: 1, unitPrice: 1200, image: '💍' },
            { name: 'Silk Scarf', quantity: 1, unitPrice: 300, image: '🧣' }
          ]
        },
        { 
          id: '#ORD005', 
          customerName: 'Karan Thapa', 
          email: 'karan@example.com', 
          items: 2, 
          total: 3000, 
          status: 'cancelled', 
          paymentStatus: 'refunded', 
          shippingStatus: 'cancelled', 
          date: '2026-04-09', 
          address: '654 Maple Dr, Pokhara',
          orderItems: [
            { name: 'Formal Blazer', quantity: 1, unitPrice: 1800, image: '🧥' },
            { name: 'Dress Pants', quantity: 1, unitPrice: 1200, image: '👖' }
          ]
        },
      ];
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setUpdateMessage(`✅ Order status updated to ${newStatus}`);
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  const updateShippingStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, shippingStatus: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, shippingStatus: newStatus });
    }
    setUpdateMessage(`✅ Shipping status updated to ${newStatus}`);
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      confirmed: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  };

  const generateInvoiceHTML = (order) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
          .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #c9a227; padding-bottom: 20px; }
          .invoice-header h1 { margin: 0; color: #1a1a1a; }
          .invoice-header .logo { font-size: 24px; margin-bottom: 10px; }
          .invoice-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-section { }
          .info-section h3 { margin: 0 0 10px 0; color: #666; font-size: 12px; text-transform: uppercase; }
          .info-section p { margin: 5px 0; font-size: 14px; }
          .order-details { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f5f5f5; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: 600; }
          td { padding: 12px; border: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9f9f9; }
          .summary { text-align: right; margin-top: 20px; }
          .summary-row { display: flex; justify-content: flex-end; gap: 20px; margin: 8px 0; font-size: 14px; }
          .summary-label { font-weight: 600; min-width: 150px; }
          .summary-value { min-width: 100px; text-align: right; }
          .total-row { font-size: 16px; font-weight: 700; margin-top: 15px; padding-top: 15px; border-top: 2px solid #c9a227; }
          .status-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
          .status-item { }
          .status-label { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; }
          .status-value { font-size: 14px; color: #1a1a1a; margin-top: 5px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
          @media print { body { margin: 0; } .invoice-container { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="logo">🛍️ AAXOMS</div>
            <h1>INVOICE</h1>
            <p style="margin: 10px 0; color: #c9a227; font-size: 16px; font-weight: 600;">${order.id}</p>
          </div>

          <div class="invoice-info">
            <div class="info-section">
              <h3>From</h3>
              <p><strong>AAXOMS Store</strong></p>
              <p>Karachi, Pakistan</p>
              <p>contact@aaxoms.com</p>
            </div>
            <div class="info-section">
              <h3>Bill To</h3>
              <p><strong>${order.customerName}</strong></p>
              <p>${order.email}</p>
              <p>${order.address}</p>
            </div>
          </div>

          <div class="order-details">
            <h3 style="margin: 0 0 10px 0; color: #666; font-size: 12px; text-transform: uppercase;">Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems && order.orderItems.length > 0 ? order.orderItems.map(item => `
                <tr>
                  <td>${item.image} ${item.name}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">Rs. ${item.unitPrice.toLocaleString()}</td>
                  <td style="text-align: right;">Rs. ${(item.quantity * item.unitPrice).toLocaleString()}</td>
                </tr>
                `).join('') : `
                <tr>
                  <td>Mixed Products (${order.items} items)</td>
                  <td style="text-align: center;">${order.items}</td>
                  <td style="text-align: right;">Rs. ${(order.total / order.items).toFixed(0)}</td>
                  <td style="text-align: right;">Rs. ${order.total.toLocaleString()}</td>
                </tr>
                `}
              </tbody>
            </table>
          </div>

          <div class="summary">
            <div class="summary-row">
              <div class="summary-label">Subtotal:</div>
              <div class="summary-value">Rs. ${order.total.toLocaleString()}</div>
            </div>
            <div class="summary-row">
              <div class="summary-label">Tax (0%):</div>
              <div class="summary-value">Rs. 0</div>
            </div>
            <div class="summary-row">
              <div class="summary-label">Shipping:</div>
              <div class="summary-value">Rs. 0 (Included)</div>
            </div>
            <div class="summary-row total-row">
              <div class="summary-label">Total Amount:</div>
              <div class="summary-value">Rs. ${order.total.toLocaleString()}</div>
            </div>
          </div>

          <div class="status-row">
            <div class="status-item">
              <div class="status-label">Order Status</div>
              <div class="status-value">${order.status.toUpperCase()}</div>
            </div>
            <div class="status-item">
              <div class="status-label">Payment Status</div>
              <div class="status-value">${order.paymentStatus.toUpperCase()}</div>
            </div>
            <div class="status-item">
              <div class="status-label">Shipping Status</div>
              <div class="status-value">${order.shippingStatus.toUpperCase()}</div>
            </div>
            <div class="status-item">
              <div class="status-label">Order Date</div>
              <div class="status-value">${order.date}</div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your order! If you have any questions, please contact us.</p>
            <p style="margin-top: 10px; font-size: 11px;">Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrintInvoice = (order) => {
    if (!order) return;
    const invoiceHTML = generateInvoiceHTML(order);
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleDownloadInvoice = (order) => {
    if (!order) return;
    const invoiceHTML = generateInvoiceHTML(order);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(invoiceHTML));
    element.setAttribute('download', `Invoice_${order.id}_${new Date().toISOString().split('T')[0]}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setUpdateMessage(`✅ Invoice downloaded: Invoice_${order.id}.html`);
    setTimeout(() => setUpdateMessage(''), 3000);
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>Order Management</h1>
        <p>View and process all orders</p>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="order-management">
          {/* Search and Filter */}
          <div className="filters-section">
            <div className="search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by Order ID, Customer name, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Shipping</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.customerName}</td>
                      <td>{order.items}</td>
                      <td>Rs. {order.total.toLocaleString()}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>{order.shippingStatus}</td>
                      <td>{order.date}</td>
                      <td>
                        <button 
                          className="icon-btn"
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Detail Panel */}
          {selectedOrder && (
            <div className="order-detail-panel">
              <div className="detail-header">
                <h2>{selectedOrder.id}</h2>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
              </div>

              {updateMessage && (
                <div className="update-message">
                  {updateMessage}
                </div>
              )}

              <div className="detail-content">
                <div className="detail-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Shipping Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Order Date:</strong> {selectedOrder.date}</p>
                </div>

                <div className="detail-section">
                  <h4>Order Items</h4>
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    <div className="order-items-table">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                            <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Product</th>
                            <th style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>Qty</th>
                            <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>Price</th>
                            <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.orderItems.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                              <td style={{ padding: '10px 8px', fontSize: '13px' }}>{item.image} {item.name}</td>
                              <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '13px' }}>{item.quantity}</td>
                              <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '13px' }}>Rs. {item.unitPrice.toLocaleString()}</td>
                              <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>Rs. {(item.quantity * item.unitPrice).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#666' }}>No items listed</p>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Order Summary</h4>
                  <p><strong>Total Items:</strong> {selectedOrder.items}</p>
                  <p><strong>Total Amount:</strong> Rs. {selectedOrder.total.toLocaleString()}</p>
                </div>

                <div className="detail-section">
                  <h4>Update Order Status</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '6px', display: 'block' }}>Order Status</label>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="form-select"
                    >
                      <option value="pending">🔴 Pending</option>
                      <option value="confirmed">🟡 Confirmed</option>
                      <option value="shipped">🟣 Shipped</option>
                      <option value="delivered">🟢 Delivered</option>
                      <option value="cancelled">⚫ Cancelled</option>
                    </select>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="quick-actions">
                    <button 
                      className="quick-action-btn confirmed"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                      title="Mark as Confirmed"
                    >
                      <FiCheck /> Confirm
                    </button>
                    <button 
                      className="quick-action-btn shipped"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      title="Mark as Shipped"
                    >
                      <FiTruck /> Ship
                    </button>
                    <button 
                      className="quick-action-btn delivered"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      title="Mark as Delivered"
                    >
                      <FiCheckCircle /> Deliver
                    </button>
                    <button 
                      className="quick-action-btn cancelled"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      title="Cancel Order"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Update Shipping Status</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '6px', display: 'block' }}>Shipping Status</label>
                    <select 
                      value={selectedOrder.shippingStatus}
                      onChange={(e) => updateShippingStatus(selectedOrder.id, e.target.value)}
                      className="form-select"
                    >
                      <option value="not-shipped">📦 Not Shipped</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="in-transit">🚛 In Transit</option>
                      <option value="delivered">✅ Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Payment Status</h4>
                  <p className={`payment-status ${selectedOrder.paymentStatus}`}>
                    {selectedOrder.paymentStatus === 'paid' ? '✅ PAID' : selectedOrder.paymentStatus === 'refunded' ? '💳 REFUNDED' : '⏳ PENDING'}
                  </p>
                </div>

                <div className="detail-actions">
                  <button 
                    className="action-btn" 
                    onClick={() => handlePrintInvoice(selectedOrder)}
                    title="Print order invoice"
                  >
                    <FiPrinter /> Print Invoice
                  </button>
                  <button 
                    className="action-btn" 
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    title="Download order invoice as HTML"
                  >
                    <FiDownload /> Download
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

export default OrderManagement;
