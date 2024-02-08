import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import { FaMapMarkedAlt, FaWineBottle, FaUtensils } from 'react-icons/fa';
import {
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
import axios from 'axios';
import NavigationBar from "../../components/NavigationBar";
import RecipeReviewCard from '../../components/RecipeReviewCard';


// MUI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

// 탭 패널 컴포넌트 정의
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}// 현재 탭과 일치하지 않는 경우 숨김
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

// PropTypes를 사용하여 props 유형 검증
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// 접근성 속성을 위한 함수
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function LearnMorePage() {
  const [value, setValue] = useState(0);// 탭 상태 관리
  const [articles, setArticles] = useState({1: [], 2: [], 3: []}); // 게시글 데이터
  const [userId, setUserId] = useState(""); // 인증 컨텍스트나 세션에서 설정해야 합니다
  const [currentPage, setCurrentPage] = useState({1: 1, 2: 1, 3: 1}); // 각 게시판 별 현재 페이지 상태
  const [totalPages, setTotalPages] = useState({1: 0, 2: 0, 3: 0}); // 각 게시판 별 총 페이지 수
  const [loading, setLoading] = useState(true);



  //게시글 데이터 로드
  useEffect(() => {
    const boardId = value + 1; // Assuming boardId is 1-indexed and matches tab order
    fetchArticles(boardId, currentPage[boardId]);
  }, [value, currentPage]);

  const fetchArticles = async (boardId, page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/usr/article/showListWithRecommendCount`, {
        params: { boardId,  page, pageSize: 4 },
        withCredentials: true,
      });
      setArticles(prev => ({ ...prev, [boardId]: response.data.articles }));
      setTotalPages(prev => ({ ...prev, [boardId]: response.data.totalPages }));
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePageChange = (boardId, newPage) => {
    setCurrentPage(prev => ({ ...prev, [boardId]: newPage }));
    fetchArticles(boardId, newPage);
  };
// handleLike 함수 정의
const handleLike = async (articleId) => {
  // if (!isLoggedIn) {
  //   alert("로그인이 필요합니다.");
  //   return;
  // }

  try {
    const url = `http://localhost:8081/usr/recommendPoint/toggleRecommend/article/${articleId}`;
    const response = await axios.post(url, {}, {
      withCredentials: true,
      params: { memberId: userId }
    });

    // 업데이트된 좋아요 수와 좋아요 상태를 받아옴
    const updatedPoint = response.data.point;
    const isLiked = response.data.isLikedByUser;

    // 게시글 목록 상태 업데이트
    const updatedArticles = articles.map(article => {
      if (article.id === articleId) {
        return {
          ...article,
          isLikedByUser: isLiked,
          point: updatedPoint
        };
      }
      return article;
    });

    setArticles(updatedArticles);
  } catch (error) {
    console.error('Error handling like:', error);
  }
};





// boardId에 따라 게시글을 필터링하는 함수
const filterArticlesByBoardId = (boardId) => {
  // Directly access the array for the current boardId
  const filtered = articles[boardId] ? articles[boardId] : [];
  return filtered;
};
//페이징
const PaginationControls = ({ boardId, currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
        <Button
          key={pageNumber}
          onClick={() => onPageChange(boardId, pageNumber)}
          disabled={currentPage === pageNumber}
        >
          {pageNumber}
        </Button>
      ))}
    </div>
  );
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
            <PaginationControls
              boardId={1}
              currentPage={currentPage[1]}
              totalPages={totalPages[1]}
              onPageChange={handlePageChange}
            />
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
            <PaginationControls
              boardId={2}
              currentPage={currentPage[1]}
              totalPages={totalPages[1]}
              onPageChange={handlePageChange}
            />
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
            <PaginationControls
              boardId={3}
              currentPage={currentPage[1]}
              totalPages={totalPages[1]}
              onPageChange={handlePageChange}
            />
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