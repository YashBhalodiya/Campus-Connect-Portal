import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { isAuthenticated } from './lib/auth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import CreateAnnouncementPage from './pages/CreateAnnouncementPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import CreateResourcePage from './pages/CreateResourcePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Main app routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Announcements */}
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="announcements/new" element={
            <ProtectedRoute>
              <CreateAnnouncementPage />
            </ProtectedRoute>
          } />
          <Route path="announcements/:id" element={<AnnouncementDetailPage />} />
          
          {/* Events */}
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          
          {/* Resources */}
          <Route path="resources" element={
            <ProtectedRoute>
              <ResourcesPage />
            </ProtectedRoute>
          } />
          <Route path="resources/new" element={
            <ProtectedRoute>
              <CreateResourcePage />
            </ProtectedRoute>
          } />
          <Route path="resources/:id" element={
            <ProtectedRoute>
              <ResourceDetailPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;