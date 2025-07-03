import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Couple } from '../types';

interface AuthState {
  user: User | null;
  couple: Couple | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  sessionExpiry: Date | null;
  loginAttempts: number;
  isLocked: boolean;
  lockUntil: Date | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; couple: Couple; token: string; refreshToken: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_COUPLE'; payload: Couple }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INIT_COMPLETE' }
  | { type: 'INCREMENT_LOGIN_ATTEMPTS' }
  | { type: 'LOCK_ACCOUNT'; payload: Date }
  | { type: 'UNLOCK_ACCOUNT' }
  | { type: 'REFRESH_TOKEN'; payload: { token: string; refreshToken: string } };

const initialState: AuthState = {
  user: null,
  couple: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  sessionExpiry: null,
  loginAttempts: 0,
  isLocked: false,
  lockUntil: null,
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
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
        loginAttempts: 0,
        isLocked: false,
        lockUntil: null,
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
    case 'INIT_COMPLETE':
      return {
        ...state,
        isLoading: false,
      };
    case 'INCREMENT_LOGIN_ATTEMPTS':
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1,
      };
    case 'LOCK_ACCOUNT':
      return {
        ...state,
        isLocked: true,
        lockUntil: action.payload,
      };
    case 'UNLOCK_ACCOUNT':
      return {
        ...state,
        isLocked: false,
        lockUntil: null,
        loginAttempts: 0,
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
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
    partnerEmail: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
  validatePassword: (password: string) => boolean;
  validateEmail: (email: string) => boolean;
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

  // Validation des emails
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation des mots de passe
  const validatePassword = (password: string): boolean => {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Génération de tokens sécurisés
  const generateSecureToken = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + Date.now().toString(36);
  };

  // Hashage simple des mots de passe (pour la démo)
  const hashPassword = (password: string): string => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36) + 'CouPle_Salt_2024';
  };

  // Vérification du verrouillage du compte
  const checkAccountLock = (): boolean => {
    if (!state.isLocked || !state.lockUntil) return false;
    return new Date() < state.lockUntil;
  };

  // Initialisation de l'authentification
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        const sessionExpiry = await AsyncStorage.getItem('session_expiry');
        const loginAttempts = await AsyncStorage.getItem('login_attempts');
        const lockUntil = await AsyncStorage.getItem('lock_until');

        if (token && refreshToken && sessionExpiry) {
          const expiryDate = new Date(sessionExpiry);
          
          // Vérifier si la session n'est pas expirée
          if (new Date() < expiryDate) {
            const mockUser: User = {
              id: '1',
              name: 'Utilisateur Test',
              email: 'test@example.com',
              avatar: undefined,
              isOnline: true,
              lastSeen: new Date(),
            };
            
            const mockCouple: Couple = {
              id: '1',
              partner1: mockUser,
              partner2: mockUser,
              relationshipStart: new Date(),
              status: 'active',
            };

            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: mockUser,
                couple: mockCouple,
                token,
                refreshToken,
              },
            });
          } else {
            // Session expirée, nettoyer
            await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'session_expiry']);
          }
        }

        // Restaurer les tentatives de connexion et le verrouillage
        if (loginAttempts) {
          dispatch({ type: 'INCREMENT_LOGIN_ATTEMPTS' });
        }
        if (lockUntil) {
          const lockDate = new Date(lockUntil);
          if (new Date() < lockDate) {
            dispatch({ type: 'LOCK_ACCOUNT', payload: lockDate });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'session_expiry']);
      } finally {
        dispatch({ type: 'INIT_COMPLETE' });
      }
    };

    initializeAuth();
  }, []);

  // Vérification périodique de la session
  useEffect(() => {
    const checkSession = setInterval(() => {
      if (state.sessionExpiry && new Date() > state.sessionExpiry) {
        logout();
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(checkSession);
  }, [state.sessionExpiry]);

  const login = async (email: string, password: string) => {
    try {
      // Vérifier le verrouillage du compte
      if (checkAccountLock()) {
        const remainingTime = Math.ceil((state.lockUntil!.getTime() - new Date().getTime()) / 60000);
        dispatch({
          type: 'AUTH_FAILURE',
          payload: `Compte temporairement verrouillé. Réessayez dans ${remainingTime} minutes.`,
        });
        return;
      }

      dispatch({ type: 'AUTH_START' });

      // Validation des entrées
      if (!validateEmail(email)) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Adresse email invalide',
        });
        return;
      }

      // Simulation d'une connexion réussie
      const mockUser: User = {
        id: '1',
        name: 'Utilisateur Test',
        email: email,
        avatar: undefined,
        isOnline: true,
        lastSeen: new Date(),
      };
      
      const mockCouple: Couple = {
        id: '1',
        partner1: mockUser,
        partner2: mockUser,
        relationshipStart: new Date(),
        status: 'active',
      };

      const token = generateSecureToken();
      const refreshToken = generateSecureToken();
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      // Sauvegarder les tokens
      await AsyncStorage.multiSet([
        ['auth_token', token],
        ['refresh_token', refreshToken],
        ['session_expiry', sessionExpiry.toISOString()],
      ]);
      
      // Nettoyer les tentatives de connexion
      await AsyncStorage.removeItem('login_attempts');
      await AsyncStorage.removeItem('lock_until');
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: mockUser, couple: mockCouple, token, refreshToken },
      });
    } catch (error) {
      // Incrémenter les tentatives de connexion
      dispatch({ type: 'INCREMENT_LOGIN_ATTEMPTS' });
      const newAttempts = state.loginAttempts + 1;
      
      if (newAttempts >= 5) {
        // Verrouiller le compte pendant 15 minutes
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await AsyncStorage.setItem('lock_until', lockUntil.toISOString());
        dispatch({ type: 'LOCK_ACCOUNT', payload: lockUntil });
        
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Trop de tentatives de connexion. Compte verrouillé pendant 15 minutes.',
        });
      } else {
        await AsyncStorage.setItem('login_attempts', newAttempts.toString());
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Email ou mot de passe incorrect',
        });
      }
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    partnerEmail: string;
  }) => {
    try {
      dispatch({ type: 'AUTH_START' });

      // Validation des données d'inscription
      if (!userData.name.trim()) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Le nom est obligatoire',
        });
        return;
      }

      if (!validateEmail(userData.email)) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Veuillez entrer une adresse email valide',
        });
        return;
      }

      if (!validatePassword(userData.password)) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
        });
        return;
      }

      if (!validateEmail(userData.partnerEmail)) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: 'Veuillez entrer une adresse email valide pour votre partenaire',
        });
        return;
      }

      // Hashage du mot de passe
      const hashedPassword = hashPassword(userData.password);

      // Simulation d'un enregistrement réussi
      const mockUser: User = {
        id: '1',
        name: userData.name,
        email: userData.email,
        avatar: undefined,
        isOnline: true,
        lastSeen: new Date(),
      };
      
      const mockCouple: Couple = {
        id: '1',
        partner1: mockUser,
        partner2: mockUser,
        relationshipStart: new Date(),
        status: 'active',
      };

      const token = generateSecureToken();
      const refreshToken = generateSecureToken();
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      // Sauvegarder les données
      await AsyncStorage.multiSet([
        ['auth_token', token],
        ['refresh_token', refreshToken],
        ['session_expiry', sessionExpiry.toISOString()],
        ['user_password_hash', hashedPassword],
      ]);
      
      await AsyncStorage.setItem('partner_email', userData.partnerEmail);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: mockUser, couple: mockCouple, token, refreshToken },
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Erreur lors de la création du compte',
      });
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'auth_token',
        'refresh_token',
        'session_expiry',
        'login_attempts',
        'lock_until',
      ]);
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshSession = async () => {
    try {
      if (!state.refreshToken) return;

      const newToken = generateSecureToken();
      const newRefreshToken = generateSecureToken();
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await AsyncStorage.multiSet([
        ['auth_token', newToken],
        ['refresh_token', newRefreshToken],
        ['session_expiry', sessionExpiry.toISOString()],
      ]);

      dispatch({
        type: 'REFRESH_TOKEN',
        payload: { token: newToken, refreshToken: newRefreshToken },
      });
    } catch (error) {
      console.error('Session refresh error:', error);
      logout();
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      if (state.user) {
        const updatedUser = { ...state.user, ...profileData };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
        refreshSession,
        validatePassword,
        validateEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 