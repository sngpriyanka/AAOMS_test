// components/CustomerReviews/CustomerReviews.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaStar, 
  FaRegStar, 
  FaStarHalfAlt,
  FaThumbsUp,
  FaCheck,
  FaTimes,
  FaCamera,
  FaChevronDown,
  FaFilter
} from 'react-icons/fa';
import './CustomerReviews.css';

const CustomerReviews = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load reviews from localStorage or use initial data
  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${productId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Sample reviews data
      const sampleReviews = [
        {
          id: 1,
          name: 'Rahul M.',
          email: 'rahul@example.com',
          rating: 5,
          title: 'Perfect for gym workouts!',
          review: 'The fabric is incredibly breathable and the fit is just right. I wear it for my daily gym sessions and it keeps me cool even during intense workouts. Highly recommended!',
          date: '2024-01-15',
          verified: true,
          helpful: 12,
          size: 'M',
          images: [],
          location: 'Mumbai'
        },
        {
          id: 2,
          name: 'Priya S.',
          email: 'priya@example.com',
          rating: 4,
          title: 'Great quality, slightly tight',
          review: 'Love the quality of the fabric. Very comfortable for sports activities. Only reason for 4 stars is that it runs slightly tight. Would recommend sizing up if you prefer a looser fit.',
          date: '2024-01-10',
          verified: true,
          helpful: 8,
          size: 'S',
          images: [],
          location: 'Delhi'
        },
        {
          id: 3,
          name: 'Arjun K.',
          email: 'arjun@example.com',
          rating: 5,
          title: 'Best activewear I own',
          review: 'This is hands down the best activewear t-shirt I have ever purchased. The moisture-wicking technology actually works, and the shirt looks great even after multiple washes.',
          date: '2024-01-05',
          verified: true,
          helpful: 15,
          size: 'L',
          images: [],
          location: 'Bangalore'
        }
      ];
      setReviews(sampleReviews);
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(sampleReviews));
    }
  }, [productId]);

  // Calculate stats
  const calculateStats = () => {
    if (reviews.length === 0) {
      return { average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let total = 0;

    reviews.forEach(review => {
      distribution[review.rating]++;
      total += review.rating;
    });

    return {
      average: (total / reviews.length).toFixed(1),
      total: reviews.length,
      distribution
    };
  };

  const stats = calculateStats();

  // Sort and filter reviews
  const getFilteredReviews = () => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating > 0) {
      filtered = filtered.filter(r => r.rating === filterRating);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredReviews = getFilteredReviews();
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  // Render stars
  const renderStars = (rating, size = 'small') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className={`star filled ${size}`} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className={`star filled ${size}`} />);
      } else {
        stars.push(<FaRegStar key={i} className={`star ${size}`} />);
      }
    }

    return stars;
  };

  // Handle helpful click
  const handleHelpful = (reviewId) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, helpful: review.helpful + 1 };
      }
      return review;
    });
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
  };

  // Handle new review submission
  const handleReviewSubmit = (newReview) => {
    const reviewWithId = {
      ...newReview,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0
    };

    const updatedReviews = [reviewWithId, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    setIsWriteReviewOpen(false);
  };

  return (
    <section className="reviews-section">
      <h2 className="reviews-title">CUSTOMER REVIEWS</h2>

      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="reviews-summary__left">
          <div className="reviews-summary__rating">
            <span className="reviews-summary__number">{stats.average}</span>
            <div className="reviews-summary__stars">
              {renderStars(parseFloat(stats.average), 'medium')}
            </div>
            <span className="reviews-summary__count">
              Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        <div className="reviews-summary__middle">
          {/* Rating Distribution */}
          <div className="reviews-distribution">
            {[5, 4, 3, 2, 1].map(star => (
              <button
                key={star}
                className={`distribution-row ${filterRating === star ? 'active' : ''}`}
                onClick={() => setFilterRating(filterRating === star ? 0 : star)}
              >
                <span className="distribution-star">{star} ★</span>
                <div className="distribution-bar">
                  <div 
                    className="distribution-fill"
                    style={{ 
                      width: stats.total > 0 
                        ? `${(stats.distribution[star] / stats.total) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className="distribution-count">{stats.distribution[star]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="reviews-summary__right">
          <button 
            className="write-review-btn"
            onClick={() => setIsWriteReviewOpen(true)}
          >
            WRITE A REVIEW
          </button>
        </div>
      </div>

      {/* Filters and Sort */}
      {reviews.length > 0 && (
        <div className="reviews-controls">
          <div className="reviews-controls__left">
            <span className="reviews-showing">
              Showing {displayedReviews.length} of {filteredReviews.length} reviews
              {filterRating > 0 && ` (${filterRating} star)`}
            </span>
            {filterRating > 0 && (
              <button 
                className="reviews-clear-filter"
                onClick={() => setFilterRating(0)}
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="reviews-controls__right">
            <div className="reviews-sort">
              <label>Sort by:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="reviews-empty">
            <div className="reviews-empty__stars">
              {renderStars(0, 'large')}
            </div>
            <p className="reviews-empty__text">BE THE FIRST TO WRITE A REVIEW</p>
            <button 
              className="reviews-empty__btn"
              onClick={() => setIsWriteReviewOpen(true)}
            >
              WRITE A REVIEW
            </button>
          </div>
        ) : (
          <>
            {displayedReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__stars">
                    {renderStars(review.rating)}
                  </div>
                  <span className="review-card__date">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h4 className="review-card__title">{review.title}</h4>
                
                <p className="review-card__text">{review.review}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="review-card__images">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                    ))}
                  </div>
                )}

                <div className="review-card__footer">
                  <div className="review-card__author">
                    <span className="review-card__name">{review.name}</span>
                    {review.verified && (
                      <span className="review-card__verified">
                        <FaCheck /> Verified Purchase
                      </span>
                    )}
                    {review.size && (
                      <span className="review-card__size">Size: {review.size}</span>
                    )}
                  </div>

                  <button 
                    className="review-card__helpful"
                    onClick={() => handleHelpful(review.id)}
                  >
                    <FaThumbsUp /> Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}

            {/* Show More Button */}
            {filteredReviews.length > 3 && (
              <button 
                className="reviews-show-more"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? 'SHOW LESS' : `SHOW ALL ${filteredReviews.length} REVIEWS`}
                <FaChevronDown className={showAllReviews ? 'rotated' : ''} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Write Review Modal */}
      {isWriteReviewOpen && (
        <WriteReviewModal
          productName={productName}
          onClose={() => setIsWriteReviewOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </section>
  );
};

// Write Review Modal Component
const WriteReviewModal = ({ productName, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    title: '',
    review: '',
    size: '',
    images: [],
    recommend: true
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In production, you'd upload these to a server
    // For now, we'll create object URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    }
    if (!formData.review.trim()) {
      newErrors.review = 'Review is required';
    } else if (formData.review.length < 20) {
      newErrors.review = 'Review must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal__header">
          <h2>WRITE A REVIEW</h2>
          <button className="review-modal__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="review-modal__product">
          <span>Reviewing: </span>
          <strong>{productName}</strong>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Rating */}
          <div className="form-group">
            <label>Your Rating *</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className="rating-star"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                >
                  {star <= (hoverRating || formData.rating) ? (
                    <FaStar className="filled" />
                  ) : (
                    <FaRegStar />
                  )}
                </button>
              ))}
              <span className="rating-text">
                {formData.rating > 0 && (
                  ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][formData.rating]
                )}
              </span>
            </div>
            {errors.rating && <span className="error">{errors.rating}</span>}
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Review Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Sum up your review in a headline"
              maxLength={100}
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* Review */}
          <div className="form-group">
            <label htmlFor="review">Your Review *</label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              placeholder="What did you like or dislike about this product?"
              rows={5}
              maxLength={1000}
            />
            <span className="char-count">{formData.review.length}/1000</span>
            {errors.review && <span className="error">{errors.review}</span>}
          </div>

          {/* Size Purchased */}
          <div className="form-group">
            <label>Size Purchased (Optional)</label>
            <div className="size-buttons">
              {sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn ${formData.size === size ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, size }))}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <label>Add Photos (Optional)</label>
            <div className="photo-upload">
              <label className="photo-upload-btn">
                <FaCamera />
                <span>Add Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <span className="photo-hint">Up to 5 photos</span>
            </div>
            {formData.images.length > 0 && (
              <div className="photo-preview">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="photo-preview-item">
                    <img src={img} alt={`Upload ${idx + 1}`} />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="photo-remove"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>

          {/* Recommend */}
          <div className="form-group form-checkbox">
            <label>
              <input
                type="checkbox"
                name="recommend"
                checked={formData.recommend}
                onChange={handleInputChange}
              />
              <span>I would recommend this product to a friend</span>
            </label>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerReviews;