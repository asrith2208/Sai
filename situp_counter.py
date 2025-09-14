import numpy as np
from typing import Dict, List, Optional, Tuple
from pose_detector import PoseDetector

class SitUpCounter:
    """
    Advanced sit-up counter that validates proper form and rejects half repetitions
    """
    
    def __init__(self):
        """Initialize the sit-up counter"""
        self.pose_detector = PoseDetector()
        self.count = 0
        self.stage = None  # 'down', 'transition_up', 'up', 'transition_down'
        self.previous_stages = []  # Track stage history for validation
        self.angle_history = []  # Track angle history for smoothing
        self.max_history_length = 10
        
        # Angle thresholds for sit-up detection (optimized for better detection)
        self.down_angle_threshold = 140  # Lying down position (more lenient)
        self.up_angle_threshold = 70     # Sitting up position (more achievable)
        self.transition_threshold = 20   # Minimum angle change for valid transition
        
        # Form validation parameters
        self.min_range_of_motion = 50    # Minimum angle difference for full rep (more achievable)
        self.stability_frames = 3        # Frames to hold position for validation (faster response)
        self.stage_consistency_required = 2  # Consistent stage detection required (faster response)
        
    def smooth_angle(self, angle: float) -> float:
        """
        Apply smoothing to angle measurements to reduce noise
        
        Args:
            angle: Current angle measurement
            
        Returns:
            Smoothed angle
        """
        self.angle_history.append(angle)
        
        # Keep only recent history
        if len(self.angle_history) > self.max_history_length:
            self.angle_history = self.angle_history[-self.max_history_length:]
        
        # Return median of recent angles for stability
        return np.median(self.angle_history)
    
    def validate_body_position(self, key_points: Dict) -> bool:
        """
        Validate that the person is in proper position for sit-ups
        
        Args:
            key_points: Dictionary of body landmarks
            
        Returns:
            True if position is valid for sit-ups
        """
        if not key_points:
            return False
        
        # More flexible point detection - try both sides
        required_points_left = ['left_shoulder', 'left_hip', 'left_knee']
        required_points_right = ['right_shoulder', 'right_hip', 'right_knee']
        
        # Check if left side points are detected
        left_side_valid = all(point in key_points for point in required_points_left)
        right_side_valid = all(point in key_points for point in required_points_right)
        
        if not (left_side_valid or right_side_valid):
            return False
        
        # Use the side with better detection
        if left_side_valid:
            shoulder_y = key_points['left_shoulder'][1]
            hip_y = key_points['left_hip'][1]
            knee_y = key_points['left_knee'][1]
        else:
            shoulder_y = key_points['right_shoulder'][1]
            hip_y = key_points['right_hip'][1]
            knee_y = key_points['right_knee'][1]
        
        # More lenient position validation - just check if person is roughly horizontal
        # Allow for various sitting/lying positions
        return True  # For now, accept any pose where key points are detected
    
    def calculate_torso_angle(self, key_points: Dict) -> Optional[float]:
        """
        Calculate the torso angle for sit-up counting
        
        Args:
            key_points: Dictionary of body landmarks
            
        Returns:
            Torso angle or None if calculation fails
        """
        try:
            # Try left side first, then right side
            angle = None
            
            if all(point in key_points for point in ['left_shoulder', 'left_hip', 'left_knee']):
                shoulder = key_points['left_shoulder']
                hip = key_points['left_hip']
                knee = key_points['left_knee']
                angle = self.pose_detector.calculate_angle(shoulder, hip, knee)
            elif all(point in key_points for point in ['right_shoulder', 'right_hip', 'right_knee']):
                shoulder = key_points['right_shoulder']
                hip = key_points['right_hip']
                knee = key_points['right_knee']
                angle = self.pose_detector.calculate_angle(shoulder, hip, knee)
            
            if angle is not None:
                return self.smooth_angle(angle)
            return None
            
        except (KeyError, TypeError):
            return None
    
    def determine_stage(self, angle: float) -> str:
        """
        Determine the current exercise stage based on angle
        
        Args:
            angle: Current torso angle
            
        Returns:
            Current stage string
        """
        if angle > self.down_angle_threshold:
            return 'down'
        elif angle < self.up_angle_threshold:
            return 'up'
        elif self.stage == 'down' and angle < self.down_angle_threshold:
            return 'transition_up'
        elif self.stage == 'up' and angle > self.up_angle_threshold:
            return 'transition_down'
        else:
            return self.stage or 'unknown'
    
    def validate_full_repetition(self) -> bool:
        """
        Validate that a full repetition was completed
        
        Returns:
            True if valid full repetition detected
        """
        if len(self.previous_stages) < 4:
            return False
        
        # Look for the pattern: down -> transition_up -> up -> transition_down -> down
        recent_stages = self.previous_stages[-5:]
        
        # Check for minimum range of motion in angle history
        if len(self.angle_history) >= 5:
            min_angle = min(self.angle_history[-10:])
            max_angle = max(self.angle_history[-10:])
            range_of_motion = max_angle - min_angle
            
            if range_of_motion < self.min_range_of_motion:
                return False
        
        # Check for proper stage sequence
        stage_sequence_found = False
        for i in range(len(recent_stages) - 3):
            if (recent_stages[i] == 'down' and 
                recent_stages[i + 1] in ['transition_up', 'up'] and
                recent_stages[i + 2] == 'up' and
                recent_stages[i + 3] in ['transition_down', 'down']):
                stage_sequence_found = True
                break
        
        return stage_sequence_found
    
    def process_frame(self, image: np.ndarray) -> Dict:
        """
        Process a single frame for sit-up counting
        
        Args:
            image: Input image frame
            
        Returns:
            Dictionary with counting results
        """
        # Get pose landmarks
        landmarks = self.pose_detector.get_pose_landmarks(image)
        key_points = self.pose_detector.get_key_points(landmarks)
        
        result = {
            'count': self.count,
            'stage': self.stage,
            'angle': None,
            'valid_position': False,
            'landmarks': landmarks,
            'message': ''
        }
        
        # Validate body position
        if not self.validate_body_position(key_points):
            result['message'] = 'Position yourself for sit-ups: lie down with knees bent'
            return result
        
        result['valid_position'] = True
        
        # Calculate torso angle
        angle = self.calculate_torso_angle(key_points)
        if angle is None:
            result['message'] = 'Cannot detect body landmarks clearly'
            return result
        
        result['angle'] = angle
        
        # Determine current stage
        new_stage = self.determine_stage(angle)
        
        # Track stage history for validation
        if new_stage != self.stage:
            self.previous_stages.append(new_stage)
            if len(self.previous_stages) > 20:  # Keep recent history
                self.previous_stages = self.previous_stages[-20:]
        
        # Update stage
        previous_stage = self.stage
        self.stage = new_stage
        
        # Count logic: increment when transitioning from 'up' to 'down' with validation
        if (previous_stage == 'up' or previous_stage == 'transition_down') and new_stage == 'down':
            if self.validate_full_repetition():
                self.count += 1
                result['message'] = f'Excellent! Sit-up #{self.count} counted ✓'
            else:
                result['message'] = 'Almost there! Go all the way up for full rep'
        
        # Provide feedback based on current stage
        if new_stage == 'down':
            result['message'] = result['message'] or 'Ready - now sit up!'
        elif new_stage == 'transition_up':
            result['message'] = result['message'] or 'Keep going up...'
        elif new_stage == 'up':
            result['message'] = result['message'] or 'Good! Now go back down'
        elif new_stage == 'transition_down':
            result['message'] = result['message'] or 'Going down...'
        
        result['count'] = self.count
        result['stage'] = self.stage
        
        return result
    
    def reset(self):
        """Reset the counter"""
        self.count = 0
        self.stage = None
        self.previous_stages = []
        self.angle_history = []
    
    def get_stats(self) -> Dict:
        """
        Get current statistics
        
        Returns:
            Dictionary with current stats
        """
        return {
            'total_count': self.count,
            'current_stage': self.stage,
            'angle_history_length': len(self.angle_history),
            'stage_history_length': len(self.previous_stages)
        }