import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { FaUser, FaUserCheck, FaLock, FaEnvelope, FaCheckSquare, FaRegCheckSquare } from "react-icons/fa";
import './Login.css';
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import NavigationBar from '../../components/NavigationBar';

// MUI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const RegisterPage = () => {
  // 상태 변수 선언
  const [name, setName] = useState(''); // 사용자 이름을 저장하는 상태, 초기값은 빈 문자열
  const [loginId, setLoginId] = useState(''); // 사용자 로그인 ID를 저장하는 상태, 초기값은 빈 문자열
  const [loginPw, setPassword] = useState(''); // 사용자 비밀번호를 저장하는 상태, 초기값은 빈 문자열
  const [passwordCheck, setPasswordCheck] = useState(''); // 비밀번호 확인을 위한 상태, 초기값은 빈 문자열
  const [email, setEmail] = useState(''); // 사용자 이메일을 저장하는 상태, 초기값은 빈 문자열
  const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(true); 
  // 사용자의 로그인 ID가 사용 가능한지 여부를 저장하는 상태, 초기값은 true (사용 가능)
  const [loginIdError, setLoginIdError] = useState(''); 
  // 로그인 ID에 관한 오류 메시지를 저장하는 상태, 초기값은 빈 문자열
  const history = useHistory();//히스토리 객체


  // 로그인 ID의 유효성을 확인하는 함수
  const checkLoginIdAvailability = async (loginId) => {
    if (!loginId) {
      setLoginIdError('아이디는 필수 입력 정보입니다.');
      setIsLoginIdAvailable(false);
      return;
    }
    try {
        // 백엔드 서버에 로그인 ID 유효성 검사 요청
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

  // 로그인 ID 변경시 유효성 검사 실행
  useEffect(() => {
    if (loginId.length > 0) {
      checkLoginIdAvailability(loginId);
    }
  }, [loginId]);
  // 회원가입 처리 함수
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
  // 백엔드 서버에 회원가입 요청
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

  // 패스워드 변경 핸들러
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  // 패스워드 확인 변경 핸들러
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