// constants/theme.js - SAI (Sports Authority of India) Theme Configuration

// SAI Official Color Palette
export const SAI_COLORS = {
  // Primary Colors
  orange: '#FF6B35',      // SAI Primary Orange
  blue: '#1E40AF',        // SAI Deep Blue  
  green: '#059669',       // SAI Success Green
  white: '#FFFFFF',       // Pure White
  
  // Secondary Colors
  lightOrange: '#FFF4F1',  // Light Orange Background
  lightBlue: '#EFF6FF',    // Light Blue Background
  lightGreen: '#ECFDF5',   // Light Green Background
  
  // Neutral Colors
  dark: '#1F2937',         // Dark Text
  gray: '#6B7280',         // Secondary Text
  lightGray: '#F9FAFB',    // Background
  border: '#E5E7EB',       // Border Color
  
  // Status Colors
  success: '#10B981',      // Success Green
  warning: '#F59E0B',      // Warning Amber
  error: '#EF4444',        // Error Red
  info: '#3B82F6',         // Info Blue
  purple: '#8B5CF6',       // Purple
};

// SAI Theme Object
export const SAI_THEME = {
  colors: SAI_COLORS,
  
  // Typography
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    }
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  // Border Radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// SAI Sports Categories
export const SAI_SPORTS = {
  athletics: {
    name: 'Athletics',
    icon: 'fitness',
    color: SAI_COLORS.orange,
    subcategories: ['100m Sprint', '200m Sprint', '400m Sprint', 'Long Jump', 'High Jump', 'Shot Put', 'Javelin', 'Marathon']
  },
  football: {
    name: 'Football',
    icon: 'football',
    color: SAI_COLORS.green,
    subcategories: ['Ball Control', 'Dribbling', 'Shooting', 'Passing', 'Goalkeeping']
  },
  cricket: {
    name: 'Cricket',
    icon: 'baseball',
    color: SAI_COLORS.blue,
    subcategories: ['Batting', 'Bowling', 'Fielding', 'Wicket Keeping']
  },
  badminton: {
    name: 'Badminton',
    icon: 'tennisball',
    color: SAI_COLORS.orange,
    subcategories: ['Singles', 'Doubles', 'Smash', 'Drop Shot', 'Clear']
  },
  basketball: {
    name: 'Basketball',
    icon: 'basketball',
    color: SAI_COLORS.green,
    subcategories: ['Shooting', 'Dribbling', 'Passing', 'Rebounding', 'Defense']
  },
  swimming: {
    name: 'Swimming',
    icon: 'water',
    color: SAI_COLORS.blue,
    subcategories: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly']
  },
  hockey: {
    name: 'Hockey',
    icon: 'american-football',
    color: SAI_COLORS.orange,
    subcategories: ['Stick Work', 'Dribbling', 'Shooting', 'Passing', 'Goalkeeping']
  },
  tennis: {
    name: 'Tennis',
    icon: 'tennisball',
    color: SAI_COLORS.green,
    subcategories: ['Forehand', 'Backhand', 'Serve', 'Volley', 'Return']
  },
  boxing: {
    name: 'Boxing',
    icon: 'fitness',
    color: SAI_COLORS.blue,
    subcategories: ['Jab', 'Cross', 'Hook', 'Uppercut', 'Defense', 'Footwork']
  },
  wrestling: {
    name: 'Wrestling',
    icon: 'fitness',
    color: SAI_COLORS.orange,
    subcategories: ['Takedown', 'Grappling', 'Pin', 'Escape', 'Reversal']
  }
};

// SAI Performance Grades
export const SAI_GRADES = {
  EXCELLENT: { grade: 'A+', color: SAI_COLORS.success, range: [90, 100], description: 'Exceptional Performance' },
  VERY_GOOD: { grade: 'A', color: SAI_COLORS.green, range: [80, 89], description: 'Very Good Performance' },
  GOOD: { grade: 'B+', color: SAI_COLORS.blue, range: [70, 79], description: 'Good Performance' },
  SATISFACTORY: { grade: 'B', color: SAI_COLORS.orange, range: [60, 69], description: 'Satisfactory Performance' },
  NEEDS_IMPROVEMENT: { grade: 'C', color: SAI_COLORS.warning, range: [50, 59], description: 'Needs Improvement' },
  POOR: { grade: 'D', color: SAI_COLORS.error, range: [0, 49], description: 'Poor Performance' },
};

// SAI Selection Criteria
export const SAI_SELECTION_CRITERIA = {
  minScore: 75,
  topPerformers: 20,
  ageGroups: {
    junior: { min: 14, max: 18 },
    senior: { min: 19, max: 25 },
    veteran: { min: 26, max: 35 }
  },
  physicalTestRequired: true,
  medicalTestRequired: true,
};

export default SAI_THEME;