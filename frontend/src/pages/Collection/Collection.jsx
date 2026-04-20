// Collection.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Collection.css';
import Footer from '../../components/Footer/Footer';

const Collection = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const products = [
    {
      id: 1,
      name: "TROOPERGO: 2-IN-1 UTILITY CARGO PANTS",
      price: 4250,
      image: "/images/tshirt.jpg",
      colors: ["green", "black", "grey", "orange"],
      soldOut: true
    },
    {
      id: 2,
      name: "DESERT TAN OVERSIZED POCKETS CARGO MAX HOPPERS",
      price: 2875,
      image: "/images/desert-tan-cargo.jpg",
      colors: [],
      soldOut: true
    },
    {
      id: 3,
      name: "JET BLACK AIRWAVE HOPPERS",
      price: 2475,
      image: "/images/jet-black-hoppers.jpg",
      colors: [],
      soldOut: false
    },
    {
      id: 4,
      name: "AEGEAN BLUE AIRWAVE HOPPERS",
      price: 2475,
      image: "/images/aegean-blue-hoppers.jpg",
      colors: [],
      soldOut: false
    },
    {
      id: 5,
      name: "NAVY & BLACK TROOPERGO CARGO HOPPERS",
      price: 2475,
      image: "/images/navy-black-cargo.jpg",
      colors: [],
      soldOut: true
    },
    {
      id: 6,
      name: "CARDEMOM GREEN & BLACK TROOPERGO CARGO HOPPERS",
      price: 2475,
      image: "/images/cardemom-green-cargo.jpg",
      colors: [],
      soldOut: true
    },
    {
      id: 7,
      name: "TROOPERGO: AIRWAVE TREKKING PANTS",
      price: 2475,
      image: "/images/airwave-trekking.jpg",
      colors: ["green", "grey", "black"],
      soldOut: false
    },
    {
      id: 8,
      name: "TROOPERGO: AERO LITE ACTIVE T-SHIRT",
      price: 1275,
      image: "/images/aero-lite-tshirt.jpg",
      colors: ["white", "grey", "blue", "black"],
      extraColors: 2,
      soldOut: false
    },
    {
      id: 9,
      name: "CAPPUCCINO & COAL GREY TROOPERGO CARGO HOPPERS",
      price: 2475,
      image: "/images/cappuccino-cargo.jpg",
      colors: [],
      soldOut: true
    },
    {
      id: 10,
      name: "CAPPUCCINO CREAM ACTIVE QUICK DRY HOPPERS",
      price: 1875,
      image: "/images/cappuccino-cream.jpg",
      colors: [],
      quickDry: true,
      soldOut: false
    },
    {
      id: 11,
      name: "TROOPERGO: ULTRA LIGHT TREKKING PANTS",
      price: 2475,
      image: "/images/ultra-light-trekking.jpg",
      colors: ["green", "blue", "grey", "black"],
      soldOut: false
    },
    {
      id: 12,
      name: "DARK GREY - TREKKING & HIKING SUN HAT",
      price: 1199,
      image: "/images/sun-hat-grey.jpg",
      colors: [],
      soldOut: false
    },
    {
      id: 13,
      name: "OLIVE GREEN - TREKKING & HIKING SUN HAT",
      price: 1199,
      image: "/images/sun-hat-olive.jpg",
      colors: [],
      soldOut: false
    },
    {
      id: 14,
      name: "OLIVE GREEN ACTIVE QUICK DRY HOPPERS",
      price: 1875,
      image: "/images/olive-green-hoppers.jpg",
      colors: [],
      quickDry: true,
      soldOut: false
    },
    {
      id: 15,
      name: "TROOPERGO: FEATHER LITE ACTIVE T-SHIRT",
      price: 1180,
      originalPrice: 1475,
      image: "/images/feather-lite-tshirt.jpg",
      colors: ["blue", "grey", "green"],
      soldOut: false
    },
    {
      id: 16,
      name: "DEEP OCEAN BLUE ACTIVE QUICK DRY HOPPERS",
      price: 1875,
      image: "/images/deep-ocean-hoppers.jpg",
      colors: [],
      soldOut: false
    },
    {
      id: 17,
      name: "TROOPERGO UTILITY WAIST PACK",
      price: 1499,
      image: "/images/waist-pack.jpg",
      colors: ["black", "grey", "green"],
      soldOut: false
    },
    {
      id: 18,
      name: "STRIDER LITE BACKPACK",
      price: 3999,
      image: "/images/strider-lite.jpg",
      colors: [],
      soldOut: true
    },
    {
      id: 19,
      name: "STRIDER PRO BACKPACK",
      price: 5999,
      image: "/images/strider-pro.jpg",
      colors: [],
      soldOut: true
    }
  ];

  return (
    <div className="collection-page">
<Navbar />

      {/* Hero Section */}
      <section className="collection-hero">
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop" 
            alt="Treks & Hikes Collection" 
          />
          <div className="hero-overlay">
            <h1 className="hero-title">TREKS & HIKES</h1>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-header">
          <span className="product-count">19 PRODUCTS</span>
          <div className="view-options">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
            <span className="divider">|</span>
            <button className="filter-btn">
              <span>⚙</span> FILTER & SORT
            </button>
          </div>
        </div>

        <div className={`products-grid ${viewMode}`}>
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} />
                {product.soldOut && (
                  <span className="sold-out-badge">SOLD OUT</span>
                )}
                {product.quickDry && (
                  <span className="quick-dry-badge">
                    <span>QUICK</span>
                    <span>DRY</span>
                  </span>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                  <span>
                    Rs.{product.price.toLocaleString()}
                  </span>
                </div>
                {product.colors.length > 0 && (
                  <div className="product-colors">
                    {product.colors.map((color, index) => (
                      <span 
                        key={index} 
                        className={`color-dot ${color}`}
                      ></span>
                    ))}
                    {product.extraColors && (
                      <span className="extra-colors">+{product.extraColors}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Footer */}
<Footer />
    </div>
  );
};

export default Collection;