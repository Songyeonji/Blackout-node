import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick'; // 캐러셀을 위한 라이브러리 추가
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const BlogSearchComponent = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 크롤링 함수
  const fetchBlogPosts = async () => {
    const keyword = "막걸리+술"; // 검색 키워드
    setLoading(true);
    try {
      const response = await axios.get(`YOUR_API_ENDPOINT/search?query=${encodeURIComponent(keyword)}`);
      setBlogPosts(response.data); // API 응답 구조에 따라 조정 필요
    } catch (err) {
      setError('블로그 포스트를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 3 // 스크롤 할 때마다 넘어갈 슬라이드 수
  };

  // UI 렌더링 부분
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <button onClick={fetchBlogPosts}>막걸리 검색</button>
      <Slider {...settings}>
        {blogPosts.map((post, index) => (
          <div key={index}>
            <a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
            <p>{post.summary}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlogSearchComponent;