/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { Toaster, toast } from 'sonner';
import { pageview, GA_TRACKING_ID } from "./lib/analytics";
import { useThemeStore } from "./store/themeStore";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AnimatePresence } from "framer-motion";
import { GlobalLoader } from "./components/ui/GlobalLoader";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages for performance (Code Splitting)
const HomePage = lazy(() => import("./pages/HomePage").then(module => ({ default: module.HomePage })));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage").then(module => ({ default: module.SubjectsPage })));
const SubjectPage = lazy(() => import("./pages/SubjectPage").then(module => ({ default: module.SubjectPage })));
const AiTutorPage = lazy(() => import("./pages/AiTutorPage").then(module => ({ default: module.AiTutorPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(module => ({ default: module.AboutPage })));
const PracticePage = lazy(() => import("./pages/PracticePage").then(module => ({ default: module.PracticePage })));
const ModelTestsPage = lazy(() => import("./pages/ModelTestsPage").then(module => ({ default: module.ModelTestsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(module => ({ default: module.ContactPage })));
const ProgressPage = lazy(() => import("./pages/ProgressPage").then(module => ({ default: module.ProgressPage })));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage").then(module => ({ default: module.BookmarksPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(module => ({ default: module.NotFoundPage })));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
  </div>
);

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
      <div className="flex min-h-[100dvh] flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <GlobalLoader isLoading={isInitialLoad} />
        <Toaster position="bottom-center" />
        <AnalyticsTracker />
        <Navbar />
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
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
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        {location.pathname !== '/tutor' && <Footer />}
      </div>
    </ThemeProvider>
  );
}
