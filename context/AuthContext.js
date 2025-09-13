// context/AuthContext.js - Authentication Context for SAI-Vision App
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('authToken');
      
      if (userData && token) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register with email
  const registerWithEmail = async (email, password, personalInfo) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For now, we'll simulate the registration
      const newUser = {
        id: Date.now().toString(),
        email,
        ...personalInfo,
        createdAt: new Date().toISOString(),
        profile: {
          isProfileComplete: false,
          submissions: [],
          currentStatus: 'registered', // registered, submitted, under_review, selected, rejected
        }
      };
      
      const authToken = `token_${Date.now()}`;
      
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      await AsyncStorage.setItem('authToken', authToken);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register with phone
  const registerWithPhone = async (phoneNumber, otp, personalInfo) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would verify OTP with backend
      if (otp !== '123456') { // Mock OTP verification
        throw new Error('Invalid OTP');
      }
      
      const newUser = {
        id: Date.now().toString(),
        phoneNumber,
        ...personalInfo,
        createdAt: new Date().toISOString(),
        profile: {
          isProfileComplete: false,
          submissions: [],
          currentStatus: 'registered',
        }
      };
      
      const authToken = `token_${Date.now()}`;
      
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      await AsyncStorage.setItem('authToken', authToken);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Phone registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email
  const loginWithEmail = async (email, password) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For demo, we'll check if user exists in AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      
      if (userData) {
        const existingUser = JSON.parse(userData);
        if (existingUser.email === email) {
          setUser(existingUser);
          setIsAuthenticated(true);
          return { success: true, user: existingUser };
        }
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login with phone
  const loginWithPhone = async (phoneNumber, otp) => {
    try {
      setIsLoading(true);
      
      if (otp !== '123456') { // Mock OTP verification
        throw new Error('Invalid OTP');
      }
      
      const userData = await AsyncStorage.getItem('userData');
      
      if (userData) {
        const existingUser = JSON.parse(userData);
        if (existingUser.phoneNumber === phoneNumber) {
          setUser(existingUser);
          setIsAuthenticated(true);
          return { success: true, user: existingUser };
        }
      }
      
      throw new Error('User not found');
    } catch (error) {
      console.error('Phone login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP (mock implementation)
  const sendOTP = async (phoneNumber) => {
    try {
      // In a real app, this would send actual OTP
      console.log(`Sending OTP to ${phoneNumber}: 123456`);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Submit test results to SAI
  const submitToSAI = async (submissionData) => {
    try {
      const submission = {
        id: Date.now().toString(),
        userId: user.id,
        ...submissionData,
        submittedAt: new Date().toISOString(),
        status: 'under_review',
      };

      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          submissions: [...(user.profile.submissions || []), submission],
          currentStatus: 'submitted'
        }
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, submission };
    } catch (error) {
      console.error('SAI submission error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    registerWithEmail,
    registerWithPhone,
    loginWithEmail,
    loginWithPhone,
    sendOTP,
    updateProfile,
    submitToSAI,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;