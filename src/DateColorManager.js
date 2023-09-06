import React from "react";

const DateColorManager = ({ dateColors, updateDateColor }) => {
  return (
    <div>
      {Object.entries(dateColors).map(([date, color]) => (
        <div key={date}>
          <span>날짜: {date}</span>
          <input
            type="color"
            value={color}
            onChange={(e) => updateDateColor(date, e.target.value)}
          />
          <button onClick={() => updateDateColor(date, "")}>색상 지우기</button>
        </div>
      ))}
    </div>
  );
};

export default DateColorManager;
