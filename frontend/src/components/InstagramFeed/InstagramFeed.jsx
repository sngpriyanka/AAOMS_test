// InstagramFeed.jsx
import React, { useRef, useEffect, useState } from 'react';
import { FaInstagram, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { instagramPosts } from '../../data/homeData';
import './InstagramFeed.css';

const InstagramFeed = () => {
  const scrollRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollInterval = useRef(null);

  // Auto scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollInterval.current = setInterval(() => {
        if (scrollRef.current && isAutoScrolling) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          
          // If reached the end, scroll back to start
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
          }
        }
      }, 3000); // Auto scroll every 3 seconds
    };

    if (isAutoScrolling) {
      startAutoScroll();
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      
      if (scrollLeft <= 10) {
        scrollRef.current.scrollTo({ 
          left: scrollRef.current.scrollWidth, 
          behavior: 'smooth' 
        });
      } else {
        scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="instagram-feed">
      <div className="instagram-feed__header">
        <h2 className="instagram-feed__title">TROOPERS AROUND THE WORLD</h2>
        <p className="instagram-feed__subtitle">
          JOIN OUR INSTAGRAM COMMUNITY OF GLOBETROTTERS AND EXPLORERS
        </p>
      </div>

      <div 
        className="instagram-feed__grid-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className="instagram-feed__scroll-btn instagram-feed__scroll-btn--left" 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <FaChevronLeft size={18} />
        </button>

        <div className="instagram-feed__grid" ref={scrollRef}>
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.reelLink || post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-feed__item"
            >
              <img src={post.image} alt={post.alt || "Instagram post"} loading="lazy" />
              <div className="instagram-feed__item-overlay">
                <FaInstagram size={20} color="#fff" />
              </div>
              {post.isReel && (
                <div className="instagram-feed__reel-indicator">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff">
                    <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1z"/>
                    <path d="M9.5 7.5v9l7-4.5z"/>
                  </svg>
                </div>
              )}
            </a>
          ))}
        </div>

        <button 
          className="instagram-feed__scroll-btn instagram-feed__scroll-btn--right" 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <FaChevronRight size={18} />
        </button>
      </div>

      <div className="instagram-feed__cta-wrapper">
        <a
          href="https://www.instagram.com/aaoms/reels/"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-feed__cta"
        >
          VISIT INSTAGRAM
        </a>
      </div>
    </section>
  );
};

export default InstagramFeed;