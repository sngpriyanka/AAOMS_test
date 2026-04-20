// pages/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaChevronDown, 
  FaChevronLeft, 
  FaChevronRight,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaShareAlt,
  FaTimes,
  FaThumbsUp,
  FaCheck,
  FaCamera
} from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './ProductDetail.css';

import { products, getRelatedProducts, getRecentlyViewed } from '../../data/productsData';

// ==================== SIZE CHART DATA ====================
const sizeChartData = {
  'T-SHIRTS': [
    { size: 'XS', chest: '36"', shoulder: '16"', length: '25"' },
    { size: 'S', chest: '38"', shoulder: '17"', length: '26"' },
    { size: 'M', chest: '40"', shoulder: '18"', length: '27"' },
    { size: 'L', chest: '42"', shoulder: '19"', length: '28"' },
    { size: 'XL', chest: '44"', shoulder: '20"', length: '29"' },
    { size: '2XL', chest: '46"', shoulder: '21"', length: '30"' },
    { size: '3XL', chest: '48"', shoulder: '22"', length: '31"' },
    { size: '4XL', chest: '50"', shoulder: '23"', length: '32"' },
    { size: '5XL', chest: '52"', shoulder: '24"', length: '33"' },
  ],
  'SHORTS': [
    { size: 'XS', waist: '28"', hip: '36"', length: '17"' },
    { size: 'S', waist: '30"', hip: '38"', length: '18"' },
    { size: 'M', waist: '32"', hip: '40"', length: '19"' },
    { size: 'L', waist: '34"', hip: '42"', length: '20"' },
    { size: 'XL', waist: '36"', hip: '44"', length: '21"' },
    { size: '2XL', waist: '38"', hip: '46"', length: '22"' },
  ]
};

// ==================== SIZE CHART DRAWER ====================
const SizeChartDrawer = ({ isOpen, onClose, category = 'T-SHIRTS' }) => {
  const data = sizeChartData[category] || sizeChartData['T-SHIRTS'];
  const headers = category === 'SHORTS' 
    ? ['SIZE', 'WAIST', 'HIP', 'LENGTH'] 
    : ['SIZE', 'CHEST', 'SHOULDER', 'LENGTH'];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`sc-drawer-overlay ${isOpen ? 'sc-drawer-overlay--visible' : ''}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`sc-drawer ${isOpen ? 'sc-drawer--open' : ''}`}>
        {/* Close Button */}
        <button className="sc-drawer__close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Title */}
        <h2 className="sc-drawer__title">SIZE CHART: {category}</h2>

        {/* Table */}
        <div className="sc-drawer__table-wrap">
          <table className="sc-drawer__table">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.size}</td>
                  {category === 'SHORTS' ? (
                    <>
                      <td>{row.waist}</td>
                      <td>{row.hip}</td>
                      <td>{row.length}</td>
                    </>
                  ) : (
                    <>
                      <td>{row.chest}</td>
                      <td>{row.shoulder}</td>
                      <td>{row.length}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// ==================== WRITE REVIEW MODAL ====================
const WriteReviewModal = ({ productName, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', rating: 0, title: '', review: '',
    size: '', images: [], recommend: true
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls].slice(0, 5) }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.rating === 0) newErrors.rating = 'Please select a rating';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.review.trim()) newErrors.review = 'Review is required';
    else if (formData.review.length < 20) newErrors.review = 'Minimum 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="rv-modal-overlay" onClick={onClose}>
      <div className="rv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rv-modal-header">
          <h2>WRITE A REVIEW</h2>
          <button className="rv-modal-close" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="rv-modal-product">
          <span>Reviewing: </span><strong>{productName}</strong>
        </div>
        <form onSubmit={handleSubmit} className="rv-form">
          {/* Rating */}
          <div className="rv-field">
            <label>Your Rating *</label>
            <div className="rv-rating-input">
              {[1,2,3,4,5].map(star => (
                <button key={star} type="button" className="rv-rating-star"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}>
                  {star <= (hoverRating || formData.rating) ? <FaStar className="rv-star-filled" /> : <FaRegStar />}
                </button>
              ))}
              <span className="rv-rating-text">
                {formData.rating > 0 && ['','Poor','Fair','Good','Very Good','Excellent'][formData.rating]}
              </span>
            </div>
            {errors.rating && <span className="rv-error">{errors.rating}</span>}
          </div>
          {/* Title */}
          <div className="rv-field">
            <label htmlFor="rv-title">Review Title *</label>
            <input type="text" id="rv-title" name="title" value={formData.title}
              onChange={handleChange} placeholder="Sum up your review" maxLength={100} />
            {errors.title && <span className="rv-error">{errors.title}</span>}
          </div>
          {/* Review */}
          <div className="rv-field">
            <label htmlFor="rv-review">Your Review *</label>
            <textarea id="rv-review" name="review" value={formData.review}
              onChange={handleChange} placeholder="What did you like or dislike?" rows={5} maxLength={1000} />
            <span className="rv-char-count">{formData.review.length}/1000</span>
            {errors.review && <span className="rv-error">{errors.review}</span>}
          </div>
          {/* Size */}
          <div className="rv-field">
            <label>Size Purchased (Optional)</label>
            <div className="rv-size-btns">
              {sizes.map(size => (
                <button key={size} type="button"
                  className={`rv-size-btn ${formData.size === size ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, size }))}>{size}</button>
              ))}
            </div>
          </div>
          {/* Photos */}
          <div className="rv-field">
            <label>Add Photos (Optional)</label>
            <div className="rv-photo-upload">
              <label className="rv-photo-btn">
                <FaCamera /><span>Add Photos</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              <span className="rv-photo-hint">Up to 5 photos</span>
            </div>
            {formData.images.length > 0 && (
              <div className="rv-photo-preview">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="rv-photo-item">
                    <img src={img} alt={`Upload ${idx+1}`} />
                    <button type="button" onClick={() => removeImage(idx)} className="rv-photo-remove"><FaTimes /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Name & Email */}
          <div className="rv-field-row">
            <div className="rv-field">
              <label htmlFor="rv-name">Your Name *</label>
              <input type="text" id="rv-name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
              {errors.name && <span className="rv-error">{errors.name}</span>}
            </div>
            <div className="rv-field">
              <label htmlFor="rv-email">Email *</label>
              <input type="email" id="rv-email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
              {errors.email && <span className="rv-error">{errors.email}</span>}
            </div>
          </div>
          {/* Recommend */}
          <div className="rv-field rv-checkbox">
            <label>
              <input type="checkbox" name="recommend" checked={formData.recommend} onChange={handleChange} />
              <span>I would recommend this product</span>
            </label>
          </div>
          {/* Actions */}
          <div className="rv-actions">
            <button type="button" className="rv-btn-cancel" onClick={onClose}>CANCEL</button>
            <button type="submit" className="rv-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, isItemInCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('S');
  const [showCustomizeDropdown, setShowCustomizeDropdown] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerLogo, setCustomerLogo] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = products.find(p => p.id === parseInt(id) || p.slug === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes?.[0] || 'S');
      setRelatedProducts(getRelatedProducts(foundProduct.category, foundProduct.id));
      setRecentlyViewed(getRecentlyViewed(foundProduct.id));
      loadReviews(foundProduct.id);
      
      // Check if product is in wishlist
      if (isAuthenticated()) {
        checkWishlistStatus(foundProduct.id);
      } else {
        setIsInWishlist(false);
      }
    }
    setLoading(false);
  }, [id]);

const loadReviews = (productId) => {
  const saved = localStorage.getItem(`reviews_${productId}`);

  if (saved) {
    setReviews(JSON.parse(saved));
  } else {
    setReviews([]); 
  }
};

