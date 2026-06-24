import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Skeletons / Components
import ErrorBoundary from './components/ErrorBoundary';
import safeStorage from './services/storage';

// Lazy-loaded pages for optimized bundle sizes
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const JoinCommunity = React.lazy(() => import('./pages/JoinCommunity'));
const Feed = React.lazy(() => import('./pages/Feed'));
const HindiFeed = React.lazy(() => import('./pages/HindiFeed'));
const NearbyIssues = React.lazy(() => import('./pages/NearbyIssues'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const Trending = React.lazy(() => import('./pages/Trending'));
const Profile = React.lazy(() => import('./pages/Profile'));
const PostDetails = React.lazy(() => import('./pages/PostDetails'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

// Guard component: Redirects to onboarding if not signed in
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = safeStorage.getItem('civio_current_user');
  if (!currentUser) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

// Guard component: Redirects to feed if not admin
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUserStr = safeStorage.getItem('civio_current_user');
  if (!currentUserStr) {
    return <Navigate to="/onboarding" replace />;
  }
  try {
    const currentUser = JSON.parse(currentUserStr);
    if (currentUser.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

// Guard component: Redirects to feed if already signed in
const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = safeStorage.getItem('civio_current_user');
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Simple fullscreen route-loading spinner
const RouteLoaderFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center select-none" role="status" aria-live="polite">
      <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<RouteLoaderFallback />}>
            <Routes>
              {/* Onboarding & Registration */}
              <Route
                path="/onboarding"
                element={
                  <GuestGuard>
                    <Onboarding />
                  </GuestGuard>
                }
              />
              <Route
                path="/join"
                element={
                  <GuestGuard>
                    <JoinCommunity />
                  </GuestGuard>
                }
              />

              {/* Protected Civic Social Experience */}
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <Feed />
                  </AuthGuard>
                }
              />
              <Route
                path="/hindi"
                element={
                  <AuthGuard>
                    <HindiFeed />
                  </AuthGuard>
                }
              />
              <Route
                path="/nearby"
                element={
                  <AuthGuard>
                    <NearbyIssues />
                  </AuthGuard>
                }
              />
              <Route
                path="/create"
                element={
                  <AuthGuard>
                    <CreatePost />
                  </AuthGuard>
                }
              />
              <Route
                path="/notifications"
                element={
                  <AuthGuard>
                    <Notifications />
                  </AuthGuard>
                }
              />
              <Route
                path="/trending"
                element={
                  <AuthGuard>
                    <Trending />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                }
              />
              <Route
                path="/post/:id"
                element={
                  <AuthGuard>
                    <PostDetails />
                  </AuthGuard>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;
