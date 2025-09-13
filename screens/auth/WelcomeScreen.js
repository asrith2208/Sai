// screens/auth/WelcomeScreen.js - SAI Welcome & Authentication Options
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SAI_COLORS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[SAI_COLORS.blue, SAI_COLORS.orange]}
        style={styles.gradient}
      >
        {/* SAI Logo and Branding */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="trophy" size={64} color={SAI_COLORS.white} />
          </View>
          <Text style={styles.appName}>SAI-Vision</Text>
          <Text style={styles.tagline}>Sports Authority of India</Text>
          <Text style={styles.subtitle}>AI-Powered Sports Talent Discovery</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <Ionicons name="videocam" size={24} color={SAI_COLORS.white} />
            <Text style={styles.featureText}>Record & Analyze Performance</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={24} color={SAI_COLORS.white} />
            <Text style={styles.featureText}>AI-Powered Scoring</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="medal" size={24} color={SAI_COLORS.white} />
            <Text style={styles.featureText}>Official SAI Recognition</Text>
          </View>
        </View>

        {/* Authentication Buttons */}
        <View style={styles.authSection}>
          <TouchableOpacity
            style={[styles.authButton, styles.primaryButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Ionicons name="person-add" size={20} color={SAI_COLORS.blue} />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in" size={20} color={SAI_COLORS.white} />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => navigation.navigate('MainApp', { isGuest: true })}
          >
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by Artificial Intelligence
          </Text>
          <Text style={styles.footerSubtext}>
            Ministry of Youth Affairs & Sports, Government of India
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: SAI_COLORS.white,
    textAlign: 'center',
    opacity: 0.8,
  },
  featuresSection: {
    paddingVertical: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: SAI_COLORS.white,
  },
  featureText: {
    fontSize: 16,
    color: SAI_COLORS.white,
    marginLeft: 16,
    fontWeight: '500',
  },
  authSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: SAI_COLORS.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: SAI_COLORS.white,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: SAI_COLORS.blue,
  },
  secondaryButtonText: {
    color: SAI_COLORS.white,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  guestText: {
    fontSize: 16,
    color: SAI_COLORS.white,
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: SAI_COLORS.white,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: SAI_COLORS.white,
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default WelcomeScreen;