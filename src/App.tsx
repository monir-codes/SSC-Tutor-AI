/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import { pageview, GA_TRACKING_ID } from "./lib/analytics";
import { useThemeStore } from "./store/themeStore";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/HomePage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { SubjectPage } from "./pages/SubjectPage";
import { AiTutorPage } from "./pages/AiTutorPage";
import { AboutPage } from "./pages/AboutPage";
import { PracticePage } from "./pages/PracticePage";
import { ModelTestsPage } from "./pages/ModelTestsPage";
import { ContactPage } from "./pages/ContactPage";
import { ProgressPage } from "./pages/ProgressPage";
import { BookmarksPage } from "./pages/BookmarksPage";
import { AnimatePresence } from "framer-motion";
import { GlobalLoader } from "./components/ui/GlobalLoader";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }
    
    root.classList.add(theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (useThemeStore.getState().theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (GA_TRACKING_ID) {
      pageview(location.pathname + location.search);
    }
  }, [location]);

  return null;
}

export default function App() {
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Simulate initial loading sequence
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      toast.success("You are back online!", { duration: 3000 });
    };
    const handleOffline = () => {
      toast.error("You are offline. Some features may not be available.", { duration: Infinity, id: 'offline-toast' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <GlobalLoader isLoading={isInitialLoad} />
        <Toaster position="bottom-center" />
        <AnalyticsTracker />
        <Navbar />
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:subjectId" element={<SubjectPage />} />
              <Route path="/tutor" element={<AiTutorPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/model-tests" element={<ModelTestsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
