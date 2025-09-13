import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CoachAnalysis from '../components/CoachAnalysis';

const ResultsScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Performance Analysis Results</Text>
            <CoachAnalysis />
            <Text style={styles.feedback}>
                Here are your scores and feedback based on the AI analysis of your recorded performance.
            </Text>
            {/* Additional results and insights can be displayed here */}
        </ScrollView>
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
    feedback: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default ResultsScreen;