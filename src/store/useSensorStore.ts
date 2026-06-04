import { create } from 'zustand';

// Types for the sensor state
export interface SensorMetrics {
  heartRate: number | null;
  temperature: number | null;
  movement: number | null;
  posture: string | null;
}

// Store State
export interface SensorState {
  metrics: SensorMetrics;
  isConnected: boolean;
  isAnomalyDetected: boolean;
}

// Store Actions
type SensorActions = {
  setMetrics: (newMetrics: SensorMetrics) => void;
  setConnectionStatus: (status: boolean) => void;
  setAnomalyDetected: (status: boolean) => void;
  resetStore: () => void;
};

// Create the store
export const useSensorStore = create<SensorState & SensorActions>((set) => ({
  metrics: {
    heartRate: null,
    temperature: null,
    movement: null,
    posture: null,
  },
  isConnected: false,
  isAnomalyDetected: false,

  // Action: Update sensor metrics from WebSocket/BLE callbacks
  setMetrics: (newMetrics) => set({ metrics: newMetrics }),

  // Action: Toggle connection status
  setConnectionStatus: (status) => set({ isConnected: status }),

  // Action: Update anomaly detection status
  setAnomalyDetected: (status) => set({ isAnomalyDetected: status }),

  // Action: Reset entire store to initial state
  resetStore: () => set({
    metrics: {
      heartRate: null,
      temperature: null,
      movement: null,
      posture: null,
    },
    isConnected: false,
    isAnomalyDetected: false,
  }),
}));
