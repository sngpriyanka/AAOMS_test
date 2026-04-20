import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFilter, FiDownload, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function AuditLogs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchTerm, filterAction, startDate, endDate]);

  const fetchAuditLogs = async () => {
    try {
      // Simulated audit logs data
      const mockLogs = [
        { id: 1, action: 'User Created', by: 'admin1', target: 'customer123', details: 'New user registered', timestamp: '2026-04-14 10:30:00', ipAddress: '192.168.1.1' },
        { id: 2, action: 'Product Updated', by: 'super_admin', target: 'product456', details: 'Price changed from 1000 to 1200', timestamp: '2026-04-14 09:15:00', ipAddress: '192.168.1.2' },
        { id: 3, action: 'Order Refunded', by: 'admin2', target: 'order789', details: 'Full refund processed', timestamp: '2026-04-14 08:45:00', ipAddress: '192.168.1.3' },
        { id: 4, action: 'User Promoted', by: 'super_admin', target: 'admin1', details: 'Promoted to admin role', timestamp: '2026-04-13 16:20:00', ipAddress: '192.168.1.1' },
        { id: 5, action: 'Activity Log Viewed', by: 'admin1', target: 'system', details: 'Accessed audit logs', timestamp: '2026-04-13 14:10:00', ipAddress: '192.168.1.2' },
        { id: 6, action: 'Settings Changed', by: 'super_admin', target: 'system_settings', details: 'Updated email templates', timestamp: '2026-04-13 11:50:00', ipAddress: '192.168.1.1' },
        { id: 7, action: 'User Deleted', by: 'super_admin', target: 'user999', details: 'Account permanently deleted', timestamp: '2026-04-12 13:30:00', ipAddress: '192.168.1.3' },
        { id: 8, action: 'Product Created', by: 'admin2', target: 'product_new', details: 'New product added to catalog', timestamp: '2026-04-12 11:00:00', ipAddress: '192.168.1.2' },
      ];
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }

    setFilteredLogs(filtered);
  };

  const downloadLogs = () => {
    const csv = [
      ['ID', 'Action', 'By', 'Target', 'Details', 'Timestamp', 'IP Address'],
      ...filteredLogs.map(log => [log.id, log.action, log.by, log.target, log.details, log.timestamp, log.ipAddress])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>Audit Logs</h1>
        <p>Track all system activities and changes</p>
      </div>

      {loading ? (
        <div className="loading">Loading audit logs...</div>
      ) : (
        <div className="admin-section">
          {/* Filters */}
          <div className="filters-section">
            <div className="search-input">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search by action, user, or target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
                <option value="all">All Actions</option>
                <option value="User Created">User Created</option>
                <option value="Product Updated">Product Updated</option>
                <option value="Order Refunded">Order Refunded</option>
                <option value="User Promoted">User Promoted</option>
                <option value="Settings Changed">Settings Changed</option>
              </select>

              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />

              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />

              <button className="download-btn" onClick={downloadLogs}>
                <FiDownload /> Export CSV
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>By</th>
                  <th>Target</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>#{log.id}</td>
                      <td><span className={`action-badge action-${log.action.replace(/\s+/g, '-').toLowerCase()}`}>{log.action}</span></td>
                      <td>{log.by}</td>
                      <td><code>{log.target}</code></td>
                      <td>{log.details}</td>
                      <td>{log.timestamp}</td>
                      <td><code>{log.ipAddress}</code></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No audit logs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Stats */}
          <div className="stats-info">
            <p>Total Logs: <strong>{filteredLogs.length}</strong> | Showing: <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
