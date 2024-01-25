import React from "react";
import moment from "moment";
import { Rating } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { CompactPicker } from "react-color"; // 컬러 피커를 추가합니다.


import AlcoholProgress from "./AlcoholProgress";

const DiaryEntry = ({
  // props로 받은 변수들 및 함수들
  selectedDate, // 선택된 날짜
  diaryEntries, // 일기 항목들
  setDiaryEntries, // 일기 항목들을 설정하는 함수
  handleAdditionalDiaryEntry, // 추가 일기 항목을 처리하는 함수
  handleRadioChange, // 라디오 버튼 변경을 처리하는 함수
  getImageByDrink, // 음료에 따른 이미지를 가져오는 함수
  renderDrinkIcon, // 음료 아이콘을 렌더링하는 함수
  handleStarClick, // 별점 클릭을 처리하는 함수
  calculateDrinkRatio, // 음료 비율을 계산하는 함수
  calculateTotalDrinkRatio, // 총 음료 비율을 계산하는 함수
  handleColorSelect, // 색상 선택을 처리하는 함수
  selectedColor, // 선택된 색상
  colorPalette, // 색상 팔레트
  setSelectedColor, // 선택된 색상을 설정하는 함수
  handleAddColor, // 색상을 추가하는 함수
  handleDeleteColor, // 색상을 삭제하는 함수
}) => {


  // 라디오 버튼의 라벨을 반환하는 함수
  const getRadioLabel = (value, text) => {
    const entryValue = diaryEntries[moment(selectedDate).format("YYYY-MM-DD")];
    if (entryValue === value) {
      return <span className="selected">{text}</span>;
    }
    return text;
  };
  

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "30px", marginTop: "20px" }}>
      {/* 날짜 */}
      <h2 style={{ marginBottom: "10px" }}>{moment(selectedDate).format("YYYY-MM-DD")}</h2>

      <textarea
        value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-additional"] || ""}
        rows={5}
        onChange={handleAdditionalDiaryEntry}
        placeholder="Additional notes..."
        style={{ marginBottom: "10px" }}
      />

      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <label>
          <input
            type="radio"
            name="drink"
            value="wine"
            checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "wine"}
            onChange={handleRadioChange}
          />
          {getRadioLabel("wine", "와인")}
        </label>
        <label>
          <input
            type="radio"
            name="drink"
            value="soju"
            checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "soju"}
            onChange={handleRadioChange}
          />
          {getRadioLabel("soju", "소주")}
        </label>
        <label>
          <input
            type="radio"
            name="drink"
            value="beer"
            checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "beer"}
            onChange={handleRadioChange}
          />
          {getRadioLabel("beer", "맥주")}
        </label>
        <label>
          <input
            type="radio"
            name="drink"
            value="makgeolli"
            checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "makgeolli"}
            onChange={handleRadioChange}
          />
          {getRadioLabel("makgeolli", "막걸리")}
        </label>
        <label>
          <input
            type="radio"
            name="drink"
            value="nonAlcohol"
            checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "nonAlcohol"}
            onChange={handleRadioChange}
          />
          {getRadioLabel("", "nonAlcohol")}
        </label>
      </div>

      <div style={{ marginLeft: "10px" }}>{renderDrinkIcon()}</div>
      <div>
        <label>
          병수:
          <input
            type="number"
            min={0}
            value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-quantity"] || ""}
            onChange={(event) => {
              const { value } = event.target;
              setDiaryEntries((prevDiaryEntries) => ({
                ...prevDiaryEntries,
                [moment(selectedDate).format("YYYY-MM-DD") + "-quantity"]: value,
              }));
            }}
            style={{ marginLeft: "5px", width: "50px" }}
          />
        </label>
      </div>

      <div>
        <div className="star-group" style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <span className="star-label" style={{ marginRight: "10px" }}>별점:</span>
          <Rating
            name="highlight-selected-only"
            value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-rating"] || 0}
            onChange={(event, rating) => handleStarClick(rating)}
            emptyIcon={<FontAwesomeIcon icon={emptyStar} />}
            icon={<FontAwesomeIcon icon={solidStar} />}
            hover
          />
        </div>
      </div>
      
      <div className="color-palette">
        {colorPalette.map((color, index) => (
          <div
            key={index}
            className="color-option"
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
          >
            <span
              className="delete-color"
              onClick={() => handleDeleteColor(color)}
            >
              X
            </span>
          </div>
        ))}
      </div>
      {/* 컬러 피커 */}
      <div className="color-picker">
        <CompactPicker color={selectedColor} onChange={(color) => setSelectedColor(color.hex)} />
        <button onClick={handleAddColor}>+</button>
      </div>

      <div style={{ width: "100%", marginTop: "20px" }}>
        <h2>이번달 알콜 수치</h2>
        <AlcoholProgress
          calculateDrinkRatio={calculateDrinkRatio}
          calculateTotalDrinkRatio={calculateTotalDrinkRatio}
        />
      </div>
    </div>
  );
};

export default DiaryEntry;
