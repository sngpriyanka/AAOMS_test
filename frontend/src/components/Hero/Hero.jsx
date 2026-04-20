import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__background">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop"
          alt="Adventure Background"
          className="hero__bg-image"
        />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content">
        <h1 className="hero__title">
          FUNCTIONAL CLOTHING FOR THE
          <span className="hero__title-highlight"> ADVENTUROUS SOUL</span>
        </h1>
        <p className="hero__subtitle">
          FROM OUTDOOR TRAVELS TO INDOOR WORKOUTS
          <br />
          GEAR DESIGNED TO HELP YOU MOVE BETTER
        </p>
        <Link to="/collection" className="hero__cta">
          VIEW COLLECTION
        </Link>
      </div>
    </section>
  );
};

export default Hero;