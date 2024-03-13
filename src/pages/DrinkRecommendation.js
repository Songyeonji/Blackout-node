import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  createTheme,
  ThemeProvider,
  Button,
  TextField, 
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faCloudRain,
  faCloudSun,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import wineIcon from "./icon/wine-bottle.png";
import sojuIcon from "./icon/soju.png";
import beerIcon from "./icon/beer.png";
import makgeolliIcon from "./icon/rice-wine.png";
import { useHistory } from "react-router-dom";
import RecipeReviewCard from "../components/RecipeReviewCard";
import NavigationBar from "../components/NavigationBar";
import BlogSearchComponent from '../components/BlogSearchComponent'; 

// MUI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const DrinkRecommendation = () => {
    // 상태 관리 변수 선언
  const [weather, setWeather] = useState(null);
  const [articles, setArticles] = useState([]);
  const [recommendationType, setRecommendationType] = useState("drink");
  const [selectedDrink, setSelectedDrink] = useState(null);//선택된 음료를 위한 상태변수
  const [blogPosts, setBlogPosts] = useState([]);//블로그 크롤링을 위한 상태변수
  const [foodRecommendation, setFoodRecommendation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
 
 
 
  //chatgpt api
  const [userQuery, setUserQuery] = useState('');
  const [gptResponse, setGptResponse] = useState('');

 // 사용자 쿼리 변경 핸들러
  const handleQueryChange = (event) => {
    setUserQuery(event.target.value);
  };

// ChatGPT API 요청 핸들러
const handleAskButtonClick = async () => {
  if (!userQuery) {
    alert('질문을 입력해주세요.');
    return;
  }

  try {
    // 백엔드를 통해 ChatGPT API를 호출
    const response = await axios.post('http://localhost:3000/api/chatgpt', {
      query: userQuery
    });
    setGptResponse(response.data.choices[0].text);
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    setGptResponse('Sorry, there was an error processing your request.');
  }
};
  // 좋아요 핸들러
  const handleLike = async (articleId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    try {
      const url = `http://localhost:8081/usr/recommendPoint/toggleRecommend/article/${articleId}`;
      const response = await axios.post(url, {}, {
        withCredentials: true
      });
      const newRecommendCount = response.data.recommendCount;
  
      setArticles(articles.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            isLiked: !article.isLiked,
            recommendCount: newRecommendCount
          };
        }
        return article;
      }));
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };
  
  // 날씨 데이터 가져오는 useEffect
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
//사용자의 위치기반으로 날씨에 넣는 로직
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


  
//음료 옵션 아이콘들 
  const drinkOptions = [
    { name: "Wine", icon: wineIcon },
    { name: "Soju", icon: sojuIcon },
    { name: "Beer", icon: beerIcon },
    { name: "Makgeolli", icon: makgeolliIcon },
  ];


  // 음료 선택 핸들러
  const handleDrinkSelection = (drink) => {
    setSelectedDrink(drink);
  };

//음료아이콘의 스타일
  const drinkIconStyle = {
    width: "50px",
    height: "50px",
    cursor: "pointer",
  };
//선택된 음료의 스타일
  const selectedDrinkStyle = {
    border: "2px solid blue",
  };

 // 날씨 아이콘 가져오는 함수
  const getWeatherIcon = (weather) => {
    const lowerCaseWeather = weather?.toLowerCase() ?? "";

    if (lowerCaseWeather.includes("clear")) {
      return faSun;
    } else if (lowerCaseWeather.includes("clouds")) {
      return faCloud;
    } else if (lowerCaseWeather.includes("rain")) {
      return faCloudRain;
    } else if (lowerCaseWeather.includes("snow")) {
      return faSnowflake;
    } else {
      return faCloudSun;
    }
  };
  
  // 날씨에 따른 음료 추천 로직
  const getDrinkRecommendationByWeather = () => {
    if (!weather || !weather.weather) return "Unknown";

    const temperature = weather?.main?.temp;

    if (temperature >= 30) {
      return "Beer";
    } else if (
      temperature >= 10 &&
      temperature <= 20 &&
      !weatherDescription.includes("rain")
    ) {
      return "Wine";
    } else {
      const weatherDescription = weather.weather[0]?.description?.toLowerCase() ?? "";

      if (weatherDescription.includes("rain")) {
        return "Makgeolli";
      } else {
        return "Soju";
      }
    }
  };
  

//데이터 객체들
  const temperature = weather?.main?.temp;//온도 정보 추출
  const weatherDescription = weather?.weather?.[0]?.description;//날씨 상태 정보 추출
  const weatherIcon = getWeatherIcon(weatherDescription);//날씨 아이콘 결정

  useEffect(() => {
    axios.get('http://localhost:8081/usr/member/getLoggedUser', { withCredentials: true })
      .then(response => {
        if (response.data && response.data.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      });
  }, []);
  // 로그아웃 핸들러
  const handleLogout = () => {
    axios.post('http://localhost:8081/usr/member/doLogout', {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        history.push('/login');
      })
      .catch(error => console.error('Logout error:', error));
  };


  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <NavigationBar /> 
   
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
                <div>
                  {drinkOptions.map((option) => (
                    <Button
                      key={option.name}
                      variant={selectedDrink === option.name ? "contained" : "outlined"}
                      onClick={() => handleDrinkSelection(option.name)}
                      startIcon={<img src={option.icon} alt={option.name} style={{ width: 50, height: 50 }} />}
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
           
              </CardContent>
            </Card>
          </Grid>


          <Grid xs={8}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <TextField
                label="Ask a question about drinks"
                variant="outlined"
                fullWidth
                value={userQuery}
                onChange={handleQueryChange}
                style={{ marginBottom: "10px" }} // 텍스트 필드와 버튼 사이의 간격
              />
              <Button variant="contained" color="primary" onClick={handleAskButtonClick}>
                Ask
              </Button>
              {gptResponse && <div style={{ marginTop: "10px" }}>{gptResponse}</div>}
            </div>
            <BlogSearchComponent selectedDrink={selectedDrink} />
          </Grid>     

   

        </Grid>
        
      </div>
    </ThemeProvider>
  );
};

export default DrinkRecommendation;