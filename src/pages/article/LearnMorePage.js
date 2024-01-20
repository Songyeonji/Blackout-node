import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { FaMapMarkedAlt, FaWineBottle, FaUtensils } from 'react-icons/fa';
import {
  AppBar,
  Toolbar,
  createTheme,
  ThemeProvider,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid
} from "@mui/material";
import PropTypes from 'prop-types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import NavigationBar from "../../components/NavigationBar";
import { AuthContext } from '../../AuthContext';
import RecipeReviewCard from '../../components/RecipeReviewCard';



const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function LearnMorePage() {
  const [value, setValue] = useState(0);
  const [articles, setArticles] = useState([]); // 게시글 데이터 상태
  const { userId, isLoggedIn } = useContext(AuthContext);

  // handleLike 함수 정의
  const handleLike = async (articleId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    try {
      const url = `http://localhost:8081/usr/recommendPoint/toggleRecommend/article/${articleId}`;
      await axios.post(url, {}, {
        withCredentials: true,
        params: { memberId: userId }
      });
  
      // 게시글 목록 상태 업데이트
      const updatedArticles = articles.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            isLikedByUser: !article.isLikedByUser, // 좋아요 상태 토글
            point: article.isLikedByUser ? article.point - 1 : article.point + 1 // 좋아요 수 업데이트
          };
        }
        return article;
      });
  
      console.log("Updated Articles:", updatedArticles);
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/usr/article/showListWithRecommendCount');
        const fetchedArticles = response.data.map(article => ({
          ...article,
          isLikedByUser: article.isLikedByUser === 1 // 사용자가 좋아요를 눌렀는지 여부 (1이면 true, 그 외는 false)
        }));
  
        console.log("Fetched Articles:", fetchedArticles);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, [userId]);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  // boardId에 따라 게시글을 필터링하는 함수
  const filterArticlesByBoardId = (boardId) => {
    const filtered = articles.filter((article) => parseInt(article.boardId) === boardId);
    console.log(`Articles for boardId ${boardId}:`, filtered); // 필터링 결과 확인
    return filtered;
  };



  return (
    <ThemeProvider theme={theme}>
      <div>
        <NavigationBar /> 
        
        {/* 여기서부터 탭 바 */}
        <Box sx={{ width: '100%', backgroundColor: theme.palette.background.paper }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab icon={<FaMapMarkedAlt />} label="맛집" {...a11yProps(0)} />
            <Tab icon={<FaWineBottle />} label="술" {...a11yProps(1)} />
            <Tab icon={<FaUtensils />} label="안주" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <div>
        <CustomTabPanel value={value} index={0}>
            <Grid container spacing={2}>
              {filterArticlesByBoardId(1).map((article, index) => (
                <Grid item xs={12} sm={6} key={index}>
                 <RecipeReviewCard article={article} handleLike={handleLike} />
                  <Link to={`/detail/${article.id}`} style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
                      자세히 보기
                    </Button>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </CustomTabPanel>
        
          <CustomTabPanel value={value} index={1}>
            <Grid container spacing={2}>
              {filterArticlesByBoardId(2).map((article, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <RecipeReviewCard article={article} handleLike={handleLike} />
                  <Link to={`/detail/${article.id}`} style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
                      자세히 보기
                    </Button>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Grid container spacing={2}>
              {filterArticlesByBoardId(3).map((article, index) => (
                <Grid item xs={12} sm={6} key={index}>
                   <RecipeReviewCard article={article} handleLike={handleLike} />
                  <Link to={`/detail/${article.id}`} style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
                      자세히 보기
                    </Button>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </CustomTabPanel>
        </div>
        
         {/* 글쓰기 버튼 */}
        <Link to="/write-page" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
            글쓰기
          </Button>
        </Link>

      </div>
    </ThemeProvider>
  );
};

export default LearnMorePage;