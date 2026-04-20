import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ProductSection.css';

const ProductSection = ({ title, subtitle, products, viewAllLink }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Total items = VIEW ALL card + products
  const totalItems = products.length + 1;

  // Calculate visible items based on screen width
  const calculateItemsPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width <= 480) return 1.18; // Show hint of next
    if (width <= 640) return 1.43;
    if (width <= 992) return 2;
    if (width <= 1200) return 3;
    return 4;
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const perView = calculateItemsPerView();
      setItemsPerView(perView);

      // Adjust current index if needed
      const maxIdx = Math.max(0, totalItems - Math.floor(perView));
      if (currentIndex > maxIdx) {
        setCurrentIndex(maxIdx);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [calculateItemsPerView, currentIndex, totalItems]);

  // Max scroll index
  const maxIndex = Math.max(0, totalItems - Math.floor(itemsPerView));

  // Handlers
  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  // Transform calculation
  const itemWidth = 100 / itemsPerView;
  const translateX = currentIndex * itemWidth;

  return (
    <section className="product-section">
      <div className="product-section__container" ref={containerRef}>
        {/* Header */}
        <div className="product-section__header">
          <h2 className="product-section__title">{title}</h2>
          <p className="product-section__subtitle">{subtitle}</p>
        </div>

        {/* Carousel */}
        <div className="product-section__carousel">
          {/* Navigation Arrows */}
          <button
            className="product-section__nav product-section__nav--left"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
            <span className="product-section__nav-btn">
              <svg viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
          </button>

          <button
            className="product-section__nav product-section__nav--right"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next"
          >
            <span className="product-section__nav-btn">
              <svg viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </button>

          {/* Track */}
          <div
            className="product-section__track"
            style={{ transform: `translateX(-${translateX}%)` }}
          >
            {/* VIEW ALL Card */}
            <div className="product-section__item">
              <Link to={viewAllLink || '#'} className="product-section__view-all">
                <div className="product-section__view-all-inner">
                  <img
                    src={products[0]?.image || ''}
                    alt="View All"
                    className="product-section__view-all-image"
                  />
                  <div className="product-section__view-all-overlay" />
                  <span className="product-section__view-all-btn">View All</span>
                </div>
                <div className="product-section__view-all-spacer" />
              </Link>
            </div>

            {/* Product Cards */}
            {products.map((product) => (
              <div key={product.id} className="product-section__item">
                <Link
                  to={`/product/${product.slug || product.id}`}
                  className="product-section__product"
                >
                  <div className="product-section__product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-section__product-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="product-section__product-info">
                    <h3 className="product-section__product-title">
                      {product.title}
                    </h3>
                    <p className="product-section__product-price">
                      Rs.{product.price?.toLocaleString('ne-NP')}.00
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;