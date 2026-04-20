import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiFilter, FiDownload, FiPrinter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function PurchaseHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('all');

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [purchases, searchTerm, filterDateRange]);

  const fetchPurchaseHistory = async () => {
    try {
      const mockPurchases = [
        // Krishna Magar's purchases
        { id: 1, orderId: '#ORD001', customerName: 'Krishna Magar', email: 'krishna@example.com', productName: 'BOLD HORIZONS: CLASSIC OVERSIZED T-SHIRT', category: 'tshirts', quantity: 2, unitPrice: 1199, totalPrice: 2398, date: '2026-04-14', status: 'delivered', paymentMethod: 'Card' },
        { id: 2, orderId: '#ORD001', customerName: 'Krishna Magar', email: 'krishna@example.com', productName: 'ESSENTIAL COTTON T-SHIRT', category: 'plain-tshirts', quantity: 1, unitPrice: 799, totalPrice: 799, date: '2026-04-14', status: 'delivered', paymentMethod: 'Card' },

        // Priya Verma's purchases
        { id: 3, orderId: '#ORD002', customerName: 'Priya Verma', email: 'priya@example.com', productName: 'CLASSIC TROOPER HOODIE', category: 'hoodies', quantity: 1, unitPrice: 2699, totalPrice: 2699, date: '2026-04-13', status: 'delivered', paymentMethod: 'Bank Transfer' },

        // Rajesh Patel's purchases
        { id: 4, orderId: '#ORD003', customerName: 'Rajesh Patel', email: 'rajesh@example.com', productName: 'MOUNTAIN CALLING SWEATSHIRT', category: 'printed-sweatshirts', quantity: 1, unitPrice: 2299, totalPrice: 2299, date: '2026-04-12', status: 'in-transit', paymentMethod: 'Bank Transfer' },
        { id: 5, orderId: '#ORD003', customerName: 'Rajesh Patel', email: 'rajesh@example.com', productName: 'CLASSIC V-NECK SCRUB TOP - CEIL BLUE', category: 'scrubs', quantity: 2, unitPrice: 1299, totalPrice: 2598, date: '2026-04-12', status: 'in-transit', paymentMethod: 'Bank Transfer' },

        // Ananya Gupta's purchases
        { id: 6, orderId: '#ORD004', customerName: 'Ananya Gupta', email: 'ananya@example.com', productName: 'PREMIUM SUPIMA T-SHIRT', category: 'plain-tshirts', quantity: 2, unitPrice: 1299, totalPrice: 2598, date: '2026-04-10', status: 'delivered', paymentMethod: 'Card' },
        { id: 7, orderId: '#ORD004', customerName: 'Ananya Gupta', email: 'ananya@example.com', productName: 'WANDERLUST GRAPHIC T-SHIRT', category: 'tshirts', quantity: 1, unitPrice: 1099, totalPrice: 1099, date: '2026-04-10', status: 'delivered', paymentMethod: 'Card' },
        { id: 8, orderId: '#ORD004', customerName: 'Ananya Gupta', email: 'ananya@example.com', productName: 'TACTICAL CARGO SHORTS', category: 'cargo-shorts', quantity: 1, unitPrice: 1875, totalPrice: 1875, date: '2026-04-10', status: 'delivered', paymentMethod: 'Card' },

        // Nisha Singh's purchases
        { id: 9, orderId: '#ORD005', customerName: 'Nisha Singh', email: 'nisha@example.com', productName: 'EXPLORER ZIP-UP HOODIE', category: 'hoodies', quantity: 1, unitPrice: 2999, totalPrice: 2999, date: '2026-04-08', status: 'delivered', paymentMethod: 'Cash on Delivery' },
        { id: 10, orderId: '#ORD006', customerName: 'Nisha Singh', email: 'nisha@example.com', productName: 'ESSENTIAL PLAIN SWEATSHIRT', category: 'plain-sweatshirts', quantity: 3, unitPrice: 1999, totalPrice: 5997, date: '2026-04-07', status: 'delivered', paymentMethod: 'Bank Transfer' },

        // Karan Thapa's purchases
        { id: 11, orderId: '#ORD007', customerName: 'Karan Thapa', email: 'karan@example.com', productName: 'TROOPERGO: 2-IN-1 UTILITY CARGO PANTS', category: 'cargo-pants', quantity: 1, unitPrice: 4250, totalPrice: 4250, date: '2026-04-06', status: 'delivered', paymentMethod: 'Bank Transfer' },
        { id: 12, orderId: '#ORD008', customerName: 'Karan Thapa', email: 'karan@example.com', productName: 'CLASSIC CHEF APRON - BLACK', category: 'apron', quantity: 2, unitPrice: 1499, totalPrice: 2998, date: '2026-04-05', status: 'delivered', paymentMethod: 'Card' },

        // Pooja Desai's purchases
        { id: 13, orderId: '#ORD009', customerName: 'Pooja Desai', email: 'pooja@example.com', productName: 'MOUNTAIN EXPLORER PRINTED', category: 'printed-tshirts', quantity: 1, unitPrice: 1199, totalPrice: 1199, date: '2026-04-04', status: 'delivered', paymentMethod: 'Bank Transfer' },
        { id: 14, orderId: '#ORD010', customerName: 'Pooja Desai', email: 'pooja@example.com', productName: 'CONVERTIBLE TRAVEL PANTS', category: 'travel-pants', quantity: 1, unitPrice: 2799, totalPrice: 2799, date: '2026-04-03', status: 'delivered', paymentMethod: 'Card' },

        // Divya Kumar's purchases
        { id: 15, orderId: '#ORD011', customerName: 'Divya Kumar', email: 'divya@example.com', productName: 'HANDCRAFTED LEATHER JOURNAL', category: 'boutique-products', quantity: 1, unitPrice: 1899, totalPrice: 1899, date: '2026-04-02', status: 'pending', paymentMethod: 'Card' },
      ];

      setPurchases(mockPurchases);
      setFilteredPurchases(mockPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = purchases;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPurchases(filtered);
  };

  const getTotalRevenue = () => {
    return filteredPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  };

  const getTotalQuantity = () => {
    return filteredPurchases.reduce((sum, p) => sum + p.quantity, 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: '#4CAF50',
      'in-transit': '#FF9800',
      pending: '#2196F3',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  const exportToCSV = () => {
    if (filteredPurchases.length === 0) {
      toast.warning('No purchases to export');
      return;
    }

    // Prepare CSV headers
    const headers = ['Order ID', 'Customer Name', 'Email', 'Product Name', 'Category', 'Quantity', 'Unit Price', 'Total Price', 'Date', 'Status', 'Payment Method'];
    
    // Prepare CSV rows
    const rows = filteredPurchases.map(p => [
      p.orderId,
      p.customerName,
      p.email,
      p.productName,
      p.category,
      p.quantity,
      p.unitPrice,
      p.totalPrice,
      p.date,
      p.status,
      p.paymentMethod
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download CSV file
    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `Purchase_History_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    if (filteredPurchases.length === 0) {
      toast.warning('No purchases to print');
      return;
    }

    // Create a print-friendly version
    const printWindow = window.open('', '', 'width=900,height=600');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase History Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background-color: #fff; }
          h1 { text-align: center; color: #333; }
          .summary { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 30px; }
          .summary-item { padding: 15px; background-color: #f5f5f5; border-radius: 4px; text-align: center; }
          .summary-item h3 { margin: 0; font-size: 12px; color: #666; }
          .summary-item p { margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #2196F3; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #2196F3; color: white; padding: 10px; text-align: left; font-size: 12px; }
          td { padding: 8px 10px; border-bottom: 1px solid #ddd; font-size: 11px; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 11px; }
          @media print {
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        <h1>📊 Purchase History Report</h1>
        <p style="text-align: center; color: #666;">Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <div class="summary-item">
            <h3>Total Revenue</h3>
            <p>Rs. ${getTotalRevenue().toLocaleString()}</p>
          </div>
          <div class="summary-item">
            <h3>Total Items Sold</h3>
            <p>${getTotalQuantity()}</p>
          </div>
          <div class="summary-item">
            <h3>Total Transactions</h3>
            <p>${filteredPurchases.length}</p>
          </div>
          <div class="summary-item">
            <h3>Unique Customers</h3>
            <p>${new Set(filteredPurchases.map(p => p.customerName)).size}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPurchases.map(p => `
              <tr>
                <td>${p.orderId}</td>
                <td>${p.customerName}</td>
                <td>${p.productName}</td>
                <td>${p.quantity}</td>
                <td>Rs. ${p.unitPrice.toLocaleString()}</td>
                <td>Rs. ${p.totalPrice.toLocaleString()}</td>
                <td>${p.date}</td>
                <td>${p.status}</td>
                <td>${p.paymentMethod}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>This is an official purchase history report from AAXOMS Store. For inquiries, contact admin@aaxoms.com</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>📊 Purchase History</h1>
        <p>View all customer purchases with product details</p>
      </div>

      {loading ? (
        <div className="loading">Loading purchase history...</div>
      ) : (
        <div className="purchase-history-container">
          {/* Summary Cards */}
          <div className="purchase-summary">
            <div className="summary-card">
              <h3>Total Revenue</h3>
              <p className="summary-value">Rs. {getTotalRevenue().toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h3>Total Items Sold</h3>
              <p className="summary-value">{getTotalQuantity()}</p>
            </div>
            <div className="summary-card">
              <h3>Total Transactions</h3>
              <p className="summary-value">{filteredPurchases.length}</p>
            </div>
            <div className="summary-card">
              <h3>Unique Customers</h3>
              <p className="summary-value">{new Set(filteredPurchases.map(p => p.customerName)).size}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="filters-section">
            <div className="search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by customer name, email, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="action-btn" onClick={exportToCSV} style={{ backgroundColor: '#2196F3' }}>
              <FiDownload /> Export CSV
            </button>
            <button className="action-btn" onClick={handlePrint} style={{ backgroundColor: '#FF9800' }}>
              <FiPrinter /> Print
            </button>
          </div>

          {/* Purchase Table */}
          <div className="purchase-table-container">
            <table className="purchase-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td><strong>{purchase.orderId}</strong></td>
                      <td>
                        <div className="customer-cell">
                          <p className="customer-name">{purchase.customerName}</p>
                          <p className="customer-email">{purchase.email}</p>
                        </div>
                      </td>
                      <td className="product-cell">{purchase.productName}</td>
                      <td><span className="category-badge">{purchase.category}</span></td>
                      <td className="quantity-cell"><strong>{purchase.quantity}</strong></td>
                      <td>Rs. {purchase.unitPrice.toLocaleString()}</td>
                      <td><strong>Rs. {purchase.totalPrice.toLocaleString()}</strong></td>
                      <td>{new Date(purchase.date).toLocaleDateString()}</td>
                      <td>
                        <span 
                          className={`status-badge ${getStatusClass(purchase.status)}`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      <td>{purchase.paymentMethod}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      No purchases found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
