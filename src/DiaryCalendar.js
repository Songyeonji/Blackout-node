import React, { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppBar, Toolbar, createTheme, ThemeProvider, Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import wineIcon from "./icon/wine-bottle.png";
import sojuIcon from "./icon/soju.png";
import beerIcon from "./icon/beer.png";
import makgeolliIcon from "./icon/rice-wine.png";
import WeatherInfo from "./WeatherInfo";
import DiaryEntry from "./DiaryEntry";
import DateColorManager from "./DateColorManager"; // DateColorManager 추가
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
  const [showSnackbar, setShowSnackbar] = useState(false);

  // 날씨
  const [weather, setWeather] = useState(null);

  // 색상 팔레트와 선택된 색상을 관리하기 위한 상태
  const [dateColors, setDateColors] = useState({});
  const [colorPalette, setColorPalette] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#ffffff"); // 기본 색상

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

  useEffect(() => {
    if (selectedDate && currentMonth !== selectedDate.getMonth()) {
      setCurrentMonthEntries(
        diaryEntries[moment(selectedDate).format("YYYY-MM")] || {}
      );
      setCurrentMonth(selectedDate.getMonth());
    }
  }, [selectedDate, diaryEntries, currentMonth]);
//칼러 상태관리
  useEffect(() => {
    localStorage.setItem("dateColors", JSON.stringify(dateColors));
  }, [dateColors]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 컬러 팔레트에 컬러 추가
  const handleAddColor = () => {
    if (!colorPalette.includes(selectedColor)) {
      setColorPalette([...colorPalette, selectedColor]);
    }
  };

  // 컬러 피커의 컬러 변경 핸들러
  const handleColorSelect = (color) => {
    setSelectedColor(color.hex);
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

    const drinkCount = entriesInMonth.filter(([_, entry]) => entry === drink)
      .length;
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

    const drinkCount = entriesInMonth.filter(([_, entry]) => entry !== "nonAlcohol")
      .length;
    const entryCount = moment(selectedDate).daysInMonth();
    const ratio = (drinkCount / entryCount) * 100;

    if (ratio > 20) {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    } else {
      setShowSnackbar(false);
    }

    return ratio;
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

  // DateColorManager 컴포넌트에서 호출할 함수
  const updateDateColor = (date, color) => {
    setDateColors((prevDateColors) => ({
      ...prevDateColors,
      [date]: color,
    }));
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
            <Link
              to="/drink-recommendation"
              style={{ color: "white", textDecoration: "none" }}
            >
              <span className="font-bold">오늘의 술 추천</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <div className="calendar-container" style={{ marginTop: "10px" }}>
          <Calendar
            onChange={handleDateChange}
            locale="en"
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={({ date }) => {
              // 선택한 날짜의 배경색을 dateColors 상태에서 가져옴
              const selectedDateColor = dateColors[moment(date).format("YYYY-MM-DD")];
              return selectedDateColor
                ? `custom-background-${selectedDateColor}`
                : null;
            }}
          />

          {weather && <WeatherInfo weather={weather} />}
        </div>
        <Snackbar
          open={showSnackbar}
          message="당신은 정말 술을 사랑하는군요!"
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity="info"
            sx={{
              backgroundColor: "#6f48eb",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            당신은 정말 술을 사랑하는군요!
          </Alert>
        </Snackbar>

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
            handleColorSelect={handleColorSelect} // 컬러 피커 핸들러 추가
            selectedColor={selectedColor} // 선택된 컬러
            colorPalette={colorPalette} // Pass colorPalette
            setSelectedColor={setSelectedColor} // Pass setSelectedColor
            handleAddColor={handleAddColor} // Pass handleAddColor
          />
        )}

        <DateColorManager
          dateColors={dateColors}
          updateDateColor={updateDateColor} // updateDateColor 함수 전달
        />

        </div>
    </ThemeProvider>
  );
};

export default DiaryCalendar;
