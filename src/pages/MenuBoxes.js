// MenuBoxes.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './MenuBoxes.scss';
// Import images
import calendarImage from './icon/C.png';
import drinkRecommendationImage from './icon/R.png';
import alcoholInformationImage from './icon/W.png';

const MenuBoxes = () => {
  const history = useHistory();
  const boxes = [
   
    { id: 1, img: drinkRecommendationImage, text: '오늘의 술 추천', path: '/drink-recommendation' },
    { id: 2, img: calendarImage, text: '달력', path: '/diary-calendar' },
    { id: 3, img: alcoholInformationImage, text: '술 정보', path: '/learn-more' }
  ];

  const handleBoxClick = (path) => {
    history.push(path);
  };
  return (
    <div className="menu-boxes-container">
      {boxes.map(box => (
        <div
          className={`menu-box menu-box-${box.id}`}
          style={{ '--img': `url(${box.img})` }}
          data-text={box.text}
          key={box.id}
          onClick={() => handleBoxClick(box.path)}
        ></div>
      ))}
    </div>
  );
};

export default MenuBoxes;
