/**
 * SitUpCounter React Component
 * Integrates AI sit-up counting with React/React Native apps
 */

import React, { useState, useEffect, useRef } from 'react';

const SitUpCounter = ({ 
  onCountUpdate, 
  onStageChange, 
  apiBaseUrl = 'http://localhost:5000/api',
  style = {} 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stats, setStats] = useState({
    count: 0,
    stage: 'Ready',
    angle: null,
    valid_position: false,
    message: 'Click Start Recording to begin',
    active: false
  });
  const [currentFrame, setCurrentFrame] = useState(null);
  const [error, setError] = useState(null);
  
  const intervalRef = useRef(null);

  // Default styles
  const defaultStyles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#2c3e50',
      borderRadius: '10px',
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      ...style
    },
    videoSection: {
      flex: 2,
      marginRight: '20px'
    },
    videoContainer: {
      backgroundColor: '#34495e',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center'
    },
    video: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
      border: '2px solid #fff'
    },
    placeholder: {
      width: '640px',
      height: '480px',
      backgroundColor: '#34495e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      border: '2px dashed #95a5a6',
      fontSize: '18px',
      color: '#95a5a6'
    },
    controlPanel: {
      flex: 1,
      backgroundColor: '#34495e',
      borderRadius: '8px',
      padding: '20px'
    },
    button: {
      padding: '15px 30px',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '5px',
      width: '100%'
    },
    recordButton: {
      backgroundColor: isRecording ? '#27ae60' : '#e74c3c',
      color: 'white'
    },
    resetButton: {
      backgroundColor: '#f39c12',
      color: 'white'
    },
    statsSection: {
      marginTop: '30px'
    },
    statItem: {
      margin: '10px 0',
      padding: '10px',
      backgroundColor: '#2c3e50',
      borderRadius: '5px'
    },
    count: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#e74c3c',
      textAlign: 'center'
    },
    stage: {
      fontSize: '18px',
      color: '#3498db'
    },
    message: {
      fontSize: '14px',
      color: '#f39c12',
      fontStyle: 'italic',
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#2c3e50',
      borderRadius: '5px',
      textAlign: 'center'
    },
    error: {
      color: '#e74c3c',
      backgroundColor: '#2c3e50',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0'
    }
  };

  // Start/stop recording
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        const response = await fetch(`${apiBaseUrl}/stop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        
        if (result.status === 'success') {
          setIsRecording(false);
          setCurrentFrame(null);
          clearInterval(intervalRef.current);
          setStats(prev => ({ ...prev, active: false }));
        } else {
          setError(result.message);
        }
      } else {
        const response = await fetch(`${apiBaseUrl}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ camera_index: 0 })
        });
        const result = await response.json();
        
        if (result.status === 'success') {
          setIsRecording(true);
          setError(null);
          startDataPolling();
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
    }
  };

  // Reset counter
  const resetCounter = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        setStats(prev => ({ ...prev, count: 0, message: 'Counter reset!' }));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(`Reset failed: ${err.message}`);
    }
  };

  // Start polling for frame and stats data
  const startDataPolling = () => {
    intervalRef.current = setInterval(async () => {
      try {
        // Get current frame
        const frameResponse = await fetch(`${apiBaseUrl}/frame`);
        const frameData = await frameResponse.json();
        if (frameData.frame) {
          setCurrentFrame(frameData.frame);
        }

        // Get current stats
        const statsResponse = await fetch(`${apiBaseUrl}/stats`);
        const statsData = await statsResponse.json();
        
        setStats(prevStats => {
          // Call callbacks if count or stage changed
          if (onCountUpdate && prevStats.count !== statsData.count) {
            onCountUpdate(statsData.count);
          }
          if (onStageChange && prevStats.stage !== statsData.stage) {
            onStageChange(statsData.stage);
          }
          
          return statsData;
        });
        
      } catch (err) {
        console.error('Polling error:', err);
        setError('Connection lost - check if Python API is running');
      }
    }, 100); // Poll every 100ms for smooth updates
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Stop recording on unmount
      if (isRecording) {
        fetch(`${apiBaseUrl}/stop`, { method: 'POST' });
      }
    };
  }, [isRecording, apiBaseUrl]);

  return (
    <div style={defaultStyles.container}>
      {/* Video Section */}
      <div style={defaultStyles.videoSection}>
        <div style={defaultStyles.videoContainer}>
          {currentFrame ? (
            <img 
              src={currentFrame} 
              alt="Sit-up counter video feed"
              style={defaultStyles.video}
            />
          ) : (
            <div style={defaultStyles.placeholder}>
              {isRecording ? 'Starting camera...' : 'Click "Start Recording" to begin'}
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div style={defaultStyles.controlPanel}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          AI Sit-Up Counter
        </h2>

        {/* Controls */}
        <button 
          onClick={toggleRecording}
          style={{ ...defaultStyles.button, ...defaultStyles.recordButton }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        <button 
          onClick={resetCounter}
          style={{ ...defaultStyles.button, ...defaultStyles.resetButton }}
        >
          Reset Counter
        </button>

        {/* Error display */}
        {error && (
          <div style={defaultStyles.error}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div style={defaultStyles.statsSection}>
          <h3>Statistics</h3>
          
          <div style={defaultStyles.statItem}>
            <div style={defaultStyles.count}>
              {stats.count}
            </div>
            <div style={{ textAlign: 'center', fontSize: '14px' }}>
              Sit-ups Completed
            </div>
          </div>
          
          <div style={defaultStyles.statItem}>
            <div style={defaultStyles.stage}>
              Stage: {stats.stage}
            </div>
          </div>
          
          {stats.angle && (
            <div style={defaultStyles.statItem}>
              <div style={{ fontSize: '14px', color: '#95a5a6' }}>
                Angle: {stats.angle.toFixed(1)}°
              </div>
            </div>
          )}
          
          <div style={defaultStyles.statItem}>
            <div style={{ 
              fontSize: '12px', 
              color: stats.valid_position ? '#27ae60' : '#e74c3c' 
            }}>
              {stats.valid_position ? '✓ Good Position' : '✗ Adjust Position'}
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        <div style={defaultStyles.message}>
          {stats.message}
        </div>
        
        {/* Connection Status */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          fontSize: '12px',
          color: stats.active ? '#27ae60' : '#e74c3c'
        }}>
          Camera: {stats.active ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
};

export default SitUpCounter;

// Usage example:
/*
import SitUpCounter from './SitUpCounter';

function App() {
  const handleCountUpdate = (count) => {
    console.log('Sit-up count:', count);
    // Update your app state, send to database, etc.
  };

  const handleStageChange = (stage) => {
    console.log('Exercise stage:', stage);
    // Provide audio feedback, animations, etc.
  };

  return (
    <div>
      <h1>My Fitness App</h1>
      <SitUpCounter 
        onCountUpdate={handleCountUpdate}
        onStageChange={handleStageChange}
        apiBaseUrl="http://localhost:5000/api"
      />
    </div>
  );
}
*/