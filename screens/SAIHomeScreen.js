// screens/SAIHomeScreen.js - SAI (Sports Authority of India) Home Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SAI_COLORS, SAI_SPORTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const SAIHomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // SAI News and Announcements
  const saiNews = [
    {
      id: 1,
      title: 'SAI-Vision AI Platform Launched',
      description: 'Revolutionary AI-powered sports talent discovery platform now live across India',
      date: '2024-01-15',
      category: 'Launch',
      priority: 'high'
    },
    {
      id: 2,
      title: 'National Sports Talent Hunt 2024',
      description: 'Applications open for discovering young sports talent nationwide',
      date: '2024-01-10',
      category: 'Recruitment',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Olympic Preparation Program',
      description: 'Special coaching programs for Paris 2024 Olympic preparation',
      date: '2024-01-08',
      category: 'Training',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Sports Science Research Initiative',
      description: 'New sports science research center inaugurated in Bangalore',
      date: '2024-01-05',
      category: 'Research',
      priority: 'medium'
    }
  ];

  // SAI Banner Images (would be actual images in production)
  const bannerData = [
    {
      id: 1,
      title: 'Discover Your Sports Potential',
      subtitle: 'AI-Powered Performance Analysis',
      color: SAI_COLORS.orange,
      icon: 'flash'
    },
    {
      id: 2,
      title: 'Join SAI Academy',
      subtitle: 'Train with Olympic Champions',
      color: SAI_COLORS.blue,
      icon: 'trophy'
    },
    {
      id: 3,
      title: 'Future Sports Stars',
      subtitle: 'Building India\'s Sports Legacy',
      color: SAI_COLORS.green,
      icon: 'star'
    }
  ];

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Launch': return 'rocket';
      case 'Recruitment': return 'people';
      case 'Training': return 'fitness';
      case 'Research': return 'flask';
      default: return 'information-circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return SAI_COLORS.error;
      case 'medium': return SAI_COLORS.orange;
      case 'low': return SAI_COLORS.blue;
      default: return SAI_COLORS.gray;
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[SAI_COLORS.orange, SAI_COLORS.blue]}
      style={styles.header}
    >
      <SafeAreaView style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="trophy" size={32} color={SAI_COLORS.white} />
            </View>
            <View style={styles.titleSection}>
              <Text style={styles.appTitle}>SAI-Vision</Text>
              <Text style={styles.tagline}>Sports Authority of India</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle" size={24} color={SAI_COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={24} color={SAI_COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {user && (
          <View style={styles.userWelcome}>
            <Text style={styles.welcomeText}>Welcome back, {user.fullName || user.email}!</Text>
            <Text style={styles.statusText}>
              Status: {user.profile?.currentStatus === 'registered' ? 'Ready to Start' : 
                      user.profile?.currentStatus === 'submitted' ? 'Under Review' : 
                      'Active'}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );

  const renderBannerCarousel = () => (
    <View style={styles.bannerSection}>
      <LinearGradient
        colors={[bannerData[currentBannerIndex].color, SAI_COLORS.white]}
        style={styles.bannerContainer}
      >
        <View style={styles.bannerContent}>
          <Ionicons 
            name={bannerData[currentBannerIndex].icon} 
            size={48} 
            color={SAI_COLORS.white} 
          />
          <Text style={styles.bannerTitle}>{bannerData[currentBannerIndex].title}</Text>
          <Text style={styles.bannerSubtitle}>{bannerData[currentBannerIndex].subtitle}</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Learn More</Text>
            <Ionicons name="arrow-forward" size={16} color={SAI_COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Banner Indicators */}
      <View style={styles.bannerIndicators}>
        {bannerData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              index === currentBannerIndex && styles.activeIndicator
            ]}
            onPress={() => setCurrentBannerIndex(index)}
          />
        ))}
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: SAI_COLORS.lightOrange }]}
          onPress={() => navigation.navigate('Test')}
        >
          <Ionicons name="videocam" size={32} color={SAI_COLORS.orange} />
          <Text style={styles.actionTitle}>Start Test</Text>
          <Text style={styles.actionSubtitle}>Record Performance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: SAI_COLORS.lightBlue }]}
          onPress={() => navigation.navigate('Results')}
        >
          <Ionicons name="analytics" size={32} color={SAI_COLORS.blue} />
          <Text style={styles.actionTitle}>My Results</Text>
          <Text style={styles.actionSubtitle}>View Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: SAI_COLORS.lightGreen }]}
          onPress={() => navigation.navigate('About')}
        >
          <Ionicons name="information-circle" size={32} color={SAI_COLORS.green} />
          <Text style={styles.actionTitle}>About SAI</Text>
          <Text style={styles.actionSubtitle}>Learn More</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: SAI_COLORS.lightGray }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={32} color={SAI_COLORS.dark} />
          <Text style={styles.actionTitle}>Profile</Text>
          <Text style={styles.actionSubtitle}>Manage Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSportsCategories = () => (
    <View style={styles.sportsSection}>
      <Text style={styles.sectionTitle}>Sports Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.sportsGrid}>
          {Object.entries(SAI_SPORTS).slice(0, 6).map(([key, sport]) => (
            <TouchableOpacity
              key={key}
              style={styles.sportCard}
              onPress={() => navigation.navigate('Test', { selectedSport: key })}
            >
              <View style={[styles.sportIconContainer, { backgroundColor: sport.color }]}>
                <Ionicons name={sport.icon} size={24} color={SAI_COLORS.white} />
              </View>
              <Text style={styles.sportName}>{sport.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderNewsSection = () => (
    <View style={styles.newsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SAI News & Updates</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {saiNews.slice(0, 3).map((news) => (
        <TouchableOpacity key={news.id} style={styles.newsCard}>
          <View style={styles.newsContent}>
            <View style={styles.newsHeader}>
              <View style={styles.newsCategory}>
                <Ionicons 
                  name={getCategoryIcon(news.category)} 
                  size={16} 
                  color={getPriorityColor(news.priority)} 
                />
                <Text style={[styles.categoryText, { color: getPriorityColor(news.priority) }]}>
                  {news.category}
                </Text>
              </View>
              <Text style={styles.newsDate}>{news.date}</Text>
            </View>
            <Text style={styles.newsTitle}>{news.title}</Text>
            <Text style={styles.newsDescription}>{news.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={SAI_COLORS.gray} />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderBannerCarousel()}
        {renderQuickActions()}
        {renderSportsCategories()}
        {renderNewsSection()}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Ministry of Youth Affairs & Sports</Text>
          <Text style={styles.footerSubtext}>Government of India</Text>
          <Text style={styles.versionText}>SAI-Vision v1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  tagline: {
    fontSize: 12,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  userWelcome: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  bannerSection: {
    margin: 20,
    marginBottom: 0,
  },
  bannerContainer: {
    height: 180,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: SAI_COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: SAI_COLORS.white,
    fontWeight: '600',
    marginRight: 8,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SAI_COLORS.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: SAI_COLORS.orange,
  },
  quickActionsSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    textAlign: 'center',
  },
  sportsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sportsGrid: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  sportCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  sportIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sportName: {
    fontSize: 12,
    fontWeight: '500',
    color: SAI_COLORS.dark,
    textAlign: 'center',
  },
  newsSection: {
    margin: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: SAI_COLORS.orange,
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  newsContent: {
    flex: 1,
    marginRight: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  newsDate: {
    fontSize: 12,
    color: SAI_COLORS.gray,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 100,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 10,
    color: SAI_COLORS.gray,
    opacity: 0.7,
  },
});

export default SAIHomeScreen;