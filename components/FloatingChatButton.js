// components/FloatingChatButton.js - Floating SAI Assistant Button
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SAI_COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const FloatingChatButton = () => {
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to chatbot screen
    navigation.navigate('Chatbot');
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="chatbubble-ellipses" size={24} color={SAI_COLORS.white} />
          </View>
          
          {/* Pulse effect */}
          <View style={styles.pulseContainer}>
            <View style={styles.pulse} />
            <View style={[styles.pulse, styles.pulseDelay]} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Above the tab bar
    zIndex: 999,
  },
  buttonContainer: {
    position: 'relative',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SAI_COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    zIndex: 2,
  },
  pulseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SAI_COLORS.orange,
    opacity: 0.6,
  },
  pulseDelay: {
    backgroundColor: SAI_COLORS.orange,
    opacity: 0.4,
  },
});

export default FloatingChatButton;