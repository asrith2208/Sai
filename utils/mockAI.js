// utils/mockAI.js - Mock AI Analysis System
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AI analysis results based on test type
const generateMockAnalysis = (testType, videoUri = null) => {
  const analysisId = Date.now().toString();
  const date = new Date().toISOString();
  
  let result = {
    id: analysisId,
    testType,
    date,
    videoUri,
    analysisComplete: true,
  };

  // Generate different mock results based on test type
  switch (testType) {
    case 'vertical_jump':
      result = {
        ...result,
        score: Math.floor(Math.random() * 30) + 35, // 35-65 cm
        unit: 'cm',
        metrics: {
          jumpHeight: Math.floor(Math.random() * 30) + 35,
          takeoffVelocity: (Math.random() * 2 + 2.5).toFixed(1), // 2.5-4.5 m/s
          airTime: (Math.random() * 0.3 + 0.4).toFixed(2), // 0.4-0.7 seconds
        },
        feedback: 'Good explosive power! Focus on arm swing coordination for better height.',
        grade: 'B+',
      };
      break;
      
    case 'sprint':
      result = {
        ...result,
        score: (Math.random() * 1.5 + 4.5).toFixed(2), // 4.5-6.0 seconds
        unit: 'seconds',
        metrics: {
          time: (Math.random() * 1.5 + 4.5).toFixed(2),
          topSpeed: (Math.random() * 3 + 22).toFixed(1), // 22-25 km/h
          acceleration: (Math.random() * 2 + 6).toFixed(1), // 6-8 m/s²
        },
        feedback: 'Strong acceleration phase. Work on maintaining speed in final meters.',
        grade: 'A-',
      };
      break;
      
    case 'sit_ups':
      result = {
        ...result,
        score: Math.floor(Math.random() * 25) + 25, // 25-50 reps
        unit: 'reps',
        metrics: {
          repetitions: Math.floor(Math.random() * 25) + 25,
          avgCadence: Math.floor(Math.random() * 10) + 25, // 25-35 reps/min
          formScore: Math.floor(Math.random() * 20) + 80, // 80-100%
        },
        feedback: 'Consistent rhythm and good form. Excellent core strength!',
        grade: 'A',
      };
      break;
      
    case 'broad_jump':
      result = {
        ...result,
        score: Math.floor(Math.random() * 60) + 180, // 180-240 cm
        unit: 'cm',
        metrics: {
          distance: Math.floor(Math.random() * 60) + 180,
          takeoffAngle: Math.floor(Math.random() * 10) + 40, // 40-50 degrees
          landingStability: Math.floor(Math.random() * 20) + 80, // 80-100%
        },
        feedback: 'Great distance! Focus on landing technique for better stability.',
        grade: 'B+',
      };
      break;
      
    default:
      result = {
        ...result,
        score: Math.floor(Math.random() * 100) + 50, // 50-150 generic score
        unit: 'points',
        metrics: {
          overallPerformance: Math.floor(Math.random() * 100) + 50,
          technique: Math.floor(Math.random() * 30) + 70,
          consistency: Math.floor(Math.random() * 25) + 75,
        },
        feedback: 'Good performance! Keep practicing to improve your technique.',
        grade: 'B',
      };
  }

  return result;
};

// Simulate AI processing delay
const simulateProcessing = (duration = 2000) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

// Save result to AsyncStorage
const saveResult = async (result) => {
  try {
    const existingResults = await getResults();
    const updatedResults = [result, ...existingResults];
    await AsyncStorage.setItem('sai_vision_results', JSON.stringify(updatedResults));
    return true;
  } catch (error) {
    console.error('Error saving result:', error);
    return false;
  }
};

// Get all saved results
const getResults = async () => {
  try {
    const results = await AsyncStorage.getItem('sai_vision_results');
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Error getting results:', error);
    return [];
  }
};

// Clear all results (for testing)
const clearResults = async () => {
  try {
    await AsyncStorage.removeItem('sai_vision_results');
    return true;
  } catch (error) {
    console.error('Error clearing results:', error);
    return false;
  }
};

// Main AI analysis function
export const analyzePerformance = async (testType, videoUri = null) => {
  // Simulate processing time
  await simulateProcessing(2000);
  
  // Generate mock analysis
  const analysis = generateMockAnalysis(testType, videoUri);
  
  // Save to storage
  await saveResult(analysis);
  
  return analysis;
};

// Export utility functions
export {
  getResults,
  clearResults,
  saveResult,
  generateMockAnalysis,
};

// Test types configuration
export const TEST_TYPES = {
  vertical_jump: {
    name: 'Vertical Jump',
    description: 'Measure your explosive leg power',
    instructions: 'Stand still, then jump as high as possible',
    icon: 'trending-up',
    color: '#3b82f6',
  },
  sprint: {
    name: '40m Sprint',
    description: 'Test your speed and acceleration',
    instructions: 'Run as fast as possible for 40 meters',
    icon: 'flash',
    color: '#ef4444',
  },
  sit_ups: {
    name: 'Sit-ups Test',
    description: 'Measure core strength and endurance',
    instructions: 'Perform maximum sit-ups in 60 seconds',
    icon: 'fitness',
    color: '#10b981',
  },
  broad_jump: {
    name: 'Broad Jump',
    description: 'Test horizontal jumping power',
    instructions: 'Jump forward as far as possible',
    icon: 'arrow-forward',
    color: '#f59e0b',
  },
};