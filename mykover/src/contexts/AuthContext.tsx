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
  login: (identifier: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export interface SignupData {
  fullname: string; // Correspond au backend: fullname
  email: string;
  phone: string; // Correspond au backend: phone
  password: string;
  birth_date: string; // Correspond au backend: birth_date (YYYY-MM-DD)
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

  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(identifier, password);

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
      const response = await authApi.register(userData);

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
      console.error("Signup error:", error);
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
