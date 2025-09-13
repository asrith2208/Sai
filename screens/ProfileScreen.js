// screens/ProfileScreen.js - User Profile Management
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SAI_COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateProfile } = useAuth();

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

  const profileSections = [
    {
      title: 'Account Information',
      items: [
        { label: 'Full Name', value: user?.fullName || 'Not provided', icon: 'person' },
        { label: 'Email', value: user?.email || 'Not provided', icon: 'mail' },
        { label: 'Phone', value: user?.phoneNumber || 'Not provided', icon: 'call' },
        { label: 'Date of Birth', value: user?.dateOfBirth || 'Not provided', icon: 'calendar' },
      ]
    },
    {
      title: 'Location & Sports',
      items: [
        { label: 'City', value: user?.city || 'Not provided', icon: 'location' },
        { label: 'State', value: user?.state || 'Not provided', icon: 'map' },
        { label: 'Preferred Sport', value: user?.sport || 'Not provided', icon: 'trophy' },
        { label: 'Experience', value: user?.experience ? `${user.experience} years` : 'Not provided', icon: 'star' },
      ]
    }
  ];

  const actionItems = [
    { title: 'Edit Profile', icon: 'create', onPress: () => Alert.alert('Coming Soon', 'Profile editing feature will be available soon!') },
    { title: 'Submission History', icon: 'document-text', onPress: () => navigation.navigate('Results') },
    { title: 'Settings', icon: 'settings', onPress: () => Alert.alert('Coming Soon', 'Settings feature will be available soon!') },
    { title: 'Help & Support', icon: 'help-circle', onPress: () => Alert.alert('Help', 'Contact SAI support at support@sai.gov.in') },
    { title: 'About SAI-Vision', icon: 'information-circle', onPress: () => navigation.navigate('About') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[SAI_COLORS.orange, SAI_COLORS.blue]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={SAI_COLORS.white} />
          </View>
          <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.userStatus}>
            Status: {user?.profile?.currentStatus === 'registered' ? 'Active User' : 
                     user?.profile?.currentStatus === 'submitted' ? 'Under Review' : 'Active User'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Information */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <Ionicons name={item.icon} size={20} color={SAI_COLORS.gray} />
                    <Text style={styles.infoLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.profile?.submissions?.length || 0}</Text>
              <Text style={styles.statLabel}>Submissions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Tests Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>Member Since</Text>
              <Text style={styles.statLabel}>
                {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.sectionCard}>
            {actionItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionRow}
                onPress={item.onPress}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name={item.icon} size={20} color={SAI_COLORS.gray} />
                  <Text style={styles.actionLabel}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={SAI_COLORS.gray} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color={SAI_COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
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
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.lightGray,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: SAI_COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.orange,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.lightGray,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    marginLeft: 12,
  },
  logoutSection: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SAI_COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SAI_COLORS.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.error,
    marginLeft: 8,
  },
});

export default ProfileScreen;