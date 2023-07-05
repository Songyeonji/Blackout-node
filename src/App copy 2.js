import React, { useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppBar, Toolbar, createTheme, ThemeProvider,LinearProgress } from "@mui/material";

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
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  

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
  const calculateDrinkRatio = (drink) => {
    const entriesInMonth = Object.entries(diaryEntries).filter(([date]) => {
      const dateMoment = moment(date);
      return dateMoment.year() === selectedDate.getFullYear() && dateMoment.month() === selectedDate.getMonth();
    });

    const drinkCount = entriesInMonth.filter(([_, entry]) => entry === drink).length;
    const entryCount = moment(selectedDate).daysInMonth();

    return (drinkCount / entryCount) * 100;
  };

  const calculateTotalDrinkRatio = () => {
    const entriesInMonth = Object.entries(diaryEntries).filter(([date]) => {
      const dateMoment = moment(date);
      return dateMoment.year() === selectedDate.getFullYear() && dateMoment.month() === selectedDate.getMonth();
    });

    const drinkCount = entriesInMonth.length;
    const entryCount = moment(selectedDate).daysInMonth();

    if (entryCount === 0 || drinkCount === 0) {
      return 0;
    }

    return (drinkCount / entryCount) * 100;
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft:"30px"  }}> {/* 텍스트 필드를 가운데로 정렬 */}
            <h2>{moment(selectedDate).format("YYYY-MM-DD")}</h2>
            <div style={{ display: "flex", justifyContent: "center" }}> {/* 텍스트 필드를 가운데로 정렬 */}
              <textarea
                value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] || ""}
                onChange={handleDiaryEntry}
                rows={5}
              />
            </div>
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

            <div style={{ width: "100%", marginTop: "20px" }}>
              <h2>이번달 알콜 수치</h2>
              {/* 와인 프로그레스 바 */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <div style={{ width: "100px", marginRight: "10px" }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateDrinkRatio("wine")}
                    style={{ backgroundColor: "#D5A9E3", height: "15px", borderRadius: "10px" }}
                  />
                </div>
                <span>{`${calculateDrinkRatio("wine").toFixed(0)}% 와인`}</span>
              </div>
              {/* 소주 프로그레스 바 */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <div style={{ width: "100px", marginRight: "10px" }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateDrinkRatio("soju")}
                    style={{ backgroundColor: "#98EECC", height: "15px", borderRadius: "10px" }}
                  />
                </div>
                <span>{`${calculateDrinkRatio("soju").toFixed(0)}% 소주`}</span>
              </div>
              {/* 맥주 프로그레스 바 */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <div style={{ width: "100px", marginRight: "10px" }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateDrinkRatio("beer")}
                    style={{ backgroundColor: "#AED6F1", height: "15px", borderRadius: "10px" }}
                  />
                </div>
                <span>{`${calculateDrinkRatio("beer").toFixed(0)}% 맥주`}</span>
              </div>
              {/* 막걸리 프로그레스 바 */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "100px", marginRight: "10px" }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateDrinkRatio("makgeolli")}
                    style={{ backgroundColor: "#F9E79F", height: "15px", borderRadius: "10px" }}
                  />
                </div>
                <span>{`${calculateDrinkRatio("makgeolli").toFixed(0)}% 막걸리`}</span>
              </div>
               {/* 총 음주량 프로그레스 바 */}
              {Object.values(diaryEntries).includes("wine") ||
              Object.values(diaryEntries).includes("soju") ||
              Object.values(diaryEntries).includes("beer") ||
              Object.values(diaryEntries).includes("makgeolli") ? (
                <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                  <div style={{ width: "100%", marginRight: "10px" }}>
                    <LinearProgress
                      variant="determinate"
                      value={calculateTotalDrinkRatio()}
                      style={{ backgroundColor: "#B799FF", height: "15px", borderRadius: "10px" }}
                    />
                  </div>
                  <span>{`${calculateTotalDrinkRatio().toFixed(0)}% 총 음주량`}</span>
                </div>
              ) : null}
            </div>

            </div>

        )}
      </div>
    </ThemeProvider>
  );
};

export default DiaryCalendar;
