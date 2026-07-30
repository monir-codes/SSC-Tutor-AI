import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, BrainCircuit, Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/themeStore";

const mainNavLinks = [
  { name: "Home", path: "/" },
  { name: "Practice", path: "/practice" },
  { name: "Model Tests", path: "/model-tests" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const subjectGroups = {
  science: {
    title: "Science",
    icon: "📘",
    items: [
      { name: "Mathematics", path: "/subjects/math" },
      { name: "Higher Mathematics", path: "/subjects/higher-math" },
      { name: "Physics", path: "/subjects/physics" },
      { name: "Chemistry", path: "/subjects/chemistry" },
      { name: "Biology", path: "/subjects/biology" },
    ],
  },
  humanities: {
    title: "Humanities (Arts)",
    icon: "📙",
    items: [
      { name: "Bangla", path: "/subjects/bangla" },
      { name: "English", path: "/subjects/english" },
      { name: "History", path: "/subjects/history" },
      { name: "Geography", path: "/subjects/geography" },
      { name: "Civics", path: "/subjects/civics" },
      { name: "Economics", path: "/subjects/economics" },
      { name: "ICT", path: "/subjects/ict" },
      { name: "Religion", path: "/subjects/religion" },
    ],
  },
  commerce: {
    title: "Business Studies (Commerce)",
    icon: "📗",
    items: [
      { name: "Accounting", path: "/subjects/accounting" },
      { name: "Finance & Banking", path: "/subjects/finance" },
      { name: "Business Entrepreneurship", path: "/subjects/entrepreneurship" },
      { name: "ICT", path: "/subjects/ict" },
      { name: "Bangla", path: "/subjects/bangla" },
      { name: "English", path: "/subjects/english" },
      { name: "Mathematics", path: "/subjects/math" },
      { name: "Religion", path: "/subjects/religion" },
    ],
  },
};

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubjectsOpen, setMobileSubjectsOpen] = useState(false);
  const [expandedStream, setExpandedStream] = useState<string | null>(null);
  const { theme, setTheme } = useThemeStore();

  // Resolve actual theme (light or dark)
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const cycleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileSubjectsOpen(false);
    setExpandedStream(null);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleStream = (streamKey: string) => {
    setExpandedStream((prev) => (prev === streamKey ? null : streamKey));
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-2xl dark:bg-slate-950/80 dark:border-slate-800/50 transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl hover:scale-[1.05] active:scale-[0.98] transition-transform"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              SSC Tutor AI
            </span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm",
                location.pathname === "/"
                  ? "text-primary-600"
                  : "text-slate-600 dark:text-slate-300 dark:hover:text-primary-400",
              )}
            >
              Home
            </Link>

            {/* Subjects Dropdown */}
            <div className="group relative">
              <button
                className={cn(
                  "flex items-center text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm py-2",
                  location.pathname.startsWith("/subjects")
                    ? "text-primary-600"
                    : "text-slate-600 dark:text-slate-300 dark:hover:text-primary-400",
                )}
              >
                Subjects
                <svg
                  className="ml-1 h-4 w-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div className="absolute left-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 py-2">
                  {Object.entries(subjectGroups).map(([key, group]) => (
                    <div key={key} className="group/nested relative">
                      <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                        <span>
                          {group.icon} {group.title}
                        </span>
                        <svg
                          className="h-4 w-4 text-slate-400 group-hover/nested:text-primary-500 transition-transform group-hover/nested:-rotate-90"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Nested Dropdown */}
                      <div className="absolute left-full top-0 ml-2 w-64 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-200 ease-in-out">
                        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 py-2">
                          <div className="px-4 py-2 border-b border-slate-100 mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {group.icon} {group.title} Subjects
                            </span>
                          </div>
                          {group.items.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <Link
                      to="/subjects"
                      className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-slate-50 transition-colors flex items-center"
                    >
                      View All Subjects
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {mainNavLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-sm",
                  location.pathname === link.path
                    ? "text-primary-600"
                    : "text-slate-600 dark:text-slate-300 dark:hover:text-primary-400",
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={cycleTheme}
              aria-label="Toggle theme"
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="dark"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="light"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-slate-200 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <span className="font-sans text-lg font-bold text-slate-900 dark:text-white">
                  Navigation
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={cycleTheme}
                    aria-label="Toggle theme"
                    className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isDark ? (
                        <motion.div
                          key="dark-mobile"
                          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Moon className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="light-mobile"
                          initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Sun className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close Menu"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col px-6 py-8 space-y-2">
                <Link
                  to="/"
                  className={cn(
                    "group flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
                    location.pathname === "/"
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <span
                    className={cn(
                      "transition-transform duration-200",
                      location.pathname === "/"
                        ? "translate-x-2"
                        : "group-hover:translate-x-2",
                    )}
                  >
                    Home
                  </span>
                </Link>

                {/* Mobile Subjects Accordion */}
                <div>
                  <button
                    onClick={() => setMobileSubjectsOpen(!mobileSubjectsOpen)}
                    className={cn(
                      "w-full group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
                      location.pathname.startsWith("/subjects")
                        ? "bg-primary-50 text-primary-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <span
                      className={cn(
                        "transition-transform duration-200",
                        location.pathname.startsWith("/subjects")
                          ? "translate-x-2"
                          : "group-hover:translate-x-2",
                      )}
                    >
                      Subjects
                    </span>
                    <svg
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        mobileSubjectsOpen ? "rotate-180" : "",
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {mobileSubjectsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pr-2 pt-2 pb-2 space-y-2 border-l-2 border-slate-100 ml-4 mt-1">
                          {Object.entries(subjectGroups).map(([key, group]) => (
                            <div key={key}>
                              <button
                                onClick={() => toggleStream(key)}
                                className="w-full flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                              >
                                <span>
                                  {group.icon} {group.title}
                                </span>
                                <svg
                                  className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    expandedStream === key ? "rotate-180" : "",
                                  )}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>

                              <AnimatePresence>
                                {expandedStream === key && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-4 py-2 space-y-1">
                                      {group.items.map((item) => (
                                        <Link
                                          key={item.name}
                                          to={item.path}
                                          className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                        >
                                          {item.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                          <Link
                            to="/subjects"
                            className="block rounded-lg px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors mt-2"
                          >
                            View All Subjects &rarr;
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {mainNavLinks.slice(1).map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={cn(
                        "group flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <span
                        className={cn(
                          "transition-transform duration-200",
                          isActive
                            ? "translate-x-2"
                            : "group-hover:translate-x-2",
                        )}
                      >
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