const checkWishlistStatus = async (productId) => {
  try {
    const response = await api.get('/wishlist');
    if (response.data.success && response.data.data?.items) {
      const isInWish = response.data.data.items.some(
        item => item.productId === productId
      );
      setIsInWishlist(isInWish);
    }
  } catch (error) {
    console.error('Error checking wishlist status:', error);
  }
};

  const reviewStats = () => {
    if (reviews.length === 0) return { average: 0, total: 0, distribution: {5:0,4:0,3:0,2:0,1:0} };
    const dist = {5:0,4:0,3:0,2:0,1:0};
    let total = 0;
    reviews.forEach(r => { dist[r.rating]++; total += r.rating; });
    return { average: (total / reviews.length).toFixed(1), total: reviews.length, distribution: dist };
  };
  const stats = reviewStats();

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    if (filterRating > 0) filtered = filtered.filter(r => r.rating === filterRating);
    switch (sortBy) {
      case 'newest': filtered.sort((a,b) => new Date(b.date) - new Date(a.date)); break;
      case 'oldest': filtered.sort((a,b) => new Date(a.date) - new Date(b.date)); break;
      case 'highest': filtered.sort((a,b) => b.rating - a.rating); break;
      case 'lowest': filtered.sort((a,b) => a.rating - b.rating); break;
      case 'helpful': filtered.sort((a,b) => b.helpful - a.helpful); break;
      default: break;
    }
    return filtered;
  };
  const filteredReviews = getFilteredReviews();
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  const renderStars = (rating, size = 'small') => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= full) stars.push(<FaStar key={i} className={`rv-star rv-star--filled rv-star--${size}`} />);
      else if (i === full + 1 && half) stars.push(<FaStarHalfAlt key={i} className={`rv-star rv-star--filled rv-star--${size}`} />);
      else stars.push(<FaRegStar key={i} className={`rv-star rv-star--${size}`} />);
    }
    return stars;
  };

  const handleHelpful = (reviewId) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r);
    setReviews(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
  };

  const handleReviewSubmit = (newReview) => {
    const review = { ...newReview, id: Date.now(), date: new Date().toISOString().split('T')[0], verified: true, helpful: 0 };
    const updated = [review, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
    setIsWriteReviewOpen(false);
  };

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      // Check if product with selected size is already in cart
      const isInCart = (() => {
        try {
          const savedCart = localStorage.getItem('cart');
          if (!savedCart) return false;
          const cartItems = JSON.parse(savedCart);
          return cartItems.some(item => item.id === product.id && item.size === selectedSize);
        } catch (err) {
          console.error('Error checking cart:', err);
          return false;
        }
      })();

      if (isInCart) {
        toast.error('This product with selected size is already in cart', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        return;
      }

      addToCart(product, selectedSize);
      toast.success(`${product.name} added to cart!`, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated()) {
      toast.warning('Please login to add to wishlist');
      return;
    }

    if (!product || !product.id) {
      toast.error('Invalid product');
      return;
    }

    setWishlistLoading(true);
    try {
      const response = await api.post('/wishlist/add', { 
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images ? product.images[0] : ''
      });
      
      if (response.data.success) {
        setIsInWishlist(true);
        toast.success(`${product.name} added to wishlist!`);
      } else {
        toast.error(response.data.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      if (error.response?.data?.message?.includes('already in wishlist')) {
        setIsInWishlist(true);
        toast.info('Already in your wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url: window.location.href }); }
      catch (err) { console.log('Share cancelled'); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const getSizeChartCategory = () => {
    if (product?.category?.toLowerCase().includes('short')) return 'SHORTS';
    return 'T-SHIRTS';
  };

  const isCustomizableProduct = () => {
    if (!product) return false;
    const category = product.category?.toLowerCase() || '';
    return category.includes('apron') || category.includes('scrub');
  };

  if (loading) {
    return (
      <><Navbar alwaysSolid /><div className="pdp-loading"><div className="pdp-loading__spinner"></div></div><Footer /></>
    );
  }

  if (!product) {
    return (
      <><Navbar alwaysSolid /><div className="pdp-not-found"><h1>Product Not Found</h1><Link to="/">Back to Home</Link></div><Footer /></>
    );
  }

  return (
    <>
      <Navbar alwaysSolid />
      
      <main className="pdp">
        {/* ===== PRODUCT MAIN ===== */}
        <section className="pdp__main">
          {/* Left - Gallery */}
          <div className="pdp__gallery">
            <div className="pdp__image-container">
              <img src={product.images[currentImageIndex]} alt={product.name} className="pdp__image" />
              {product.images.length > 1 && (
                <>
                  <button className="pdp__nav pdp__nav--prev" onClick={handlePrevImage}><FaChevronLeft /></button>
                  <button className="pdp__nav pdp__nav--next" onClick={handleNextImage}><FaChevronRight /></button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="pdp__dots-wrap">
                {product.images.map((_, idx) => (
                  <button key={idx} className={`pdp__dot ${idx === currentImageIndex ? 'active' : ''}`} onClick={() => setCurrentImageIndex(idx)} />
                ))}
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div className="pdp__info">
            <span className="pdp__brand">BOMBAY TROOPER</span>
            <h1 className="pdp__title">{product.name.toUpperCase()}</h1>
            <div className="pdp__price-row">
              <span className="pdp__price">Rs. {product.price.toLocaleString()}.00</span>
            </div>
            <span className="pdp__tax">MRP INCL. OF TAXES</span>

            {/* Size */}
            <div className="pdp__size-section">
              <div className="pdp__size-header">
                <span className="pdp__size-label">SIZE: {selectedSize}</span>
                <button className="pdp__size-chart-btn" onClick={() => setIsSizeChartOpen(true)}>
                  SIZE CHART
                </button>
              </div>
              <div className="pdp__sizes">
                {product.sizes?.map(size => (
                  <button key={size} className={`pdp__size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}>{size}</button>
                ))}
              </div>
            </div>

            {/* Customize Section for Aprons & Scrubs */}
            {isCustomizableProduct() && (
              <div className="pdp__customize-section">
                <button className="pdp__customize-btn" onClick={() => setShowCustomizeDropdown(!showCustomizeDropdown)}>
                  CUSTOMIZE <FaChevronDown className={showCustomizeDropdown ? 'rotated' : ''} />
                </button>
                
                {showCustomizeDropdown && (
                  <div className="pdp__customize-dropdown">
                    <label className="pdp__customize-label">Personalize Your Item (Optional):</label>

                    {/* Name Input */}
                    <div className="pdp__input-field">
                      <label>Enter Name (Optional):</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter name to embroider"
                        maxLength={30}
                      />
                      <span className="pdp__char-count">{customerName.length}/30</span>
                    </div>

                    {/* Logo Upload */}
                    <div className="pdp__input-field">
                      <label>Upload Logo (Optional):</label>
                      <label className="pdp__logo-upload">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              const logoUrl = URL.createObjectURL(e.target.files[0]);
                              setCustomerLogo(logoUrl);
                            }
                          }}
                        />
                        <span>{customerLogo ? '✓ Logo uploaded' : 'Click to upload logo'}</span>
                      </label>
                      {customerLogo && (
                        <div className="pdp__logo-preview">
                          <img src={customerLogo} alt="Logo preview" />
                        </div>
                      )}
                    </div>

                    {/* Save Button */}
                    <button 
                      className="pdp__save-customize-btn"
                      onClick={() => {
                        setShowCustomizeDropdown(false);
                      }}
                      disabled={!customerName && !customerLogo}
                    >
                      SAVE & CONTINUE
                    </button>
                  </div>
                )}
                
                {/* Show customization summary if selected */}
                {(customerName || customerLogo) && !showCustomizeDropdown && (
                  <div className="pdp__customize-summary">
                    <div className="pdp__summary-item">
                      {customerName && (
                        <span><strong>Name:</strong> {customerName}</span>
                      )}
                      {customerLogo && (
                        <span><strong>Logo:</strong> ✓ Uploaded</span>
                      )}
                    </div>
                    <button 
                      className="pdp__edit-customize-btn"
                      onClick={() => setShowCustomizeDropdown(true)}
                    >
                      EDIT
                    </button>
                  </div>
                )}
              </div>
            )}

            <button className="pdp__add-to-cart" onClick={handleAddToCart}>ADD TO CART</button>
            
            <button 
              className={`pdp__wishlist-btn ${isInWishlist ? 'pdp__wishlist-btn--active' : ''}`}
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
              title={isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            >
              <FiHeart size={20} />
              <span>{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {/* Description */}
            <div className="pdp__description">
              <p className="pdp__tagline">{product.description?.tagline}</p>
              <p className="pdp__desc-text">
                THE <span className="highlight">TROOPER ACTIVE T-SHIRT</span> IS BUILT FOR MOVEMENT-HEAVY DAYS, FROM INTENSE GYM SESSIONS TO <span className="highlight">HIGH-ENERGY MATCHES OF PICKLEBALL, PADEL, OR BADMINTON.</span>
              </p>
              <p className="pdp__desc-text">
                MADE WITH <span className="highlight">TEXTURED MESH PERFORMANCE FABRIC</span>, IT PROMOTES SUPERIOR AIRFLOW AND <span className="highlight">WICKS AWAY SWEAT INSTANTLY</span>, SO THE TEE NEVER STICKS TO YOUR SKIN.
              </p>
              <p className="pdp__desc-link">
                <Link to={`/collections/${product.category}`}>CLICK HERE</Link> TO VIEW THE ENTIRE COLLECTION.
              </p>
            </div>

            <p className="pdp__sku">SKU: {product.sku}</p>

            {/* Accordion */}
            <div className="pdp__accordion">
              <button className="pdp__accordion-toggle" onClick={() => setIsProductInfoOpen(!isProductInfoOpen)}>
                <span><HiOutlineClipboardList className="pdp__accordion-icon" /> PRODUCT INFORMATION</span>
                <FaChevronDown className={`pdp__accordion-arrow ${isProductInfoOpen ? 'open' : ''}`} />
              </button>
              {isProductInfoOpen && (
                <div className="pdp__accordion-content">
                  <table><tbody>
                    {product.productInfo?.map((info, idx) => (
                      <tr key={idx}><td>{info.label}</td><td>{info.value}</td></tr>
                    ))}
                  </tbody></table>
                </div>
              )}
            </div>

            <button className="pdp__share" onClick={handleShare}>SHARE <FaShareAlt /></button>
          </div>
        </section>

        {/* ===== REVIEWS ===== */}
        <section className="pdp__reviews-section">
          <h2 className="pdp__reviews-heading">CUSTOMER REVIEWS</h2>

          <div className="rv-summary">
            <div className="rv-summary__left">
              <span className="rv-summary__number">{stats.average}</span>
              <div className="rv-summary__stars">{renderStars(parseFloat(stats.average), 'medium')}</div>
              <span className="rv-summary__count">Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}</span>
            </div>
            <div className="rv-summary__middle">
              {[5,4,3,2,1].map(star => (
                <button key={star} className={`rv-dist-row ${filterRating === star ? 'active' : ''}`}
                  onClick={() => setFilterRating(filterRating === star ? 0 : star)}>
                  <span className="rv-dist-star">{star} ★</span>
                  <div className="rv-dist-bar">
                    <div className="rv-dist-fill" style={{ width: stats.total > 0 ? `${(stats.distribution[star]/stats.total)*100}%` : '0%' }} />
                  </div>
                  <span className="rv-dist-count">{stats.distribution[star]}</span>
                </button>
              ))}
            </div>
            <div className="rv-summary__right">
              <button className="rv-write-btn" onClick={() => setIsWriteReviewOpen(true)}>WRITE A REVIEW</button>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="rv-controls">
              <div className="rv-controls__left">
                <span className="rv-showing">Showing {displayedReviews.length} of {filteredReviews.length} reviews{filterRating > 0 && ` (${filterRating} star)`}</span>
                {filterRating > 0 && <button className="rv-clear-filter" onClick={() => setFilterRating(0)}>Clear filter</button>}
              </div>
              <div className="rv-controls__right">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          )}

          <div className="rv-list">
            {reviews.length === 0 ? (
              <div className="rv-empty">
                <div className="rv-empty__stars">{renderStars(0, 'large')}</div>
                <p>BE THE FIRST TO WRITE A REVIEW</p>
                <button onClick={() => setIsWriteReviewOpen(true)}>WRITE A REVIEW</button>
              </div>
            ) : (
              <>
                {displayedReviews.map(review => (
                  <div key={review.id} className="rv-card">
                    <div className="rv-card__header">
                      <div className="rv-card__stars">{renderStars(review.rating)}</div>
                      <span className="rv-card__date">{new Date(review.date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</span>
                    </div>
                    <h4 className="rv-card__title">{review.title}</h4>
                    <p className="rv-card__text">{review.review}</p>
                    {review.images?.length > 0 && (
                      <div className="rv-card__images">{review.images.map((img,idx) => <img key={idx} src={img} alt="" />)}</div>
                    )}
                    <div className="rv-card__footer">
                      <div className="rv-card__author">
                        <span className="rv-card__name">{review.name}</span>
                        {review.verified && <span className="rv-card__verified"><FaCheck /> Verified Purchase</span>}
                        {review.size && <span className="rv-card__size">Size: {review.size}</span>}
                      </div>
                      <button className="rv-card__helpful" onClick={() => handleHelpful(review.id)}>
                        <FaThumbsUp /> Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
                {filteredReviews.length > 3 && (
                  <button className="rv-show-more" onClick={() => setShowAllReviews(!showAllReviews)}>
                    {showAllReviews ? 'SHOW LESS' : `SHOW ALL ${filteredReviews.length} REVIEWS`}
                    <FaChevronDown className={showAllReviews ? 'rotated' : ''} />
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {/* ===== RELATED ===== */}
        <section className="pdp__related">
          <h3 className="pdp__section-title">YOU MAY ALSO LIKE</h3>
          <div className="pdp__products-grid">
            {relatedProducts.map(prod => (
              <Link to={`/product/${prod.slug}`} key={prod.id} className="pdp__product-card">
                <div className="pdp__product-image"><img src={prod.images[0]} alt={prod.name} /></div>
                <div className="pdp__product-info">
                  <h4 className="pdp__product-name">{prod.name}</h4>
                  <p className="pdp__product-price">Rs. {prod.price.toLocaleString()}.00</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== RECENTLY VIEWED ===== */}
        <section className="pdp__recently-viewed">
          <h3 className="pdp__section-title">RECENTLY VIEWED</h3>
          <div className="pdp__products-grid">
            {recentlyViewed.map(prod => (
              <Link to={`/product/${prod.slug}`} key={prod.id} className="pdp__product-card">
                <div className="pdp__product-image">
                  {prod.badge && <span className="pdp__product-badge">{prod.badge.text}</span>}
                  <img src={prod.images[0]} alt={prod.name} />
                </div>
                <div className="pdp__product-info">
                  <h4 className="pdp__product-name">{prod.name}</h4>
                  <p className="pdp__product-price">Rs. {prod.price.toLocaleString()}.00</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ===== SIZE CHART DRAWER ===== */}
      <SizeChartDrawer
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={getSizeChartCategory()}
      />

      {/* ===== WRITE REVIEW MODAL ===== */}
      {isWriteReviewOpen && (
        <WriteReviewModal
          productName={product.name}
          onClose={() => setIsWriteReviewOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      <Footer />
    </>
  );
};

export default ProductDetail;