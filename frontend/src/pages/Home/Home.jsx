import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import ProductSection from '../../components/ProductSection/ProductSection';
import Marquee from '../../components/Marquee/Marquee';
import ExploreCollections from '../../components/ExploreCollections/ExploreCollections';
import BrandStory from '../../components/BrandStory/BrandStory';
import Testimonial from '../../components/Testimonial/Testimonial';
import InstagramFeed from '../../components/InstagramFeed/InstagramFeed';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Collection from '../Collection/Collection';
import {
  cargopantsCollectionProducts,
   scrubProducts,
   hoddiesProducts, 
  hoppersProducts,
  marqueeTexts1,
  marqueeTexts2,
  marqueeTexts3,
  marqueeTexts4,
  marqueeTexts5,
  tshirtsProducts,
  appronProducts,
} from '../../data/homeData';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />

      {/* Hoppers */}
      <ProductSection
        title="HOPPERS"
        subtitle="YOUR GO-TO PANTS FOR WHEREVER LIFE TAKES YOU."
        products={hoppersProducts}
        viewAllLink="/collections/hoppers"
      />


      {/* Marquee 1 */}
      <Marquee
        texts={marqueeTexts1}
        direction="left"
        bgColor="#f5f5f5"
        textColor="#111"
      />

      {/* CARGO PANTS */}
      <ProductSection
        title="CARGO PANTS"
        subtitle="READY FOR ANY ADVENTURE, FROM AIRPORTS TO MOUNTAIN TRAILS"
        products={cargopantsCollectionProducts}
        viewAllLink="/collections/cargo-pants"
      />

      {/* Marquee 2 */}
      <Marquee
        texts={marqueeTexts2}
        direction="right"
        bgColor="#f5f5f5"
        textColor="#111"
      />

      {/* Scrub */}
      <ProductSection
        title="Scrub"
        subtitle="SIMPLE. ELEGANT. TIMELESS."
        products={scrubProducts}
        viewAllLink="/collections/scrubs"
      />

            {/* Marquee 3 */}
      <Marquee
        texts={marqueeTexts3}
        direction="left"
        bgColor="#f5f5f5"
        textColor="#111"
      />

      {/* Hoddies */}
      <ProductSection
        title="HOODIES"
        subtitle="COMFORTABLE. STYLISH. TIMELESS."
        products={hoddiesProducts}
        viewAllLink="/collections/hoodies"
      />

      {/* Marquee 4 */}
      <Marquee
        texts={marqueeTexts4}
        direction="right"
        bgColor="#f5f5f5"
        textColor="#111"
      />

            {/* T-Shirts */}
      <ProductSection
        title="T-SHIRTS"
        subtitle="COMFORTABLE. STYLISH. TIMELESS."
        products={tshirtsProducts}
        viewAllLink="/collections/tshirts"
      />

            {/* Marquee 5 */}
      <Marquee
        texts={marqueeTexts5}
        direction="left"
        bgColor="#f5f5f5"
        textColor="#111"
      />

      {/* Aprons */}
      <ProductSection
        title="APRONS"
        subtitle="COMFORTABLE. STYLISH. TIMELESS."
        products={appronProducts}
        viewAllLink="/collections/apron"
      />

      {/* Explore Collections */}
      <ExploreCollections />

      {/* Brand Story */}

<BrandStory 
  backgroundImage="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&h=700&fit=crop"
  foundedText="FOUNDED IN 2013, MUMBAI"
  highlightedWords={["TROOPER", "TRAVELLERS,"]}
  mainText="TROOPER IS A DESIGN HOUSE FOR TRAVELLERS, EXPLORERS & OUTDOOR"
/>

      {/* Testimonial */}
      <Testimonial />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;