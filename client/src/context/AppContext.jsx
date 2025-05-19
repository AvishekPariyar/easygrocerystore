// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { api, authAPI } from "../config/api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Authentication methods
  const login = async (email, password, role = 'user') => {
    try {
      setLoading(true);
      console.log('Login attempt with role:', role);
      
      // Use the authAPI instead of direct axios call
      const response = await authAPI.login({
        email,
        password,
        role // Include role in the login request
      });
      
      const { token, user: userData } = response.data;
      console.log('Login response user data:', userData);
      
      // If the user has a role in the response, use it; otherwise use the selected role
      if (!userData.role && role) {
        userData.role = role;
        console.log('Setting role from selection:', role);
      }
      
      localStorage.setItem('token', token);
      setUser(userData);
      setError(null);
      
      // Return user data so the component can check the role
      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred');
      throw err; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      setLoading(true);
      console.log('Register attempt with role:', role);
      
      // Register with the specified role
      const response = await authAPI.register({
        name,
        email,
        password,
        role // Use the selected role
      });
      
      const { token, user: userData } = response.data;
      console.log('Register response user data:', userData);
      
      // Don't store the token or user data on registration
      // User will need to log in explicitly
      setError(null);
      
      // Return the user data for confirmation
      return { success: true, user: userData };
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'An error occurred');
      throw err; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear user data and token
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    localStorage.removeItem('cart');
    
    // Use window.location for a full page refresh to ensure clean state
    window.location.href = '/login';
  };

  // Cart methods
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const value = {

    user,
    setUser,
    cart,
    loading,
    error,
    showUserLogin,
    setShowUserLogin,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
