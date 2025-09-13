// screens/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// SAI Official Colors
const saiTheme = {
  primary: '#1f357b',
  primaryDark: '#101c40',
  accent: '#ff9933',
};

export default function LoginScreen({ navigation }) {
  return (
    <LinearGradient colors={[saiTheme.primary, saiTheme.primaryDark]} style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* Use the official SAI logo image */}
        <Image source={require('../assets/sai_logo.png')} style={styles.logo} />

        <Text style={styles.subtitle}>Unearthing India's Future Champions</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 280,
    height: 140, // Adjust height based on your logo's aspect ratio
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    marginTop: 60,
    backgroundColor: saiTheme.accent, // Use SAI Orange for the button
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: 'white', // White text on orange button
    fontSize: 18,
    fontWeight: 'bold',
  },
});