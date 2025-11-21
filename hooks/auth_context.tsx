import { loginAPI } from "@/services/api";
import { removeToken, setToken } from "@/utils/storage";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useContext, useState } from "react";


interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (account: string, password: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isLoading: false,
  login:  (account: string, password: string) => {},
  logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();


  const login = async (account: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await loginAPI(account, password);
      console.log(res); 
      if (res.access_token && res.refresh_token) {
        await setToken(res.access_token, res.refresh_token);
        setIsLoggedIn(true);
        router.replace("/(protected)/(tabs)/(home)");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await removeToken();
    setIsLoggedIn(false);
    router.replace("/login");
  };


  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

