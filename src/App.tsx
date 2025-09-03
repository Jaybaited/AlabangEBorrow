import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;