// screens/SAITeamDashboard.js - SAI Team Dashboard for reviewing submissions
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SAI_COLORS } from '../constants/theme';
import DummyDataService from '../services/dummyDataService';

const SAITeamDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [statistics, setStatistics] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, selectedFilter, searchQuery]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const stats = await DummyDataService.getStatistics();
      const allSubmissions = await DummyDataService.getAllSubmissions();
      
      // Sort by most recent first
      const sortedSubmissions = allSubmissions.sort((a, b) => 
        new Date(b.submittedAt) - new Date(a.submittedAt)
      );
      
      setStatistics(stats);
      setSubmissions(sortedSubmissions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(sub =>
        sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return SAI_COLORS.warning;
      case 'under_review': return SAI_COLORS.blue;
      case 'approved': return SAI_COLORS.success;
      case 'rejected': return SAI_COLORS.error;
      default: return SAI_COLORS.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'time';
      case 'under_review': return 'eye';
      case 'approved': return 'checkmark-circle';
      case 'rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStatCard = (title, value, icon, color, onPress) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.statContent}>
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color={SAI_COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSubmissionCard = (submission) => (
    <TouchableOpacity
      key={submission.id}
      style={styles.submissionCard}
      onPress={() => navigation.navigate('SubmissionReview', { submission })}
    >
      <View style={styles.submissionHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{submission.userName}</Text>
          <Text style={styles.userEmail}>{submission.userEmail}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(submission.status) }]}>
          <Ionicons 
            name={getStatusIcon(submission.status)} 
            size={12} 
            color={SAI_COLORS.white} 
          />
          <Text style={styles.statusText}>{submission.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={styles.submissionDetails}>
        <View style={styles.sportInfo}>
          <Ionicons name="trophy" size={16} color={SAI_COLORS.orange} />
          <Text style={styles.sportText}>{submission.sport} • {submission.subcategory}</Text>
        </View>
        <Text style={styles.submissionDate}>Submitted: {formatDate(submission.submittedAt)}</Text>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>AI Score</Text>
          <Text style={[styles.scoreValue, { color: SAI_COLORS.blue }]}>
            {submission.aiScore || 'N/A'}
          </Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>SAI Score</Text>
          <Text style={[styles.scoreValue, { 
            color: submission.saiScore ? SAI_COLORS.success : SAI_COLORS.gray 
          }]}>
            {submission.saiScore || 'Pending'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={SAI_COLORS.gray} />
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter Submissions</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={SAI_COLORS.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterOptions}>
            {[
              { key: 'all', label: 'All Submissions', icon: 'list' },
              { key: 'pending', label: 'Pending Review', icon: 'time' },
              { key: 'under_review', label: 'Under Review', icon: 'eye' },
              { key: 'approved', label: 'Approved', icon: 'checkmark-circle' },
              { key: 'rejected', label: 'Rejected', icon: 'close-circle' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterOption,
                  selectedFilter === filter.key && styles.selectedFilterOption
                ]}
                onPress={() => {
                  setSelectedFilter(filter.key);
                  setShowFilters(false);
                }}
              >
                <Ionicons 
                  name={filter.icon} 
                  size={20} 
                  color={selectedFilter === filter.key ? SAI_COLORS.orange : SAI_COLORS.gray} 
                />
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === filter.key && styles.selectedFilterOptionText
                ]}>
                  {filter.label}
                </Text>
                {selectedFilter === filter.key && (
                  <Ionicons name="checkmark" size={16} color={SAI_COLORS.orange} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[SAI_COLORS.orange, SAI_COLORS.blue]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={20} color={SAI_COLORS.white} />
            </View>
            <View>
              <Text style={styles.headerTitle}>SAI Dashboard</Text>
              <Text style={styles.headerSubtitle}>Welcome, {user?.fullName}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color={SAI_COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadDashboardData} />
        }
      >
        {/* Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Total Submissions',
              statistics.total || 0,
              'folder',
              SAI_COLORS.blue,
              () => setSelectedFilter('all')
            )}
            {renderStatCard(
              'Pending Review',
              statistics.pending || 0,
              'time',
              SAI_COLORS.warning,
              () => setSelectedFilter('pending')
            )}
            {renderStatCard(
              'Under Review',
              statistics.underReview || 0,
              'eye',
              SAI_COLORS.blue,
              () => setSelectedFilter('under_review')
            )}
            {renderStatCard(
              'Approved',
              statistics.approved || 0,
              'checkmark-circle',
              SAI_COLORS.success,
              () => setSelectedFilter('approved')
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Rejected',
              statistics.rejected || 0,
              'close-circle',
              SAI_COLORS.error,
              () => setSelectedFilter('rejected')
            )}
            {renderStatCard(
              'Avg AI Score',
              statistics.avgAiScore || 0,
              'analytics',
              SAI_COLORS.purple,
              null
            )}
            {renderStatCard(
              'Avg SAI Score',
              statistics.avgSaiScore || 0,
              'star',
              SAI_COLORS.orange,
              null
            )}
            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={styles.statText}>
                  <Text style={styles.statValue}>
                    {statistics.approved && statistics.total 
                      ? Math.round((statistics.approved / statistics.total) * 100) 
                      : 0}%
                  </Text>
                  <Text style={styles.statTitle}>Approval Rate</Text>
                </View>
                <View style={[styles.statIcon, { backgroundColor: SAI_COLORS.green }]}>
                  <Ionicons name="trending-up" size={20} color={SAI_COLORS.white} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={SAI_COLORS.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, sport, or technique..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={SAI_COLORS.gray}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={20} color={SAI_COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Filter indicator */}
        {selectedFilter !== 'all' && (
          <View style={styles.filterIndicator}>
            <Text style={styles.filterIndicatorText}>
              Filtered by: {selectedFilter.replace('_', ' ')}
            </Text>
            <TouchableOpacity onPress={() => setSelectedFilter('all')}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Submissions List */}
        <View style={styles.submissionsSection}>
          <Text style={styles.sectionTitle}>
            Submissions ({filteredSubmissions.length})
          </Text>
          {filteredSubmissions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open" size={48} color={SAI_COLORS.gray} />
              <Text style={styles.emptyStateText}>No submissions found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedFilter !== 'all' 
                  ? 'Try changing your filter or search criteria'
                  : 'Submissions will appear here once users upload their videos'
                }
              </Text>
            </View>
          ) : (
            filteredSubmissions.map(renderSubmissionCard)
          )}
        </View>
      </ScrollView>

      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    fontWeight: '500',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    fontSize: 16,
    color: SAI_COLORS.dark,
  },
  filterButton: {
    backgroundColor: SAI_COLORS.orange,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.lightBlue,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  filterIndicatorText: {
    fontSize: 14,
    color: SAI_COLORS.blue,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  clearFilterText: {
    fontSize: 14,
    color: SAI_COLORS.blue,
    fontWeight: '600',
  },
  submissionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  submissionCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: SAI_COLORS.gray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: SAI_COLORS.white,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  submissionDetails: {
    marginBottom: 12,
  },
  sportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sportText: {
    fontSize: 14,
    fontWeight: '500',
    color: SAI_COLORS.dark,
    marginLeft: 8,
  },
  submissionDate: {
    fontSize: 12,
    color: SAI_COLORS.gray,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: SAI_COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.border,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.dark,
  },
  filterOptions: {
    padding: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: SAI_COLORS.lightOrange,
  },
  filterOptionText: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    marginLeft: 12,
    flex: 1,
  },
  selectedFilterOptionText: {
    color: SAI_COLORS.orange,
    fontWeight: '600',
  },
});

export default SAITeamDashboard;