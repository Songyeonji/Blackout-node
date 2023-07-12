import React, { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppBar, Toolbar, createTheme, ThemeProvider,LinearProgress } from "@mui/material";
import axios from 'axios';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";

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
  const [diaryEntries, setDiaryEntries] = useState(() => {
  const storedDiaryEntries = localStorage.getItem("diaryEntries");
  return storedDiaryEntries ? JSON.parse(storedDiaryEntries) : {};
});
const [currentMonth, setCurrentMonth] = useState(moment().month());
const [currentMonthEntries, setCurrentMonthEntries] = useState({});
  //날씨
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Daejeon,kr&appid=af984965d76ffbb83dbfda6c8e3faae3&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.log("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    // Save diary entries to localStorage whenever it changes
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  const handleDateChange = (date) => {
    if (selectedDate && date.getMonth() !== selectedDate.getMonth()) {
      setCurrentMonthEntries(diaryEntries[moment(date).format("YYYY-MM")] || {});
    }
    setSelectedDate(date);
  };

  const handleDiaryEntry = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD")]: value,
    }));
  };
  const handleAdditionalDiaryEntry = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD") + "-additional"]: value,
    }));
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD")]: value,
    }));
    
    return event.target.value;
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
  //프로그래스 바
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
      return (
        dateMoment.year() === selectedDate.getFullYear() &&
        dateMoment.month() === selectedDate.getMonth()
      );
    });
  
    const drinkCount = entriesInMonth.filter(([_, entry]) => entry !== "nonAlcohol").length;
    const entryCount = moment(selectedDate).daysInMonth();
    return (drinkCount / entryCount) * 100;
  };

//술 아이콘 찍히게  
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
  const handleStarClick = (rating) => {
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD") + "-rating"]: rating,
    }));
  };

  const renderDrinkIcon = () => {
    const selectedDrink = diaryEntries[moment(selectedDate).format("YYYY-MM-DD")];
    let drinkIcon = null;
  
    switch (selectedDrink) {
      case "wine":
        drinkIcon = <img src={wineIcon} alt="Wine" className="drink-icon" style={{ width: "30px", height: "30px" }} />;
        break;
      case "soju":
        drinkIcon = <img src={sojuIcon} alt="Soju" className="drink-icon" style={{ width: "30px", height: "30px" }} />;
        break;
      case "beer":
        drinkIcon = <img src={beerIcon} alt="Beer" className="drink-icon" style={{ width: "30px", height: "30px" }} />;
        break;
      case "makgeolli":
        drinkIcon = <img src={makgeolliIcon} alt="Makgeolli" className="drink-icon" style={{ width: "30px", height: "30px" }} />;
        break;
      default:
        drinkIcon = null;
        break;
    }
  
    return drinkIcon;
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
        
           {/* 현재 날씨 정보 */}
          {weather && (
          <div style={{ marginTop: "30px", marginLeft: "30px" }}>
            <h2>현재 날씨</h2>
            <div>
              <strong>도시:</strong> {weather.name}
            </div>
          {weather.main && (
            <div>
            <strong>기온:</strong> {weather.main.temp}°C
            </div>
          )}
          {weather.weather && (
            <div>
            <strong>날씨:</strong> {weather.weather[0].description}
            </div>
          )}
        </div>
        )}
        
        {selectedDate && (
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft:"30px"  }}> {/* 텍스트 필드를 가운데로 정렬 */}
          
            <h2>{moment(selectedDate).format("YYYY-MM-DD")}</h2>
            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            <textarea
            value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-additional"] || ""}
            rows={5}
            onChange={handleAdditionalDiaryEntry}
            placeholder="Additional notes..."
            />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}> {/* 텍스트 필드를 가운데로 정렬 */}
              <textarea
                value={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] || ""}
                onChange={handleDiaryEntry}
                rows={1}
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
              <label>
                <input
                  type="radio"
                  name="drink"
                  value="nonAlcohol"
                  checked={diaryEntries[moment(selectedDate).format("YYYY-MM-DD")] === "nonAlcohol"}
                  onChange={handleRadioChange}
                />
                {getRadioLabel("makgeolli", "nonAlcohol")}
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
            </div>

            </div>

        )}
      </div>
    </ThemeProvider>
  );
};

export default DiaryCalendar;
