import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { exploreCategories } from '../../data/homeData';
import './ExploreCollections.css';

const ExploreCollections = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Section enters viewport
    if (rect.top < windowHeight * 0.85) {
      setIsVisible(true);
    }

    // Label animation
    if (rect.top < windowHeight * 0.75) {
      setLabelVisible(true);
    }

    // Individual items animation based on scroll
    if (rect.top < windowHeight * 0.7) {
      const scrollDepth = (windowHeight * 0.7 - rect.top) / (windowHeight * 0.4);
      const itemsToShow = Math.floor(scrollDepth * exploreCategories.length * 1.2);
      
      const newVisibleItems = [];
      for (let i = 0; i < Math.min(itemsToShow, exploreCategories.length); i++) {
        newVisibleItems.push(i);
      }
      setVisibleItems(newVisibleItems);
    }

    // Reset when scrolled above
    if (rect.top > windowHeight) {
      setIsVisible(false);
      setLabelVisible(false);
      setVisibleItems([]);
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section className="explore-collections" ref={sectionRef}>
      <div className={`explore-collections__wrapper ${isVisible ? 'visible' : ''}`}>
        <h3 className={`explore-collections__label ${labelVisible ? 'visible' : ''}`}>
          <span className="explore-collections__label-dot">■</span>
          EXPLORE COLLECTIONS
        </h3>

        <div className="explore-collections__list">
          {exploreCategories.map((category, index) => (
            <Link
              to={category.link}
              key={category.id}
              className={`explore-collections__item ${visibleItems.includes(index) ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="explore-collections__item-image">
                <img src={category.image} alt={category.name} />
              </div>
              <h4 className="explore-collections__item-name">{category.name}</h4>
              <FaArrowRight className="explore-collections__arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCollections;