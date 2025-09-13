// screens/VideoRecordingScreen.js - Enhanced Video Recording with Sport-specific Guidance
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SAI_COLORS, SAI_SPORTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const VideoRecordingScreen = ({ navigation, route }) => {
  const { sport, subcategory, sportData } = route.params;
  
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const cameraRef = useRef(null);
  const recordingTimer = useRef(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, []);

  const requestPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const audioPermission = await Camera.requestMicrophonePermissionsAsync();
    setHasPermission(cameraPermission.status === 'granted' && audioPermission.status === 'granted');
  };

  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingTimer.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        setIsRecording(true);
        startRecordingTimer();
        
        const recordingOptions = {
          quality: '720p',
          maxDuration: 60, // 1 minute max for SAI evaluation
          mute: false,
        };
        
        const data = await cameraRef.current.recordAsync(recordingOptions);
        setVideoUri(data.uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Recording error:', error);
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
        stopRecordingTimer();
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const pickVideoFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to select video');
    }
  };

  const analyzeVideo = () => {
    if (!videoUri) {
      Alert.alert('No Video', 'Please record or upload a video first');
      return;
    }

    navigation.navigate('AnalysisResult', {
      videoUri,
      sport,
      subcategory,
      sportData
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sport-specific instructions
  const getSportInstructions = () => {
    const baseInstructions = {
      setup: 'Position yourself clearly in frame',
      lighting: 'Ensure good lighting',
      angle: 'Record from the side or front',
      duration: 'Keep recording under 1 minute'
    };

    const sportSpecificInstructions = {
      athletics: {
        setup: 'Position camera to capture full body movement',
        execution: 'Perform the complete movement (run, jump, throw)',
        angle: 'Side view for running/jumping, front view for throwing'
      },
      football: {
        setup: 'Use a ball and mark clear boundaries',
        execution: 'Demonstrate the specific skill with the ball',
        angle: 'Record from an angle that shows ball control clearly'
      },
      cricket: {
        setup: 'Use proper cricket equipment (bat/ball)',
        execution: 'Show proper technique and follow-through',
        angle: 'Side view for batting, front view for bowling'
      },
      // Add more sports as needed
    };

    return {
      ...baseInstructions,
      ...(sportSpecificInstructions[sport] || {})
    };
  };

  const renderInstructionsModal = () => (
    <Modal
      visible={showInstructions}
      animationType="slide"
      transparent
      onRequestClose={() => setShowInstructions(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.instructionsModal}>
          <LinearGradient
            colors={[sportData.color, SAI_COLORS.white]}
            style={styles.instructionsHeader}
          >
            <Ionicons name={sportData.icon} size={32} color={SAI_COLORS.white} />
            <Text style={styles.instructionsTitle}>{sportData.name} - {subcategory}</Text>
            <Text style={styles.instructionsSubtitle}>Recording Guidelines</Text>
          </LinearGradient>

          <View style={styles.instructionsContent}>
            <Text style={styles.instructionsDescription}>
              Follow these guidelines to ensure accurate AI analysis of your performance:
            </Text>

            {Object.entries(getSportInstructions()).map(([key, instruction], index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={[styles.instructionIcon, { backgroundColor: sportData.color }]}>
                  <Text style={styles.instructionNumber}>{index + 1}</Text>
                </View>
                <View style={styles.instructionText}>
                  <Text style={styles.instructionTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.instructionDetail}>{instruction}</Text>
                </View>
              </View>
            ))}

            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color={SAI_COLORS.warning} />
              <Text style={styles.warningText}>
                Ensure your video clearly shows the technique. Poor quality recordings may affect AI analysis accuracy.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startRecordingButton, { backgroundColor: sportData.color }]}
            onPress={() => {
              setShowInstructions(false);
              setShowCamera(true);
            }}
          >
            <Ionicons name="videocam" size={20} color={SAI_COLORS.white} />
            <Text style={styles.startRecordingButtonText}>Start Recording</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type="back"
        onCameraReady={() => setCameraReady(true)}
      >
        <SafeAreaView style={styles.cameraOverlay}>
          <View style={styles.cameraHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={24} color={SAI_COLORS.white} />
            </TouchableOpacity>
            <View style={styles.sportInfo}>
              <Text style={styles.sportTitle}>{sportData.name}</Text>
              <Text style={styles.subcategoryTitle}>{subcategory}</Text>
            </View>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => setShowInstructions(true)}
            >
              <Ionicons name="help-circle" size={24} color={SAI_COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Recording Timer */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
            </View>
          )}

          {/* Guidelines Overlay */}
          <View style={styles.guidelinesOverlay}>
            <View style={styles.frameGuide} />
            <Text style={styles.guidelineText}>
              {isRecording ? 'Recording in progress...' : 'Position yourself in the frame'}
            </Text>
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordButtonActive]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={!cameraReady}
            >
              <Ionicons
                name={isRecording ? "stop" : "radio-button-on"}
                size={isRecording ? 30 : 60}
                color={SAI_COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off" size={64} color={SAI_COLORS.gray} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          SAI-Vision needs camera access to record your performance.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermissions}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showCamera) {
    return renderCameraView();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[sportData.color, SAI_COLORS.white]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name={sportData.icon} size={24} color={SAI_COLORS.white} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{sportData.name}</Text>
            <Text style={styles.headerSubtitle}>{subcategory}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Video Preview or Upload Options */}
        {videoUri ? (
          <View style={styles.videoPreview}>
            <Text style={styles.sectionTitle}>Video Ready for Analysis</Text>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={64} color={sportData.color} />
              <Text style={styles.videoText}>Video recorded successfully</Text>
              <Text style={styles.videoSubtext}>Ready for AI analysis</Text>
            </View>
            
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setVideoUri(null)}
            >
              <Ionicons name="refresh" size={16} color={SAI_COLORS.orange} />
              <Text style={styles.retakeButtonText}>Record Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recordingOptions}>
            <Text style={styles.sectionTitle}>Record Your Performance</Text>
            
            <TouchableOpacity
              style={[styles.optionButton, { borderColor: sportData.color }]}
              onPress={() => setShowInstructions(true)}
            >
              <View style={[styles.optionIcon, { backgroundColor: sportData.color }]}>
                <Ionicons name="videocam" size={24} color={SAI_COLORS.white} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Record New Video</Text>
                <Text style={styles.optionDescription}>
                  Use your camera to record the performance
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={SAI_COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={pickVideoFromGallery}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="folder" size={24} color={SAI_COLORS.white} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Upload from Gallery</Text>
                <Text style={styles.optionDescription}>
                  Select an existing video from your device
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={SAI_COLORS.gray} />
            </TouchableOpacity>
          </View>
        )}

        {/* Analysis Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            { backgroundColor: videoUri ? sportData.color : SAI_COLORS.border },
            !videoUri && styles.disabledButton
          ]}
          onPress={analyzeVideo}
          disabled={!videoUri}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={videoUri ? SAI_COLORS.white : SAI_COLORS.gray} 
          />
          <Text style={[
            styles.analyzeButtonText,
            !videoUri && styles.disabledButtonText
          ]}>
            Analyze Performance
          </Text>
        </TouchableOpacity>
      </View>

      {renderInstructionsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
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
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 20,
  },
  recordingOptions: {
    flex: 1,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: SAI_COLORS.border,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SAI_COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 20,
  },
  videoPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
    backgroundColor: SAI_COLORS.white,
    padding: 40,
    borderRadius: 16,
    marginBottom: 20,
  },
  videoText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginTop: 16,
  },
  videoSubtext: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    marginTop: 4,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  retakeButtonText: {
    fontSize: 16,
    color: SAI_COLORS.orange,
    fontWeight: '500',
    marginLeft: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledButtonText: {
    color: SAI_COLORS.gray,
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  sportInfo: {
    alignItems: 'center',
    flex: 1,
  },
  sportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
  },
  subcategoryTitle: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  helpButton: {
    padding: 8,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SAI_COLORS.white,
    marginRight: 8,
  },
  recordingTime: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.white,
  },
  guidelinesOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  frameGuide: {
    width: width * 0.7,
    height: height * 0.4,
    borderWidth: 2,
    borderColor: SAI_COLORS.white,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginBottom: 20,
  },
  guidelineText: {
    fontSize: 16,
    color: SAI_COLORS.white,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: SAI_COLORS.white,
  },
  recordButtonActive: {
    backgroundColor: SAI_COLORS.error,
  },
  // Instructions Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  instructionsModal: {
    backgroundColor: SAI_COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  instructionsHeader: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
    marginTop: 12,
    textAlign: 'center',
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  instructionsContent: {
    padding: 20,
  },
  instructionsDescription: {
    fontSize: 16,
    color: SAI_COLORS.dark,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SAI_COLORS.white,
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  instructionDetail: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: SAI_COLORS.lightOrange,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  warningText: {
    fontSize: 14,
    color: SAI_COLORS.dark,
    marginLeft: 12,
    lineHeight: 20,
    flex: 1,
  },
  startRecordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startRecordingButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginLeft: 8,
  },
  // Permission styles
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: SAI_COLORS.lightGray,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: SAI_COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: SAI_COLORS.orange,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.white,
  },
});

export default VideoRecordingScreen;