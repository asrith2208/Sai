import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestDetailScreen = ({ route }) => {
    const { testDetails } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test Details</Text>
            <Text style={styles.metric}>Test Name: {testDetails.name}</Text>
            <Text style={styles.metric}>Score: {testDetails.score}</Text>
            <Text style={styles.metric}>Duration: {testDetails.duration} seconds</Text>
            <Text style={styles.metric}>Feedback: {testDetails.feedback}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    metric: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default TestDetailScreen;