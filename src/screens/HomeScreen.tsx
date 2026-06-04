import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';

// 1. A interface para receber a navegação do App.tsx
interface HomeScreenProps {
  onNavigateToDashboard: () => void;
}

// 2. Tipagem simples para o dispositivo simulado
interface Device {
  id: string;
  name: string;
  signalStrength: number;
}

export default function HomeScreen({ onNavigateToDashboard }: HomeScreenProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanStatus, setScanStatus] = useState('');

  // Simula a varredura e encontra o nosso "Sensor IIT"
  const handleScan = () => {
    setIsScanning(true);
    setScanStatus('Scanning for digital twin...');
    setDevices([]); // Limpa a lista

    // Após 1.5 segundos, "encontra" o sensor
    setTimeout(() => {
      setDevices([
        {
          id: '192.168.x.x (Node Server)',
          name: 'IIT_Sensor_Mock',
          signalStrength: 98,
        }
      ]);
      setIsScanning(false);
      setScanStatus('Scan complete');
    }, 1500);
  };

  // Simula a conexão e muda de tela
  const handleConnect = async (deviceId: string) => {
    setIsConnecting(true);
    
    // Simula um atraso de conexão de 1 segundo
    setTimeout(() => {
      setIsConnecting(false);
      onNavigateToDashboard(); // Vai para o Dashboard!
    }, 1000);
  };

  const renderDeviceItem = (device: Device) => {
    const isTargetDevice = device.name?.includes('IIT');
    
    return (
      <View style={styles.deviceCard} key={device.id}>
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <Text style={[styles.deviceName, isTargetDevice && styles.highlightedName]}>
              {device.name}
            </Text>
            <Text style={styles.deviceId}>ID: {device.id}</Text>
            {isTargetDevice && (
              <View style={styles.targetBadge}>
                <Text style={styles.targetText}>✓ TARGET DEVICE</Text>
              </View>
            )}
          </View>
          <Text style={styles.signalStrength}>Signal: {device.signalStrength}%</Text>
        </View>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={() => handleConnect(device.id)}
          disabled={isConnecting}
        >
          <Text style={styles.connectButtonText}>
            {isConnecting ? 'Connecting...' : 'Connect to Server'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sensor Scanner</Text>
        <View style={styles.scanStatusBadge}>
          {isScanning ? (
            <>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.statusText}>{scanStatus}</Text>
            </>
          ) : (
            <Text style={styles.statusText}>{scanStatus || 'Ready to scan'}</Text>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleScan}
          title="Scan for Sensors"
          color="#007AFF"
          disabled={isScanning}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.devicesList}
        showsVerticalScrollIndicator={false}
      >
        {devices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No sensors detected yet. Press "Scan for Sensors" to start.
            </Text>
          </View>
        ) : (
          devices.map(device => renderDeviceItem(device))
        )}
      </ScrollView>
    </View>
  );
}

// Styles (Matching Dashboard theme - Light with blue accents)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scanStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8,
    fontWeight: '600',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  devicesList: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    padding: 20,
  },
  deviceCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  highlightedName: {
    color: '#007AFF',
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  signalStrength: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  targetBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  targetText: {
    fontSize: 10,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});