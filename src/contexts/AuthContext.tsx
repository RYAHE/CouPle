import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Couple } from '../types';
import apiService from '../services/api';

interface AuthState {
  user: User | null;
  couple: Couple | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; couple: Couple; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_COUPLE'; payload: Couple }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  couple: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        couple: action.payload.couple,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE_COUPLE':
      return {
        ...state,
        couple: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    partnerEmail?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          apiService.setToken(token);
          const profileResponse = await apiService.getProfile();
          const coupleResponse = await apiService.getCoupleInfo();

          if (profileResponse.success && coupleResponse.success) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: profileResponse.data,
                couple: coupleResponse.data,
                token,
              },
            });
          } else {
            await AsyncStorage.removeItem('auth_token');
            apiService.clearToken();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await AsyncStorage.removeItem('auth_token');
        apiService.clearToken();
      } finally {
        dispatch({ type: 'AUTH_START' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user, couple, token } = response.data;
        
        await AsyncStorage.setItem('auth_token', token);
        apiService.setToken(token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, couple, token },
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Échec de la connexion',
        });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Erreur de connexion',
      });
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    partnerEmail?: string;
  }) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user, couple, token } = response.data;
        
        await AsyncStorage.setItem('auth_token', token);
        apiService.setToken(token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, couple, token },
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.error || 'Échec de l\'inscription',
        });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Erreur d\'inscription',
      });
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      apiService.clearToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(profileData);
      
      if (response.success && response.data) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data,
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 