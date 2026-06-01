# Heart Failure BLE Monitor - IoT Gateway

## Overview
This project was developed for the IoT Exam (A.A. 2025/2026) at the IDA Lab, Università del Salento, in partnership with the Istituto Italiano di Tecnologia (IIT). 

It is a mobile IoT gateway designed to replace traditional hardware USB dongles. The application communicates directly with IIT's multimodal wearable sensors via Bluetooth Low Energy (BLE) to monitor patients with heart failure in real-time, predicting dangerous situations through local anomaly detection.

## Monorepo Structure
The repository is divided into two main environments to separate the mobile application from the hardware simulation:

* `/mobile-app` - The React Native (Expo) application serving as the BLE Gateway.

## Tech Stack
**Mobile Application:**
* React Native (via Expo Custom Dev Client)
* TypeScript
* `react-native-ble-plx` (Bluetooth Native Bridge)
* Zustand (State Management)
* AsyncStorage (Local Persistence)

## Getting Started

### Prerequisites
* Node.js installed on your machine.
* A physical Android device (BLE scanning does not work on standard emulators).
* Expo CLI installed.

## License
This project is developed for academic purposes at Università del Salento.
