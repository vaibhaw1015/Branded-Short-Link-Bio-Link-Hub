import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { LinkAnalytics } from './pages/LinkAnalytics';
import { BioBuilder } from './pages/BioBuilder';
import { PublicBioPage } from './pages/PublicBioPage';
import { Landing } from './pages/Landing';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2 // 2 minutes
    }
  }
});

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Guest Only Route (redirect to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Home: Landing page for guests, Dashboard for logged-in users
const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading...
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Creator Bio Route */}
            <Route path="/bio/:username" element={<PublicBioPage />} />

            {/* Landing Page (home) */}
            <Route path="/" element={<HomeRoute />} />

            {/* Guest Auth Routes */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Authenticated Application Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics/:id" element={<ProtectedRoute><LinkAnalytics /></ProtectedRoute>} />
            <Route path="/bio-builder" element={<ProtectedRoute><BioBuilder /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
