// screens/SAISubmissionScreen.js - Submit Performance to SAI Team
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SAI_COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const SAISubmissionScreen = ({ navigation, route }) => {
  const { analysisData, videoUri, sport, subcategory, sportData } = route.params;
  const { user, submitToSAI } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [contactPreference, setContactPreference] = useState('email');

  const handleSubmission = async () => {
    if (!agreedToTerms) {
      Alert.alert('Terms & Conditions', 'Please agree to the terms and conditions to proceed.');
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      analysisData,
      videoUri,
      sport,
      subcategory,
      additionalInfo,
      contactPreference,
      submissionDate: new Date().toISOString(),
      status: 'under_review',
      userInfo: {
        name: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        age: calculateAge(user.dateOfBirth),
        city: user.city,
        state: user.state,
        experience: user.experience,
      }
    };

    try {
      const result = await submitToSAI(submissionData);
      
      if (result.success) {
        setIsSubmitting(false);
        setShowSuccessModal(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Submission Error', error.message || 'Failed to submit to SAI. Please try again.');
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const renderSubmissionForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      {/* Performance Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name={sportData.icon} size={24} color={sportData.color} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>{sportData.name} - {subcategory}</Text>
              <Text style={styles.summaryScore}>Score: {analysisData.score}/100</Text>
            </View>
            <View style={[styles.gradeChip, { backgroundColor: analysisData.gradeData.color }]}>
              <Text style={styles.gradeText}>{analysisData.grade}</Text>
            </View>
          </View>
          <Text style={styles.summaryDescription}>
            {analysisData.gradeData.description}
          </Text>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{user.fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{calculateAge(user.dateOfBirth)} years</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{user.city}, {user.state}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text style={styles.infoValue}>{user.email || user.phoneNumber}</Text>
          </View>
        </View>
      </View>

      {/* Contact Preference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Preference</Text>
        <Text style={styles.sectionDescription}>
          How would you like SAI officials to contact you regarding your submission?
        </Text>
        
        <View style={styles.contactOptions}>
          <TouchableOpacity
            style={[
              styles.contactOption,
              contactPreference === 'email' && styles.selectedContactOption
            ]}
            onPress={() => setContactPreference('email')}
          >
            <Ionicons 
              name="mail" 
              size={20} 
              color={contactPreference === 'email' ? SAI_COLORS.white : SAI_COLORS.gray} 
            />
            <Text style={[
              styles.contactOptionText,
              contactPreference === 'email' && styles.selectedContactOptionText
            ]}>
              Email
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.contactOption,
              contactPreference === 'phone' && styles.selectedContactOption
            ]}
            onPress={() => setContactPreference('phone')}
          >
            <Ionicons 
              name="call" 
              size={20} 
              color={contactPreference === 'phone' ? SAI_COLORS.white : SAI_COLORS.gray} 
            />
            <Text style={[
              styles.contactOptionText,
              contactPreference === 'phone' && styles.selectedContactOptionText
            ]}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text style={styles.sectionDescription}>
          Share any relevant information about your sports background, achievements, or goals.
        </Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          placeholder="Tell us about your sports journey, achievements, training, or anything else you'd like SAI to know..."
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          placeholderTextColor={SAI_COLORS.gray}
        />
      </View>

      {/* Terms and Conditions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          <View style={[
            styles.checkbox,
            agreedToTerms && styles.checkedCheckbox
          ]}>
            {agreedToTerms && (
              <Ionicons name="checkmark" size={16} color={SAI_COLORS.white} />
            )}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
            I understand that my video and performance data will be reviewed by SAI officials.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: agreedToTerms ? SAI_COLORS.orange : SAI_COLORS.border },
            isSubmitting && styles.submittingButton
          ]}
          onPress={handleSubmission}
          disabled={!agreedToTerms || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Ionicons name="sync" size={20} color={SAI_COLORS.white} />
              <Text style={styles.submitButtonText}>Submitting...</Text>
            </>
          ) : (
            <>
              <Ionicons name="send" size={20} color={agreedToTerms ? SAI_COLORS.white : SAI_COLORS.gray} />
              <Text style={[
                styles.submitButtonText,
                !agreedToTerms && styles.disabledSubmitText
              ]}>
                Submit to SAI
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.submitNote}>
          Your submission will be reviewed by SAI officials within 7-14 business days.
        </Text>
      </View>
    </ScrollView>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <LinearGradient
            colors={[SAI_COLORS.success, SAI_COLORS.white]}
            style={styles.successHeader}
          >
            <Ionicons name="checkmark-circle" size={64} color={SAI_COLORS.white} />
            <Text style={styles.successTitle}>Submission Successful!</Text>
            <Text style={styles.successSubtitle}>
              Your performance has been submitted to the Sports Authority of India
            </Text>
          </LinearGradient>
          
          <View style={styles.successContent}>
            <View style={styles.successInfo}>
              <Ionicons name="time" size={20} color={SAI_COLORS.blue} />
              <Text style={styles.successInfoText}>
                Review Process: 7-14 business days
              </Text>
            </View>
            
            <View style={styles.successInfo}>
              <Ionicons name={contactPreference === 'email' ? 'mail' : 'call'} size={20} color={SAI_COLORS.blue} />
              <Text style={styles.successInfoText}>
                Contact Method: {contactPreference === 'email' ? 'Email' : 'Phone'}
              </Text>
            </View>
            
            <View style={styles.successInfo}>
              <Ionicons name="document" size={20} color={SAI_COLORS.blue} />
              <Text style={styles.successInfoText}>
                Reference ID: SAI{Date.now().toString().slice(-6)}
              </Text>
            </View>
            
            <Text style={styles.nextStepsTitle}>What's Next?</Text>
            <Text style={styles.nextStepsText}>
              1. SAI officials will review your performance{'\n'}
              2. If selected, you'll be contacted for physical trials{'\n'}
              3. Medical examination and final evaluation{'\n'}
              4. Invitation to SAI training academy
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setShowSuccessModal(false);
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
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
          <Ionicons name="send" size={24} color={SAI_COLORS.white} />
          <Text style={styles.headerTitle}>Submit to SAI</Text>
          <Text style={styles.headerSubtitle}>
            Official submission to Sports Authority of India
          </Text>
        </View>
      </LinearGradient>

      {renderSubmissionForm()}
      {renderSuccessModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 20,
    marginBottom: 16,
  },
  // Performance Summary
  summaryCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  summaryScore: {
    fontSize: 14,
    color: SAI_COLORS.gray,
  },
  gradeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  summaryDescription: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 20,
  },
  // Personal Info
  infoCard: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.lightGray,
  },
  infoLabel: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    fontWeight: '600',
  },
  // Contact Options
  contactOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: SAI_COLORS.border,
  },
  selectedContactOption: {
    backgroundColor: SAI_COLORS.blue,
    borderColor: SAI_COLORS.blue,
  },
  contactOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: SAI_COLORS.gray,
    marginLeft: 8,
  },
  selectedContactOptionText: {
    color: SAI_COLORS.white,
  },
  // Text Input
  textInput: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: SAI_COLORS.dark,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: SAI_COLORS.border,
  },
  // Terms
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: SAI_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedCheckbox: {
    backgroundColor: SAI_COLORS.orange,
    borderColor: SAI_COLORS.orange,
  },
  termsText: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: SAI_COLORS.orange,
    fontWeight: '600',
  },
  // Submit Section
  submitSection: {
    marginTop: 24,
    paddingBottom: 40,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  submittingButton: {
    opacity: 0.8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginLeft: 8,
  },
  disabledSubmitText: {
    color: SAI_COLORS.gray,
  },
  submitNote: {
    fontSize: 12,
    color: SAI_COLORS.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successModal: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  successHeader: {
    padding: 32,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: SAI_COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  successContent: {
    padding: 24,
  },
  successInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  successInfoText: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    marginLeft: 12,
    flex: 1,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginTop: 16,
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: SAI_COLORS.orange,
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
  },
});

export default SAISubmissionScreen;