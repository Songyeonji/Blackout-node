import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMemberName, setLoginMemberName] = useState('');

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loginMemberName, setLoginMemberName }}>
    {children}
    </AuthContext.Provider>
  );
};