import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { testimonials } from '../../data/homeData';
import './Testimonial.css';

const Testimonial = () => {
  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonial = testimonials[currentIndex];

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Section enters viewport
    if (rect.top < windowHeight * 0.8) {
      setIsVisible(true);
    }

    // Reset when scrolled above
    if (rect.top > windowHeight) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Auto-scroll testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
      setIsAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="testimonial" ref={sectionRef}>
      <div className={`testimonial__wrapper ${isVisible ? 'visible' : ''}`}>
        <div className="testimonial__container">
          {/* Left Panel */}
          <div className="testimonial__left">
            <div className="testimonial__rating">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <FaStar
                  key={i}
                  size={16}
                  className="testimonial__star"
                  style={{ transitionDelay: `${0.5 + i * 0.1}s` }}
                />
              ))}
              <span className="testimonial__author">
                {testimonial.name}, {testimonial.title}
              </span>
            </div>

            <p className={`testimonial__text ${isAnimating ? 'testimonial__content-exit-active' : ''}`}>
              {testimonial.text}
            </p>

            <div className="testimonial__navigation">
              <button className="testimonial__nav-btn" onClick={handlePrev}>
                <FaChevronLeft size={16} />
              </button>
              <button className="testimonial__nav-btn" onClick={handleNext}>
                <FaChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="testimonial__right">
            <div className="testimonial__image-wrapper">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className={`testimonial__image ${isAnimating ? 'testimonial__content-exit-active' : ''}`}
              />
              <Link to={`/product/${testimonial.product.id}`} className="testimonial__product-tag">
                <img
                  src={testimonial.product.image}
                  alt={testimonial.product.name}
                  className="testimonial__product-img"
                />
                <div className="testimonial__product-info">
                  <p className="testimonial__product-name">{testimonial.product.name}</p>
                  <p className="testimonial__product-price">
                    Rs.{testimonial.product.price.toLocaleString('ne-NP')}.00
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;