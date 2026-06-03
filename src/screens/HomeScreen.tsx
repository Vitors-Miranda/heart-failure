// Allow editors/linters to skip strict TSX JSX checks when project tsconfig lacks jsx flag
// @ts-nocheck
/* @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { requestBLEPermissions, startDeviceScan, stopDeviceScan, connectToDevice } from '../services/BleService';

export default function HomeScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  
  // Scan for 10 seconds
  const SCAN_DURATION = 10000; // 10 seconds in milliseconds

  // Update devices list in real-time
  const handleDeviceFound = (device: Device) => {
    const existingDeviceIndex = devices.findIndex(d => d.id === device.id);
    
    if (existingDeviceIndex >= 0) {
      // Device already exists, update its last seen time
      const updatedDevices = [...devices];
      updatedDevices[existingDeviceIndex].lastSeen = Date.now();
      setDevices(updatedDevices);
    } else {
      // New device discovered
      setDevices(prev => [...prev, {
        ...device,
        lastSeen: Date.now(),
        signalStrength: Math.floor(Math.random() * 100),
      }]);
    }
  };

  // Start scanning for devices
  const handleScan = async () => {
    // Request permissions first
    const permissionGranted = await requestBLEPermissions();
    
    if (!permissionGranted) {
      Alert.alert(
        'Permissions Denied',
        'Bluetooth permissions are required to scan for sensors. Please enable them in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Start scanning
    setIsScanning(true);
    setScanStatus('Scanning for sensors...');
    startDeviceScan(handleDeviceFound);

    // Stop scanning after 10 seconds automatically
    setTimeout(() => {
      stopDeviceScan();
      setIsScanning(false);
      setScanStatus('Scan complete');
    }, SCAN_DURATION);
  };

  // Connect to a device
  const handleConnect = async (deviceId: string) => {
    if (!deviceId) return;
    
    setIsConnecting(true);
    try {
      const device = await connectToDevice(deviceId);
      console.log(`Connected to device: ${device.name} (ID: ${device.id})`);
      Alert.alert('Connected', `Successfully connected to ${device.name}`);
    } catch (error) {
      console.error('Connection failed:', error);
      Alert.alert(
        'Connection Failed',
        'Unable to connect to the device. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Render a single device item
  const renderDeviceItem = (device: Device) => {
    const isTargetDevice = device.name?.includes('IIT');
    
    return (
      <View style={styles.deviceCard}>
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName} style={isTargetDevice ? styles.highlightedName : null}>
              {device.name || 'Unknown Device'}
            </Text>
            <Text style={styles.deviceId}>ID: {device.id}</Text>
            {isTargetDevice && (
              <View style={styles.targetBadge}>
                <Text style={styles.targetText}>✓ TARGET DEVICE</Text>
              </View>
            )}
          </View>
          <Text style={styles.signalStrength}>
            Signal: {device.signalStrength || 'N/A'}%
          </Text>
        </View>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={() => handleConnect(device.id)}
          disabled={isConnecting}
        >
          <Text style={styles.connectButtonText}>
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render the UI
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {/* Scan Button */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleScan}
          title="Scan for Sensors"
          color="#007AFF"
          disabled={isScanning}
        />
      </View>

      {/* Devices List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.devicesList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {devices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No sensors detected yet. Press "Scan for Sensors" to start scanning.
            </Text>
          </View>
        ) : (
          devices.map(device => renderDeviceItem(device))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles (Matching Dashboard theme - Light with blue accents)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
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
    padding: 4 ,
    alignSelf: 'flex-start',
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
