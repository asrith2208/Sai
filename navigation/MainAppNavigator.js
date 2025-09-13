// navigation/MainAppNavigator.js - Main App Navigation with Bottom Tabs
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SAI_COLORS } from '../constants/theme';

// Import screens
import HomeScreen from '../screens/SAIHomeScreen';
import StartTestScreen from '../screens/StartTestScreen';
import MyResultsScreen from '../screens/MyResultsScreen';
import AboutScreen from '../screens/AboutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SportsSelectionScreen from '../screens/SportsSelectionScreen';
import VideoRecordingScreen from '../screens/VideoRecordingScreen';
import AnalysisResultScreen from '../screens/AnalysisResultScreen';
import SAISubmissionScreen from '../screens/SAISubmissionScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import FloatingChatButton from '../components/FloatingChatButton';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: SAI_COLORS.orange,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTintColor: SAI_COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerBackTitleVisible: false,
      cardStyle: { backgroundColor: SAI_COLORS.lightGray },
    }}
  >
    <Stack.Screen
      name="SAIHome"
      component={HomeScreen}
      options={{
        title: 'SAI-Vision',
        headerShown: false, // Custom header in the component
      }}
    />
    <Stack.Screen
      name="About"
      component={AboutScreen}
      options={{ title: 'About SAI-Vision' }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'My Profile' }}
    />
    <Stack.Screen
      name="Chatbot"
      component={ChatbotScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Test Stack Navigator
const TestStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: SAI_COLORS.blue,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTintColor: SAI_COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerBackTitleVisible: false,
      cardStyle: { backgroundColor: SAI_COLORS.lightGray },
    }}
  >
    <Stack.Screen
      name="StartTest"
      component={StartTestScreen}
      options={{ title: 'Performance Test' }}
    />
    <Stack.Screen
      name="SportsSelection"
      component={SportsSelectionScreen}
      options={{ title: 'Select Sport' }}
    />
    <Stack.Screen
      name="VideoRecording"
      component={VideoRecordingScreen}
      options={{ title: 'Record Performance' }}
    />
    <Stack.Screen
      name="AnalysisResult"
      component={AnalysisResultScreen}
      options={{ title: 'Analysis Results' }}
    />
    <Stack.Screen
      name="SAISubmission"
      component={SAISubmissionScreen}
      options={{ title: 'Submit to SAI' }}
    />
    <Stack.Screen
      name="Chatbot"
      component={ChatbotScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Results Stack Navigator
const ResultsStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: SAI_COLORS.green,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTintColor: SAI_COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerBackTitleVisible: false,
      cardStyle: { backgroundColor: SAI_COLORS.lightGray },
    }}
  >
    <Stack.Screen
      name="MyResults"
      component={MyResultsScreen}
      options={{ title: 'My Results' }}
    />
    <Stack.Screen
      name="Chatbot"
      component={ChatbotScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainAppNavigator = () => {
  return (
    <>
      <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Test') {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else if (route.name === 'Results') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: SAI_COLORS.orange,
        tabBarInactiveTintColor: SAI_COLORS.gray,
        tabBarStyle: {
          backgroundColor: SAI_COLORS.white,
          borderTopColor: SAI_COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarBadge: null,
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestStackNavigator}
        options={{
          tabBarLabel: 'Start Test',
          tabBarBadge: null,
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsStackNavigator}
        options={{
          tabBarLabel: 'My Results',
          tabBarBadge: null,
        }}
      />
      </Tab.Navigator>
      <FloatingChatButton />
    </>
  );
};

export default MainAppNavigator;