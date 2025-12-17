import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize authentication state safely.
   * We DO NOT trust localStorage at initialization.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!storedToken || !storedUser) {
          setLoading(false);
          return;
        }

        // Optional (recommended for production):
        // await authAPI.verifyToken(storedToken);

        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.clear();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token: authToken } = response;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);

      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Login failed");
      return { success: false, message: error.message };
    }
  };

  /**
   * Signup
   */
  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { user: newUser, token: authToken } = response;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      setToken(authToken);
      setUser(newUser);

      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Signup failed");
      return { success: false, message: error.message };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  /**
   * Update user profile
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: Boolean(token && user),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

