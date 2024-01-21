import React, { useEffect, useState } from 'react';
import '../pages/Logo.scss';

const Title = () => {
  const [transformedLogo, setTransformedLogo] = useState(null);


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

  return (
    <div className="app-container-s">
      <div className="logo-container-s" >
          {transformedLogo}
        </div>
      </div>

  );
};

export default Title;
