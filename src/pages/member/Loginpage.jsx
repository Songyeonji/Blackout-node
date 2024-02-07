import React, { useState , useContext} from 'react';
import { Link , useHistory} from 'react-router-dom';
import axios from 'axios'; 
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { createTheme, ThemeProvider} from "@mui/material";
import NavigationBar from '../../components/NavigationBar';

//테마설정
const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});



const Loginpage = () => {
  const [loginId, setLoginId] = useState('');//아이디디
  const [loginPw, setPassword] = useState('');//패스워드
  const history = useHistory();//히스토리 객체

  // 로그인 처리 함수
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // 백엔드 서버에 로그인 요청
      const response = await axios.post('http://localhost:8081/usr/member/doLogin', {
        loginId,
        loginPw,
      }, { withCredentials: true }); // withCredentials 옵션으로 세션 쿠키 전송

      if (response.data) {
        // 로그인 성공 처리
        history.push('/login-diary-calendar'); // 로그인 성공 후 리디렉션
      }
    } catch (error) {
      console.error('Login failed:', error);
      // 로그인 실패 처리
    }
  };

  
    return (
        <div className="member">
        <ThemeProvider theme={theme}>
          <NavigationBar/>

        <div className='wrapper'>
            <form onSubmit={handleLogin}>
                            <h1>Login</h1>
                            <div className="input-box">
                                <input type="text" placeholder='Login Id' value={loginId} onChange={(e) => setLoginId(e.target.value)} required />
                                <FaUser className='icon' />
                            </div>
                            <div className="input-box">
                                <input type="password" placeholder='Password' value={loginPw} onChange={(e) => setPassword(e.target.value)} required />
                                <FaLock className='icon' />
                            </div>

                            <button type="submit">Login</button>

                            <div className="register-link">
                                <p>Don't have an account? <Link to="/register">Register</Link></p>
                            </div>
                        </form>
        </div>
      
        </ThemeProvider>
      </div>
    );
};

export default Loginpage;
