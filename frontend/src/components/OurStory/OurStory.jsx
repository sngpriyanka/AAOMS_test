// OurStory.jsx
import React from 'react';
import './OurStory.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const OurStory = () => {
  return (
    <div className="our-story-page">
<Navbar alwaysSolid   hideOnScroll 
  noShadow />

      {/* Main Content */}
      <main className="main-content">
        {/* About Section */}
        <section className="about-section">
          <h1 className="about-title">ABOUT</h1>
          
          <h2 className="tagline">
            CRAFTED FOR<br />
            EXPLORERS, INSPIRED<br />
            BY NATURE.
          </h2>

          {/* Hero Image - Three explorers */}
          <div className="hero-image-container">
            <img 
              src="https://www.skylarkhimalayantravel.com/wp-content/uploads/2019/11/WhatsApp-Image-2024-11-13-at-20.33.24-1600x1080.jpeg" 
              alt="Three explorers in mountains" 
              className="hero-image"
            />
          </div>
        </section>

        {/* Secondary Image Section */}
        <section className="secondary-image-section">
          <div className="secondary-image-container">
            <img 
              src="https://www.shutterstock.com/image-photo/travel-traveler-backpack-260nw-294861680.jpg" 
              alt="Traveler with backpack" 
              className="secondary-image"
            />
          </div>
        </section>

        {/* Our Story Section */}
        <section className="story-section">
          <div className="story-logo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaHe5txcIzzBVwLO-op8SAo7xDhL6cvHF3iw&s" alt="Bombay Trooper Badge" />
          </div>
          
          <h2 className="story-title">OUR STORY</h2>
          <p className="story-established">ESTABLISHED IN 2013</p>
          
          <p className="story-text">
            BOMBAY TROOPER STARTED AS A BOLD ADVENTURE BACK IN 2013. OVER THE LAST DECADE, WE'VE TRANSFORMED AND 
            EVOLVED, FROM PIONEERING THE PRINT ON DEMAND MODEL AS A T-SHIRT COMPANY TO CRAFTING INNOVATIVE TRAVEL 
            APPAREL FROM RECYCLED PLASTICS. WHAT'S REMAINED CONSTANT? OUR ENTHUSIASM FOR GOOD DESIGN, INSATIABLE 
            CURIOSITY, AND UNYIELDING HUNGER FOR INNOVATION.
          </p>
        </section>

        {/* Inspired by Travels Section */}
        <section className="values-section">
          <h3 className="value-title">INSPIRED BY TRAVELS</h3>
          <p className="value-text">
            EACH JOURNEY WE TAKE FUELS OUR CREATIVITY, DRIVING US TO DESIGN PRODUCTS THAT NOT ONLY MAKE YOUR 
            ADVENTURES MORE ENJOYABLE BUT ALSO KEEP YOU LOOKING EFFORTLESSLY STYLISH. WHETHER YOU'RE TREKKING 
            THROUGH RUGGED LANDSCAPES OR EXPLORING URBAN JUNGLES, OUR TRAVEL-INSPIRED APPAREL COMBINES 
            FUNCTIONALITY WITH FASHION, ENSURING YOU'RE ALWAYS READY FOR THE NEXT GREAT ADVENTURE.
          </p>
        </section>

        {/* Committed to Sustainability Section */}
        <section className="values-section">
          <h3 className="value-title">COMMITTED TO SUSTAINABILITY</h3>
          <p className="value-text">
            BUT LOVING NATURE MEANS CARING FOR IT TOO. THAT'S WHY WE'RE COMMITTED TO PLANET-FIRST INITIATIVES LIKE 
            CRAFTING SHIRTS AND SHORTS FROM RECYCLED PLASTIC AND INCORPORATING ECO-FRIENDLY FIBERS LIKE LYOCELL 
            AND BAMBOO INTO OUR CLOTHING. SUSTAINABILITY ISN'T JUST A BUZZWORD FOR US; IT'S AT THE HEART OF 
            EVERYTHING WE DO.
          </p>
          <p className="value-text">
            OUR DEDICATION DOESN'T STOP THERE. WITH OUR PLASTIC NEUTRALITY PROGRAM, WE REMOVE 1 KG OF PLASTIC 
            WASTE FROM THE OCEAN FOR EVERY KILO OF PRODUCT WE SELL. IT'S OUR WAY OF ENSURING THAT EVERY STEP WE 
            TAKE LEAVES A POSITIVE IMPACT.
          </p>
        </section>

        {/* Driven by Art Section */}
        <section className="values-section">
          <h3 className="value-title">DRIVEN BY ART</h3>
          <p className="value-text">
            ART AND CREATIVITY ARE OUR LIFEBLOOD. THEY INSPIRE US TO PUSH BOUNDARIES AND EXPERIMENT WITH NEW IDEAS, 
            FROM DESIGNING UNIQUE PLAYING CARDS TO CREATING T-SHIRT COLLECTIONS LIKE TREKS OF INDIA. OUR PASSION FOR 
            ART FUELS OUR ENDLESS PURSUIT OF COOL, INNOVATIVE PROJECTS.
          </p>
          <p className="value-text">
            WE INVITE EVERY TROOPER TO JOIN US ON THIS INCREDIBLE JOURNEY AND LIVE BY OUR IDEALS. BECAUSE, IN THE END, 
            THE JOY OF ANY ADVENTURE LIES IN DOING IT TOGETHER.
          </p>
        </section>

        {/* Couple Image Section */}
        <section className="image-gallery">
          <div className="gallery-image-container">
            <img 
              src="https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2021/01/14101943/New-Featured-1-3.jpg" 
              alt="Couple travelers" 
              className="gallery-image"
            />
          </div>
        </section>

        {/* Adventure Image Section */}
        <section className="image-gallery">
          <div className="gallery-image-container">
            <img 
              src="https://thatoneadventurecouple.com/wp-content/uploads/2019/02/rattlesnake-ridge-hike-seattle-washington.jpg" 
              alt="Adventure couple" 
              className="gallery-image"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
<Footer />
    </div>
  );
};

export default OurStory;