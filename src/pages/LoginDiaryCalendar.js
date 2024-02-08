import React, { useEffect, useState } from "react";
import moment from "moment"; // 날짜 처리를 위한 'moment' 라이브러리
import Calendar from "react-calendar"; // 'react-calendar' 컴포넌트
import "react-calendar/dist/Calendar.css"; // 'react-calendar'의 CSS 스타일
import { createTheme, ThemeProvider, Snackbar, Alert } from "@mui/material"; // MUI 컴포넌트들
import axios from "axios"; // HTTP 요청을 위한 'axios' 라이브러리
import wineIcon from "./icon/wine-bottle.png"; // 와인 아이콘 이미지
import sojuIcon from "./icon/soju.png"; // 소주 아이콘 이미지
import beerIcon from "./icon/beer.png"; // 맥주 아이콘 이미지
import makgeolliIcon from "./icon/rice-wine.png"; // 막걸리 아이콘 이미지
import WeatherInfo from "../components/WeatherInfo"; // 날씨 정보를 표시하는 컴포넌트
import DiaryEntry from "../components/DiaryEntry"; // 일기 항목을 표시하는 컴포넌트
import NavigationBar from "../components/NavigationBar"; // 네비게이션 바 컴포넌트


const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});



const LoginDiaryCalendar = () => {
    // 상태 변수들
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [diaryEntries, setDiaryEntries] = useState({});
    const [showSnackbar, setShowSnackbar] = useState(false); // 스낵바 상태
    const [weather, setWeather] = useState(null); // 날씨 정보 상태
    // 컬러 팔레트와 선택된 색상을 관리하기 위한 상태
    const [colorPalette, setColorPalette] = useState(() => { });// 컬러 팔레트 상태
    const [selectedColor, setSelectedColor] = useState("#ffffff");  // 선택된 색상 상태
  
  // 컬러 선택 핸들러
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // 일기 항목 불러오기
  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/diaryEntries', { withCredentials: true });
        const formattedEntries = response.data.reduce((acc, entry) => {
          acc[moment(entry.entryDate).format("YYYY-MM-DD")] = entry;
          return acc;
        }, {});
        setDiaryEntries(formattedEntries);
      } catch (error) {
        console.error("Error fetching diary entries:", error);
      }
    };

    fetchDiaryEntries();
  }, []);
  //이거없으면 일단 오류나서 이건 보류// 색상 추가 핸들러
  const handleAddColor = () => {
    const newColorPalette = [...colorPalette, selectedColor];
    setColorPalette(newColorPalette);
    localStorage.setItem("colorPalette", JSON.stringify(newColorPalette));
  };
 // 색상 삭제 핸들러
  const handleDeleteColor = (colorToDelete) => {
    const newColorPalette = colorPalette.filter((color) => color !== colorToDelete);
    setColorPalette(newColorPalette);
    localStorage.setItem("colorPalette", JSON.stringify(newColorPalette));
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 일기 항목 저장하기
  const saveDiaryEntry = async (entryData) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const entry = {
      ...entryData,
      entryDate: formattedDate,
      userId: '사용자 ID', // 실제 사용자 ID로 대체해야 함
    };
    try {
      await axios.post('http://localhost:8081/api/diaryEntries', entry, { withCredentials: true });
      setDiaryEntries({ ...diaryEntries, [formattedDate]: entry });
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error saving diary entry:", error);
    }
  };

  // 날씨 데이터 가져오기
  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const apiKey = 'af984965d76ffbb83dbfda6c8e3faae3';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        setWeather(response.data);
      } catch (error) {
        console.log("Error fetching weather data:", error);
      }
    };
  // 사용자의 위치 정보 가져오기
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherData(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);
  

// 추가 일기 항목 처리 핸들러
  const handleAdditionalDiaryEntry = (event) => {
    const { value } = event.target;
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD") + "-additional"]: value,
    }));
  };

  // 라디오 버튼 변경 핸들러
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

  // 음료별 이미지 가져오기 함수
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

  // 음료별 비율 계산 함수
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
    // 총 음료 비율 계산 함수
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
//프로그래스 바 비율별 알림바 설정내옹
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

// 별점 클릭 핸들러
  const handleStarClick = (rating) => {
    setDiaryEntries((prevDiaryEntries) => ({
      ...prevDiaryEntries,
      [moment(selectedDate).format("YYYY-MM-DD") + "-rating"]: rating,
    }));
  };

    // 캘린더 타일 컨텐츠 렌더링
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
  
 // 음료 아이콘 렌더링
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

export default LoginDiaryCalendar;