## verifying context
Please read the following project requirements from AI_CONTEXT.md and confirm you understand the architecture before we start. 

[PASTE THE CONTENT OF YOUR AI_CONTEXT.MD HERE]

If you understand the objective, the 4 biomedical parameters, the tech stack (React Native, Expo, TypeScript, Zustand, react-native-ble-plx), and the strict folder structure, please provide a 3-sentence summary of your role. Do not generate any code yet.

## mocks about biometrics params
We need to build the visual foundation of the app to test the UI layout. Please generate two files. First, src/store/useAppStore.ts using Zustand to store heart rate, temperature, connection status, and active alerts. Second, src/screens/Dashboard.tsx to display these metrics beautifully with basic Tailwind/NativeWind or standard StyleSheet, including a visual alert badge that turns red if an anomaly is detected. Use mock intervals inside the component to simulate changing numbers so I can test the UI right away.