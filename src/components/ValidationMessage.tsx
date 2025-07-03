import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ValidationMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ type, message, visible }) => {
  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'help-circle';
    }
  };

  const getColor = (): string => {
    switch (type) {
      case 'success':
        return '#66BB6A';
      case 'error':
        return '#FF6B6B';
      case 'warning':
        return '#FFA726';
      case 'info':
        return '#42A5F5';
      default:
        return '#7F8C8D';
    }
  };

  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return '#E8F5E8';
      case 'error':
        return '#FFF5F5';
      case 'warning':
        return '#FFF8E1';
      case 'info':
        return '#E3F2FD';
      default:
        return '#F8F9FA';
    }
  };

  if (!visible || !message) return null;

  const color = getColor();
  const backgroundColor = getBackgroundColor();
  const icon = getIcon();

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor },
        { borderLeftColor: color }
      ]}
    >
      <Ionicons name={icon} size={16} color={color} style={styles.icon} />
      <Text style={[styles.message, { color }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ValidationMessage; 