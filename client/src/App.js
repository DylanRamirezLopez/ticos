import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import LayoutShell from './components/layout/LayoutShell';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import EchoPage from './pages/EchoPage';
import AdminPage from './pages/AdminPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ticos-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-ticos-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <FeedPage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <ExplorePage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <ProfilePage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <ProfilePage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <CreatePostPage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/echo"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <EchoPage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <MessagesPage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <LayoutShell>
                  <SettingsPage />
                </LayoutShell>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <AnimatedRoutes />
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
