// components/CommonComponents.js - Reusable UI Components
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Theme colors
const colors = {
  primary: '#1f357b',
  secondary: '#10b981',
  accent: '#ff9933',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Custom Button Component
export const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  icon = null, 
  disabled = false,
  style = {},
  textStyle = {} 
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];
    
    if (disabled) {
      baseStyle.push(styles.buttonDisabled);
    } else {
      baseStyle.push(styles[`button_${variant}`]);
    }
    
    baseStyle.push(style);
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`buttonText_${size}`]];
    
    if (disabled) {
      baseStyle.push(styles.buttonTextDisabled);
    } else {
      baseStyle.push(styles[`buttonText_${variant}`]);
    }
    
    baseStyle.push(textStyle);
    return baseStyle;
  };

  return (
    <TouchableOpacity 
      style={getButtonStyle()} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={size === 'large' ? 24 : size === 'small' ? 16 : 20} 
          color={variant === 'primary' || variant === 'secondary' ? '#ffffff' : colors.primary}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

// Card Component
export const Card = ({ children, style = {}, shadow = true }) => {
  return (
    <View style={[styles.card, shadow && styles.cardShadow, style]}>
      {children}
    </View>
  );
};

// Result Card Component
export const ResultCard = ({ result, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return colors.success;
    if (grade.includes('B')) return colors.warning;
    return colors.error;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultTestType}>{result.testType.replace('_', ' ').toUpperCase()}</Text>
            <Text style={styles.resultDate}>{formatDate(result.date)}</Text>
          </View>
          <View style={[styles.gradeChip, { backgroundColor: getGradeColor(result.grade) }]}>
            <Text style={styles.gradeText}>{result.grade}</Text>
          </View>
        </View>
        
        <View style={styles.resultContent}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{result.score}</Text>
            <Text style={styles.scoreUnit}>{result.unit}</Text>
          </View>
          
          {result.feedback && (
            <Text style={styles.resultFeedback} numberOfLines={2}>
              {result.feedback}
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

// Loading Component
export const LoadingSpinner = ({ text = 'Loading...', size = 'large' }) => {
  return (
    <View style={styles.loadingContainer}>
      <Ionicons 
        name="refresh" 
        size={size === 'large' ? 40 : 30} 
        color={colors.primary} 
        style={styles.spinningIcon}
      />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

// Header Component
export const CustomHeader = ({ title, showLogo = false }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Ionicons name="eye" size={24} color="#ffffff" />
          </View>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

// Empty State Component
export const EmptyState = ({ 
  icon = 'document-outline', 
  title = 'No data found', 
  description = 'There\'s nothing to show here yet.',
  actionButton = null 
}) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={64} color={colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDescription}>{description}</Text>
      {actionButton}
    </View>
  );
};

const styles = StyleSheet.create({
  // Button Styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },
  buttonText_primary: {
    color: '#ffffff',
  },
  buttonText_secondary: {
    color: '#ffffff',
  },
  buttonText_outline: {
    color: colors.primary,
  },
  buttonText_ghost: {
    color: colors.primary,
  },
  buttonTextDisabled: {
    color: colors.textSecondary,
  },

  // Card Styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Result Card Styles
  resultCard: {
    marginVertical: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTestType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  resultDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  resultFeedback: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 16,
    fontStyle: 'italic',
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  spinningIcon: {
    // Animation would be added with Animated API if needed
  },

  // Header Styles
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
});

export default { CustomButton, Card, ResultCard, LoadingSpinner, CustomHeader, EmptyState };