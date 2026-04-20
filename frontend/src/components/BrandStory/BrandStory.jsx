// BrandStory.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './BrandStory.css';

const BrandStory = ({
  backgroundImage,
  foundedText = "FOUNDED IN 2013, MUMBAI",
  highlightedWords = ["TROOPER", "TRAVELLERS,"],
  mainText = "TROOPER IS A DESIGN HOUSE FOR TRAVELLERS, EXPLORERS & OUTDOOR",
  storyLink = "/our-story" // Link to your story page
}) => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleWords, setVisibleWords] = useState([]);
  const [isFoundedVisible, setIsFoundedVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [overlayDarken, setOverlayDarken] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [parallaxScale, setParallaxScale] = useState(1);
  const [isBgActive, setIsBgActive] = useState(false);
  const [isBgHidden, setIsBgHidden] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const words = mainText.split(' ');

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = rect.height;

    // Calculate scroll progress through the section
    const scrolled = -rect.top;
    const totalScrollable = sectionHeight;
    const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
    setScrollProgress(progress);

    // ============================================
    // BACKGROUND VISIBILITY CONTROL
    // ============================================
    
    const sectionEntering = rect.top < windowHeight && rect.bottom > 0;
    const sectionPassed = rect.bottom < windowHeight * 0.3;
    
    setIsBgActive(sectionEntering && !sectionPassed);
    setIsBgHidden(sectionPassed);

    // ============================================
    // OTHER ANIMATIONS
    // ============================================

    setShowScrollIndicator(rect.top > -100);

    if (sectionEntering && !sectionPassed) {
      const scale = 1 + (progress * 0.1);
      setParallaxScale(scale);
    }

    const shouldDarken = rect.top < windowHeight * 0.5 && !sectionPassed;
    setOverlayDarken(shouldDarken);

    // Text fade-in logic
    if (rect.top < windowHeight * 0.7 && rect.top > -sectionHeight * 0.5) {
      setIsFoundedVisible(true);
      
      const scrollDepth = (windowHeight * 0.7 - rect.top) / (windowHeight * 0.5);
      const wordsToShow = Math.floor(scrollDepth * words.length * 1.2);
      
      const newVisibleWords = [];
      for (let i = 0; i < Math.min(wordsToShow, words.length); i++) {
        newVisibleWords.push(i);
      }
      setVisibleWords(newVisibleWords);

      // Show button after all words are visible
      if (wordsToShow >= words.length) {
        setTimeout(() => setShowButton(true), 300);
      }
    }

    // Fade out effect when scrolling past
    if (rect.top < -sectionHeight * 0.3) {
      setIsFadingOut(true);
    } else {
      setIsFadingOut(false);
    }

    // Reset when scrolled above
    if (rect.top > windowHeight) {
      setVisibleWords([]);
      setIsFoundedVisible(false);
      setIsFadingOut(false);
      setIsBgActive(false);
      setIsBgHidden(false);
      setShowButton(false);
    }
  }, [words.length]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const isHighlighted = (word) => {
    return highlightedWords.some(hw =>
      word.toUpperCase().includes(hw.toUpperCase().replace(',', ''))
    );
  };

  const getBgClass = () => {
    if (isBgHidden) return 'hidden';
    if (isBgActive) return 'active';
    return '';
  };

  return (
    <section className="brand-story" ref={sectionRef}>
      {/* Fixed Background */}
      <div className={`brand-story__bg ${getBgClass()}`}>
        <img
          src={backgroundImage}
          alt="Brand Story Background"
          className="brand-story__bg-image"
          style={{ transform: `scale(${parallaxScale})` }}
        />
        <div className={`brand-story__overlay ${overlayDarken ? 'darken' : ''}`} />
      </div>

      {/* Content */}
      <div className="brand-story__content">
        <p className={`brand-story__founded 
          ${isFoundedVisible ? 'visible' : ''} 
          ${isFadingOut ? 'fade-out' : ''}`}
        >
          {foundedText}
        </p>

        <h2 className="brand-story__heading">
          {words.map((word, index) => (
            <span
              key={index}
              className={`brand-story__word 
                ${visibleWords.includes(index) ? 'visible' : ''} 
                ${isHighlighted(word) ? 'highlight' : ''}
                ${isFadingOut ? 'fade-out' : ''}`}
              style={{ transitionDelay: `${index * 0.06}s` }}
            >
              {word}{index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>

        {/* Read More Button */}
        <Link 
          to={storyLink} 
          className={`brand-story__read-more ${showButton ? 'visible' : ''} ${isFadingOut ? 'fade-out' : ''}`}
        >
          <span className="brand-story__read-more-text">Read Our Story</span>
          <span className="brand-story__read-more-icon">
            <FaArrowRight />
          </span>
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div className={`brand-story__scroll-indicator ${!showScrollIndicator ? 'hidden' : ''}`}>
        <span className="brand-story__scroll-text">Scroll</span>
        <div className="brand-story__scroll-line" />
      </div>

      {/* Progress Bar */}
      <div
        className={`brand-story__progress ${isBgActive ? 'active' : ''}`}
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </section>
  );
};

export default BrandStory;