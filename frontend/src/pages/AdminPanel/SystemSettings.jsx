import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function SystemSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'AAXOMS',
    siteDescription: 'Premium Fashion & Accessories',
    email: 'support@aaxoms.com',
    phone: '+92-300-1234567',
    maintenanceMode: false,
  });

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const saveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="admin-container">
      <div className="admin-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <h1>⚙️ System Settings</h1>
        <p>Configure website and system settings</p>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
            🌐 General
          </button>
          <button className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>
            💳 Payment
          </button>
          <button className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`} onClick={() => setActiveTab('email')}>
            📧 Email
          </button>
          <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            🔒 Security
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="setting-field">
                <label>Site Name</label>
                <input type="text" value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} />
              </div>
              <div className="setting-field">
                <label>Description</label>
                <textarea value={settings.siteDescription} onChange={(e) => handleChange('siteDescription', e.target.value)} rows="3" />
              </div>
              <div className="setting-field">
                <label>Support Email</label>
                <input type="email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} />
              </div>
              <div className="setting-field">
                <label>Support Phone</label>
                <input type="tel" value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              </div>
              <div className="setting-field">
                <label><input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => handleChange('maintenanceMode', e.target.checked)} /> Enable Maintenance Mode</label>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="settings-section">
              <h2>Payment Methods</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <h4>💳 Credit Card</h4>
                  <p>Stripe</p>
                  <span className="badge success">Active</span>
                </div>
                <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <h4>🏦 Bank Transfer</h4>
                  <p>Direct Transfer</p>
                  <span className="badge success">Active</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="settings-section">
              <h2>Email Configuration</h2>
              <div className="setting-field">
                <label>Email Service</label>
                <select><option>Gmail SMTP</option><option>SendGrid</option></select>
              </div>
              <div className="setting-field">
                <label>From Email</label>
                <input type="email" defaultValue="noreply@aaxoms.com" />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="security-features">
                <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  <h4>🔐 Two-Factor Authentication</h4>
                  <span className="badge warning">Disabled</span>
                </div>
                <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  <h4>📝 Audit Logs</h4>
                  <span className="badge success">Enabled</span>
                </div>
                <div style={{ padding: '12px 0' }}>
                  <h4>🔒 SSL/TLS</h4>
                  <span className="badge success">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-footer">
        <button className="action-btn" onClick={saveSettings} style={{ backgroundColor: '#4CAF50' }}>
          <FiSave /> Save Settings
        </button>
      </div>
    </div>
  );
}

export default SystemSettings;
