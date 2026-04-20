// pages/Wishlist/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiHeart,
  FiShoppingBag,
  FiTrash2,
  FiShare2,
  FiGrid,
  FiList,
  FiX
} from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isItemInCart } = useCart();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedSize, setSelectedSize] = useState({});
  const [notification, setNotification] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Fetch wishlist data on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/wishlist');
        if (response.data.success && response.data.data) {
          setWishlistItems(response.data.data.items || []);
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist');
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Check if product with size is already in cart by reading from localStorage
  const isProductInCart = (productId, sizeValue) => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return false;
      const cartItems = JSON.parse(savedCart);
      return cartItems.some(item => item.id === productId && item.size === sizeValue);
    } catch (err) {
      console.error('Error checking cart:', err);
      return false;
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await api.delete(`/wishlist/${itemId}`);
      if (response.data.success) {
        setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
        toast.success('Item removed from wishlist');
        showNotification('Item removed from wishlist');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Error removing item');
    }
  };

  const handleAddToCart = async (item) => {
    // Only require size if item has sizes
    if (item.sizes && item.sizes.length > 0 && !selectedSize[item.id]) {
      showNotification('Please select a size', 'error');
      return;
    }

    // Check if item already in cart with same size
    const selectedSizeValue = selectedSize[item.id] || '';
    const productId = item.id || item.productId;

    if (isProductInCart(productId, selectedSizeValue)) {
      showNotification('This product with selected size is already in cart', 'error');
      toast.error('This product with selected size is already in cart');
      return;
    }

    try {
      const cartData = {
        productId: productId,
        quantity: 1,
        size: selectedSizeValue,
        color: item.color || '',
        price: item.price,
        name: item.name,
        image: item.image,
        customization: {}
      };

      const response = await api.post('/cart/add', cartData);
      
      if (response.data.success) {
        // Update local cart context
        addToCart({
          id: productId,
          name: item.name,
          price: item.price,
          image: item.image,
          colors: [{ name: item.color || '' }]
        }, selectedSizeValue, 1, item.color);
        
        toast.success(`${item.name} added to cart!`);
        showNotification(`${item.name} added to cart!`);
      } else {
        toast.error('Failed to add to cart');
        showNotification('Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
      showNotification('Error adding to cart', 'error');
    }
  };

  const handleAddAllToCart = async () => {
    try {
      // Filter items that are not already in cart and prepare API calls
      const itemsToAdd = wishlistItems.filter(item => {
        const selectedSizeValue = selectedSize[item.id] || '';
        const productId = item.id || item.productId;
        return !isProductInCart(productId, selectedSizeValue);
      });

      if (itemsToAdd.length === 0) {
        toast.warning('All items are already in your cart');
        return;
      }

      // Add remaining items to cart
      const addToCartPromises = itemsToAdd.map(item =>
        api.post('/cart/add', {
          productId: item.id || item.productId,
          quantity: 1,
          size: selectedSize[item.id] || '',
          color: item.color || '',
          price: item.price,
          name: item.name,
          image: item.image,
          customization: {}
        })
      );

      const responses = await Promise.all(addToCartPromises);
      const successCount = responses.filter(r => r.data.success).length;

      if (successCount > 0) {
        // Update local cart context for successfully added items
        itemsToAdd.forEach((item, index) => {
          if (responses[index].data.success) {
            addToCart({
              id: item.id || item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
              colors: [{ name: item.color || '' }]
            }, selectedSize[item.id] || '', 1, item.color);
          }
        });

        toast.success(`${successCount} items added to cart!`);
        showNotification(`${successCount} items added to cart!`);
      } else {
        toast.error('Failed to add items to cart');
        showNotification('Failed to add items to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding items to cart:', error);
      toast.error('Error adding items to cart');
      showNotification('Error adding items to cart', 'error');
    }
  };

  const handleClearWishlist = () => {
    setShowClearModal(true);
  };

  const confirmClearWishlist = async () => {
    try {
      const response = await api.post('/wishlist/clear');
      if (response.data.success) {
        setWishlistItems([]);
        toast.success('Wishlist cleared');
        showNotification('Wishlist cleared');
      } else {
        toast.error('Failed to clear wishlist');
      }
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      toast.error('Error clearing wishlist');
    } finally {
      setShowClearModal(false);
    }
  };

  const cancelClearWishlist = () => {
    setShowClearModal(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist - Bombay Trooper',
        text: 'Check out my wishlist!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!');
    }
  };



  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlistItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price),
    0
  );

  return (
    <>
      {/* Custom Confirmation Modal */}
      {showClearModal && (
        <div className="wishlist__modal-overlay">
          <div className="wishlist__modal">
            <h2 className="wishlist__modal-title">Clear Wishlist</h2>
            <p className="wishlist__modal-message">Are you sure you want to clear your entire wishlist?</p>
            <div className="wishlist__modal-actions">
              <button 
                className="wishlist__modal-btn wishlist__modal-btn--cancel"
                onClick={cancelClearWishlist}
              >
                Cancel
              </button>
              <button 
                className="wishlist__modal-btn wishlist__modal-btn--confirm"
                onClick={confirmClearWishlist}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar alwaysSolid/>
      <main className="wishlist">
        <div className="wishlist__container">
          {/* Header */}
          <div className="wishlist__header">
            <div className="wishlist__header-content">
              <h1>MY WISHLIST</h1>
              <p>{wishlistItems.length} items saved</p>
            </div>
            <div className="wishlist__header-actions">
              <button className="wishlist__share-btn" onClick={handleShare}>
                <FiShare2 /> Share
              </button>
              <div className="wishlist__view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`wishlist__notification ${notification.type}`}>
              {notification.message}
              <button onClick={() => setNotification(null)}>
                <FiX />
              </button>
            </div>
          )}

          {loading ? (
            <div className="wishlist__loading">
              <p>Loading your wishlist...</p>
            </div>
          ) : error ? (
            <div className="wishlist__error">
              <p>{error}</p>
              <p>Please try again later</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="wishlist__empty">
              <FiHeart />
              <h3>Your wishlist is empty</h3>
              <p>Save items you love by clicking the heart icon on products</p>
              <Link to="/collection">EXPLORE COLLECTION</Link>
            </div>
          ) : (
            <>
              {/* Summary Bar */}
              <div className="wishlist__summary-bar">
                <div className="wishlist__summary-info">
                  <span>
                    Total Value:{' '}
                    <strong>Rs. {totalValue.toLocaleString()}</strong>
                  </span>
                  {totalSavings > 0 && (
                    <span className="wishlist__savings">
                      You'll save Rs.{totalSavings.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="wishlist__summary-actions">
                  <button
                    className="wishlist__clear-btn"
                    onClick={handleClearWishlist}
                  >
                    Clear All
                  </button>
                  <button
                    className="wishlist__add-all-btn"
                    onClick={handleAddAllToCart}
                  >
                    <FiShoppingBag /> Add All to Cart
                  </button>
                </div>
              </div>

              {/* Items Grid/List */}
              <div className={`wishlist__items ${viewMode}`}>
                {wishlistItems.map(item => (
                  <div
                    key={item.id}
                    className="wishlist__item"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="wishlist__item-image"
                    >
                      <img src={item.image} alt={item.name} />
                      <button
                        className="wishlist__remove-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveItem(item.id);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </Link>

                    {/* Info */}
                    <div className="wishlist__item-info">
                      <span className="wishlist__item-category">
                        {item.category}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        className="wishlist__item-name"
                      >
                        {item.name}
                      </Link>
                      <div className="wishlist__item-price">
                        <span className="current">
                          Rs.{item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Size Selection - Only show if item has sizes */}
                      {item.sizes && item.sizes.length > 0 && (
                        <div className="wishlist__item-sizes">
                          <span>Size:</span>
                          <div className="wishlist__size-options">
                            {item.sizes.map(size => (
                              <button
                                key={size}
                                className={`wishlist__size-btn ${
                                  selectedSize[item.id] === size
                                    ? 'selected'
                                    : ''
                                }`}
                                onClick={() =>
                                  setSelectedSize({
                                    ...selectedSize,
                                    [item.id]: size
                                  })
                                }
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="wishlist__item-actions">
                        <button
                          className="wishlist__add-to-cart"
                          onClick={() => handleAddToCart(item)}
                        >
                          <FiShoppingBag /> ADD TO CART
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Wishlist;