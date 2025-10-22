import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {  signUpUser, signInUser, refreshAccessToken, logoutUser } from './usersAPI'; // Adjust the path as needed

interface AuthContextType {
  user: any; // Define a more specific type based on your user structure
  signUp: (data: any) => Promise<void>; // Adjust the type as needed
  signIn: (data: { identifier: string; password: string }) => Promise<void>;
  refreshToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Adjust the initial state as needed

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signUp = async (data: any) => {
    try {
      const result = await signUpUser(data);
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
    } catch (error) {
      console.error(error);
      throw error; // Handle error appropriately
    }
  };

  const signIn = async (data: { identifier: string; password: string }) => {
    try {
      console.log("signing in user: "+data)
      console.log("signing in user:", JSON.stringify(data, null, 2))
      const result = await signInUser(data);
      console.log(JSON.stringify(result))
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      // Store tokens if needed
      localStorage.setItem('accessToken', result.tokens.accessToken);
      localStorage.setItem('refreshToken', result.tokens.refreshToken);
    } catch (error) {
      console.error(error);
      throw error; // Handle error appropriately
    }
  };

  const refreshToken = async (token: string) => {
    try {
      const result = await refreshAccessToken(token);
      // Update the user or tokens as needed
      localStorage.setItem('accessToken', result.accessToken);
    } catch (error) {
      console.error(error);
      throw error; // Handle error appropriately
    }
  };

  const logout = async () => {
    console.log("logout called")
    try {
      console.log(localStorage.getItem('refreshToken'))
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error(error);
      throw error; // Handle error appropriately
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
