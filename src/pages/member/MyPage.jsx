import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from "@mui/material";
import './Login.css'; // 'Login.css'를 사용
import NavigationBar from '../../components/NavigationBar';

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
  // 마이페이지 정보를 가져오는 함수
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        // 백엔드 서버에 마이페이지 정보 요청
        const response = await axios.get('http://localhost:8081/usr/member/myPage', {
          withCredentials: true //브라우저가 다른 도메인으로의 HTTP 요청 시 쿠키 및 인증 정보를 함께 전송할 수 있도록 허용하는 옵션
        });
        setMember(response.data);
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    };
    fetchMemberInfo();
  }, []);
  
// 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
       // 백엔드 서버에 회원 정보 수정 요청
      await axios.post('http://localhost:8081/usr/member/doModify', member, { withCredentials: true });
      alert('회원 정보가 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating member info:', error);
    }
  };
 // 입력 필드 변경 핸들러
  const handleChange = (event) => {
    setMember({ ...member, [event.target.name]: event.target.value });
  };

  return (
    <div className="member">
        <ThemeProvider theme={theme}>
        <NavigationBar/>

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

    </ThemeProvider>
    </div>
  );
};

export default MyPage;
