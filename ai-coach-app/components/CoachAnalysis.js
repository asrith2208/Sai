import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CoachAnalysis = ({ analysisData }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI Performance Analysis</Text>
            <Text style={styles.subtitle}>Feedback and Suggestions:</Text>
            {analysisData.map((item, index) => (
                <View key={index} style={styles.analysisItem}>
                    <Text style={styles.metric}>{item.metric}</Text>
                    <Text style={styles.feedback}>{item.feedback}</Text>
                </View>
            ))}
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    analysisItem: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    metric: {
        fontSize: 16,
        fontWeight: '600',
    },
    feedback: {
        fontSize: 14,
        color: '#555',
    },
});

export default CoachAnalysis;