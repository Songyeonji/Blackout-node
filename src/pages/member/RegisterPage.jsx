import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { FaUser, FaUserCheck, FaLock, FaEnvelope, FaCheckSquare, FaRegCheckSquare } from "react-icons/fa";
import './Login.css';
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import NavigationBar from '../../components/NavigationBar';

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [email, setEmail] = useState('');
  const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(true);
  const [loginIdError, setLoginIdError] = useState('');
  const history = useHistory();


  const checkLoginIdAvailability = async (loginId) => {
    if (!loginId) {
      setLoginIdError('아이디는 필수 입력 정보입니다.');
      setIsLoginIdAvailable(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8081/usr/member/isLoginIdAvailable`, {
        params: { loginId },
        withCredentials: true
      });
      setIsLoginIdAvailable(response.data);
      setLoginIdError(response.data ? '' : '이미 사용 중인 아이디입니다.');
    } catch (error) {
      console.error('Error checking login ID availability:', error);
    }
  };

  useEffect(() => {
    if (loginId.length > 0) {
      checkLoginIdAvailability(loginId);
    }
  }, [loginId]);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!isLoginIdAvailable) {
      alert(`${loginId}은(는) 사용할 수 없는 아이디입니다.`);
      setLoginId('');
      return;
    }

    if (loginPw !== passwordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    try {
        const response = await axios.post('http://localhost:8081/usr/member/doJoin', {
            name,
            loginId,
            loginPw,
            email
        });
        alert(`${name}님, 환영합니다!`);
        history.push('/login'); // 로그인 페이지로 이동
    } catch (error) {
        console.error('Registration failed:', error);
        alert('회원가입 실패');
    }
};

  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    const handlePasswordCheckChange = (event) => {
      setPasswordCheck(event.target.value);
    };
  

    return (
        <div className="member">
        <ThemeProvider theme={theme}>
        <NavigationBar/>
    
        <div className='wrapper'>
        <form onSubmit={handleRegister}>
            <h1>Register</h1>
            <div className="input-box">
              <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
              <FaUser className='icon' />
            </div>
            <div className="input-box">
                <input type="text" placeholder='Login Id' value={loginId} onChange={(e) => setLoginId(e.target.value)} onBlur={() => checkLoginIdAvailability(loginId)} required />
                {isLoginIdAvailable ? <FaUserCheck className='icon' /> : <FaRegCheckSquare className='icon' />}
                <div className="text-sm text-red-500">{loginIdError}</div>
              </div>
            <div className="input-box">
              <input type="password" placeholder='Password' value={loginPw} onChange={handlePasswordChange} required />
              <FaLock className='icon' />
            </div>
            <div className="input-box">
              <input type="password" placeholder='Password Check' value={passwordCheck} onChange={handlePasswordCheckChange} required />
              {loginPw === passwordCheck ? <FaCheckSquare className='icon' /> : <FaRegCheckSquare className='icon' />}
            </div>
            <div className="input-box">
              <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              <FaEnvelope className='icon' />
            </div>
            <button type="submit">Register</button>
            <div className="register-link">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </form>
        </div>
        </ThemeProvider>
        </div>
    );
};

export default RegisterPage;