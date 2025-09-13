// screens/RecordingScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Camera from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

// SAI Official Colors
const saiTheme = {
  primary: '#1f357b',
  accent: '#ff9933',
  recordRed: '#ff4d4d',
};

export default function RecordingScreen({ navigation, route }) {
  const { testData } = route.params;
  const cameraRef = useRef(null); // Create a reference to control the camera

  // State Management
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  // Request all permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');

      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(mediaStatus.status === 'granted');
    })();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const videoRecordPromise = cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
        });

        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const source = data.uri;
          await saveVideo(source);
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      setIsRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  const saveVideo = async (uri) => {
    try {
      if (hasMediaPermission) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Video Saved!', 'Your test video has been saved to your gallery.');

        // For now, we still navigate with simulated data
        // In a real app, you would pass the 'uri' to an analysis screen
        navigation.replace('Results', {
          testData,
          finalScore: Math.floor(Math.random() * 5) + 10,
          formScore: (Math.random() * 2 + 7.5).toFixed(1),
        });
      } else {
        Alert.alert("Permission Error", "We need permission to save videos to your gallery.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Render logic based on permissions
  if (hasCameraPermission === null || hasAudioPermission === null || hasMediaPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text style={{textAlign: 'center', marginTop: 50}}>Camera and Audio access are required!</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} type="front" ref={cameraRef} />
      
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.testTitle}>{testData.title}</Text>
          {isRecording && <Text style={styles.timerText}>{new Date(recordTime * 1000).toISOString().substr(14, 5)}</Text>}
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <View style={isRecording ? styles.stopButton : styles.recordButton} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'space-between', backgroundColor: 'transparent' },
  header: { alignItems: 'center', marginTop: 20 },
  testTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  timerText: { color: 'white', fontSize: 18, marginTop: 10 },
  controlsContainer: { paddingBottom: 30, alignItems: 'center' },
  controlButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 255, 255, 0.4)', justifyContent: 'center', alignItems: 'center' },
  recordButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: saiTheme.recordRed },
  stopButton: { width: 35, height: 35, borderRadius: 5, backgroundColor: saiTheme.recordRed },
});