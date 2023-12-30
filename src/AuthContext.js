import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMemberName, setLoginMemberName] = useState('');

  useEffect(() => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    if (storedLoginStatus) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loginMemberName, setLoginMemberName }}>
    {children}
    </AuthContext.Provider>
  );
};