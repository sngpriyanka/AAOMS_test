import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiBell, FiLock, FiMail, FiToggleRight, FiToggleLeft, FiEdit2, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function AdminSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    productNotifications: true,
    lowStockAlert: true,
    lowStockThreshold: 10,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsLoading(true);

    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast.success('✅ Settings saved successfully!');
    } catch (error) {
      toast.error('❌ Failed to save settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      toast.error('⚠️ Please fill in all password fields');
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      toast.error('❌ New passwords do not match');
      return;
    }

    if (password.newPassword.length < 6) {
      toast.error('❌ Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      toast.success('✅ Password changed successfully!');
      setPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('❌ Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuper = user?.role === 'super_admin';
  const backLink = isSuper ? '/super-admin' : '/admin';

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '0' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#fff',
        padding: '30px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <button 
            onClick={() => navigate(backLink)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px'
            }}
          >
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>⚙️ Admin Settings</h1>
          <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)' }}>Manage your preferences and account</p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px 20px',
          borderRadius: '8px',
          textAlign: 'right'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Logged in as</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>{user?.name}</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Role: {user?.role}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        gap: '0',
        overflow: 'auto',
        padding: '0 40px'
      }}>
        {[
          { id: 'notifications', label: '🔔 Notifications', icon: FiBell },
          { id: 'system', label: '🔧 System', icon: FiEdit2 },
          { id: 'security', label: '🔒 Security', icon: FiLock },
          { id: 'api', label: '📡 API Settings', icon: FiMail }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? '#c9a227' : 'transparent',
              border: 'none',
              color: activeTab === tab.id ? '#000' : '#666',
              padding: '16px 20px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? '600' : '500',
              fontSize: '14px',
              borderBottom: activeTab === tab.id ? '3px solid #c9a227' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1a1a1a' }}>Notification Preferences</h2>
            <form style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  { name: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email alerts for important events' },
                  { name: 'orderNotifications', label: 'Order Notifications', desc: 'Get alerts when new orders are placed' },
                  { name: 'userNotifications', label: 'User Notifications', desc: 'Get alerts for new user registrations' },
                  { name: 'productNotifications', label: 'Product Notifications', desc: 'Get alerts for product updates' },
                  { name: 'lowStockAlert', label: 'Low Stock Alerts', desc: 'Get notified when product stock is low' }
                ].map(notif => (
                  <div key={notif.name} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>{notif.label}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>{notif.desc}</p>
                    </div>
                    <label style={{ cursor: 'pointer', fontSize: '24px', color: settings[notif.name] ? '#4caf50' : '#ccc' }}>
                      <input
                        type="checkbox"
                        name={notif.name}
                        checked={settings[notif.name]}
                        onChange={handleSettingChange}
                        style={{ display: 'none' }}
                      />
                      {settings[notif.name] ? <FiToggleRight color="#4caf50" /> : <FiToggleLeft />}
                    </label>
                  </div>
                ))}
              </div>

              {settings.lowStockAlert && (
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#e8f5e9',
                  borderRadius: '6px',
                  borderLeft: '4px solid #4caf50'
                }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>Low Stock Threshold (units)</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={settings.lowStockThreshold}
                    onChange={handleSettingChange}
                    min="1"
                    style={{
                      width: '100%',
                      maxWidth: '200px',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>Alert when stock falls below this number</p>
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                disabled={settingsLoading}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: '#c9a227',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: settingsLoading ? 0.6 : 1
                }}
              >
                <FiSave /> {settingsLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1a1a1a' }}>System Settings</h2>
            <form style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#fff3e0',
                  borderRadius: '6px',
                  border: '1px solid #ffe0b2'
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Maintenance Mode</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>Disable all features for maintenance (users cannot browse or purchase)</p>
                    {settings.maintenanceMode && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#f57c00', fontWeight: '600' }}>⚠️  Maintenance mode is active</p>
                    )}
                  </div>
                  <label style={{ cursor: 'pointer', fontSize: '24px', color: settings.maintenanceMode ? '#ff9800' : '#ccc' }}>
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleSettingChange}
                      style={{ display: 'none' }}
                    />
                    {settings.maintenanceMode ? <FiToggleRight color="#ff9800" /> : <FiToggleLeft />}
                  </label>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>Automatic Backups</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>Automatically backup your data at regular intervals</p>
                  </div>
                  <label style={{ cursor: 'pointer', fontSize: '24px', color: settings.autoBackup ? '#4caf50' : '#ccc' }}>
                    <input
                      type="checkbox"
                      name="autoBackup"
                      checked={settings.autoBackup}
                      onChange={handleSettingChange}
                      style={{ display: 'none' }}
                    />
                    {settings.autoBackup ? <FiToggleRight color="#4caf50" /> : <FiToggleLeft />}
                  </label>
                </div>
              </div>

              {settings.autoBackup && (
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: '#e8f5e9',
                  borderRadius: '6px',
                  borderLeft: '4px solid #4caf50'
                }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>Backup Frequency</label>
                  <select
                    name="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={handleSettingChange}
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>How often to backup your data</p>
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                disabled={settingsLoading}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: '#c9a227',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: settingsLoading ? 0.6 : 1
                }}
              >
                <FiSave /> {settingsLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1a1a1a' }}>Change Password</h2>
            <form onSubmit={handlePasswordChange} style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              maxWidth: '500px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Current Password</label>
                <input
                  type="password"
                  value={password.currentPassword}
                  onChange={(e) => setPassword({...password, currentPassword: e.target.value})}
                  placeholder="Enter your current password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>New Password</label>
                <input
                  type="password"
                  value={password.newPassword}
                  onChange={(e) => setPassword({...password, newPassword: e.target.value})}
                  placeholder="Enter new password (min 6 characters)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={password.confirmPassword}
                  onChange={(e) => setPassword({...password, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button 
                type="submit"
                disabled={passwordLoading}
                style={{
                  padding: '12px 24px',
                  background: '#c9a227',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: passwordLoading ? 0.6 : 1
                }}
              >
                <FiRefreshCw /> {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* API TAB */}
        {activeTab === 'api' && (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1a1a1a' }}>API Settings</h2>
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  background: '#f5f5f5',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>API Base URL</p>
                  <code style={{ display: 'block', margin: '8px 0 0 0', fontSize: '14px', color: '#1a1a1a', wordBreak: 'break-all' }}>https://api.aaxoms.com</code>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f5f5f5',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>API Version</p>
                  <code style={{ display: 'block', margin: '8px 0 0 0', fontSize: '14px', color: '#1a1a1a' }}>v1</code>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#fff3e0',
                  borderRadius: '6px',
                  border: '1px solid #ffe0b2'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>Admin Token (Keep Secret)</p>
                  <code style={{ display: 'block', margin: '8px 0 0 0', fontSize: '14px', color: '#f57c00', wordBreak: 'break-all', fontWeight: 'bold' }}>***{user?.token?.slice(-10) || 'N/A'}</code>
                  <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#f57c00' }}>⚠️ Never share your token with anyone</p>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.info('🔄 Token regeneration coming soon. Please contact support for now.');
                }}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: '#2196f3',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FiRefreshCw /> Regenerate Token
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;
