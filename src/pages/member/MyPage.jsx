import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import './Login.css'; // 'Login.css'를 사용

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb",  //보라색
    },
  },
});

const MyPage = () => {
  const [member, setMember] = useState({
    name: '',
    loginId: '',
    loginPw:'',
    email: '',
  });

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/usr/member/myPage', {
          withCredentials: true 
        });
        setMember(response.data);
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    };
    fetchMemberInfo();
  }, []);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8080/usr/member/doModify', member, { withCredentials: true });
      alert('회원 정보가 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating member info:', error);
    }
  };

  const handleChange = (event) => {
    setMember({ ...member, [event.target.name]: event.target.value });
  };

  return (
    <div className="member">
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
          <Toolbar style={{ justifyContent: "space-between" }}>
            <Link to="/diary-calendar" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">달력</span>
            </Link>
            <Link to="/drink-recommendation" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">오늘의 술 추천</span>
            </Link>
          </Toolbar>
        </AppBar>

        <div className='wrapper'>
          <h1>MyPage</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label htmlFor="loginId">아이디</label>
              <input type="text" id="loginId" name="loginId" value={member.loginId} onChange={handleChange} disabled />
            </div>
            <div className="input-box">
              <label htmlFor="name">이름</label>
              <input type="text" id="name" name="name" value={member.name} onChange={handleChange} />
            </div>
            <div className="input-box">
              <label htmlFor="email">이메일</label>
              <input type="email" id="email" name="email" value={member.email} onChange={handleChange} />
            </div>
            <button type="submit">정보 수정</button>
          </form>
        </div>
        </div>
    </ThemeProvider>
    </div>
  );
};

export default MyPage;
