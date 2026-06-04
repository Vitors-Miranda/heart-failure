// Allow editors/linters to skip strict TSX JSX checks when project tsconfig lacks jsx flag
// @ts-nocheck
/* @jsxImportSource react */
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet, StatusBar, Platform, ViewStyle } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useSensorStore } from '../store/useSensorStore';
import { MetricCard } from '../components/MetricCard';
import { BiometricMetrics } from '../store/useAppStore';

export default function Dashboard() {
  const {
    metrics,
    isConnected,
    isAnomalyDetected,
    setMetrics,
    setConnectionStatus,
    setAnomalyDetected,
    resetStore,
  } = useSensorStore();

  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = React.useState(false); // Adicione esta linha

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  // Socket.io connection logic
  const handleConnect = () => {
    // Reset store state
    resetStore();
    setConnectionStatus(false);
    setIsConnecting(true); 
    
    const newSocket = io('http://192.168.1.94:3000', {
      transports: ['websocket'],
    });

    // Successful connection
    newSocket.on('connect', () => {
      setConnectionStatus(true);
      setIsConnecting(false); // Desativa o carregamento
    });

    // Packet reception from sensor
    newSocket.on('sensorData', (data: BiometricMetrics) => {
      setMetrics(data);

      if (data.posture === 'Lying down' && data.movement === 1) {
        setAnomalyDetected(true);
      } else {
        setAnomalyDetected(false);
      }
    });

    // Network error handling
    newSocket.on('connect_error', (err) => {
      setConnectionStatus(false);
      setIsConnecting(false); // Desativa o carregamento em caso de erro
      setSocket(null);
      // Opcional: Você pode colocar um Alert.alert('Erro', 'Falha ao conectar') aqui
    });

    setSocket(newSocket);
  };

  // Disconnect logic
  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setConnectionStatus(false);
  };

  // Format metrics values for display
  const formatMetric = (value: number | null | undefined): string => {
    return typeof value === 'number' ? value.toFixed(0) : '--';
  };

  // Format temperature value
  const formatTemperature = (value: number | null | undefined): string => {
    return typeof value === 'number' ? value.toFixed(1) : '--';
  };

  // Format movement value
  const formatMovement = (value: number | null | undefined): string => {
    return typeof value === 'number' ? value.toFixed(1) : '--';
  };

  // Determine if alert card should show warning
  const isAlertWarning = isAnomalyDetected;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Biomedical Monitor</Text>
        <View style={styles.connectionBadge}>
          {isConnected ? (
            <Text style={styles.statusText}>Connected (Wi-Fi)</Text>
          ) : (
            <Text style={styles.statusText}>Disconnected</Text>
          )}
        </View>
      </View>

      {/* Error Message - using errorMessage from store */}
      {/* Note: Store doesn't have errorMessage, keeping it simple */}

      {/* Metrics Grid */}
      <View style={styles.content}>
        {/* Heart Rate Card */}
        <MetricCard
          label="Heart Rate"
          value={formatMetric(metrics.heartRateBPM)}
          unit="BPM"
          isWarning={isAnomalyDetected && metrics.heartRateBPM !== null}
        />

        {/* Temperature Card */}
        <MetricCard
          label="Body Temp"
          value={formatTemperature(metrics.temperatureCelsius)}
          unit="°C"
        />

        {/* Movement Card */}
        <MetricCard
          label="Movement"
          value={formatMovement(metrics.movement)}
          unit="Accels"
        />

        {/* Alert Area */}
        <View
          style={[
            styles.alertCard,
            {
              backgroundColor: isAlertWarning ? '#ffcdd2' : '#e8f5e9',
              borderColor: isAlertWarning ? '#ffcdd2' : '#e8f5e9',
            },
          ]}
        >
          <Text
            style={[
              styles.alertText,
              { color: isAlertWarning ? '#c62828' : '#2e7d32' },
            ]}
          >
            {isAlertWarning
              ? "Alert: Possible Fall / Stress"
              : "Status: Normal"}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.footer}>
        {!isConnected ? (
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonLabel}>Simulate Hardware Connection</Text>
            <Button
              onPress={handleConnect}
              title={isConnecting ? "Connecting..." : "Connect Device"}
              color="#007AFF"
              disabled={isConnecting}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Text style={styles.footerText}>Receiving live data via WebSocket.</Text>
            <View style={{ marginTop: 10 }}>
              <Button
                onPress={handleDisconnect}
                title="Disconnect"
                color="#FF3B30"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// Styles (Simple and Dark Theme)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 20 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  connectionBadge: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#eee',
  },
  statusText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
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
  alertCard: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  alertText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonLabel: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ffcdd2',
    borderWidth: 1,
  },
  errorText: {
    color: '#c62828',
    fontWeight: '600',
  },
});
