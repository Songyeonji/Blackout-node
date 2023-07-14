import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Toolbar, Card, CardContent, Typography, Grid, createTheme, ThemeProvider } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faSun, faCloudSun, faCloudRain } from "@fortawesome/free-solid-svg-icons";

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

  const drinkRecommendations = [
    { weather: "Clear", temperature: "Sunny", recommendation: "Enjoy a refreshing cocktail or a glass of wine." },
    { weather: "Clouds", temperature: "Cloudy", recommendation: "Indulge in a soothing cup of tea or coffee." },
    { weather: "Rain", temperature: "Rainy", recommendation: "Savor a warm cup of hot chocolate or a glass of whiskey." },
  ];

  const getDrinkRecommendation = (weather) => {
    const recommendation = drinkRecommendations.find((item) => item.weather.toLowerCase() === (weather?.toLowerCase() ?? ''));
    return recommendation ? recommendation.recommendation : "No recommendation available.";
  };

  const handleRecommendationTypeChange = (type) => {
    setRecommendationType(type);
  };

  const getWeatherIcon = (weather) => {
    switch ((weather?.toLowerCase() ?? '')) {
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

    const weatherDescription = (weather.weather[0]?.description?.toLowerCase() ?? '');

    if (weatherDescription.includes("rain")) {
      return "makgeolli";
    } else if (weatherDescription.includes("hot")) {
      return "beer";
    } else if (weatherDescription.includes("cool")) {
      return "wine";
    } else {
      return "soju";
    }
  };

  const foodRecommendations = {
    makgeolli: ["파전", "수제비", "김치전"],
    soju: ["김치우동", "알탕", "회", "삼겹살"],
    wine: ["치즈", "과일"],
    beer: ["튀김", "나초", "건어물"],
  };
  
  const getFoodRecommendation = (drinkRecommendation) => {
    const foodList = foodRecommendations[drinkRecommendation.toLowerCase()] || [];
    const randomIndex = Math.floor(Math.random() * foodList.length);
    return foodList[randomIndex] || "No recommendation available.";
  };

  const temperature = weather?.main?.temp;
  const weatherDescription = weather?.weather?.[0]?.description;
  const weatherIcon = getWeatherIcon(weatherDescription);
  const drinkRecommendation = getDrinkRecommendation(weatherDescription);
  const foodRecommendation = getFoodRecommendation(drinkRecommendation);


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
            {/* Display drink recommendations */}
            <h2>Today's Drink Recommendation:</h2>
            {weather && weather.weather ? (
              <p>Recommended Drink: {getDrinkRecommendationByWeather()}</p>
            ) : (
              <p>Loading weather data...</p>
            )}
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
                <Typography variant="body1" align="center">
                  {foodRecommendation}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default DrinkRecommendation;
