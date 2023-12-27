import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import PropTypes from 'prop-types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

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
          {/* 자세히 보기 버튼 추가 */}
          <Link to={`/detail/${index}`} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
              자세히 보기
            </Button>
          </Link>
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

  useEffect(() => {
    // 서버로부터 게시글 데이터를 가져오는 로직
    // 예시로 가상의 데이터를 사용합니다.
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/usr/article/showList');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

   // 디테일 페이지로 이동하는 함수
   const handleDetailClick = (index) => {
    history.push(`/detail/${index}`);
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
        <AppBar position="fixed">
          <Toolbar>
            <div className="flex-1"></div>
            <Link
              to="/drink-calendar"
              style={{ color: "white", textDecoration: "none" }}
            >
              <span className="font-bold">달력</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />
        
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
            {/* 게시글을 카드 형식으로 표시 */}
            {filterArticlesByBoardId(1).map((article, index) => (
              <Card key={index} sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, mb: 2 }}>
                <CardMedia
                  component="img"
                  height="194"
                  image={article.imgUrl || "https://via.placeholder.com/194"} // 이미지 URL이 없을 경우 기본 이미지 사용
                  alt="Article Image"
                  sx={{ width: '50%', objectFit: 'cover' }}
                />
                <CardContent sx={{ flex: '1' }}>
                  <CardHeader
                    title={article.title}
                    subheader={new Date(article.regDate).toLocaleDateString()}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {article.body}
                  </Typography>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
          </CustomTabPanel>
        
        <CustomTabPanel value={value} index={1}>
            {filterArticlesByBoardId(2).map((article, index) => (
              <Card key={index} sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, mb: 2 }}>
                <CardMedia
                  component="img"
                  height="194"
                  image={article.imgUrl || "https://via.placeholder.com/194"} // 이미지 URL이 없을 경우 기본 이미지 사용
                  alt="Article Image"
                  sx={{ width: '50%', objectFit: 'cover' }}
                />
                <CardContent sx={{ flex: '1' }}>
                  <CardHeader
                    title={article.title}
                    subheader={new Date(article.regDate).toLocaleDateString()}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {article.body}
                  </Typography>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
          {filterArticlesByBoardId(3).map((article, index) => (
              <Card key={index} sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, mb: 2 }}>
                <CardMedia
                  component="img"
                  height="194"
                  image={article.imgUrl || "https://via.placeholder.com/194"} // 이미지 URL이 없을 경우 기본 이미지 사용
                  alt="Article Image"
                  sx={{ width: '50%', objectFit: 'cover' }}
                />
                <CardContent sx={{ flex: '1' }}>
                  <CardHeader
                    title={article.title}
                    subheader={new Date(article.regDate).toLocaleDateString()}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {article.body}
                  </Typography>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
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
