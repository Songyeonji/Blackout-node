import React, { useEffect, useState } from 'react';
import './Logo.scss';

const Logo = () => {
  const [logoText, setLogoText] = useState("Blackout");

  useEffect(() => {
    // 로고 텍스트를 span과 i 태그로 변환
    const transformedText = logoText.split('').map((char, index) => (
      <span className="logo-span" key={index}>
        {char}
        {[...Array(7)].map((_, i) => <i className="logo-i" key={i}>{char}</i>)}
      </span>
    ));
    setLogoText(transformedText);
  }, []);

  return (
    <div className="logo-body">
      <a href="#" target="_blank" className="logo-link">
        {logoText}
      </a>
    </div>
  );
};

export default Logo;