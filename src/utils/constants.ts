/**
 * IIT (Istituto Italiano di Tecnologia) BLE Service and Characteristic UUIDs
 * * This file defines the UUIDs used for communication with the heart failure monitoring sensor.
 * The sensor uses a custom BLE service to expose standard health parameters.
 * * Reference: Heart-Failure IoT Monitoring Project - IIT Partnership
 */

// =============================================================================
// IIT BLE SERVICE UUID (Custom Service)
// =============================================================================
export const IIT_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';

// =============================================================================
// CHARACTERISTIC UUIDS (Standard Bluetooth Health Profiles expanded to 128-bit)
// =============================================================================

/**
 * Heart Rate Measurement Characteristic UUID (Standard 0x2A37)
 * * This characteristic contains the patient's real-time heart rate in beats per minute (BPM).
 * The sensor reads from this characteristic to provide BPM data to the app.
 */
export const IIT_BPM_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb';

/**
 * Health Thermometer Characteristic UUID (Standard 0x2A1C)
 * * This characteristic contains the patient's body temperature.
 * The sensor reads from this characteristic to provide temperature data to the app.
 */
export const IIT_TEMP_CHARACTERISTIC_UUID = '00002a1c-0000-1000-8000-00805f9b34fb';

// =============================================================================
// EXPORT OBJECT FOR CONVENIENCE
// =============================================================================
export const IIT_BLE_CONSTANTS = {
  /** Service UUID for discovering the IIT sensor */
  serviceUuid: IIT_SERVICE_UUID,
  
  /** Characteristic UUID for reading heart rate (BPM) */
  bpmCharacteristicUuid: IIT_BPM_CHARACTERISTIC_UUID,
  
  /** Characteristic UUID for reading temperature */
  tempCharacteristicUuid: IIT_TEMP_CHARACTERISTIC_UUID,
};