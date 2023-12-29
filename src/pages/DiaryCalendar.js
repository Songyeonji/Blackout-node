import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../AuthContext';
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createTheme, ThemeProvider, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import wineIcon from "./icon/wine-bottle.png";
import sojuIcon from "./icon/soju.png";
import beerIcon from "./icon/beer.png";
import makgeolliIcon from "./icon/rice-wine.png";
import WeatherInfo from "../components/WeatherInfo";
import DiaryEntry from "../components/DiaryEntry";
import NavigationBar from "../components/NavigationBar"; 

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

  
  const [showSnackbar, setShowSnackbar] = useState(false);

  // 날씨
  const [weather, setWeather] = useState(null);

  // 컬러 팔레트와 선택된 색상을 관리하기 위한 상태
  const [colorPalette, setColorPalette] = useState(() => {
    const storedColorPalette = localStorage.getItem("colorPalette");
    return storedColorPalette ? JSON.parse(storedColorPalette) : [];
  });

  const [selectedColor, setSelectedColor] = useState("#ffffff"); // 기본 색상

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleAddColor = () => {
    const newColorPalette = [...colorPalette, selectedColor];
    setColorPalette(newColorPalette);
    localStorage.setItem("colorPalette", JSON.stringify(newColorPalette));
  };

  const handleDeleteColor = (colorToDelete) => {
    const newColorPalette = colorPalette.filter((color) => color !== colorToDelete);
    setColorPalette(newColorPalette);
    localStorage.setItem("colorPalette", JSON.stringify(newColorPalette));
  };

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

  const [dateColors, setDateColors] = useState(() => {
    const storedDateColors = localStorage.getItem("dateColors");
    return storedDateColors ? JSON.parse(storedDateColors) : {};
  });

  useEffect(() => {
    // Save diary entries and dateColors to localStorage whenever they change
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
    localStorage.setItem("colorPalette", JSON.stringify(colorPalette));
  }, [diaryEntries, colorPalette]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    // Diary Entries
    const storedDiaryEntries = localStorage.getItem("diaryEntries");
    if (storedDiaryEntries) {
      setDiaryEntries(JSON.parse(storedDiaryEntries));
    }
  
    // Color Palette
    const storedColorPalette = localStorage.getItem("colorPalette");
    if (storedColorPalette) {
      setColorPalette(JSON.parse(storedColorPalette));
    }
  }, []);

  


  const handleAdditionalDiaryEntry = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD") + "-additional"]: value,
    }));
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    // 이전에 선택했던 컬러 초기화
    if (diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-color"]) {
      setSelectedColor(diaryEntries[moment(selectedDate).format("YYYY-MM-DD") + "-color"]);
    } else {
      setSelectedColor("#ffffff"); // 기본 색상
    }


    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD")]: value,
      [moment(selectedDate).format("YYYY-MM-DD") + "-color"]: selectedColor, // 색상 추가
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
        <NavigationBar /> 

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
            colorPalette={colorPalette}
            setSelectedColor={setSelectedColor}
            handleAddColor={handleAddColor}
            handleDeleteColor={handleDeleteColor} 
          />
        )}

        </div>
    </ThemeProvider>
  );
};

export default DiaryCalendar;
