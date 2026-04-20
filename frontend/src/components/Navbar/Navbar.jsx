// components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { FiUser, FiSearch, FiShoppingBag, FiX, FiMinus, FiPlus, FiHeart, FiClock, FiTrendingUp, FiLogOut } from 'react-icons/fi';
import { IoCloseOutline, IoArrowForward, IoArrowBack } from 'react-icons/io5';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { products } from '../../data/productsData';
import './Navbar.css';

const Navbar = ({ alwaysSolid = false, hideOnScroll = false, noShadow = false }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartCount, getCartTotal } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  
  // New states for dropdowns
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Refs for click outside
  const userDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // Popular searches
  const popularSearches = ['T-Shirt', 'Apron', 'Scrub', 'Hoppers', 'Cargo Shorts', 'Sweatshirt'];

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Hide on scroll effect
  useEffect(() => {
    if (!hideOnScroll) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll]);

  // Scroll effect for background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body overflow when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Generate search suggestions based on query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const suggestions = products
      .filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.colors && product.colors.some(c => c.name.toLowerCase().includes(query)))
      )
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        image: product.images[0]
      }));

    setSearchSuggestions(suggestions);
  }, [searchQuery]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        // Don't close search if clicking the search icon
        if (!event.target.closest('.navbar__icon-btn')) {
          setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsUserDropdownOpen(false);
        setIsSearchOpen(false);
        setIsCartOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setActiveSubmenu(null);
  };

  const handleSubmenuClick = (submenu) => {
    setActiveSubmenu(submenu);
  };

  const handleBack = () => {
    setActiveSubmenu(null);
  };

  // Toggle functions
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsSearchOpen(false);
    setIsCartOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsUserDropdownOpen(false);
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsUserDropdownOpen(false);
    setIsSearchOpen(false);
  };

  // Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to search history
      const updatedHistory = [searchQuery.trim(), ...searchHistory.filter(h => h !== searchQuery.trim())].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion.slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Handle history/popular click
  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    // Auto submit
    const updatedHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Clear search history
  const handleClearHistory = (e) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Menu Data
  const menuData = {
    mainMenu: [
      { name: 'HOME', link: '/' },
      { name: 'T-SHIRTS', link: '/category/tshirts' },
      { name: 'BOUTIQUE PRODUCTS', link: '/category/boutique-products' },
      { name: 'SHOP BY CATEGORY', hasSubmenu: true, submenuKey: 'category' },
      { name: 'CURATED PRODUCTS', hasSubmenu: true, submenuKey: 'curated' },
      { name: 'OUR STORY', link: '/our-story' },
    ],
    shopByCategory: {
      topWear: {
        title: 'TOP WEAR',
        items: [
          { name: 'PRINTED T-SHIRTS', link: '/category/printed-tshirts' },
          { name: 'PLAIN T-SHIRTS', link: '/category/plain-tshirts' },
          { name: 'PRINTED SWEAT-SHIRTS', link: '/category/printed-sweatshirts' },
          { name: 'PLAIN SWEAT-SHIRTS', link: '/category/plain-sweatshirts' },
          { name: 'HOODIES', link: '/category/hoodies' },
        ]
      },
      bottomWear: {
        title: 'BOTTOM WEAR',
        items: [
          { name: 'HOPPERS', link: '/category/hoppers' },
          { name: 'TRAVEL PANTS', link: '/category/travel-pants' },
          { name: 'CARGO PANTS', link: '/category/cargo-pants' },
          { name: 'CARGO SHORTS', link: '/category/cargo-shorts', highlighted: true },
        ]
      },
      allCollections: {
        title: 'ALL COLLECTIONS',
        link: '/collections/all',
        highlighted: true
      }
    },
    curatedProducts: {
      items: [
        { name: 'APRON', link: '/curated/apron' },
        { name: 'SCRUBS', link: '/curated/scrubs' },
      ]
    },
    bottomLinks: [
      // { name: 'TRACK ORDER & RETURNS', link: '/track-order' },
      { name: 'MY ACCOUNT & ORDERS', link: '/account' },
      { name: 'CONTACT US', link: '/contact' },
    ],
    socialLinks: [
      { name: 'Facebook', icon: 'facebook', link: 'https://facebook.com' },
      { name: 'Twitter', icon: 'twitter', link: 'https://twitter.com' },
      { name: 'Instagram', icon: 'instagram', link: 'https://instagram.com' },
      { name: 'YouTube', icon: 'youtube', link: 'https://youtube.com' },
      { name: 'WhatsApp', icon: 'whatsapp', link: 'https://whatsapp.com' },
    ]
  };

  return (
    <>
      <nav
        className={`navbar 
          ${(alwaysSolid || scrolled) ? 'navbar--scrolled' : ''} 
          ${noShadow ? 'navbar--no-shadow' : ''} 
          ${!showNavbar ? 'navbar--hidden' : ''}
        `}
      >
        <div className="navbar__left">
          <button
            className="navbar__menu-btn"
            onClick={() => setMenuOpen(true)}
          >
            <HiOutlineMenuAlt3 size={22} />
            <span>MENU</span>
          </button>
        </div>

        <div className="navbar__center">
          <Link to="/" className="navbar__logo">
            <img src="/images/logo.png" alt="AAOMS Logo" className="navbar__logo-image" />
          </Link>
        </div>

        <div className="navbar__right">
          {/* User Account Dropdown */}
          <div className="navbar__dropdown-wrapper" ref={userDropdownRef}>
            <button 
              className="navbar__icon-btn"
              onClick={toggleUserDropdown}
              aria-label="Account"
            >
              <FiUser size={20} />
            </button>

            {isUserDropdownOpen && (
              <div className="navbar__dropdown navbar__user-dropdown">
                <div className="navbar__dropdown-arrow"></div>
                <div className="navbar__dropdown-header">
                  <span>MY ACCOUNT</span>
                </div>
                <div className="navbar__dropdown-body">
                  {isAuthenticated() && user ? (
                    <>
                      <div className="navbar__user-info">
                        <span className="navbar__user-name">{user.name || user.email}</span>
                        <span className="navbar__user-email">{user.email}</span>
                      </div>
                      <div className="navbar__dropdown-divider"></div>
                      <Link 
                        to="/account" 
                        className="navbar__dropdown-link"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link 
                        to="/orders" 
                        className="navbar__dropdown-link"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="navbar__dropdown-link"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FiHeart size={11} /> Wishlist
                      </Link>
                      <div className="navbar__dropdown-divider"></div>
                      <button 
                        className="navbar__dropdown-link navbar__logout-btn"
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/');
                        }}
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="navbar__dropdown-link"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        className="navbar__dropdown-link"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Sign Up
                      </Link>
                      <div className="navbar__dropdown-divider"></div>
                      <Link 
                        to="/orders" 
                        className="navbar__dropdown-link"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button 
            className="navbar__icon-btn"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>

          {/* Cart Dropdown */}
          <div className="navbar__dropdown-wrapper" ref={cartDropdownRef}>
            <button 
              className="navbar__icon-btn navbar__cart-btn"
              onClick={toggleCart}
              aria-label="Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="navbar__cart-count">{cartCount}</span>
              )}
            </button>

            {isCartOpen && (
              <div className="navbar__dropdown navbar__cart-dropdown">
                <div className="navbar__dropdown-arrow"></div>
                <div className="navbar__dropdown-header">
                  <span>YOUR CART ({cartCount})</span>
                  <button 
                    className="navbar__dropdown-close"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="navbar__cart-empty">
                    <FiShoppingBag size={40} />
                    <p>Your cart is empty</p>
                    <Link 
                      to="/collection" 
                      className="navbar__cart-shop-btn"
                      onClick={() => setIsCartOpen(false)}
                    >
                      SHOP NOW
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="navbar__cart-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="navbar__cart-item">
                          <Link 
                            to={`/product/${item.id}`}
                            className="navbar__cart-item-image"
                            onClick={() => setIsCartOpen(false)}
                          >
                            <img src={item.image} alt={item.name} />
                          </Link>
                          <div className="navbar__cart-item-info">
                            <Link 
                              to={`/product/${item.id}`}
                              className="navbar__cart-item-name"
                              onClick={() => setIsCartOpen(false)}
                            >
                              {item.name}
                            </Link>
                            <p className="navbar__cart-item-variant">
                              {item.size} / {item.color}
                            </p>
                            <div className="navbar__cart-item-bottom">
                              <div className="navbar__cart-item-qty">
                                <button onClick={() => {
                                  const currentItem = cartItems.find(i => i.id === item.id);
                                  if (currentItem && currentItem.quantity > 1) {
                                    updateQuantity(item.id, currentItem.quantity - 1);
                                  } else if (currentItem) {
                                    removeFromCart(item.id, item.size);
                                  }
                                }}>
                                  <FiMinus size={12} />
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => {
                                  const currentItem = cartItems.find(i => i.id === item.id);
                                  if (currentItem) {
                                    updateQuantity(item.id, currentItem.quantity + 1);
                                  }
                                }}>
                                  <FiPlus size={12} />
                                </button>
                              </div>
                              <span className="navbar__cart-item-price">
                                Rs.{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <button 
                            className="navbar__cart-item-remove"
                            onClick={() => removeFromCart(item.id, item.size)}
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="navbar__cart-footer">
                      <div className="navbar__cart-total">
                        <span>Subtotal</span>
                        <span>Rs. {cartTotal.toLocaleString()}</span>
                      </div>
                      <Link 
                        to="/cart" 
                        className="navbar__cart-view-btn"
                        onClick={() => setIsCartOpen(false)}
                      >
                        VIEW CART
                      </Link>
                      <Link 
                        to="/checkout" 
                        className="navbar__cart-checkout-btn"
                        onClick={() => setIsCartOpen(false)}
                      >
                        CHECKOUT
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className={`navbar__search-bar ${isSearchOpen ? 'navbar__search-bar--open' : ''}`}
          ref={searchDropdownRef}
        >
          <form onSubmit={handleSearchSubmit} className="navbar__search-form">
            <FiSearch className="navbar__search-icon" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
              autoComplete="off"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="navbar__search-clear"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchQuery('');
                }}
              >
                <FiX size={18} />
              </button>
            )}
            <button 
              type="button" 
              className="navbar__search-close"
              onClick={() => setIsSearchOpen(false)}
            >
              <FiX size={22} />
            </button>
          </form>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="navbar__search-dropdown">
              {/* Product Suggestions */}
              {searchQuery && searchSuggestions.length > 0 && (
                <div className="navbar__search-section">
                  <div className="navbar__search-section-title">Suggested Products</div>
                  <ul className="navbar__search-suggestions">
                    {searchSuggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button 
                          className="navbar__search-suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                          type="button"
                        >
                          <img src={suggestion.image} alt={suggestion.name} className="navbar__search-suggestion-image" />
                          <div className="navbar__search-suggestion-info">
                            <div className="navbar__search-suggestion-name">{suggestion.name}</div>
                            <div className="navbar__search-suggestion-category">{suggestion.category}</div>
                          </div>
                          <FiSearch size={16} className="navbar__search-suggestion-icon" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Search History */}
              {!searchQuery && searchHistory.length > 0 && (
                <div className="navbar__search-section">
                  <div className="navbar__search-section-header">
                    <span className="navbar__search-section-title">
                      <FiClock size={16} /> Recent Searches
                    </span>
                    <button 
                      className="navbar__search-clear-btn"
                      onClick={handleClearHistory}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="navbar__search-history">
                    {searchHistory.map((query, index) => (
                      <button 
                        key={index}
                        className="navbar__search-history-item"
                        onClick={() => handleQuickSearch(query)}
                        type="button"
                      >
                        <FiClock size={14} />
                        <span>{query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {!searchQuery && (
                <div className="navbar__search-section">
                  <div className="navbar__search-section-title">
                    <FiTrendingUp size={16} /> Popular Searches
                  </div>
                  <div className="navbar__search-popular">
                    {popularSearches.map((query, index) => (
                      <button 
                        key={index}
                        className="navbar__search-popular-item"
                        onClick={() => handleQuickSearch(query)}
                        type="button"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {searchQuery && searchSuggestions.length === 0 && (
                <div className="navbar__search-empty">
                  <FiSearch size={32} />
                  <p>No products found for "{searchQuery}"</p>
                  <small>Try different keywords</small>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Menu Overlay */}
      <div className={`menu-overlay ${menuOpen ? 'menu-overlay--open' : ''}`}>
        <div className="menu-overlay__backdrop" onClick={handleCloseMenu}></div>
        
        <div className="menu-overlay__sidebar">
          {/* Close Button */}
          <button className="menu-overlay__close" onClick={handleCloseMenu}>
            <IoCloseOutline size={24} />
            <span>MENU</span>
          </button>

          {/* Main Menu */}
          <div className={`menu-overlay__main ${activeSubmenu ? 'menu-overlay__main--hidden' : ''}`}>
            <ul className="menu-overlay__list">
              {menuData.mainMenu.map((item, index) => (
                <li key={index} className="menu-overlay__item">
                  {item.hasSubmenu ? (
                    <button 
                      className="menu-overlay__link menu-overlay__link--has-arrow"
                      onClick={() => handleSubmenuClick(item.submenuKey)}
                    >
                      {item.name}
                      <IoArrowForward size={18} />
                    </button>
                  ) : (
                    <Link 
                      to={item.link} 
                      className="menu-overlay__link"
                      onClick={handleCloseMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="menu-overlay__divider"></div>

            <ul className="menu-overlay__bottom-links">
              {menuData.bottomLinks.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="menu-overlay__bottom-link"
                    onClick={handleCloseMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="menu-overlay__social">
              {menuData.socialLinks.map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-overlay__social-icon"
                >
                  {item.icon === 'facebook' && <FaFacebookF size={18} />}
                  {item.icon === 'twitter' && <FaXTwitter size={18} />}
                  {item.icon === 'instagram' && <FaInstagram size={18} />}
                  {item.icon === 'youtube' && <FaYoutube size={18} />}
                  {item.icon === 'whatsapp' && <FaWhatsapp size={18} />}
                </a>
              ))}
            </div>
          </div>

          {/* SHOP BY CATEGORY Submenu */}
          <div className={`menu-overlay__submenu ${activeSubmenu === 'category' ? 'menu-overlay__submenu--active' : ''}`}>
            <button className="menu-overlay__back" onClick={handleBack}>
              <IoArrowBack size={18} />
              <span>BACK</span>
            </button>

            <div className="menu-overlay__submenu-scroll">
              <div className="menu-overlay__category-group">
                <h3 className="menu-overlay__category-title">
                  {menuData.shopByCategory.topWear.title}
                </h3>
                <ul className="menu-overlay__category-items">
                  {menuData.shopByCategory.topWear.items.map((item, index) => (
                    <li key={index}>
                      <Link 
                        to={item.link} 
                        className={`menu-overlay__category-link ${item.highlighted ? 'menu-overlay__category-link--highlighted' : ''}`}
                        onClick={handleCloseMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="menu-overlay__category-group">
                <h3 className="menu-overlay__category-title">
                  {menuData.shopByCategory.bottomWear.title}
                </h3>
                <ul className="menu-overlay__category-items">
                  {menuData.shopByCategory.bottomWear.items.map((item, index) => (
                    <li key={index}>
                      <Link 
                        to={item.link} 
                        className={`menu-overlay__category-link ${item.highlighted ? 'menu-overlay__category-link--highlighted' : ''}`}
                        onClick={handleCloseMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="menu-overlay__category-group">
                <Link 
                  to={menuData.shopByCategory.allCollections.link}
                  className="menu-overlay__category-link menu-overlay__category-link--highlighted menu-overlay__category-link--large"
                  onClick={handleCloseMenu}
                >
                  {menuData.shopByCategory.allCollections.title}
                </Link>
              </div>
            </div>
          </div>

          {/* CURATED PRODUCTS Submenu */}
          <div className={`menu-overlay__submenu ${activeSubmenu === 'curated' ? 'menu-overlay__submenu--active' : ''}`}>
            <button className="menu-overlay__back" onClick={handleBack}>
              <IoArrowBack size={18} />
              <span>BACK</span>
            </button>

            <div className="menu-overlay__submenu-scroll">
              <div className="menu-overlay__category-group">
                <ul className="menu-overlay__category-items">
                  {menuData.curatedProducts.items.map((item, index) => (
                    <li key={index}>
                      <Link 
                        to={item.link} 
                        className="menu-overlay__category-link menu-overlay__category-link--large"
                        onClick={handleCloseMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;