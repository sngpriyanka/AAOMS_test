// pages/Contact/Contact.jsx
import React, { useState } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock,
  FiMessageSquare,
  FiSend,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    orderNumber: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', orderNumber: '', message: '' });
    }, 1500);
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email Us',
      details: ['support@aaoms.com', 'orders@aaoms.com'],
      action: 'mailto:support@aaoms.com',
      color: '#ea4335'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      details: ['+91 98765 43210', 'Mon-Sat, 10AM-7PM'],
      action: 'tel:+919876543210',
      color: '#34a853'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      details: ['+91 98765 43210', 'Quick responses'],
      action: 'https://wa.me/919876543210',
      color: '#25d366'
    },
    {
      icon: FiMapPin,
      title: 'Visit Us',
      details: ['123 Fashion Street', 'Mumbai, MH 400001'],
      action: 'https://maps.google.com',
      color: '#4285f4'
    }
  ];

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the order number sent to your email. Visit our Track Order page, enter your order number and email address to see real-time shipping updates.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 15-day easy return policy. Items must be unused, unwashed, and have all original tags attached. Innerwear cannot be returned once used.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days within India. Express shipping (available in select cities) delivers in 2-3 business days. Free shipping on orders above Rs.999.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping typically takes 10-15 business days. Customs duties and taxes may apply based on your country.'
    },
    {
      question: 'How do I exchange a product for a different size?',
      answer: 'To exchange a product, initiate a return from your account or contact us. Once we receive the original item, we\'ll ship the new size. Exchanges are subject to availability.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, Paytm, PhonePe, and Cash on Delivery (COD). COD is available for orders up to Rs.10,000.'
    }
  ];

  const socialLinks = [
    { icon: FaInstagram, url: 'https://instagram.com/aaoms', label: 'Instagram' },
    { icon: FaFacebookF, url: 'https://facebook.com/aaoms', label: 'Facebook' },
    { icon: FaTwitter, url: 'https://twitter.com/aaoms', label: 'Twitter' }
  ];

  return (
    <>
      <Navbar alwaysSolid />
      
      <main className="contact">
        {/* Hero Section */}
        <section className="contact__hero">
          <div className="contact__hero-content">
            <h1>GET IN TOUCH</h1>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </section>

        <div className="contact__container">
          {/* Contact Cards */}
          <section className="contact__cards">
            {contactInfo.map((info, index) => (
              <a 
                key={index} 
                href={info.action}
                target={info.action.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="contact__card"
              >
                <div className="contact__card-icon" style={{ backgroundColor: `${info.color}15`, color: info.color }}>
                  <info.icon />
                </div>
                <h3>{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </a>
            ))}
          </section>

          {/* Main Content */}
          <div className="contact__main">
            {/* Contact Form */}
            <section className="contact__form-section">
              <div className="contact__form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              {isSubmitted ? (
                <div className="contact__success">
                  <div className="contact__success-icon">
                    <FiMessageSquare />
                  </div>
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setIsSubmitted(false)}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact__form">
                  <div className="contact__form-row">
                    <div className="contact__form-field">
                      <label>NAME *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="contact__form-field">
                      <label>EMAIL *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="contact__form-row">
                    <div className="contact__form-field">
                      <label>PHONE</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="contact__form-field">
                      <label>SUBJECT *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Inquiry</option>
                        <option value="return">Return / Exchange</option>
                        <option value="product">Product Question</option>
                        <option value="shipping">Shipping Information</option>
                        <option value="feedback">Feedback</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {formData.subject === 'order' && (
                    <div className="contact__form-field">
                      <label>ORDER NUMBER</label>
                      <input
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        placeholder="e.g., BT-2024-78945"
                      />
                    </div>
                  )}

                  <div className="contact__form-field">
                    <label>MESSAGE *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows="6"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="contact__submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      'SENDING...'
                    ) : (
                      <>
                        <FiSend /> SEND MESSAGE
                      </>
                    )}
                  </button>
                </form>
              )}
            </section>

            {/* FAQ Section */}
            <section className="contact__faq-section">
              <div className="contact__faq-header">
                <h2>Frequently Asked Questions</h2>
                <p>Find quick answers to common questions</p>
              </div>

              <div className="contact__faq-list">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`contact__faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                  >
                    <button 
                      className="contact__faq-question"
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{faq.question}</span>
                      {expandedFaq === index ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    <div className="contact__faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Store Info & Social */}
          <section className="contact__info-section">
            <div className="contact__store-hours">
              <h3><FiClock /> Store Hours</h3>
              <ul>
                <li>
                  <span>Monday - Friday</span>
                  <span>10:00 AM - 8:00 PM</span>
                </li>
                <li>
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li>
                  <span>Sunday</span>
                  <span>11:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>

            <div className="contact__social">
              <h3>Follow Us</h3>
              <p>Stay updated with our latest collections</p>
              <div className="contact__social-links">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>

            <div className="contact__map">
              <h3>Find Us</h3>
              <div className="contact__map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.7849542789!2d72.82548!3d18.9387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU2JzE5LjMiTiA3MsKwNDknMzEuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                />
              </div>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact__directions-btn"
              >
                <FiMapPin /> Get Directions
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Contact;