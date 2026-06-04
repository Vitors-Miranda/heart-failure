// Allow editors/linters to skip strict TSX JSX checks when project tsconfig lacks jsx flag
// @ts-nocheck
/* @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { io, Socket } from 'socket.io-client';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<{
    heartRateBPM: number | null;
    temperatureCelsius: number | null;
    movement: number | null;
    posture: string | null;
  }>({
    heartRateBPM: null,
    temperatureCelsius: null,
    movement: null,
    posture: null,
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAnomalyDetected, setIsAnomalyDetected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // cleaning
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  // node server connection logic
  const handleConnect = () => {
    // reset
    setMetrics({ heartRateBPM: null, temperatureCelsius: null, movement: null, posture: null });
    setIsAnomalyDetected(false);
    setErrorMessage('');
    setIsConnecting(true);
    
    // connecting to the IP
    const newSocket = io('http://10.110.10.57:3000', {
      transports: ['websocket'], // Força o uso direto de websockets
    });

    // successful connection
    newSocket.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setErrorMessage('');
    });

    // packet reception
    newSocket.on('sensorData', (data) => {
      setMetrics({
        heartRateBPM: data.heartRateBPM,
        temperatureCelsius: data.temperatureCelsius,
        movement: data.movement,
        posture: data.posture,
      });

      // anomaly detection logic (simplified for demo purposes)
      if (data.posture === 'Lying down' && data.movement === 1) {
        setIsAnomalyDetected(true);
      } else {
        setIsAnomalyDetected(false);
      }
    });

    // network error handling
    newSocket.on('connect_error', (err) => {
      setErrorMessage('Erro: Não foi possível ligar ao servidor. Verifique o IP e o Wi-Fi.');
      setIsConnecting(false);
      newSocket.disconnect();
    });

    setSocket(newSocket);
  };

  // disconnect logic
  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsConnected(false);
    setIsConnecting(false);
    setErrorMessage('');
    setIsAnomalyDetected(false);
  };

  // interface rendering
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Biomedical Monitor</Text>
        <View style={styles.connectionBadge}>
          {isConnecting ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.statusText}>{isConnected ? "Connected (Wi-Fi)" : "Disconnected"}</Text>
          )}
        </View>
      </View>

      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Metrics Grid */}
      <View style={styles.content}>
        {/* Heart Rate Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Heart Rate</Text>
          <Text style={styles.cardValue}>
            {metrics.heartRateBPM !== null ? metrics.heartRateBPM.toFixed(0) : '--'} <Text style={{fontSize: 12}}>BPM</Text>
          </Text>
          {isAnomalyDetected && metrics.heartRateBPM !== null && (
             <Text style={styles.warning}>⚠ High</Text>
          )}
        </View>

        {/* Temperature Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Body Temp</Text>
          <Text style={styles.cardValue}>
            {metrics.temperatureCelsius !== null ? metrics.temperatureCelsius.toFixed(1) : '--'} <Text style={{fontSize: 12}}>°C</Text>
          </Text>
        </View>

        {/* Movement Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Movement</Text>
          <Text style={styles.cardValue}>
            {metrics.movement !== null ? metrics.movement.toFixed(1) : '--'} <Text style={{fontSize: 12}}>Accels</Text>
          </Text>
        </View>
        
        {/* Alert Area */}
        <View style={[styles.alertCard, { backgroundColor: isAnomalyDetected ? '#ffcdd2' : '#e8f5e9' }]}>
           <Text style={[styles.alertText, { color: isAnomalyDetected ? '#c62828' : '#2e7d32' }]}>
             {isAnomalyDetected ? "Alert: Possible Fall / Stress" : "Status: Normal"}
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
    borderColor: 'rgba(0,0,0,0.1)'
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