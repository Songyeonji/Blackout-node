// MenuBoxes.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './MenuBoxes.scss';

const MenuBoxes = () => {
  const history = useHistory();
  const boxes = [
    
    { id: 1, img: 'https://i.postimg.cc/sgBkfbtx/img-1.jpg', text: '달력', path: '/diary-calendar' },
    { id: 2, img: 'https://i.postimg.cc/3RZ6bhDS/img-2.jpg', text: '오늘의 술 추천', path: '/drink-recommendation' },
    { id: 3, img: 'https://i.postimg.cc/DZhHg0m4/img-3.jpg', text: '술 정보', path: '/learn-more' }
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
