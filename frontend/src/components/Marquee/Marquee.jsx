import React from 'react';
import './Marquee.css';

const Marquee = ({ texts, direction = 'left', bgColor = '#f5f5f5', textColor = '#111' }) => {
  const renderTexts = () => {
    return texts.map((text, index) => (
      <span key={index} className="marquee__item">
        {text}
        <span className="marquee__separator">✦</span>
      </span>
    ));
  };

  return (
    <div
      className="marquee"
      style={{ backgroundColor: bgColor }}
    >
      <div className={`marquee__track marquee__track--${direction}`}>
        <div className="marquee__content" style={{ color: textColor }}>
          {renderTexts()}
          {renderTexts()}
          {renderTexts()}
        </div>
      </div>
    </div>
  );
};

export default Marquee;