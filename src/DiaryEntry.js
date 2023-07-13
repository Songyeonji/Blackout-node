import React from "react";
import moment from "moment";
import { LinearProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";

import wineIcon from "./icon/wine-bottle.png";
import sojuIcon from "./icon/soju.png";
import beerIcon from "./icon/beer.png";
import makgeolliIcon from "./icon/rice-wine.png";
import AlcoholProgress from "./AlcoholProgress";

const DiaryEntry = ({
  selectedDate,
  diaryEntries,
  setDiaryEntries, // Add setDiaryEntries prop
  handleAdditionalDiaryEntry,
  handleRadioChange,
  getImageByDrink,
  renderDrinkIcon,
  handleStarClick,
  calculateDrinkRatio,
  calculateTotalDrinkRatio
}) => {
    
  const tileContent = ({ date }) => {
    const entry = diaryEntries[moment(date).format("YYYY-MM-DD")];
    if (entry) {
      const imageSrc = getImageByDrink(entry);
      if (imageSrc) {
        return <img className="dot" src={imageSrc} alt={entry} />;
      }
    }
    return null;
  };

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
        <div className="star-group">
          <span className="star-label">별점:</span>
          {Array.from({ length: 5 }, (_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index + 1 <= diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-rating"] ? solidStar : emptyStar}
              className={`star ${index + 1 <= diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-rating"] ? "filled" : ""}`}
              onClick={() => handleStarClick(index + 1)}
            />
          ))}
        </div>
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
