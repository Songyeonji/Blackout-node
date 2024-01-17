import React, { useEffect, useState } from 'react';
import MenuBoxes from './MenuBoxes';
import './Logo.scss';

const Logo = () => {
  const [transformedLogo, setTransformedLogo] = useState(null);
  const [showBoxes, setShowBoxes] = useState(false);

  useEffect(() => {
    const logoText = "Blackout";
    const transformedText = logoText.split('').map((char, index) => (
      <span className="logo-span" key={index}>
        {char}
        {[...Array(7)].map((_, i) => <i className="logo-i" key={i}>{char}</i>)}
      </span>
    ));
    setTransformedLogo(transformedText);
  }, []);

  const handleLogoClick = () => {
    setShowBoxes(!showBoxes);
  };

  return (
    <div className="app-container">
      <div className="logo-container" onClick={handleLogoClick}>
        <div className={`logo-body ${showBoxes ? 'small' : ''} logo-link`}>
          {transformedLogo}
        </div>
      </div>
      {showBoxes && <MenuBoxes />}
    </div>
  );
};

export default Logo;
