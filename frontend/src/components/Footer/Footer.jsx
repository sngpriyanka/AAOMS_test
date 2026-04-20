// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaInstagram, 
  FaFacebookF, 
  FaTwitter, 
  FaHeart, 
  FaCalendarAlt, 
  FaSmile, 
  FaQuestionCircle 
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Trust Badges Section */}
      <div className="footer__trust-section">
        <div className="footer__trust-container">
          <div className="footer__trust-badge">
            <div className="footer__trust-icon">
              <FaHeart />
            </div>
            <div className="footer__trust-content">
              <h4>TRUSTED BY 400K CUSTOMERS</h4>
              <p>Turning customers into loyal fans since 2019</p>
            </div>
          </div>

          <div className="footer__trust-badge">
            <div className="footer__trust-icon">
              <FaCalendarAlt />
            </div>
            <div className="footer__trust-content">
              <h4>EASY RETURNS</h4>
              <p>15-days no question asked returns</p>
            </div>
          </div>

          <div className="footer__trust-badge">
            <div className="footer__trust-icon">
              <FaSmile />
            </div>
            <div className="footer__trust-content">
              <h4>GUARANTEED HAPPINESS</h4>
              <p>Our top notch support is available Monday to Friday to address any concerns</p>
            </div>
          </div>

          <div className="footer__trust-badge">
            <div className="footer__trust-icon">
              <FaQuestionCircle />
            </div>
            <div className="footer__trust-content">
              <h4>GOT QUESTIONS?</h4>
              <p>Reach out to us on WhatsApp and we'd be delighted to help you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer__main">
        <div className="footer__container">
          <div className="footer__content">
            {/* Brand Section */}
            <div className="footer__brand">
              <div className="footer__logo">
                <img src="/images/logo.png" alt="AAOMS Logo" className="footer__logo-image" />
              </div>
              <p className="footer__description">
                AAOMS is a worldwide travel-inspired fashion and accessories design house since 2019, blending our love for nature with a commitment to sustainability. All while adding a dash of global wanderlust to your wardrobe.
              </p>
            </div>

            {/* Newsletter Section */}
            <div className="footer__newsletter">
              <h4 className="footer__title">JOIN THE AAOMS CLUB</h4>
              <p className="footer__newsletter-text">
                Be the first to see our new launches.
              </p>
              <form className="footer__newsletter-form">
                <input
                  type="email"
                  placeholder="E-Mail"
                  className="footer__newsletter-input"
                />
                <button type="submit" className="footer__newsletter-btn">
                  SUBSCRIBE
                </button>
              </form>
            </div>

            {/* Links Section */}
            <div className="footer__links-section">
              <ul className="footer__links">
                <li><Link to="/our-story">ABOUT</Link></li>
                <li><Link to="/privacy">PRIVACY POLICY</Link></li>
                <li><Link to="/terms">TERMS & CONDITIONS</Link></li>
                {/* <li><Link to="/track-order">TRACK ORDER</Link></li> */}
                <li><Link to="/account">MY ACCOUNT</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__container">
          <div className="footer__bottom-content">
            <div className="footer__bottom-left">
              <p className="footer__copyright">
                © 2024 - AAOMS ALL RIGHTS RESERVED
              </p>
              <div className="footer__payment">
                <img src="/images/esewa.png" alt="Esewa" className="footer__payment-esewa" />
                <img src="/images/khaltilogo.png" alt="Khalti" className="footer__payment-khalti" />
              </div>
            </div>

            <div className="footer__bottom-right">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;