// screens/AnalysisResultScreen.js - AI Analysis Results with Detailed Metrics
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SAI_COLORS, SAI_GRADES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const AnalysisResultScreen = ({ navigation, route }) => {
  const { videoUri, sport, subcategory, sportData } = route.params;
  const { user } = useAuth();
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    simulateAIAnalysis();
  }, []);

  const simulateAIAnalysis = async () => {
    // Simulate AI processing time
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis();
      setAnalysisData(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const generateMockAnalysis = () => {
    // Generate realistic mock analysis based on sport
    const baseScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
    
    const sportSpecificMetrics = {
      athletics: {
        metrics: {
          'Speed': `${(Math.random() * 5 + 10).toFixed(1)} m/s`,
          'Technique Score': `${Math.floor(Math.random() * 20) + 75}/100`,
          'Body Alignment': `${Math.floor(Math.random() * 15) + 80}%`,
          'Rhythm Consistency': `${Math.floor(Math.random() * 20) + 70}%`,
          'Power Output': `${Math.floor(Math.random() * 200) + 800}W`,
        },
        feedback: 'Excellent form with room for improvement in follow-through technique.',
        recommendations: [
          'Focus on maintaining consistent rhythm',
          'Work on explosive power training',
          'Practice proper landing technique'
        ]
      },
      football: {
        metrics: {
          'Ball Control': `${Math.floor(Math.random() * 20) + 75}/100`,
          'Touch Quality': `${Math.floor(Math.random() * 15) + 80}%`,
          'Speed': `${(Math.random() * 3 + 15).toFixed(1)} km/h`,
          'Accuracy': `${Math.floor(Math.random() * 25) + 65}%`,
          'Decision Making': `${Math.floor(Math.random() * 20) + 70}/100`,
        },
        feedback: 'Strong technical skills demonstrated. Focus on consistency under pressure.',
        recommendations: [
          'Practice ball control drills',
          'Improve first touch quality',
          'Work on weak foot development'
        ]
      },
      cricket: {
        metrics: {
          'Technique Score': `${Math.floor(Math.random() * 20) + 75}/100`,
          'Timing': `${Math.floor(Math.random() * 15) + 80}%`,
          'Balance': `${Math.floor(Math.random() * 20) + 70}%`,
          'Follow Through': `${Math.floor(Math.random() * 15) + 75}%`,
          'Foot Movement': `${Math.floor(Math.random() * 20) + 70}/100`,
        },
        feedback: 'Good basic technique with potential for improvement in timing.',
        recommendations: [
          'Focus on head position stability',
          'Practice against varying pace',
          'Strengthen core muscles'
        ]
      }
    };

    const sportMetrics = sportSpecificMetrics[sport] || sportSpecificMetrics.athletics;
    
    // Determine grade based on score
    let grade = 'D';
    let gradeData = SAI_GRADES.POOR;
    
    Object.entries(SAI_GRADES).forEach(([key, value]) => {
      if (baseScore >= value.range[0] && baseScore <= value.range[1]) {
        grade = value.grade;
        gradeData = value;
      }
    });

    return {
      score: baseScore,
      grade: grade,
      gradeData: gradeData,
      sport: sport,
      subcategory: subcategory,
      metrics: sportMetrics.metrics,
      feedback: sportMetrics.feedback,
      recommendations: sportMetrics.recommendations,
      analysisDetails: {
        processingTime: '2.3s',
        confidence: `${Math.floor(Math.random() * 15) + 85}%`,
        frameAnalyzed: Math.floor(Math.random() * 100) + 150,
        keyPointsDetected: Math.floor(Math.random() * 10) + 15,
      },
      eligibleForSAI: baseScore >= 75,
      timestamp: new Date().toISOString(),
    };
  };

  const handleSubmitToSAI = () => {
    if (analysisData.eligibleForSAI) {
      navigation.navigate('SAISubmission', {
        analysisData,
        videoUri,
        sport,
        subcategory,
        sportData
      });
    } else {
      Alert.alert(
        'Score Requirement',
        `Your current score of ${analysisData.score} is below the SAI requirement of 75. Keep practicing and try again!`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const renderAnalyzingView = () => (
    <View style={styles.analyzingContainer}>
      <LinearGradient
        colors={[sportData.color, SAI_COLORS.white]}
        style={styles.analyzingGradient}
      >
        <View style={styles.analyzingContent}>
          <View style={styles.loadingIcon}>
            <Ionicons name="analytics" size={48} color={SAI_COLORS.white} />
          </View>
          <Text style={styles.analyzingTitle}>Analyzing Performance</Text>
          <Text style={styles.analyzingSubtitle}>AI is processing your video...</Text>
          
          <View style={styles.processingSteps}>
            <View style={styles.processingStep}>
              <Ionicons name="checkmark-circle" size={16} color={SAI_COLORS.white} />
              <Text style={styles.processingText}>Video uploaded</Text>
            </View>
            <View style={styles.processingStep}>
              <Ionicons name="checkmark-circle" size={16} color={SAI_COLORS.white} />
              <Text style={styles.processingText}>Motion detected</Text>
            </View>
            <View style={styles.processingStep}>
              <Ionicons name="sync" size={16} color={SAI_COLORS.white} />
              <Text style={styles.processingText}>Analyzing technique...</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        {renderAnalyzingView()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[sportData.color, SAI_COLORS.white]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="analytics" size={32} color={SAI_COLORS.white} />
            <Text style={styles.headerTitle}>Analysis Complete</Text>
            <Text style={styles.headerSubtitle}>{sportData.name} - {subcategory}</Text>
          </View>
        </LinearGradient>

        {/* Score Card */}
        <View style={styles.scoreSection}>
          <LinearGradient
            colors={[analysisData.gradeData.color, SAI_COLORS.white]}
            style={styles.scoreCard}
          >
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>Performance Score</Text>
              <View style={[styles.gradeChip, { backgroundColor: analysisData.gradeData.color }]}>
                <Text style={styles.gradeText}>{analysisData.grade}</Text>
              </View>
            </View>
            
            <View style={styles.mainScore}>
              <Text style={styles.scoreValue}>{analysisData.score}</Text>
              <Text style={styles.scoreUnit}>/100</Text>
            </View>
            
            <Text style={styles.scoreDescription}>
              {analysisData.gradeData.description}
            </Text>

            {analysisData.eligibleForSAI && (
              <View style={styles.eligibilityBadge}>
                <Ionicons name="trophy" size={16} color={SAI_COLORS.success} />
                <Text style={styles.eligibilityText}>SAI Eligible</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Detailed Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsContainer}>
            {Object.entries(analysisData.metrics).map(([metric, value], index) => (
              <View key={index} style={styles.metricRow}>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>{metric}</Text>
                  <Text style={styles.metricValue}>{value}</Text>
                </View>
                <View style={styles.metricBar}>
                  <View 
                    style={[
                      styles.metricProgress, 
                      { 
                        width: `${Math.floor(Math.random() * 30) + 60}%`,
                        backgroundColor: sportData.color 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* AI Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Analysis Feedback</Text>
          <View style={styles.feedbackCard}>
            <Ionicons name="bulb" size={24} color={SAI_COLORS.warning} />
            <Text style={styles.feedbackText}>{analysisData.feedback}</Text>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Improvement Recommendations</Text>
          {analysisData.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color={sportData.color} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Analysis Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Processing Time</Text>
              <Text style={styles.detailValue}>{analysisData.analysisDetails.processingTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Confidence</Text>
              <Text style={styles.detailValue}>{analysisData.analysisDetails.confidence}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Frames Analyzed</Text>
              <Text style={styles.detailValue}>{analysisData.analysisDetails.frameAnalyzed}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Key Points</Text>
              <Text style={styles.detailValue}>{analysisData.analysisDetails.keyPointsDetected}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {analysisData.eligibleForSAI ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleSubmitToSAI}
            >
              <Ionicons name="send" size={20} color={SAI_COLORS.white} />
              <Text style={styles.primaryButtonText}>Submit to SAI</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.disabledButton]}
              onPress={handleSubmitToSAI}
            >
              <Ionicons name="trophy" size={20} color={SAI_COLORS.gray} />
              <Text style={styles.disabledButtonText}>Score Below SAI Requirement</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="refresh" size={20} color={sportData.color} />
            <Text style={[styles.secondaryButtonText, { color: sportData.color }]}>
              Try Again
            </Text>
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
  scrollView: {
    flex: 1,
  },
  // Analyzing View
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  analyzingGradient: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  analyzingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  analyzingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    marginBottom: 8,
  },
  analyzingSubtitle: {
    fontSize: 16,
    color: SAI_COLORS.white,
    opacity: 0.9,
    marginBottom: 32,
  },
  processingSteps: {
    alignItems: 'flex-start',
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  processingText: {
    fontSize: 16,
    color: SAI_COLORS.white,
    marginLeft: 12,
  },
  // Header
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
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  // Score Section
  scoreSection: {
    padding: 20,
  },
  scoreCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  mainScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  scoreUnit: {
    fontSize: 24,
    color: SAI_COLORS.white,
    opacity: 0.8,
    marginLeft: 8,
  },
  scoreDescription: {
    fontSize: 16,
    color: SAI_COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  eligibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: SAI_COLORS.success,
  },
  eligibilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: SAI_COLORS.success,
    marginLeft: 8,
  },
  // Sections
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 16,
  },
  // Metrics
  metricsContainer: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 16,
    padding: 20,
  },
  metricRow: {
    marginBottom: 16,
  },
  metricInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    fontWeight: 'bold',
  },
  metricBar: {
    height: 6,
    backgroundColor: SAI_COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricProgress: {
    height: '100%',
    borderRadius: 3,
  },
  // Feedback
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: SAI_COLORS.white,
    padding: 20,
    borderRadius: 16,
  },
  feedbackText: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    lineHeight: 24,
    marginLeft: 16,
    flex: 1,
  },
  // Recommendations
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: SAI_COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    marginLeft: 12,
    lineHeight: 22,
    flex: 1,
  },
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: (width - 60) / 2,
    backgroundColor: SAI_COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    textAlign: 'center',
  },
  // Action Buttons
  actionSection: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: SAI_COLORS.success,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: SAI_COLORS.border,
  },
  disabledButton: {
    backgroundColor: SAI_COLORS.border,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.gray,
    marginLeft: 8,
  },
});

export default AnalysisResultScreen;