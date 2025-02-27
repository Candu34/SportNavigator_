import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@/constants/api_url";
import { useRouter } from "expo-router";



interface AuthProps {
  authState?: {token: string | null; authenticated: boolean | null};
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}


const TOKEN_KEY = 'my_jwt';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {  
  return useContext(AuthContext);
}

export const AuthProvider = ({children}:any) => {
  const [authState, setAuthState] = useState<{
    token: string | null; 
    authenticated: boolean | null
  }>({
    token: null, 
    authenticated: null
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("stored", token);

      if (token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthState({ 
          token: token,
          authenticated: true
        });
        
      }
    }
    loadToken();
  }, [])

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync("my_jwt");
  
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = decodedToken.exp * 1000;
  
          if (Date.now() > expirationTime) {
            const newToken = await refreshAccessToken(refreshToken!);
            if (!newToken) {
              await logout();
            }
          }
        } catch (e) {
          console.error("Token validation failed", e);
          await logout();
        }
      }
    };
  
    checkTokenExpiration();
  }, []);
  

  const register = async (email: string, password: string, firstName:string, lastName:string) => {
    try {
      return await axios.post(`${API_URL}/auth/signup`, {email, password, firstName, lastName});
    } 
    catch (e) {
      return {error: true, msg: (e as any).response.data.msg};
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      const result = await axios.post(`${API_URL}/auth/login`, {email, password});
  
      console.log("Login result", result.data);

      const { accessToken, refreshToken, user } = result.data;
  
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  
      setAuthState({
        token: accessToken,
        authenticated: true
      });
  
      return result;
    } catch (e) {
      return {error: true, msg: (e as any).response.data.msg};
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (e) {
      console.error("Logout failed", e);
    }
  
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync("refresh_token");
  
    axios.defaults.headers.common['Authorization'] = '';
  
    setAuthState({
      token: null,
      authenticated: false
    });
  };
  

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/refreshToken`, {
        token: refreshToken,
      });
  
      const newAccessToken = response.data.accessToken;
  
      await SecureStore.setItemAsync(TOKEN_KEY, newAccessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  
      setAuthState({
        token: newAccessToken,
        authenticated: true
      });
  
      return newAccessToken;
    } catch (e) {
      console.error("Error refreshing token:", e);
      return null;
    }
  };
  

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  
}