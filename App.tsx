import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import Dashboard from './src/screens/Dashboard';

export default function App() {
  // Estado que controla qual tela está visível
  const [currentScreen, setCurrentScreen] = useState<'Home' | 'Dashboard'>('Home');

  // Renderização Condicional
  if (currentScreen === 'Dashboard') {
    return <Dashboard />;
  }

  // Passamos uma função como prop para o HomeScreen poder mudar a tela
  return <HomeScreen onNavigateToDashboard={() => setCurrentScreen('Dashboard')} />;
}