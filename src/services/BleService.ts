/**
 * BleService - Bluetooth Low Energy (BLE) Service
 * * Handles Android BLE runtime permissions and device scanning.
 * Uses strict react-native-ble-plx API.
 */

import { Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from '@digitalshieldfe/react-native-ble-plx';

// Create a singleton instance of the BLE Manager
export const bleManager = new BleManager();

/**
 * Request necessary Android permissions based on the OS version.
 * iOS handles permissions via Info.plist natively.
 */
export async function requestBLEPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  try {
    // For Android 12+ (API 31+)
    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return (
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } 
    // For Android 6.0 to 11 (API 23 - 30)
    else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth scanning requires location permission on this Android version.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Permission request failed:', error);
    return false;
  }
}

/**
 * Scans for BLE devices.
 * Because scanning in ble-plx is continuous, we use a callback to pass 
 * discovered devices back to the UI in real-time.
 * * @param onDeviceFound - Callback fired every time a new device is detected.
 */
export async function startDeviceScan(onDeviceFound: (device: Device) => void): Promise<void> {
  // Ensure BLE is powered on before scanning
  const state = await bleManager.state();
  if (state !== 'PoweredOn') {
    console.warn('Bluetooth is not powered on.');
    return;
  }

  console.log('Starting BLE scan...');
  
  // startDeviceScan parameters: (UUIDs to filter, options, listener callback)
  // Passing null as the first parameter scans for ALL devices. 
  // We filter for "IIT_Sensor" in the callback or UI to ensure we see it during development.
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error('Scan error:', error.message);
      return;
    }

    if (device && device.name) {
      onDeviceFound(device);
    }
  });
}

/**
 * Stop scanning for devices
 */
export function stopDeviceScan(): void {
  console.log('Stopping BLE scan...');
  bleManager.stopDeviceScan();
}

/**
 * Connect to a specific device by its ID
 */
export async function connectToDevice(deviceId: string): Promise<Device> {
  console.log(`Attempting to connect to device ID: ${deviceId}`);
  
  try {
    // 1. Connect
    const device = await bleManager.connectToDevice(deviceId);
    console.log(`Connected to ${device.name}`);

    // 2. Discover all services and characteristics (Required before reading data)
    await device.discoverAllServicesAndCharacteristics();
    console.log('Services and characteristics discovered.');

    return device;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
}

/**
 * Disconnect from a device safely
 */
export async function disconnectFromDevice(deviceId: string): Promise<void> {
  try {
    await bleManager.cancelDeviceConnection(deviceId);
    console.log(`Disconnected from ${deviceId}`);
  } catch (error) {
    console.error('Disconnection failed:', error);
  }
}