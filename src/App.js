import React, { useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import wineIcon from "./icon/wine-bottle.png";
import sojuIcon from "./icon/soju.png";
import beerIcon from "./icon/beer.png";
import makgeolliIcon from "./icon/rice-wine.png";

const DiaryCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState({});

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDiaryEntry = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD")]: value,
    }));
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD")]: value,
    }));
  };

  const getImageByDrink = (drink) => {
    switch (drink) {
      case "wine":
        return wineIcon;
      case "soju":
        return sojuIcon;
      case "beer":
        return beerIcon;
      case "makgeolli":
        return makgeolliIcon;
      default:
        return null;
    }
  };

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
    <div>
      <h1>Diary Calendar</h1>
      <Calendar onChange={handleDateChange} value={selectedDate} tileContent={tileContent} />
      {selectedDate && (
        <div>
          <h2>{moment(selectedDate).format("YYYY-MM-DD")}</h2>
          <textarea
            value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] || ""}
            onChange={handleDiaryEntry}
            rows={5}
          />
          <div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryCalendar;