
import { create } from 'zustand';

// Types for the application state
// Interface defining all metrics we expect from the BLE device
export interface BiometricMetrics {
  heartRateBPM: number | null;     // Beats Per Minute
  temperatureCelsius: number | null; // Degrees Celsius
  movement: number | null;          // Accelometer intensity (arbitrary units)
  posture: string | null;           // 'Sitting', 'Standing', 'Lying', etc.
}

// Store State
export interface AppState {
  metrics: BiometricMetrics;
  isConnected: boolean;
  isConnecting: boolean;
  errorMessage: string | null;
  isAnomalyDetected: boolean;      // Simple rule: High HR + Low Movement
}

// Store Actions
type Actions = {
  setMetrics: (newMetrics: BiometricMetrics) => void;
  setConnectionStatus: (status: boolean) => void;
  setConnecting: (status: boolean) => void;
  setError: (message: string) => void;
  clearError: () => void;
  // Derived logic for anomaly detection (High BPM > 100 AND Movement < 5)
  updateAnomalyStatus: () => void;
};

// Create the store
export const useAppStore = create<AppState & Actions>((set, get) => ({
  metrics: {
    heartRateBPM: null,
    temperatureCelsius: null,
    movement: null,
    posture: null,
  },
  isConnected: false,
  isConnecting: false,
  errorMessage: null,
  isAnomalyDetected: false,
  
  // Action: Update metrics from BLE callbacks
  setMetrics: (newMetrics) => set({ metrics: newMetrics }),
  
  // Action: Toggle connection status
  setConnectionStatus: (status) => set({ isConnected: status }),
  
  // Action: Toggle connecting state
  setConnecting: (status) => set({ isConnecting: status }),
  
  // Action: Set error message
  setError: (message) => set({ errorMessage: message }),
  
  // Action: Clear error message
  clearError: () => set({ errorMessage: null }),
  
  // Action: Recalculate anomaly status based on rules
  updateAnomalyStatus: () => {
    const { metrics } = get();
    
    // Rule: If BPM > 100 AND Movement is very low (< 5 units)
    const isHighHeartRate = metrics.heartRateBPM !== null && metrics.heartRateBPM > 100;
    const isLowMovement = metrics.movement !== null && metrics.movement < 5;
    
    const shouldTriggerAlert = isHighHeartRate && isLowMovement;
    
    // Update the state
    set({ isAnomalyDetected: shouldTriggerAlert });
  },
}));