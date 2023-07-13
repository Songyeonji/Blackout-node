import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, createTheme, ThemeProvider,  Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

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

  const handleRecommendationTypeChange = (type) => {
    setRecommendationType(type);
  };

  const getDrinkRecommendationByWeather = () => {
    if (!weather || !weather.weather) return "Unknown";

    const weatherDescription = weather.weather[0].description.toLowerCase();

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
          <Typography variant="h6">
            {recommendationType === "drink" ? "Drink Recommendations" : "Food Recommendations"}
          </Typography>
          <div className="flex-1"></div>
            <div className="flex-1"></div>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">달력</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <div>
        <div>
          <button onClick={() => handleRecommendationTypeChange("drink")}>By Alcohol</button>
          <button onClick={() => handleRecommendationTypeChange("weather")}>By Weather</button>
        </div>
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
        {/* Add logic for displaying food recommendations */}
        {/* ... */}
      </div>
    </div>

    </ThemeProvider>
  );
};

export default DrinkRecommendation;
