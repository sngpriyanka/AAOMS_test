import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Special handling for admin/super_admin - use exact role matching
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div style={{ 
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
          <h1 style={{ color: '#d32f2f', marginBottom: '15px' }}>Access Denied</h1>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Admin panel access required.
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
            Your current role: <strong>{user?.role || 'user'}</strong>
          </p>
          <a href={user?.role === 'super_admin' ? '/super-admin' : '/'} style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#c9a227',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {user?.role === 'super_admin' ? 'Go to Super Admin Panel' : 'Go to Home'}
          </a>
        </div>
      </div>
    );
  }

  if (requiredRole === 'super_admin' && user?.role !== 'super_admin') {
    return (
      <div style={{ 
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
          <h1 style={{ color: '#d32f2f', marginBottom: '15px' }}>Access Denied</h1>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            Super Admin panel access required.
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
            Your current role: <strong>{user?.role || 'user'}</strong>
          </p>
          <a href={user?.role === 'admin' ? '/admin' : '/'} style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#c9a227',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {user?.role === 'admin' ? 'Go to Admin Panel' : 'Go to Home'}
          </a>
        </div>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div style={{ 
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
          <h1 style={{ color: '#d32f2f', marginBottom: '15px' }}>Access Denied</h1>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            You don't have permission to access this page.
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
            Your current role: <strong>{user?.role || 'user'}</strong>
          </p>
          <a href="/" style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#c9a227',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
