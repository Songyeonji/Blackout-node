import React, { useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const BlogSearchComponent = ({ selectedDrink }) => {
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
      const response = await axios.get(`http://localhost:3000/api/search`, { params: { query: selectedDrink } });
      setBlogPosts(response.data); 
    } catch (err) {
      setError('블로그 포스트를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSearchClick}>검색</button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && blogPosts.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>타이틀</TableCell>
                <TableCell align="right">링크</TableCell>
                <TableCell align="right">내용(축약)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogPosts.map((post, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {post.title.replace(/(<([^>]+)>)/gi, "")}
                  </TableCell>
                  <TableCell align="right">
                    <a href={post.link} target="_blank" rel="noopener noreferrer">링크</a>
                  </TableCell>
                  <TableCell align="right">{post.description.replace(/(<([^>]+)>)/gi, "").substring(0, 50) + '...'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default BlogSearchComponent;
