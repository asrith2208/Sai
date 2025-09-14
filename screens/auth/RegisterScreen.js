// screens/auth/RegisterScreen.js - SAI User Registration
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { SAI_COLORS } from '../../constants/theme';

const RegisterScreen = ({ navigation }) => {
  const [registrationMethod, setRegistrationMethod] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    state: '',
    sport: '',
    experience: '',
    otp: '',
  });
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { registerWithEmail, registerWithPhone, sendOTP } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, email, phoneNumber, password, confirmPassword, dateOfBirth, gender } = formData;

    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (registrationMethod === 'email') {
      if (!email.trim() || !email.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }
      if (!password || password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    } else {
      if (!phoneNumber.trim() || phoneNumber.length !== 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return false;
      }
    }

    if (!dateOfBirth || !gender) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    return true;
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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const personalInfo = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      city: formData.city,
      state: formData.state,
      sport: formData.sport,
      experience: formData.experience,
    };

    let result;
    if (registrationMethod === 'email') {
      result = await registerWithEmail(formData.email, formData.password, personalInfo);
    } else {
      if (!showOTPInput) {
        await handleSendOTP();
        return;
      }
      result = await registerWithPhone(formData.phoneNumber, formData.otp, personalInfo);
    }

    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Registration successful!', [
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
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={SAI_COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the SAI talent discovery platform</Text>
          </View>

          {/* Registration Method Toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                registrationMethod === 'email' && styles.activeMethod
              ]}
              onPress={() => setRegistrationMethod('email')}
            >
              <Ionicons 
                name="mail" 
                size={20} 
                color={registrationMethod === 'email' ? SAI_COLORS.white : SAI_COLORS.gray} 
              />
              <Text style={[
                styles.methodText,
                registrationMethod === 'email' && styles.activeMethodText
              ]}>
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodButton,
                registrationMethod === 'phone' && styles.activeMethod
              ]}
              onPress={() => setRegistrationMethod('phone')}
            >
              <Ionicons 
                name="call" 
                size={20} 
                color={registrationMethod === 'phone' ? SAI_COLORS.white : SAI_COLORS.gray} 
              />
              <Text style={[
                styles.methodText,
                registrationMethod === 'phone' && styles.activeMethodText
              ]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Personal Information */}
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={SAI_COLORS.gray} />
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                placeholderTextColor={SAI_COLORS.gray}
              />
            </View>

            {registrationMethod === 'email' ? (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} color={SAI_COLORS.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address *"
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
                    placeholder="Password *"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry
                    placeholderTextColor={SAI_COLORS.gray}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={SAI_COLORS.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                    placeholderTextColor={SAI_COLORS.gray}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons name="call" size={20} color={SAI_COLORS.gray} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number *"
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
                      placeholder="Enter OTP *"
                      value={formData.otp}
                      onChangeText={(value) => handleInputChange('otp', value)}
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholderTextColor={SAI_COLORS.gray}
                    />
                  </View>
                )}
              </>
            )}

            {/* Additional Information */}
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons name="calendar" size={20} color={SAI_COLORS.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth *"
                  value={formData.dateOfBirth}
                  onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                  placeholderTextColor={SAI_COLORS.gray}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons name="person" size={20} color={SAI_COLORS.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="Gender *"
                  value={formData.gender}
                  onChangeText={(value) => handleInputChange('gender', value)}
                  placeholderTextColor={SAI_COLORS.gray}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons name="location" size={20} color={SAI_COLORS.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(value) => handleInputChange('city', value)}
                  placeholderTextColor={SAI_COLORS.gray}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons name="map" size={20} color={SAI_COLORS.gray} />
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(value) => handleInputChange('state', value)}
                  placeholderTextColor={SAI_COLORS.gray}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="trophy" size={20} color={SAI_COLORS.gray} />
              <TextInput
                style={styles.input}
                placeholder="Preferred Sport"
                value={formData.sport}
                onChangeText={(value) => handleInputChange('sport', value)}
                placeholderTextColor={SAI_COLORS.gray}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="star" size={20} color={SAI_COLORS.gray} />
              <TextInput
                style={styles.input}
                placeholder="Years of Experience"
                value={formData.experience}
                onChangeText={(value) => handleInputChange('experience', value)}
                keyboardType="numeric"
                placeholderTextColor={SAI_COLORS.gray}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Registering...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={SAI_COLORS.white} />
                <Text style={styles.buttonText}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.linkText}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
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
    marginBottom: 24,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 16,
    marginTop: 8,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  registerButton: {
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
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: SAI_COLORS.gray,
  },
  linkText: {
    color: SAI_COLORS.orange,
    fontWeight: '600',
  },
});

export default RegisterScreen;