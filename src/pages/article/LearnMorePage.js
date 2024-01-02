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
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  CardActions,
  IconButton,
  Grid
} from "@mui/material";
import PropTypes from 'prop-types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import NavigationBar from "../../components/NavigationBar";
import { AuthContext } from '../../AuthContext';



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

const LearnMorePage = () => {
  const [value, setValue] = useState(0);
  const [articles, setArticles] = useState([]); // 게시글 데이터 상태
  const history = useHistory();
  const { userId, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/usr/article/showList');
        setArticles(response.data.map(article => ({
          ...article,
          isLiked: article.recommendPointUsers && article.recommendPointUsers.includes(userId)
        })));
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, [userId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLike = async (articleId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    try {
      const authToken = sessionStorage.getItem('authToken');
      if (!authToken) {
        console.error('Auth token not found');
        return;
      }
      await axios.post(`http://localhost:8080/usr/recommendPoint/toggleRecommend/article/${articleId}`, {}, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      // 게시글 상태 업데이트 로직
      setArticles(articles.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            isLiked: !article.isLiked,
            point: article.isLiked ? article.point - 1 : article.point + 1
          };
        }
        return article;
      }));

    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  // boardId에 따라 게시글을 필터링하는 함수
  const filterArticlesByBoardId = (boardId) => {
    const filtered = articles.filter((article) => parseInt(article.boardId) === boardId);
    console.log(`Articles for boardId ${boardId}:`, filtered); // 필터링 결과 확인
    return filtered;
  };

  //이미지 기본 
  const defaultImageUrl = "https://images.unsplash.com/photo-1590189182193-1fd44f2b4048?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
                  <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, height: 250 }}>
                    <CardMedia
                        component="img"
                        height="194"
                        image={article.imgUrl || defaultImageUrl}
                        alt="Article Image"
                        sx={{ width: '50%', objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flex: '1', overflow: 'hidden' }}>
                      <CardHeader
                        title={article.title}
                        subheader={new Date(article.regDate).toLocaleDateString()}
                        titleTypographyProps={{ noWrap: true }}
                      />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {article.body}
                      </Typography>
                      <CardActions disableSpacing>
                      <IconButton 
                        onClick={() => handleLike(article.id)}
                        color={article.isLiked ? "secondary" : "default"}
                        aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <Typography>{article.point || 0}</Typography>
                      </CardActions>
                    </CardContent>
                  </Card>
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
                  <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, height: 250 }}>
                    <CardMedia
                      component="img"
                      height="194"
                      image={article.imgUrl || defaultImageUrl}
                      alt="Article Image"
                      sx={{ width: '50%', objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flex: '1', overflow: 'hidden' }}>
                      <CardHeader
                        title={article.title}
                        subheader={new Date(article.regDate).toLocaleDateString()}
                        titleTypographyProps={{ noWrap: true }}
                      />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {article.body}
                      </Typography>
                      <CardActions disableSpacing>
                      <IconButton 
                        onClick={() => handleLike(article.id)}
                        color={article.isLiked ? "secondary" : "default"}
                        aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <Typography>{article.point || 0}</Typography> {/* 좋아요 수 */}
                      </CardActions>
                    </CardContent>
                  </Card>
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
                  <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, height: 250 }}>
                    <CardMedia
                      component="img"
                      height="194"
                      image={article.imgUrl || defaultImageUrl}
                      alt="Article Image"
                      sx={{ width: '50%', objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flex: '1', overflow: 'hidden' }}>
                      <CardHeader
                        title={article.title}
                        subheader={new Date(article.regDate).toLocaleDateString()}
                        titleTypographyProps={{ noWrap: true }}
                      />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {article.body}
                      </Typography>
                      <CardActions disableSpacing>
                      <IconButton 
                        onClick={() => handleLike(article.id)}
                        color={article.isLiked ? "secondary" : "default"}
                        aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <Typography>{article.point || 0}</Typography>
                      </CardActions>
                    </CardContent>
                  </Card>
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
