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
      const result = await axios.post(`${API_URL}/auth/login`, {email, password});

      console.log("file:AuthContext.tsx ~ login ~result:", result);

      setAuthState({
        token: (result as any).data.token,
        authenticated: true
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${(result as any).data.accessToken}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);

      return result;
    } 
    catch (e) {
      return {error: true, msg: (e as any).response.data.msg};
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (e) {
      return {error: true, msg: (e as any).response.data.msg};
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common['Authorization'] = '';

    setAuthState({
      token: null,
      authenticated: false
    }); 
  }




  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  
}