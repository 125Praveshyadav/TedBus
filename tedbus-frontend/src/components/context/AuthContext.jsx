import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "../../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const persistAuth = useCallback((userData, token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }

    setUser(userData || null);
    setIsAuthenticated(Boolean(token && userData));
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      clearAuth();
      return null;
    }

    const response = await authService.getProfile();
    const freshUser = authService.extractUser(response);

    if (!freshUser) {
      throw new Error("Unable to fetch profile.");
    }
       const mergedUser = {
    ...(user || {}),
    ...freshUser,
  };

    persistAuth(mergedUser, token);
    return mergedUser;
  }, [clearAuth, persistAuth]);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      setAuthError(null);

      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = safeJsonParse(localStorage.getItem(USER_KEY));

      if (!token) {
        clearAuth();
        setLoading(false);
        return;
      }

      // Fast local restore
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }

      try {
        // Real backend token/profile verification
        await refreshUser();
      } catch (error) {
        console.error("Auth verification failed:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuth, refreshUser]);

  const login = useCallback(
    async (payloadOrUserData, tokenFromPage = null) => {
      setAuthError(null);

      try {
        // Old Login.jsx compatibility: login(user, token)
        if (tokenFromPage) {
          persistAuth(payloadOrUserData, tokenFromPage);
          return {
            user: payloadOrUserData,
            token: tokenFromPage,
          };
        }

        // New recommended flow: login({ email, password })
        const response = await authService.login(payloadOrUserData);
        const { user: loggedInUser, token } =
          authService.normalizeAuthResponse(response);

        if (!loggedInUser || !token) {
          throw new Error("Invalid login response from server.");
        }

        persistAuth(loggedInUser, token);
          // Important: ensure full user (with profileImage) is loaded
      try {
        await refreshUser();
      } catch (err) {
        console.warn("refreshUser after login failed:", err?.message);
      }

        return {
          user: loggedInUser,
          token,
          response,
        };
      } catch (error) {
        const message =
          error?.message || "Login failed. Please try again.";

        setAuthError(message);
        throw error;
      }
    },
    [persistAuth , refreshUser]
  );

  const register = useCallback(async (registerData) => {
    setAuthError(null);

    try {
      return await authService.register(registerData);
    } catch (error) {
      const message =
        error?.message || "Registration failed. Please try again.";

      setAuthError(message);
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(async (otpData) => {
    setAuthError(null);

    try {
      const response = await authService.verifyOTP(otpData);
      const { user: verifiedUser, token } =
        authService.normalizeAuthResponse(response);

      if (verifiedUser && token) {
        persistAuth(verifiedUser, token);
      }

      return response;
    } catch (error) {
      const message =
        error?.message || "OTP verification failed.";

      setAuthError(message);
      throw error;
    }
  }, [persistAuth]);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.warn("Backend logout failed, clearing local session:", error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const updateUser = useCallback(
    async (profileData) => {
      setAuthError(null);

      try {
        const response = await authService.updateProfile(profileData);
       const extractedUser = authService.extractUser(response);
        const updatedUser =
          authService.extractUser(response) || {
            ...user,
            ...profileData,
          };

        const token = localStorage.getItem(TOKEN_KEY);
        persistAuth(updatedUser, token);

        return updatedUser;
      } catch (error) {
        const message =
          error?.message || "Profile update failed. Please try again.";

        setAuthError(message);
        throw error;
      }
    },
    [persistAuth, user]
  );
   
  const updateUserPhoto = useCallback(
  async (formData) => {
    setAuthError(null);

    try {
      const response = await authService.updateProfilePhoto(formData);

      const updatedUser =
        authService.extractUser(response) ||
        response?.user ||
        user;

      const token = localStorage.getItem(TOKEN_KEY);

      persistAuth(updatedUser, token);

      return updatedUser;
    } catch (error) {
      const message =
        error?.message ||
        "Profile photo upload failed. Please try again.";

      setAuthError(message);
      throw error;
    }
  },
  [persistAuth, user]
);



  const changeUserPassword = useCallback(async (passwordData) => {
    setAuthError(null);

    try {
      return await authService.changePassword(passwordData);
    } catch (error) {
      const message =
        error?.message || "Password change failed. Please try again.";

      setAuthError(message);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      loading,
      authError,

      login,
      register,
      verifyOTP,
      logout,
      refreshUser,
      updateUser,
      
      changeUserPassword,
      updateUserPhoto, 

    }),
    [
      user,
      isAuthenticated,
      loading,
      authError,
      login,
      register,
      verifyOTP,
      logout,
      refreshUser,
      updateUser,
      updateUserPhoto,
      changeUserPassword,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};