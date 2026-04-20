import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFilter, FiSearch, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

function ReviewsManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, filterStatus]);

  const fetchReviews = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockReviews = [
        {
          id: 1,
          productName: 'Embroidered Saree',
          productId: 'PRD-001',
          reviewer: 'Krishna Magar',
          reviewerEmail: 'krishna@example.com',
          rating: 4,
          comment: 'Beautiful design and comfortable to wear.',
          status: 'pending',
          createdAt: new Date('2024-01-15'),
          images: ['image1.jpg']
        },
        {
          id: 2,
          productName: 'Silk Dress',
          productId: 'PRD-002',
          reviewer: 'Priya Verma',
          reviewerEmail: 'priya@example.com',
          rating: 5,
          comment: 'Excellent quality, my friends loved it!',
          status: 'pending',
          createdAt: new Date('2024-01-14'),
          images: []
        },
        {
          id: 3,
          productName: 'Cotton Salwar Kameez',
          productId: 'PRD-003',
          reviewer: 'Pooja Desai',
          reviewerEmail: 'pooja@example.com',
          rating: 3,
          comment: 'Good quality but sizing runs small.',
          status: 'approved',
          createdAt: new Date('2024-01-10'),
          images: []
        },
        {
          id: 4,
          productName: 'Shawl',
          productId: 'PRD-004',
          reviewer: 'Karan Thapa',
          reviewerEmail: 'karan@example.com',
          rating: 2,
          comment: 'Not as described. Poor quality.',
          status: 'rejected',
          createdAt: new Date('2024-01-08'),
          images: []
        }
      ];

      setReviews(mockReviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(review => review.status === filterStatus);
    }

    setFilteredReviews(filtered);
  };

  const handleApprove = (reviewId) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: 'approved' } : r
    ));
    setShowModal(false);
  };

  const handleReject = (reviewId) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: 'rejected' } : r
    ));
    setShowModal(false);
  };

  const handleDelete = (reviewId) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FF9800';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-success';
      case 'rejected': return 'status-danger';
      default: return 'status-neutral';
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-header-section">
        <div className="header-back">
          <button className="back-btn" onClick={() => navigate('/admin')}>
            <FiArrowLeft /> Back to Dashboard
          </button>
        </div>
        <h1>⭐ Reviews & Feedback Management</h1>
      </div>

      {loading ? (
        <div className="loading">Loading reviews...</div>
      ) : (
        <div className="admin-panel-content">
          {/* Filters */}
          <div className="admin-section">
            <div className="filter-section">
              <div className="filter-group">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by product, reviewer, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-controls">
                <FiFilter className="filter-icon" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Reviews ({reviews.length})</option>
                  <option value="pending">Pending ({reviews.filter(r => r.status === 'pending').length})</option>
                  <option value="approved">Approved ({reviews.filter(r => r.status === 'approved').length})</option>
                  <option value="rejected">Rejected ({reviews.filter(r => r.status === 'rejected').length})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          {filteredReviews.length > 0 ? (
            <div className="reviews-grid">
              {filteredReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="review-card"
                  onClick={() => {
                    setSelectedReview(review);
                    setShowModal(true);
                  }}
                >
                  <div className="review-card-header">
                    <div className="review-product-info">
                      <h3>{review.productName}</h3>
                      <p className="review-id">ID: {review.productId}</p>
                    </div>
                    <span className={`status-badge ${getStatusBadgeClass(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <div className="review-rating">
                    <span>{'⭐'.repeat(review.rating)}</span>
                    <span className="rating-value">{review.rating}/5</span>
                  </div>

                  <div className="review-details">
                    <p className="reviewer-name">{review.reviewer}</p>
                    <p className="reviewer-email">{review.reviewerEmail}</p>
                    <p className="review-comment">{review.comment.substring(0, 100)}...</p>
                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>

                  {review.status === 'pending' && (
                    <div className="review-card-actions">
                      <button className="action-btn" style={{ backgroundColor: '#4CAF50' }}>
                        <FiCheck /> Approve
                      </button>
                      <button className="action-btn" style={{ backgroundColor: '#F44336' }}>
                        <FiX /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No reviews found matching your filters.</p>
            </div>
          )}

          {/* Detail Modal */}
          {showModal && selectedReview && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
              <div className="modal-dialog">
                <div className="modal-header">
                  <h2>Review Details</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>

                <div className="modal-body">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Product</label>
                      <p>{selectedReview.productName}</p>
                    </div>
                    <div className="detail-item">
                      <label>Product ID</label>
                      <p>{selectedReview.productId}</p>
                    </div>
                    <div className="detail-item">
                      <label>Reviewer</label>
                      <p>{selectedReview.reviewer}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedReview.reviewerEmail}</p>
                    </div>
                    <div className="detail-item">
                      <label>Rating</label>
                      <p>{'⭐'.repeat(selectedReview.rating)} {selectedReview.rating}/5</p>
                    </div>
                    <div className="detail-item">
                      <label>Date</label>
                      <p>{new Date(selectedReview.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="detail-item full-width">
                      <label>Comment</label>
                      <p>{selectedReview.comment}</p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p>
                        <span className={`status-badge ${getStatusBadgeClass(selectedReview.status)}`}>
                          {selectedReview.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  {selectedReview.status === 'pending' && (
                    <>
                      <button 
                        className="action-btn" 
                        style={{ backgroundColor: '#4CAF50' }}
                        onClick={() => handleApprove(selectedReview.id)}
                      >
                        <FiCheck /> Approve Review
                      </button>
                      <button 
                        className="action-btn" 
                        style={{ backgroundColor: '#F44336' }}
                        onClick={() => handleReject(selectedReview.id)}
                      >
                        <FiX /> Reject Review
                      </button>
                    </>
                  )}
                  <button 
                    className="action-btn" 
                    style={{ backgroundColor: '#999' }}
                    onClick={() => handleDelete(selectedReview.id)}
                  >
                    <FiTrash2 /> Delete Review
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewsManagement;
