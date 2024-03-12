import React, { useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import { Button, Typography, Link as MuiLink, Box } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

const BlogSearchComponent = ({ selectedDrink, onSelectDrink }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchClick = async () => {
    if (!selectedDrink) {
      setError('검색할 음료를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // URL 주소 업데이트 확인 필요
      const response = await axios.get(`http://localhost:3000/api/search`, { params: { query: selectedDrink } });
      setBlogPosts(response.data.slice(0, 5)); // 첫 5개 결과만 저장
    } catch (err) {
      setError('블로그 포스트를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, m: 'auto' }}>
      <Button variant="contained" color="primary" onClick={handleSearchClick} sx={{ mb: 2 }}>
        블로그 검색
      </Button>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && blogPosts.length > 0 && (
        <Slider {...settings}>
          {blogPosts.map((post, index) => (
            <div key={index}>
              <Typography variant="h6">{post.title.replace(/(<([^>]+)>)/gi, "")}</Typography>
              <MuiLink href={post.link} target="_blank" rel="noopener noreferrer">
                <LinkIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                {post.link}
              </MuiLink>
              <Typography>{post.description.replace(/(<([^>]+)>)/gi, "").substring(0, 50) + '...'}</Typography>
            </div>
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default BlogSearchComponent;
