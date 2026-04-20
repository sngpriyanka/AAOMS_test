// pages/Signup/Signup.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import '../auth/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, googleAuth } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '1234567890.apps.googleusercontent.com',
          callback: handleGoogleSignUp
        });
        
        // Render the button
        const buttonElement = document.getElementById('google-signup-button');
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

  const handleGoogleSignUp = async (response) => {
    setIsLoading(true);
    setError('');
    
    try {
      const user = await googleAuth(response.credential);
      
      toast.success(`🎉 Account created successfully!`, {
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
      const errorMsg = err.message || 'Google signup failed. Please try again.';
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`, {
        position: 'bottom-right',
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      toast.error(`⚠️ ${error}`, {
        position: 'bottom-right',
        autoClose: 3000
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      await signup(formData.email, formData.password, fullName);
      
      // Success toast
      toast.success(`🎉 Account created successfully! Please login to continue.`, {
        position: 'bottom-right',
        autoClose: 2000
      });

      // Redirect to login after toast
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 500);
    } catch (err) {
      const errorMsg = err.message || 'Failed to create account. Please try again.';
      setError(errorMsg);
      
      toast.error(`❌ ${errorMsg}`, {
        position: 'bottom-right',
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar alwaysSolid />
      
      <main className="auth-page auth-page--signup">
        <div className="auth-page__container">
          <div className="auth-page__card">
            <h1 className="auth-page__title">CREATE ACCOUNT</h1>
            <p className="auth-page__subtitle">Join the Trooper community today.</p>

            {error && <div className="auth-page__error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-page__form">
              <div className="auth-page__row">
                <div className="auth-page__field">
                  <label>FIRST NAME</label>
                  <div className="auth-page__input-wrapper">
                    <FiUser className="auth-page__input-icon" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      required
                    />
                  </div>
                </div>
                <div className="auth-page__field">
                  <label>LAST NAME</label>
                  <div className="auth-page__input-wrapper">
                    <FiUser className="auth-page__input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="auth-page__field">
                <label>EMAIL</label>
                <div className="auth-page__input-wrapper">
                  <FiMail className="auth-page__input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="auth-page__field">
                <label>PHONE NUMBER</label>
                <div className="auth-page__input-wrapper">
                  <FiPhone className="auth-page__input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    minLength={8}
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

              <div className="auth-page__field">
                <label>CONFIRM PASSWORD</label>
                <div className="auth-page__input-wrapper">
                  <FiLock className="auth-page__input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-page__toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <label className="auth-page__terms">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>
                  I agree to the <Link to="/terms">Terms & Conditions</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </span>
              </label>

              <button 
                type="submit" 
                className="auth-page__submit"
                disabled={isLoading}
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="auth-page__divider">
              <span>OR</span>
            </div>

            {/* Google Sign-In Button */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <div id="google-signup-button" />
            </div>

            <p className="auth-page__switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Signup;