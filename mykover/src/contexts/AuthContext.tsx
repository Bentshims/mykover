import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../services/api";

// Types for authentication
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (phone: string, password: string) => Promise<boolean>; // ✅ CORRIGÉ
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  loginWithToken: (token: string) => Promise<boolean>;
}

export interface SignupData {
  fullname: string; // Correspond au backend: fullname
  email: string;
  phone: string; // Correspond au backend: phone
  password: string;
  birth_date: string; // Correspond au backend: birth_date (DD-MM-YYYY) ✅ CORRIGÉ
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (token && userData) {
        // Verify token with backend
        try {
          const response = await authApi.me();
          if (response.success) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(userData),
          isLoading: false,
        });
            return;
          }
        } catch (error) {
          // Token invalid, clear storage
          await AsyncStorage.removeItem("auth_token");
          await AsyncStorage.removeItem("user_data");
        }
      }

        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const login = async (phone: string, password: string): Promise<boolean> => { // ✅ CORRIGÉ
    try {
      const response = await authApi.login(phone, password); // ✅ CORRIGÉ

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Transform backend user to frontend User type
        const frontendUser: User = {
          id: user.id,
          fullName: user.fullname,
          email: user.email,
          phoneNumber: user.phone,
          isActive: user.email_verified,
        };

      // Save to AsyncStorage
        await AsyncStorage.setItem("auth_token", token);
        await AsyncStorage.setItem("user_data", JSON.stringify(frontendUser));

      setAuthState({
        isAuthenticated: true,
          user: frontendUser,
        isLoading: false,
      });

      return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      console.log('[AuthContext] Données inscription:', userData);
      const response = await authApi.register(userData);
      console.log('[AuthContext] Réponse:', response);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Transform backend user to frontend User type
        const frontendUser: User = {
          id: user.id,
          fullName: user.fullname,
          email: user.email,
          phoneNumber: user.phone,
          isActive: user.email_verified,
        };

      // Save to AsyncStorage
        await AsyncStorage.setItem("auth_token", token);
        await AsyncStorage.setItem("user_data", JSON.stringify(frontendUser));

      setAuthState({
        isAuthenticated: true,
          user: frontendUser,
        isLoading: false,
      });

      return true;
      }

      return false;
    } catch (error: any) {
      console.error("Signup error:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      return false;
    }
  };

  const loginWithToken = async (token: string): Promise<boolean> => {
    try {
      // Save token temporarily
      await AsyncStorage.setItem("auth_token", token);
      
      // Get user info with the token
      const response = await authApi.me();
      
      if (response.success && response.data) {
        const { user } = response.data;
        
        // Transform backend user to frontend User type
        const frontendUser: User = {
          id: user.id,
          fullName: user.fullname,
          email: user.email,
          phoneNumber: user.phone,
          isActive: user.email_verified,
        };

        // Save user data
        await AsyncStorage.setItem("user_data", JSON.stringify(frontendUser));

        setAuthState({
          isAuthenticated: true,
          user: frontendUser,
          isLoading: false,
        });

        return true;
      }

      // If failed, remove the token
      await AsyncStorage.removeItem("auth_token");
      return false;
    } catch (error) {
      console.error("Login with token error:", error);
      await AsyncStorage.removeItem("auth_token");
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      try {
        await authApi.logout();
      } catch (error) {
        console.error("Backend logout error:", error);
      }

      // Clear local storage
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user_data");

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    checkAuthStatus,
    loginWithToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
