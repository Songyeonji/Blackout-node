import React, { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppBar, Toolbar, createTheme, ThemeProvider, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { StyledRating } from "@mui/lab";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";

import wineIcon from "./icon/wine-bottle.png";
import sojuIcon from "./icon/soju.png";
import beerIcon from "./icon/beer.png";
import makgeolliIcon from "./icon/rice-wine.png";

import WeatherInfo from "./WeatherInfo";
import DiaryEntry from "./DiaryEntry";
import AlcoholProgress from "./AlcoholProgress";

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
  // 날씨
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

  // 프로그래스 바
  const calculateDrinkRatio = (drink) => {
    const entriesInMonth = Object.entries(diaryEntries).filter(([date]) => {
      const dateMoment = moment(date);
      return (
        dateMoment.year() === selectedDate.getFullYear() &&
        dateMoment.month() === selectedDate.getMonth()
      );
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

  const handleStarClick = (rating) => {
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD") + "-rating"]: rating,
    }));
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

  const renderDrinkIcon = () => {
    const selectedDrink = diaryEntries[moment(selectedDate).format("YYYY-MM-DD")];
    let drinkIcon = null;

    switch (selectedDrink) {
      case "wine":
        drinkIcon = (
          <img
            src={wineIcon}
            alt="Wine"
            className="drink-icon"
            style={{ width: "30px", height: "30px" }}
          />
        );
        break;
      case "soju":
        drinkIcon = (
          <img
            src={sojuIcon}
            alt="Soju"
            className="drink-icon"
            style={{ width: "30px", height: "30px" }}
          />
        );
        break;
      case "beer":
        drinkIcon = (
          <img
            src={beerIcon}
            alt="Beer"
            className="drink-icon"
            style={{ width: "30px", height: "30px" }}
          />
        );
        break;
      case "makgeolli":
        drinkIcon = (
          <img
            src={makgeolliIcon}
            alt="Makgeolli"
            className="drink-icon"
            style={{ width: "30px", height: "30px" }}
          />
        );
        break;
      default:
        drinkIcon = null;
        break;
    }

    return drinkIcon;
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <AppBar position="fixed">
          <Toolbar>
            <div className="flex-1"></div>
            <Link to="/drink-recommendation" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">오늘의 술 추천</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <div className="calendar-container" style={{ marginTop: "10px" }}>
          <Calendar onChange={handleDateChange} locale="en" value={selectedDate} tileContent={tileContent} />

          {weather && <WeatherInfo weather={weather} />}
        </div>

        {selectedDate && (
          <DiaryEntry
            selectedDate={selectedDate}
            diaryEntries={diaryEntries}
            handleAdditionalDiaryEntry={handleAdditionalDiaryEntry}
            handleRadioChange={handleRadioChange}
            getImageByDrink={getImageByDrink}
            renderDrinkIcon={renderDrinkIcon}
            handleStarClick={handleStarClick}
            calculateDrinkRatio={calculateDrinkRatio}
            calculateTotalDrinkRatio={calculateTotalDrinkRatio}
            setDiaryEntries={setDiaryEntries}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default DiaryCalendar;
