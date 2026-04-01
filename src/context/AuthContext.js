import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const signInEmail = async (email, password) => {};
  const signInGoogle = async () => {};
  const signInApple = async () => {};
  return <AuthContext.Provider value={{ user, signInEmail, signInGoogle, signInApple, firebaseReady: true }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
