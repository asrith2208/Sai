// screens/MyResultsScreen.js - Results History Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { 
  CustomButton, 
  Card, 
  ResultCard, 
  LoadingSpinner, 
  EmptyState 
} from '../components/CommonComponents';
import { getResults, clearResults, TEST_TYPES } from '../utils/mockAI';

const MyResultsScreen = ({ navigation }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState(null);

  // Load results when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [])
  );

  const loadResults = async () => {
    try {
      setLoading(true);
      const savedResults = await getResults();
      setResults(savedResults);
      calculateStats(savedResults);
    } catch (error) {
      console.error('Error loading results:', error);
      Alert.alert('Error', 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
  };

  const calculateStats = (resultsList) => {
    if (resultsList.length === 0) {
      setStats(null);
      return;
    }

    const testTypeCounts = {};
    const recentResults = resultsList.filter(result => {
      const resultDate = new Date(result.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return resultDate > weekAgo;
    });

    resultsList.forEach(result => {
      testTypeCounts[result.testType] = (testTypeCounts[result.testType] || 0) + 1;
    });

    const mostFrequentTest = Object.keys(testTypeCounts).reduce((a, b) => 
      testTypeCounts[a] > testTypeCounts[b] ? a : b
    );

    setStats({
      totalTests: resultsList.length,
      recentTests: recentResults.length,
      mostFrequentTest,
      testTypes: Object.keys(testTypeCounts).length,
    });
  };

  const showResultDetail = (result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  const clearAllResults = () => {
    Alert.alert(
      'Clear All Results',
      'Are you sure you want to delete all your test results? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearResults();
              setResults([]);
              setStats(null);
              Alert.alert('Success', 'All results have been cleared');
            } catch (error) {
              console.error('Error clearing results:', error);
              Alert.alert('Error', 'Failed to clear results');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return '#10b981';
    if (grade.includes('B')) return '#f59e0b';
    return '#ef4444';
  };

  const renderResultItem = ({ item }) => (
    <ResultCard 
      result={item} 
      onPress={() => showResultDetail(item)} 
    />
  );

  const renderStatsCard = () => {
    if (!stats) return null;

    return (
      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Performance Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalTests}</Text>
            <Text style={styles.statLabel}>Total Tests</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.recentTests}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.testTypes}</Text>
            <Text style={styles.statLabel}>Test Types</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValueSmall}>
              {TEST_TYPES[stats.mostFrequentTest]?.name || stats.mostFrequentTest}
            </Text>
            <Text style={styles.statLabel}>Most Practiced</Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderHeader = () => (
    <View>
      {renderStatsCard()}
      {results.length > 0 && (
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Test History</Text>
          <TouchableOpacity onPress={clearAllResults}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner text="Loading your results..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="trophy-outline"
            title="No Results Yet"
            description="Take your first fitness test to see your results here. Your AI-powered performance analysis will be saved securely on your device."
            actionButton={
              <CustomButton
                title="Start First Test"
                onPress={() => navigation.navigate('StartTest')}
                variant="primary"
                icon="videocam"
                style={styles.emptyActionButton}
              />
            }
          />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Result Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Test Result Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedResult && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailHeader}>
                  <View style={styles.detailTestType}>
                    <Ionicons 
                      name={TEST_TYPES[selectedResult.testType]?.icon || 'fitness'} 
                      size={32} 
                      color={TEST_TYPES[selectedResult.testType]?.color || '#1f357b'} 
                    />
                    <View style={styles.detailTestInfo}>
                      <Text style={styles.detailTestName}>
                        {TEST_TYPES[selectedResult.testType]?.name || selectedResult.testType}
                      </Text>
                      <Text style={styles.detailTestDate}>
                        {formatDate(selectedResult.date)}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.detailGrade, { backgroundColor: getGradeColor(selectedResult.grade) }]}>
                    <Text style={styles.detailGradeText}>{selectedResult.grade}</Text>
                  </View>
                </View>

                <Card style={styles.detailScoreCard}>
                  <Text style={styles.detailScoreLabel}>Performance Score</Text>
                  <View style={styles.detailMainScore}>
                    <Text style={styles.detailScoreValue}>{selectedResult.score}</Text>
                    <Text style={styles.detailScoreUnit}>{selectedResult.unit}</Text>
                  </View>
                </Card>

                <Card style={styles.detailMetricsCard}>
                  <Text style={styles.detailMetricsTitle}>Detailed Metrics</Text>
                  {Object.entries(selectedResult.metrics).map(([key, value]) => (
                    <View key={key} style={styles.detailMetricRow}>
                      <Text style={styles.detailMetricLabel}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Text>
                      <Text style={styles.detailMetricValue}>{value}</Text>
                    </View>
                  ))}
                </Card>

                <Card style={styles.detailFeedbackCard}>
                  <Text style={styles.detailFeedbackTitle}>AI Feedback</Text>
                  <Text style={styles.detailFeedbackText}>{selectedResult.feedback}</Text>
                </Card>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyActionButton: {
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
  },
  statsCard: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f357b',
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f357b',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  clearAllText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailTestType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailTestInfo: {
    marginLeft: 12,
    flex: 1,
  },
  detailTestName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailTestDate: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  detailGrade: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailGradeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailScoreCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  detailScoreLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  detailMainScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  detailScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f357b',
  },
  detailScoreUnit: {
    fontSize: 18,
    color: '#64748b',
    marginLeft: 8,
  },
  detailMetricsCard: {
    marginBottom: 16,
  },
  detailMetricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  detailMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailMetricLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  detailMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailFeedbackCard: {
    marginBottom: 20,
  },
  detailFeedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  detailFeedbackText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export default MyResultsScreen;