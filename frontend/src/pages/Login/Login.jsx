// pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import '../auth/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '1234567890.apps.googleusercontent.com',
          callback: handleGoogleSignIn
        });
        
        // Render the button
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with'
          });
        }
      }
    };
    
    // Check if script is loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for script to load
      const checkGoogleInterval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(checkGoogleInterval);
        }
      }, 100);
      
      return () => clearInterval(checkGoogleInterval);
    }
  }, []);

  const handleGoogleSignIn = async (response) => {
    setIsLoading(true);
    setError('');
    
    try {
      const user = await googleAuth(response.credential);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      toast.success(`🎉 Welcome back, ${user?.name || 'User'}!`, {
        position: 'bottom-right',
        autoClose: 2000
      });

      setTimeout(() => {
        if (user?.role === 'super_admin') {
          navigate('/super-admin', { replace: true });
        } else if (user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 500);
    } catch (err) {
      const errorMsg = err.message || 'Google login failed. Please try again.';
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`, {
        position: 'bottom-right',
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const user = await login(email, password);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Toast notification for successful login
      toast.success(`🎉 Welcome back, ${user?.name || 'User'}!`, {
        position: 'bottom-right',
        autoClose: 2000
      });

      // Redirect based on exact role match
      // IMPORTANT: Check super_admin FIRST before admin
      setTimeout(() => {
        if (user?.role === 'super_admin') {
          navigate('/super-admin', { replace: true });
        } else if (user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 500);
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      
      // Toast error notification
      toast.error(`❌ ${errorMsg}`, {
        position: 'bottom-right',
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };



  return (
    <>
      <Navbar alwaysSolid />
      
      <main className="auth-page">
        <div className="auth-page__container">
          <div className="auth-page__card">
            <h1 className="auth-page__title">LOGIN</h1>
            <p className="auth-page__subtitle">Welcome back! Please enter your details.</p>

            {error && <div className="auth-page__error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-page__form">
              <div className="auth-page__field">
                <label>EMAIL</label>
                <div className="auth-page__input-wrapper">
                  <FiMail className="auth-page__input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="auth-page__field">
                <label>PASSWORD</label>
                <div className="auth-page__input-wrapper">
                  <FiLock className="auth-page__input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-page__toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="auth-page__options">
                <label className="auth-page__checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="auth-page__forgot">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="auth-page__submit"
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>

            <div className="auth-page__divider">
              <span>OR</span>
            </div>

            {/* Demo Accounts Section */}
            <div className="demo-accounts">
              <p className="demo-accounts__title">Demo Accounts (For Testing)</p>
              <div className="demo-accounts__list">
                <button
                  type="button"
                  className="demo-account customer-demo"
                  onClick={() => useDemoAccount('customer@example.com', 'customer123')}
                >
                  <span className="demo-account__label">👤 Customer</span>
                  <small>customer@example.com</small>
                </button>
                <button
                  type="button"
                  className="demo-account admin-demo"
                  onClick={() => useDemoAccount('admin@example.com', 'admin123')}
                >
                  <span className="demo-account__label">👨‍💼 Admin</span>
                  <small>admin@example.com</small>
                </button>
                <button
                  type="button"
                  className="demo-account super-admin-demo"
                  onClick={() => useDemoAccount('super@example.com', 'super123')}
                >
                  <span className="demo-account__label">👑 Super Admin</span>
                  <small>super@example.com</small>
                </button>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <div id="google-signin-button" />
            </div>

            <p className="auth-page__switch">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Login;