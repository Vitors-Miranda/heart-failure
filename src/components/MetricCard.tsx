import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  isWarning?: boolean;
  style?: ViewStyle;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  isWarning = false,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>
        {value} <Text style={{ fontSize: 12 }}>{unit}</Text>
      </Text>
      {isWarning && (
        <Text style={styles.warning}>⚠ High</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  warning: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 5,
  },
});
