// screens/StartTestScreen.js - SAI Test Launch Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SAI_COLORS, SAI_SPORTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const StartTestScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const selectedSport = route.params?.selectedSport || null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[SAI_COLORS.blue, SAI_COLORS.green]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="fitness" size={32} color={SAI_COLORS.white} />
          <Text style={styles.headerTitle}>Performance Test</Text>
          <Text style={styles.headerSubtitle}>
            Showcase your talent to SAI officials
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.section}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.fullName || 'Athlete'}!
          </Text>
          <Text style={styles.welcomeDescription}>
            Ready to demonstrate your skills? Choose a sport and let our AI analyze your performance for potential SAI selection.
          </Text>
        </View>

        {/* Quick Sports Selection */}
        {selectedSport && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Sport</Text>
            <View style={styles.selectedSportCard}>
              <LinearGradient
                colors={[SAI_SPORTS[selectedSport].color, SAI_COLORS.white]}
                style={styles.selectedSportGradient}
              >
                <Ionicons name={SAI_SPORTS[selectedSport].icon} size={32} color={SAI_COLORS.white} />
                <View style={styles.selectedSportInfo}>
                  <Text style={styles.selectedSportName}>
                    {SAI_SPORTS[selectedSport].name}
                  </Text>
                  <Text style={styles.selectedSportDescription}>
                    {SAI_SPORTS[selectedSport].subcategories.length} categories available
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => navigation.navigate('SportsSelection', { selectedSport })}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={16} color={SAI_COLORS.white} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Sports Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Sport</Text>
          <Text style={styles.sectionDescription}>
            Select the sport you want to be evaluated for. Each sport has specific categories and evaluation criteria.
          </Text>
          
          <View style={styles.sportsGrid}>
            {Object.entries(SAI_SPORTS).map(([key, sport]) => (
              <TouchableOpacity
                key={key}
                style={styles.sportCard}
                onPress={() => navigation.navigate('SportsSelection', { selectedSport: key })}
              >
                <View style={[styles.sportIcon, { backgroundColor: sport.color }]}>
                  <Ionicons name={sport.icon} size={24} color={SAI_COLORS.white} />
                </View>
                <Text style={styles.sportName}>{sport.name}</Text>
                <Text style={styles.sportCategories}>
                  {sport.subcategories.length} categories
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: SAI_COLORS.orange }]}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Choose Sport & Category</Text>
                <Text style={styles.stepDescription}>
                  Select your sport and specific category you want to be evaluated for.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: SAI_COLORS.blue }]}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Record Performance</Text>
                <Text style={styles.stepDescription}>
                  Record a video of your performance following our guidelines.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: SAI_COLORS.green }]}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>AI Analysis</Text>
                <Text style={styles.stepDescription}>
                  Our AI analyzes your technique, form, and performance metrics.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: SAI_COLORS.orange }]}>
                <Text style={styles.stepNumber}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Submit to SAI</Text>
                <Text style={styles.stepDescription}>
                  If you score above 75%, submit your performance to SAI for review.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsCard}>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={SAI_COLORS.success} />
              <Text style={styles.requirementText}>Good lighting conditions</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={SAI_COLORS.success} />
              <Text style={styles.requirementText}>Clear video quality</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={SAI_COLORS.success} />
              <Text style={styles.requirementText}>Proper sports equipment</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={SAI_COLORS.success} />
              <Text style={styles.requirementText}>Follow sport-specific guidelines</Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <View style={styles.getStartedSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.navigate('SportsSelection')}
          >
            <Ionicons name="play" size={20} color={SAI_COLORS.white} />
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    padding: 32,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: SAI_COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 20,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    color: SAI_COLORS.gray,
    lineHeight: 24,
  },
  // Selected Sport Card
  selectedSportCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedSportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  selectedSportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  selectedSportName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    marginBottom: 4,
  },
  selectedSportDescription: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueButtonText: {
    color: SAI_COLORS.white,
    fontWeight: '600',
    marginRight: 8,
  },
  // Sports Grid
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportCard: {
    width: (width - 60) / 2,
    backgroundColor: SAI_COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  sportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportName: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
    textAlign: 'center',
  },
  sportCategories: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    textAlign: 'center',
  },
  // Steps
  stepsContainer: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 16,
    padding: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 20,
  },
  // Requirements
  requirementsCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 16,
    padding: 20,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    marginLeft: 12,
  },
  // Get Started
  getStartedSection: {
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SAI_COLORS.orange,
    paddingVertical: 16,
    borderRadius: 12,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginLeft: 8,
  },
});

export default StartTestScreen;