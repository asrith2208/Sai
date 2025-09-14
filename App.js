// App.js - SAI-Vision Mobile App with Authentication
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SAI_COLORS } from './constants/theme';

// Import authentication screens
import WelcomeScreen from './screens/auth/WelcomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';

// Import main app navigator
import MainAppNavigator from './navigation/MainAppNavigator';
import SAITeamDashboard from './screens/SAITeamDashboard';
import SubmissionReviewScreen from './screens/SubmissionReviewScreen';
import DummyDataService from './services/dummyDataService';

const Stack = createStackNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: SAI_COLORS.white },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainApp" component={MainAppNavigator} />
    </Stack.Navigator>
  );
};

// SAI Team Navigator
const SAITeamNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: SAI_COLORS.white },
      }}
    >
      <Stack.Screen name="SAITeamDashboard" component={SAITeamDashboard} />
      <Stack.Screen name="SubmissionReview" component={SubmissionReviewScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You could add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        user?.isTeamMember ? <SAITeamNavigator /> : <MainAppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  React.useEffect(() => {
    // Initialize dummy data when app starts
    DummyDataService.initializeDummyData();
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={SAI_COLORS.orange} />
      <RootNavigator />
    </AuthProvider>
  );
}
