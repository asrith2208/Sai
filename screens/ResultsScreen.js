// screens/ResultsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// SAI Official Colors
const saiTheme = {
  primary: '#1f357b',
  accent: '#ff9933',
  textDark: '#1a2a44',
  background: '#f4f7fc',
};

export default function ResultsScreen({ route, navigation }) {
  // --- UPDATED: RECEIVE DYNAMIC DATA ---
  const { testData, finalScore, formScore } = route.params;

  const handleSubmit = () => {
    Alert.alert(
      "Submission Confirmed",
      "Your results have been successfully sent to the SAI national database.",
      [{ text: "OK", onPress: () => navigation.popToTop() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="award" size={60} color={saiTheme.accent} />
        <Text style={styles.title}>Test Complete!</Text>
        <Text style={styles.subtitle}>{testData.title}</Text>
      </View>

      <View style={styles.resultsContainer}>
        {/* --- DYNAMIC RESULT BOX --- */}
        <View style={styles.resultBox}>
          <Text style={styles.resultValue}>{finalScore}</Text>
          <Text style={styles.resultLabel}>{testData.metric}</Text>
        </View>
        <View style={styles.resultBox}>
          <Text style={styles.resultValue}>{formScore}/10</Text>
          <Text style={styles.resultLabel}>AI Form Score</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={[styles.buttonText, styles.submitButtonText]}>Submit to SAI Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.retryButton]}
          onPress={() => navigation.popToTop()}
        >
          <Text style={[styles.buttonText, styles.retryButtonText]}>Test Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles are the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: saiTheme.background, justifyContent: 'space-between', padding: 20 },
  header: { alignItems: 'center', marginTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: saiTheme.textDark, marginTop: 15, },
  subtitle: { fontSize: 18, color: '#666' },
  resultsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 40, },
  resultBox: { backgroundColor: 'white', paddingVertical: 30, paddingHorizontal: 10, borderRadius: 15, alignItems: 'center', width: '45%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4, },
  resultValue: { fontSize: 48, fontWeight: 'bold', color: saiTheme.primary, },
  resultLabel: { fontSize: 16, color: '#666', marginTop: 5, },
  footer: { paddingBottom: 20, },
  button: { paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginBottom: 10, },
  submitButton: { backgroundColor: saiTheme.primary },
  submitButtonText: { color: 'white' },
  retryButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: saiTheme.primary, },
  retryButtonText: { color: saiTheme.primary },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
});