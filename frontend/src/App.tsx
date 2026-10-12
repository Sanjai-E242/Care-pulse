import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { ObservationsPage } from './pages/ObservationsPage';
import { ObservationCapturePage } from './pages/ObservationCapturePage';
import { HandoverPage } from './pages/HandoverPage';
import { BurnoutPage } from './pages/BurnoutPage';
import { FamilyPage } from './pages/FamilyPage';
import { GuidancePage } from './pages/GuidancePage';
import { TasksPage } from './pages/TasksPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-xs font-bold text-teal-600 animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/observations" element={<ObservationsPage />} />
            <Route path="/observations/new" element={<ObservationCapturePage />} />
            <Route path="/handover" element={<HandoverPage />} />
            <Route path="/burnout" element={<BurnoutPage />} />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/guidance" element={<GuidancePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;