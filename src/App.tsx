import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RoadmapRecommendationsModal } from './components/RoadmapRecommendationsModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { SolverPage } from './pages/SolverPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { StaticPages } from './pages/StaticPages';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadingInitialUser, setLoadingInitialUser] = useState(true);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial profile
  useEffect(() => {
    async function loadInitialProfile() {
      try {
        const res = await api.getProfile();
        if (res.success && res.profile) {
          setUser(res.profile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInitialUser(false);
      }
    }
    loadInitialProfile();
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = (_token: string, newUser: any) => {
    if (newUser) {
      setUser((prev) => (prev ? { ...prev, ...newUser } : newUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/auth/login');
  };

  // Route matching parser
  const renderContent = () => {
    // Normalization: strip trailing slash if not root
    const path = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');

    // 1. Landing Page
    if (path === '/') {
      return <LandingPage navigate={navigate} />;
    }

    // 2. Auth Routes (/auth/login, /auth/register, /auth/forgot-password)
    if (path === '/auth/login' || path === '/login') {
      return <AuthPage mode="login" navigate={navigate} onAuthSuccess={handleAuthSuccess} />;
    }
    if (path === '/auth/register' || path === '/register') {
      return <AuthPage mode="register" navigate={navigate} onAuthSuccess={handleAuthSuccess} />;
    }
    if (path === '/auth/forgot-password' || path === '/forgot-password') {
      return <AuthPage mode="forgot-password" navigate={navigate} onAuthSuccess={handleAuthSuccess} />;
    }

    // 3. Static Pages (/static-pages/about, /static-pages/faq, /static-pages/legal)
    if (path.startsWith('/static-pages')) {
      if (path.includes('/faq')) return <StaticPages page="faq" navigate={navigate} />;
      if (path.includes('/legal')) return <StaticPages page="legal" navigate={navigate} />;
      return <StaticPages page="about" navigate={navigate} />;
    }

    // 4. Solver Routes:
    // /solver/upload, /solver/crop, /solver/result/:solutionId
    // or /dashboard/solver/...
    if (path.includes('/solver')) {
      if (path.includes('/crop')) {
        return <SolverPage subRoute="crop" navigate={navigate} />;
      }
      if (path.includes('/result')) {
        const parts = path.split('/result/');
        const solutionId = parts[1];
        return <SolverPage subRoute="result" solutionIdParam={solutionId} navigate={navigate} />;
      }
      return <SolverPage subRoute="upload" navigate={navigate} />;
    }

    // 5. History Routes:
    // /history, /history/saved-questions, /history/wrong-answers
    // or /dashboard/history/...
    if (path.includes('/history')) {
      if (path.includes('/saved-questions')) {
        return <HistoryPage subTab="saved" navigate={navigate} user={user} />;
      }
      if (path.includes('/wrong-answers')) {
        return <HistoryPage subTab="wrong" navigate={navigate} user={user} />;
      }
      return <HistoryPage subTab="all" navigate={navigate} user={user} />;
    }

    // 6. Profile & Settings Routes:
    // /dashboard/profile, /profile, /dashboard/profile/settings, /profile/settings
    if (path.includes('/profile')) {
      const isSettings = path.includes('/settings');
      return user ? (
        <ProfilePage
          user={user}
          subTab={isSettings ? 'settings' : 'overview'}
          navigate={navigate}
          onProfileUpdated={(updated) => setUser(updated)}
        />
      ) : (
        <AuthPage mode="login" navigate={navigate} onAuthSuccess={handleAuthSuccess} />
      );
    }

    // 7. Courses Routes:
    // /courses, /courses/:courseId, /courses/:courseId/topics, /courses/:courseId/mock-exams, /courses/:courseId/past-papers
    // or /dashboard/courses/...
    if (path.includes('/courses')) {
      const cleanCoursesPath = path.replace(/^\/dashboard/, '');
      const parts = cleanCoursesPath.split('/').filter(Boolean); // ['courses', 'mat101', 'topics']

      const courseId = parts[1];
      const subTab = (parts[2] as 'topics' | 'mock-exams' | 'past-papers') || 'topics';

      return (
        <CoursesPage
          courseIdParam={courseId}
          subTabParam={subTab}
          navigate={navigate}
        />
      );
    }

    // 8. Dashboard (/dashboard)
    if (path === '/dashboard') {
      return user ? (
        <DashboardPage
          user={user}
          navigate={navigate}
          onUserUpdated={(updated) => setUser(updated)}
        />
      ) : (
        <AuthPage mode="login" navigate={navigate} onAuthSuccess={handleAuthSuccess} />
      );
    }

    // Default Fallback
    return <LandingPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        user={user}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer navigate={navigate} />

      {/* Navigation Drawer (Sliding Menu) */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPath={currentPath}
        navigate={navigate}
        user={user}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onLogout={handleLogout}
      />

      {/* Roadmap & Architectural Recommendations Drawer/Modal */}
      <RoadmapRecommendationsModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />
    </div>
  );
}
