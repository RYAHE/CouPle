import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthLevel {
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  color: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (password: string): StrengthLevel => {
    if (!password) {
      return { level: 'weak', color: '#E0E0E0', text: '', icon: 'help-outline' };
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    score += checks.length ? 1 : 0;
    score += checks.lowercase ? 1 : 0;
    score += checks.uppercase ? 1 : 0;
    score += checks.numbers ? 1 : 0;
    score += checks.special ? 1 : 0;

    if (score <= 2) {
      return { level: 'weak', color: '#FF6B6B', text: 'Faible', icon: 'alert-circle' };
    } else if (score <= 3) {
      return { level: 'medium', color: '#FFA726', text: 'Moyen', icon: 'warning' };
    } else if (score <= 4) {
      return { level: 'strong', color: '#66BB6A', text: 'Fort', icon: 'checkmark-circle' };
    } else {
      return { level: 'very-strong', color: '#42A5F5', text: 'Très fort', icon: 'shield-checkmark' };
    }
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        <View style={[styles.bar, { backgroundColor: strength.color }]} />
        <View style={[styles.bar, { backgroundColor: strength.color }]} />
        <View style={[styles.bar, { backgroundColor: strength.color }]} />
        <View style={[styles.bar, { backgroundColor: strength.color }]} />
      </View>
      <View style={styles.textContainer}>
        <Ionicons name={strength.icon} size={16} color={strength.color} />
        <Text style={[styles.strengthText, { color: strength.color }]}>
          {strength.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PasswordStrengthIndicator; 