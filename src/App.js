import React, { useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";

import wineIcon from "./icon/wine-bottle.png";
import sojuIcon from "./icon/soju.png";
import beerIcon from "./icon/beer.png";
import makgeolliIcon from "./icon/rice-wine.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div className="flex-1"></div>
            <span className="font-bold">Black out</span>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <div className="calendar-container">
          <Calendar onChange={handleDateChange} locale="en" value={selectedDate} tileContent={tileContent} />
        </div>
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
    </ThemeProvider>
  );
};

export default DiaryCalendar;
