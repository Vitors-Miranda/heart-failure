import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
// Importaremos o Dashboard novamente quando configurarmos a navegação
// import Dashboard from './src/screens/Dashboard';

export default function App() {
  // Por enquanto, vamos renderizar apenas o HomeScreen para testar o scanner BLE
  return <HomeScreen />;
}