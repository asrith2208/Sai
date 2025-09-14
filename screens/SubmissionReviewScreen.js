// screens/SubmissionReviewScreen.js - SAI Team Submission Review Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SAI_COLORS } from '../constants/theme';
import DummyDataService from '../services/dummyDataService';

const SubmissionReviewScreen = ({ navigation, route }) => {
  const { submission } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(''); // 'approve' or 'reject'
  
  // Review form state
  const [saiScore, setSaiScore] = useState(submission.saiScore?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [strengths, setStrengths] = useState(
    submission.strengths ? submission.strengths.join('\n') : ''
  );
  const [improvements, setImprovements] = useState(
    submission.improvements ? submission.improvements.join('\n') : ''
  );
  const [nextSteps, setNextSteps] = useState(submission.nextSteps || '');

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReviewSubmission = (action) => {
    setReviewAction(action);
    
    // Pre-fill data based on action
    if (action === 'approve' && !saiScore) {
      setSaiScore('80'); // Default good score for approval
    } else if (action === 'reject' && !saiScore) {
      setSaiScore('60'); // Default lower score for rejection
    }
    
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    // Validation
    if (!saiScore || parseInt(saiScore) < 0 || parseInt(saiScore) > 100) {
      Alert.alert('Error', 'Please enter a valid SAI score (0-100)');
      return;
    }

    if (!feedback.trim()) {
      Alert.alert('Error', 'Please provide feedback for the submission');
      return;
    }

    if (!nextSteps.trim()) {
      Alert.alert('Error', 'Please provide next steps for the athlete');
      return;
    }

    setIsLoading(true);
    
    try {
      const reviewData = {
        status: reviewAction === 'approve' ? 'approved' : 'rejected',
        saiScore: parseInt(saiScore),
        feedback: feedback.trim(),
        strengths: strengths.trim() ? strengths.trim().split('\n').filter(s => s.trim()) : [],
        improvements: improvements.trim() ? improvements.trim().split('\n').filter(s => s.trim()) : [],
        nextSteps: nextSteps.trim(),
        reviewedBy: user.fullName,
      };

      await DummyDataService.updateSubmissionReview(submission.id, reviewData);

      Alert.alert(
        'Success',
        `Submission has been ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowReviewModal(false);
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsUnderReview = async () => {
    setIsLoading(true);
    try {
      await DummyDataService.updateSubmissionReview(submission.id, {
        status: 'under_review',
        reviewedBy: user.fullName,
      });
      
      Alert.alert('Success', 'Submission marked as under review', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const renderVideoPlaceholder = () => (
    <View style={styles.videoSection}>
      <Text style={styles.sectionTitle}>Submitted Video</Text>
      <View style={styles.videoPlaceholder}>
        <View style={styles.videoIcon}>
          <Ionicons name="play-circle" size={64} color={SAI_COLORS.orange} />
        </View>
        <Text style={styles.videoText}>{submission.sport} - {submission.subcategory}</Text>
        <Text style={styles.videoSubtext}>Video Duration: ~45 seconds</Text>
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={16} color={SAI_COLORS.white} />
          <Text style={styles.playButtonText}>Play Video</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.videoNote}>
        📹 In a real application, the actual video would be displayed here
      </Text>
    </View>
  );

  const renderReviewModal = () => (
    <Modal
      visible={showReviewModal}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowReviewModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView 
          style={styles.modalContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReviewModal(false)}>
              <Ionicons name="close" size={24} color={SAI_COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            {/* SAI Score */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>SAI Score (0-100) *</Text>
              <TextInput
                style={styles.scoreInput}
                value={saiScore}
                onChangeText={setSaiScore}
                placeholder="Enter score"
                keyboardType="numeric"
                maxLength={3}
                placeholderTextColor={SAI_COLORS.gray}
              />
              <Text style={styles.formHint}>
                AI Score: {submission.aiScore} | Recommended: {reviewAction === 'approve' ? '75+' : '<75'}
              </Text>
            </View>

            {/* Feedback */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Overall Feedback *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Provide detailed feedback on the performance..."
                multiline
                numberOfLines={4}
                placeholderTextColor={SAI_COLORS.gray}
              />
            </View>

            {/* Strengths */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Key Strengths</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={strengths}
                onChangeText={setStrengths}
                placeholder="List key strengths (one per line)..."
                multiline
                numberOfLines={3}
                placeholderTextColor={SAI_COLORS.gray}
              />
            </View>

            {/* Areas for Improvement */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Areas for Improvement</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={improvements}
                onChangeText={setImprovements}
                placeholder="List areas that need improvement (one per line)..."
                multiline
                numberOfLines={3}
                placeholderTextColor={SAI_COLORS.gray}
              />
            </View>

            {/* Next Steps */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Next Steps & Recommendations *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={nextSteps}
                onChangeText={setNextSteps}
                placeholder="Provide clear next steps and recommendations..."
                multiline
                numberOfLines={3}
                placeholderTextColor={SAI_COLORS.gray}
              />
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowReviewModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: reviewAction === 'approve' ? SAI_COLORS.success : SAI_COLORS.error }
              ]}
              onPress={submitReview}
              disabled={isLoading}
            >
              <Ionicons 
                name={reviewAction === 'approve' ? 'checkmark' : 'close'} 
                size={16} 
                color={SAI_COLORS.white} 
              />
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Submitting...' : (reviewAction === 'approve' ? 'Approve' : 'Reject')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={SAI_COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Submission</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Submission Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
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

          <View style={styles.submissionMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="trophy" size={16} color={SAI_COLORS.orange} />
              <Text style={styles.metaText}>{submission.sport}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="fitness" size={16} color={SAI_COLORS.blue} />
              <Text style={styles.metaText}>{submission.subcategory}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color={SAI_COLORS.gray} />
              <Text style={styles.metaText}>{formatDate(submission.submittedAt)}</Text>
            </View>
          </View>
        </View>

        {/* AI Analysis */}
        <View style={styles.analysisCard}>
          <Text style={styles.sectionTitle}>AI Analysis</Text>
          <View style={styles.scoreDisplay}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{submission.aiScore}</Text>
              <Text style={styles.scoreLabel}>AI Score</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreValue, { 
                color: submission.saiScore ? SAI_COLORS.success : SAI_COLORS.gray 
              }]}>
                {submission.saiScore || '--'}
              </Text>
              <Text style={styles.scoreLabel}>SAI Score</Text>
            </View>
          </View>
          <Text style={styles.analysisNote}>
            AI detected key technique points and provided initial assessment
          </Text>
        </View>

        {/* Video Section */}
        {renderVideoPlaceholder()}

        {/* Existing Review (if any) */}
        {submission.feedback && (
          <View style={styles.existingReviewCard}>
            <Text style={styles.sectionTitle}>Previous Review</Text>
            <View style={styles.reviewInfo}>
              <Text style={styles.reviewerName}>Reviewed by: {submission.reviewedBy}</Text>
              <Text style={styles.reviewDate}>{formatDate(submission.reviewedAt)}</Text>
            </View>
            
            <View style={styles.reviewContent}>
              <Text style={styles.feedbackText}>{submission.feedback}</Text>
              
              {submission.strengths && submission.strengths.length > 0 && (
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewSectionTitle}>Strengths:</Text>
                  {submission.strengths.map((strength, index) => (
                    <Text key={index} style={styles.listItem}>• {strength}</Text>
                  ))}
                </View>
              )}
              
              {submission.improvements && submission.improvements.length > 0 && (
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewSectionTitle}>Improvements:</Text>
                  {submission.improvements.map((improvement, index) => (
                    <Text key={index} style={styles.listItem}>• {improvement}</Text>
                  ))}
                </View>
              )}
              
              {submission.nextSteps && (
                <View style={styles.reviewSection}>
                  <Text style={styles.reviewSectionTitle}>Next Steps:</Text>
                  <Text style={styles.nextStepsText}>{submission.nextSteps}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Buttons */}
      {submission.status === 'pending' || submission.status === 'under_review' ? (
        <View style={styles.actionButtons}>
          {submission.status === 'pending' && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={markAsUnderReview}
              disabled={isLoading}
            >
              <Ionicons name="eye" size={16} color={SAI_COLORS.white} />
              <Text style={styles.reviewButtonText}>Mark Under Review</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.approvalButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReviewSubmission('reject')}
              disabled={isLoading}
            >
              <Ionicons name="close" size={16} color={SAI_COLORS.white} />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleReviewSubmission('approve')}
              disabled={isLoading}
            >
              <Ionicons name="checkmark" size={16} color={SAI_COLORS.white} />
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.statusInfo}>
          <Text style={styles.statusInfoText}>
            This submission has been {submission.status} and cannot be modified.
          </Text>
        </View>
      )}

      {renderReviewModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: SAI_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.dark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
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
  submissionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    marginLeft: 6,
    fontWeight: '500',
  },
  analysisCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 12,
  },
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAI_COLORS.blue,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    fontWeight: '500',
  },
  analysisNote: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  videoSection: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: SAI_COLORS.lightGray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoIcon: {
    marginBottom: 8,
  },
  videoText: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  videoSubtext: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    marginBottom: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.orange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playButtonText: {
    color: SAI_COLORS.white,
    marginLeft: 8,
    fontWeight: '500',
  },
  videoNote: {
    fontSize: 12,
    color: SAI_COLORS.blue,
    textAlign: 'center',
    backgroundColor: SAI_COLORS.lightBlue,
    padding: 8,
    borderRadius: 6,
  },
  existingReviewCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.border,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: SAI_COLORS.dark,
  },
  reviewDate: {
    fontSize: 12,
    color: SAI_COLORS.gray,
  },
  reviewContent: {
    gap: 12,
  },
  feedbackText: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    lineHeight: 20,
    backgroundColor: SAI_COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  reviewSection: {
    gap: 4,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SAI_COLORS.dark,
  },
  listItem: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    marginLeft: 8,
    lineHeight: 18,
  },
  nextStepsText: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    lineHeight: 20,
    backgroundColor: SAI_COLORS.lightGreen,
    padding: 12,
    borderRadius: 8,
  },
  actionButtons: {
    backgroundColor: SAI_COLORS.white,
    padding: 16,
    gap: 12,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SAI_COLORS.blue,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: SAI_COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  approvalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: SAI_COLORS.success,
  },
  rejectButton: {
    backgroundColor: SAI_COLORS.error,
  },
  actionButtonText: {
    color: SAI_COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  statusInfo: {
    backgroundColor: SAI_COLORS.lightGray,
    padding: 16,
    alignItems: 'center',
  },
  statusInfoText: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    fontStyle: 'italic',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: SAI_COLORS.white,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.dark,
  },
  modalScrollView: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 8,
  },
  scoreInput: {
    backgroundColor: SAI_COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: SAI_COLORS.dark,
    borderWidth: 1,
    borderColor: SAI_COLORS.border,
  },
  textInput: {
    backgroundColor: SAI_COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: SAI_COLORS.dark,
    borderWidth: 1,
    borderColor: SAI_COLORS.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formHint: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: SAI_COLORS.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: SAI_COLORS.lightGray,
  },
  cancelButtonText: {
    color: SAI_COLORS.dark,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  submitButtonText: {
    color: SAI_COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SubmissionReviewScreen;