import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (!isAuthenticated() || !product?.id) return;

    const checkWishlistStatus = async () => {
      try {
        const response = await api.get('/wishlist');
        if (response.data.success && response.data.data?.items) {
          const isInWish = response.data.data.items.some(
            item => item.productId === product.id
          );
          setIsInWishlist(isInWish);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, product?.id]);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
        image: product.image
      });
      
      if (response.data.success) {
        setIsInWishlist(true);
        toast.success('Added to wishlist!');
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

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={product.link || '#'} className="product-card__image-wrapper">
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          className="product-card__image"
        />
        {product.badge && (
          <span className={`product-card__badge ${product.badge === 'SOLD OUT' ? 'product-card__badge--soldout' : ''}`}>
            {product.badge}
          </span>
        )}
      </Link>

      <button 
        className={`product-card__wishlist ${isInWishlist ? 'product-card__wishlist--active' : ''}`}
        onClick={handleAddToWishlist}
        disabled={wishlistLoading}
        title={isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        aria-label="Add to wishlist"
      >
        <FiHeart size={18} />
      </button>

      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">Rs. {product.price.toLocaleString('ne-NP')}.00</p>
      </div>
    </div>
  );
};

export default ProductCard;