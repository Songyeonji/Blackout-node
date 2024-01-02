import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      const storedUserId = sessionStorage.getItem('userId');
      const storedLoginStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    
      if (storedLoginStatus && storedUserId) {
        setIsLoggedIn(true);
        setUserId(Number(storedUserId)); // 문자열을 숫자로 변환
      }
    }, []);
  
    const handleLogin = (userDetails) => {
      setIsLoggedIn(true);
      setUserId(userDetails.id);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userId', userDetails.id.toString()); // 숫자를 문자열로 변환하여 저장
    };
  
    const handleLogout = () => {
      setIsLoggedIn(false);
      setUserId(null);
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userId');
    };
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, userId, setIsLoggedIn, setUserId, handleLogin, handleLogout }}>
        {children}
      </AuthContext.Provider>
    );
  };
