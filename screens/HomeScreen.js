// screens/HomeScreen.js - SAI-Vision Home Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Custom Header */}
      <LinearGradient
        colors={['#1f357b', '#2563eb']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="eye" size={32} color="#ffffff" />
            <View style={styles.logoText}>
              <Text style={styles.appTitle}>SAI-Vision</Text>
              <Text style={styles.appSubtitle}>AI Sports Coach</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome to the Future of</Text>
          <Text style={styles.welcomeTitle}>Athletic Performance</Text>
          <Text style={styles.welcomeDescription}>
            Use your phone's camera to record fitness tests and get instant AI-powered analysis with detailed performance metrics.
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryActionCard}
            onPress={() => navigation.navigate('StartTest')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.primaryCardGradient}
            >
              <Ionicons name="videocam" size={40} color="white" />
              <Text style={styles.primaryCardTitle}>Start Test</Text>
              <Text style={styles.primaryCardSubtitle}>
                Record your performance
              </Text>
              <View style={styles.cardArrow}>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={styles.secondaryActionCard}
              onPress={() => navigation.navigate('MyResults')}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="trophy" size={24} color="#1f357b" />
              </View>
              <Text style={styles.secondaryCardTitle}>My Results</Text>
              <Text style={styles.secondaryCardSubtitle}>View past tests</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryActionCard}
              onPress={() => navigation.navigate('About')}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={24} color="#1f357b" />
              </View>
              <Text style={styles.secondaryCardTitle}>About</Text>
              <Text style={styles.secondaryCardSubtitle}>Learn more</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="camera" size={20} color="#10b981" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Camera-Based Analysis</Text>
              <Text style={styles.featureDescription}>
                Record your fitness tests using your phone's camera
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="flash" size={20} color="#f59e0b" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Instant AI Scoring</Text>
              <Text style={styles.featureDescription}>
                Get immediate performance analysis and detailed metrics
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="wifi-outline" size={20} color="#6366f1" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Offline Ready</Text>
              <Text style={styles.featureDescription}>
                Works without internet connection for basic functionality
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#ef4444" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure Storage</Text>
              <Text style={styles.featureDescription}>
                Your data is stored securely on your device
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginVertical: 8,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  primaryActionCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  primaryCardGradient: {
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  primaryCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  primaryCardSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  cardArrow: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryActionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 6,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
  },
  secondaryCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  secondaryCardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  featuresSection: {
    padding: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 30,
  },
});

export default HomeScreen;
