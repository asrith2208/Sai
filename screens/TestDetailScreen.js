// screens/TestDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// SAI Official Colors
const saiTheme = {
  primary: '#1f357b',
  accent: '#ff9933',
  textDark: '#1a2a44',
  background: '#f4f7fc',
};

export default function TestDetailScreen({ route, navigation }) {
  // --- UPDATED: RECEIVE THE ENTIRE TEST OBJECT ---
  const { testData } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{testData.title}</Text>
        <Text style={styles.instructionHeader}>Instructions:</Text>
        
        {/* --- UPDATED: DYNAMICALLY RENDER INSTRUCTIONS --- */}
        {testData.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={24} color={saiTheme.primary} style={styles.icon} />
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}

      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Recording', { testData: testData })}
      >
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
// Styles updated slightly for the new list
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: saiTheme.background, padding: 20 },
    content: { flex: 1, },
    title: { fontSize: 32, fontWeight: 'bold', color: saiTheme.textDark, marginBottom: 30, textAlign: 'center' },
    instructionHeader: { fontSize: 20, fontWeight: '600', color: saiTheme.textDark, marginBottom: 15, },
    instructionItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, },
    icon: { marginRight: 15, marginTop: 2 },
    instructionText: { flex: 1, fontSize: 16, color: '#333', lineHeight: 24, },
    button: { backgroundColor: saiTheme.accent, paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', },
});