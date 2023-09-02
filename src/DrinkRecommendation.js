import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Typography,
  Grid,
  createTheme,
  ThemeProvider,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faSun, faCloudSun, faCloudRain } from "@fortawesome/free-solid-svg-icons";
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

const DrinkRecommendation = () => {
  const [weather, setWeather] = useState(null);
  const [recommendationType, setRecommendationType] = useState("drink");
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [foodRecommendation, setFoodRecommendation] = useState(null);

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

  const drinkOptions = [
    { name: "Wine", icon: wineIcon },
    { name: "Soju", icon: sojuIcon },
    { name: "Beer", icon: beerIcon },
    { name: "Makgeolli", icon: makgeolliIcon },
  ];

  const handleDrinkSelection = (drink) => {
    setSelectedDrink(drink);
    setFoodRecommendation(null);
  };

  const drinkIconStyle = {
    width: "50px",
    height: "50px",
    cursor: "pointer",
  };

  const selectedDrinkStyle = {
    border: "2px solid blue",
  };

  const drinkRecommendations = [
    { weather: "Clear", temperature: "Sunny", recommendation: "Enjoy a refreshing cocktail or a glass of wine." },
    { weather: "Clouds", temperature: "Cloudy", recommendation: "Indulge in a soothing cup of tea or coffee." },
    { weather: "Rain", temperature: "Rainy", recommendation: "Savor a warm cup of hot chocolate or a glass of whiskey." },
  ];

  const getDrinkRecommendation = (weather) => {
    const recommendation = drinkRecommendations.find((item) => item.weather.toLowerCase() === (weather?.toLowerCase() ?? ""));
    return recommendation ? recommendation.recommendation : "No recommendation available.";
  };

  const getWeatherIcon = (weather) => {
    switch ((weather?.toLowerCase() ?? "")) {
      case "clear":
        return faSun;
      case "clouds":
        return faCloud;
      case "rain":
        return faCloudRain;
      default:
        return faCloudSun;
    }
  };

  const getDrinkRecommendationByWeather = () => {
    if (!weather || !weather.weather) return "Unknown";

    const temperature = weather?.main?.temp;

    if (temperature >= 30) {
      return "Beer";
    } else if (temperature >= 10 && temperature <= 20) {
      return "Wine";
    } else {
      const weatherDescription = (weather.weather[0]?.description?.toLowerCase() ?? "");

      if (weatherDescription.includes("rain")) {
        return "Makgeolli";
      } else {
        return "Soju";
      }
    }
  };

  const foodRecommendations = {
    makgeolli: ["파전", "수제비", "김치전", "도토리묵", "두부김치", "계란찜", "모둠 전", "김치찌개", "불고기"],
    soju: ["김치우동", "알탕", "회", "삼겹살", "소고기", "닭발", "곱창", "닭도리탕", "쭈꾸미"],
    wine: ["치즈", "과일", "파스타", "피자", "스테이크", "샐러드", "새우"],
    beer: ["튀김", "나초", "건어물", "피자", "편의점", "치킨", "핫윙", "멕시칸 타코", "소세지", "나초와 팝콘","치킨위드라이스"],
  };  

  const handleRecommendationButtonClick = () => {
    if (selectedDrink) {
      const foodList = foodRecommendations[selectedDrink.toLowerCase()] || [];
      const randomIndex = Math.floor(Math.random() * foodList.length);
      const recommendation = foodList[randomIndex] || "No recommendation available.";
      setFoodRecommendation(recommendation);
    }
  };

  const temperature = weather?.main?.temp;
  const weatherDescription = weather?.weather?.[0]?.description;
  const weatherIcon = getWeatherIcon(weatherDescription);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <AppBar position="fixed">
          <Toolbar>
            <div className="flex-1"></div>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">달력</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" align="center">
                  Drink Recommendation
                </Typography>
                <Typography variant="h7" component="div" align="center">
                  Weather: {weatherDescription}
                  Temperature: {temperature}°C
                </Typography>
                <Typography variant="body1" align="center">
                  <FontAwesomeIcon icon={weatherIcon} size="2x" />
                </Typography>
                {recommendationType === "drink" && (
                  <div>
                    <Typography variant="h6" align="center">
                      Today's Drink Recommendation:
                    </Typography>
                    <Typography variant="h4" align="center" style={{ marginBottom: "20px" }}>
                      {getDrinkRecommendationByWeather()}
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" align="center">
                  Food Recommendation
                </Typography>
                <Typography variant="body1" align="center" style={{ marginBottom: "20px" }}>
                  {foodRecommendation}
                </Typography>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {drinkOptions.map((option) => (
                    <div
                      key={option.name}
                      onClick={() => handleDrinkSelection(option.name)}
                      style={selectedDrink === option.name ? { ...drinkIconStyle, ...selectedDrinkStyle } : drinkIconStyle}
                    >
                      <img src={option.icon} alt={option.name} style={{ width: "50px", height: "50px" }} />
                    </div>
                  ))}
                </div>
                {selectedDrink && (
                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" onClick={handleRecommendationButtonClick}>
                      Get New Recommendation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default DrinkRecommendation;
