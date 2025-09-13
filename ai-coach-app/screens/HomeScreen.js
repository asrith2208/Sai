import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to the AI Coach App!</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Start Recording"
        onPress={() => navigation.navigate('Recording')}
      />
      <Button
        title="View Results"
        onPress={() => navigation.navigate('Results')}
      />
      <Button
        title="Test Details"
        onPress={() => navigation.navigate('TestDetail')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;