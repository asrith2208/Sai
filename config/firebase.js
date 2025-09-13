// config/firebase.js - Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4Fx4hpU6WYxQjYm2kFJ7PD4PMcf5XKHU",
  authDomain: "saivision-1f1f0.firebaseapp.com",
  projectId: "saivision-1f1f0",
  storageBucket: "saivision-1f1f0.firebasestorage.app",
  messagingSenderId: "796197021383",
  appId: "1:796197021383:web:d9396f1d982730614c00e2",
  measurementId: "G-BQXCEXF3CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (if running in web environment)
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.log('Analytics not available in this environment');
}

export { app, analytics };
export default app;