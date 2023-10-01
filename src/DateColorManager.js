import React, { useState, useEffect } from "react";

const DateColorManager = ({ dateColors, updateDateColor }) => {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  useEffect(() => {
    // 페이지가 처음 열릴 때 localStorage에서 저장된 색상을 불러옵니다.
    const storedColor = localStorage.getItem("selectedColor");
    if (storedColor) {
      setSelectedColor(storedColor);
    }
  }, []);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    // 색상 변경 시 localStorage에 저장합니다.
    localStorage.setItem("selectedColor", newColor);
  };

  return (
    <div>
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
      />
      {/* 날짜 색상 업데이트 */}
      <button onClick={() => updateDateColor("2023-09-29", selectedColor)}>
        색상 지우기
      </button>
    </div>
  );
};

export default DateColorManager;
