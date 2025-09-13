// screens/auth/LoginScreen.js - SAI User Login
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { SAI_COLORS } from '../../constants/theme';

const LoginScreen = ({ navigation }) => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    otp: '',
  });
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithEmail, loginWithPhone, sendOTP } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOTP = async () => {
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    const result = await sendOTP(formData.phoneNumber);
    setIsLoading(false);

    if (result.success) {
      setShowOTPInput(true);
      Alert.alert('Success', 'OTP sent to your phone number (Use: 123456 for demo)');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    let result;
    if (loginMethod === 'email') {
      if (!formData.email.trim() || !formData.password.trim()) {
        Alert.alert('Error', 'Please enter both email and password');
        setIsLoading(false);
        return;
      }
      result = await loginWithEmail(formData.email, formData.password);
    } else {
      if (!showOTPInput) {
        await handleSendOTP();
        return;
      }
      if (!formData.otp.trim()) {
        Alert.alert('Error', 'Please enter the OTP');
        setIsLoading(false);
        return;
      }
      result = await loginWithPhone(formData.phoneNumber, formData.otp);
    }

    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => navigation.navigate('MainApp') }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={SAI_COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your SAI-Vision account</Text>
          </View>

          {/* Login Method Toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                loginMethod === 'email' && styles.activeMethod
              ]}
              onPress={() => {
                setLoginMethod('email');
                setShowOTPInput(false);
              }}
            >
              <Ionicons 
                name="mail" 
                size={20} 
                color={loginMethod === 'email' ? SAI_COLORS.white : SAI_COLORS.gray} 
              />
              <Text style={[
                styles.methodText,
                loginMethod === 'email' && styles.activeMethodText
              ]}>
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodButton,
                loginMethod === 'phone' && styles.activeMethod
              ]}
              onPress={() => {
                setLoginMethod('phone');
                setShowOTPInput(false);
              }}
            >
              <Ionicons 
                name="call" 
                size={20} 
                color={loginMethod === 'phone' ? SAI_COLORS.white : SAI_COLORS.gray} 
              />
              <Text style={[
                styles.methodText,
                loginMethod === 'phone' && styles.activeMethodText
              ]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {loginMethod === 'email' ? (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} color={SAI_COLORS.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={SAI_COLORS.gray}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={SAI_COLORS.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry
                    placeholderTextColor={SAI_COLORS.gray}
                  />
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons name="call" size={20} color={SAI_COLORS.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor={SAI_COLORS.gray}
                  />
                  {!showOTPInput && (
                    <TouchableOpacity onPress={handleSendOTP} style={styles.sendOTPButton}>
                      <Text style={styles.sendOTPText}>Send OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {showOTPInput && (
                  <View style={styles.inputContainer}>
                    <Ionicons name="shield-checkmark" size={20} color={SAI_COLORS.gray} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChangeText={(value) => handleInputChange('otp', value)}
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholderTextColor={SAI_COLORS.gray}
                    />
                    <TouchableOpacity onPress={handleSendOTP} style={styles.resendOTPButton}>
                      <Text style={styles.resendOTPText}>Resend</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Signing In...</Text>
            ) : (
              <>
                <Ionicons name="log-in" size={20} color={SAI_COLORS.white} />
                <Text style={styles.buttonText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account? <Text style={styles.linkText}>Create Account</Text>
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Login */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => navigation.navigate('MainApp', { isGuest: true })}
          >
            <Ionicons name="person-outline" size={20} color={SAI_COLORS.orange} />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: SAI_COLORS.gray,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: SAI_COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeMethod: {
    backgroundColor: SAI_COLORS.orange,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: SAI_COLORS.gray,
  },
  activeMethodText: {
    color: SAI_COLORS.white,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SAI_COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: SAI_COLORS.dark,
    marginLeft: 12,
  },
  sendOTPButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SAI_COLORS.blue,
    borderRadius: 8,
  },
  sendOTPText: {
    color: SAI_COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  resendOTPButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resendOTPText: {
    color: SAI_COLORS.orange,
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    color: SAI_COLORS.orange,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SAI_COLORS.orange,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginLeft: 8,
  },
  registerLink: {
    alignItems: 'center',
    marginBottom: 32,
  },
  registerLinkText: {
    fontSize: 16,
    color: SAI_COLORS.gray,
  },
  linkText: {
    color: SAI_COLORS.orange,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: SAI_COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: SAI_COLORS.gray,
    fontWeight: '500',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SAI_COLORS.orange,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: SAI_COLORS.orange,
    marginLeft: 8,
  },
});

export default LoginScreen;