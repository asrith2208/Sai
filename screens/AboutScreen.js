// screens/AboutScreen.js - About and Information Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, CustomButton } from '../components/CommonComponents';

const AboutScreen = ({ navigation }) => {
  const handleContactPress = (type) => {
    switch (type) {
      case 'email':
        Linking.openURL('mailto:support@sai-vision.in?subject=SAI-Vision App Inquiry');
        break;
      case 'website':
        Linking.openURL('https://sportsauthorityofindia.nic.in/');
        break;
      case 'privacy':
        // In a real app, this would open the privacy policy
        console.log('Privacy Policy');
        break;
      default:
        break;
    }
  };

  const features = [
    {
      icon: 'camera',
      title: 'AI-Powered Analysis',
      description: 'Advanced computer vision algorithms analyze your performance in real-time, providing accurate measurements and feedback.',
      color: '#3b82f6',
    },
    {
      icon: 'shield-checkmark',
      title: 'Data Privacy',
      description: 'All your performance data is stored locally on your device. We respect your privacy and never share your personal information.',
      color: '#10b981',
    },
    {
      icon: 'wifi-outline',
      title: 'Offline Capability',
      description: 'Core features work without an internet connection, making it accessible anywhere, anytime.',
      color: '#6366f1',
    },
    {
      icon: 'trophy',
      title: 'Fair Assessment',
      description: 'Standardized testing protocols ensure fair and consistent evaluation for all athletes, regardless of background.',
      color: '#f59e0b',
    },
    {
      icon: 'trending-up',
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed performance metrics and historical data analysis.',
      color: '#ef4444',
    },
    {
      icon: 'people',
      title: 'For Everyone',
      description: 'Designed for athletes of all levels, from beginners to professionals, making sports assessment accessible to all.',
      color: '#8b5cf6',
    },
  ];

  const team = [
    {
      role: 'Sports Authority of India',
      description: 'Promoting excellence in sports through innovative technology and fair assessment.',
    },
    {
      role: 'AI Research Team',
      description: 'Developing cutting-edge computer vision algorithms for accurate performance analysis.',
    },
    {
      role: 'Sports Scientists',
      description: 'Ensuring scientific validity and reliability of all fitness tests and measurements.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#1f357b', '#2563eb']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="eye" size={48} color="#ffffff" />
            </View>
            <Text style={styles.appName}>SAI-Vision</Text>
            <Text style={styles.appTagline}>AI Sports Coach</Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </LinearGradient>

        {/* Mission Section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            SAI-Vision democratizes sports assessment by leveraging AI technology to provide fair, 
            accurate, and accessible fitness testing. We believe every athlete deserves equal 
            opportunity and unbiased evaluation, regardless of their background or location.
          </Text>
        </Card>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                  <Ionicons name={feature.icon} size={24} color={feature.color} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* How It Works */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Select Test Type</Text>
              <Text style={styles.stepDescription}>
                Choose from various fitness tests like vertical jump, sprint, sit-ups, etc.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Record Performance</Text>
              <Text style={styles.stepDescription}>
                Use your phone's camera to record yourself performing the test.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>AI Analysis</Text>
              <Text style={styles.stepDescription}>
                Our AI analyzes your video and provides detailed performance metrics.
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get Results</Text>
              <Text style={styles.stepDescription}>
                Receive instant feedback, scores, and recommendations for improvement.
              </Text>
            </View>
          </View>
        </Card>

        {/* Team Section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Built By</Text>
          {team.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <Text style={styles.teamRole}>{member.role}</Text>
              <Text style={styles.teamDescription}>{member.description}</Text>
            </View>
          ))}
        </Card>

        {/* Technology Stack */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Technology</Text>
          <View style={styles.techStack}>
            <View style={styles.techItem}>
              <Ionicons name="phone-portrait" size={20} color="#61dafb" />
              <Text style={styles.techText}>React Native</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="camera" size={20} color="#000" />
              <Text style={styles.techText}>Expo Camera</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="brain" size={20} color="#ff6b6b" />
              <Text style={styles.techText}>Computer Vision</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="shield" size={20} color="#4ecdc4" />
              <Text style={styles.techText}>Local Storage</Text>
            </View>
          </View>
        </Card>

        {/* Contact Section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <Text style={styles.contactDescription}>
            Have questions or feedback? We'd love to hear from you.
          </Text>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContactPress('email')}
            >
              <Ionicons name="mail" size={20} color="#1f357b" />
              <Text style={styles.contactButtonText}>Email Support</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContactPress('website')}
            >
              <Ionicons name="globe" size={20} color="#1f357b" />
              <Text style={styles.contactButtonText}>Visit SAI Website</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Legal */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Legal & Privacy</Text>
          <TouchableOpacity 
            style={styles.legalLink}
            onPress={() => handleContactPress('privacy')}
          >
            <Text style={styles.legalLinkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
          </TouchableOpacity>
          
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              SAI-Vision is a prototype application for demonstration purposes. 
              Always consult with qualified sports professionals for official assessments.
            </Text>
          </View>
        </Card>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <CustomButton
            title="Start Your First Test"
            onPress={() => navigation.navigate('StartTest')}
            variant="primary"
            size="large"
            icon="videocam"
            style={styles.ctaButton}
          />
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyrightText}>
            © 2024 Sports Authority of India
          </Text>
          <Text style={styles.copyrightText}>
            Empowering Athletes Through Technology
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingBottom: 20,
  },
  heroSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featureCard: {
    marginBottom: 12,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
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
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f357b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  teamMember: {
    marginBottom: 16,
  },
  teamRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  teamDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  techText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 8,
  },
  contactDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  contactButtons: {
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 12,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 16,
  },
  legalLinkText: {
    fontSize: 16,
    color: '#1f357b',
    fontWeight: '500',
  },
  disclaimer: {
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  ctaButton: {
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  copyrightText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default AboutScreen;