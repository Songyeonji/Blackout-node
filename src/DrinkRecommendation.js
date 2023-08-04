import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Toolbar, Card, CardContent, Typography, Grid, createTheme, ThemeProvider, Button } from "@mui/material";
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
  //이미지 선택
  const drinkIconStyle = {
    width: "50px",
    height: "50px",
    cursor: "pointer",
  };
  
  const selectedDrinkStyle = {
    border: "2px solid blue", // Add a border to the selected drink icon
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
    makgeolli: ["파전", "수제비", "김치전", "도토리묵", "두부김치", "계란찜", "모둠 전","김치찌개", "불고기"],
    soju: ["김치우동", "알탕", "회", "삼겹살", "소고기", "닭발","곱창", "닭도리탕","쭈꾸미", ],
    wine: ["치즈", "과일", "파스타", "피자", "스테이크","샐러드", "새우" ],
    beer: ["튀김", "나초", "건어물", "피자" , "편의점", "치킨", "핫윙","멕시칸 타코","소세지","나초와 팝콘"],
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

  //술정보 
  const [selectedDrinkInfo, setSelectedDrinkInfo] = useState(null);
  const getDrinkInformation = (selectedDrink) => {
    // Replace these placeholder values with actual information about each drink
    const drinksInfo = {
      Wine: {
        title: "Wine",
        description: "Wine is an alcoholic beverage made from fermented grapes.",
        image: wineIcon,
        // Add other information about wine here...
      },
      Soju: {
        title: "Soju",
        description: "Soju is a popular Korean alcoholic beverage made from rice, wheat, or barley.",
        image: sojuIcon,
        // Add other information about soju here...
      },
      Beer: {
        title: "Beer",
        description: "Beer is one of the oldest and most widely consumed alcoholic drinks in the world.",
        image: beerIcon,
        // Add other information about beer here...
      },
      Makgeolli: {
        title: "Makgeolli",
        description: "Makgeolli is a traditional Korean rice wine with a milky appearance.",
        image: makgeolliIcon,
        // Add other information about makgeolli here...
      },
    };
  
    return drinksInfo[selectedDrink];
  };

    // Today's cocktail recipe
    const todaysCocktail = {
      title: "Sunset Mojito",
      description: "A refreshing cocktail with a mix of rum, mint, lime, and grenadine.",
      image: "url-to-sunset-mojito-image", // Replace this with the URL of the cocktail image
      ingredients: [
        "2 oz white rum",
        "1 oz fresh lime juice",
        "1 tbsp grenadine",
        "6-8 fresh mint leaves",
        "Club soda",
        "Ice cubes",
      ],
      instructions: [
        "In a shaker, muddle the mint leaves with lime juice and grenadine.",
        "Add ice cubes and rum to the shaker.",
        "Shake well and strain into a glass filled with ice.",
        "Top with club soda and garnish with a mint sprig.",
        "Enjoy your Sunset Mojito!",
      ],
    };

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
              {selectedDrinkInfo && (
  <Grid item xs={12} sm={6} md={4}>
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" align="center">
          {selectedDrinkInfo.title}
        </Typography>
        <img src={selectedDrinkInfo.image} alt={selectedDrinkInfo.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
        <Typography variant="body1" align="center" style={{ marginTop: "20px" }}>
          {selectedDrinkInfo.description}
        </Typography>
        {/* Add other information about the drink here... */}
      </CardContent>
    </Card>
  </Grid>
)}

            </Card>
          </Grid>
          
        </Grid>
        
      </div>
      
      {/* Today's cocktail recipe card */}
      {todaysCocktail && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" align="center">
                  Today's Cocktail Recipe
                </Typography>
                <Typography variant="h6" align="center">
                  {todaysCocktail.title}
                </Typography>
                <img src={todaysCocktail.image} alt={todaysCocktail.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                <Typography variant="body1" align="center" style={{ marginTop: "20px" }}>
                  {todaysCocktail.description}
                </Typography>
                <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
                  Ingredients:
                </Typography>
                <ul>
                  {todaysCocktail.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
                  Instructions:
                </Typography>
                <ol>
                  {todaysCocktail.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </ThemeProvider>
  );
};

export default DrinkRecommendation; 