import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BrainCircuit,
  Menu,
  X,
  Sun,
  Moon,
  Landmark,
  FileText,
  ChevronDown,
  Sparkles,
  BookOpen,
  GraduationCap,
  Atom,
  BookMarked,
  Briefcase,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/themeStore";

const subjectCategories = [
  {
    title: "বিজ্ঞান বিভাগ (Science)",
    icon: Atom,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    items: [
      { name: "পদার্থবিজ্ঞান (Physics)", code: "136", path: "/subjects/physics" },
      { name: "রসায়ন (Chemistry)", code: "137", path: "/subjects/chemistry" },
      { name: "উচ্চতর গণিত (Higher Math)", code: "126", path: "/subjects/higher-math" },
      { name: "সাধারণ গণিত (General Math)", code: "109", path: "/subjects/math" },
      { name: "জীববিজ্ঞান (Biology)", code: "138", path: "/subjects/biology" },
    ],
  },
  {
    title: "মানবিক বিভাগ (Humanities)",
    icon: BookMarked,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/50",
    items: [
      { name: "বাংলা (1st ও 2nd পত্র)", code: "101", path: "/subjects/bangla" },
      { name: "ইংরেজি (1st ও 2nd পত্র)", code: "107", path: "/subjects/english" },
      { name: "ইতিহাস ও বিশ্বসভ্যতা", code: "153", path: "/subjects/history" },
      { name: "ভূগোল ও পরিবেশ", code: "110", path: "/subjects/geography" },
      { name: "পৌরনীতি ও নাগরিকতা", code: "140", path: "/subjects/civics" },
      { name: "অর্থনীতি (Economics)", code: "141", path: "/subjects/economics" },
    ],
  },
  {
    title: "ব্যবসায় শিক্ষা (Commerce)",
    icon: Briefcase,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    items: [
      { name: "হিসাববিজ্ঞান (Accounting)", code: "146", path: "/subjects/accounting" },
      { name: "ফিন্যান্স ও ব্যাংকিং", code: "152", path: "/subjects/finance" },
      { name: "ব্যবসায় উদ্যোগ", code: "143", path: "/subjects/entrepreneurship" },
      { name: "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", code: "154", path: "/subjects/ict" },
      { name: "ইসলাম ও নৈতিক শিক্ষা", code: "111", path: "/subjects/religion" },
    ],
  },
];

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [mobileSubjectsExpanded, setMobileSubjectsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useThemeStore();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const cycleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Close menus on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSubjectsOpen(false);
  }, [location.pathname, location.search]);

  // Lock scroll on mobile menu open
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

  // Click outside listener for subjects dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSubjectsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Top Utility Strip (Crisp & Responsive) */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] sm:text-xs font-bn py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
            <span className="font-semibold text-slate-200 truncate">
              <span className="hidden sm:inline">গণপ্রজাতন্ত্রী বাংলাদেশ অনুমোদিত এনসিটিবি কারিকুলাম • </span>
              জাতীয় মাধ্যমিক ডিজিটাল পরীক্ষা পোর্টাল
            </span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 shrink-0 text-[10px] sm:text-[11px] whitespace-nowrap">
            <span className="hidden md:inline">10টি শিক্ষা বোর্ড</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden sm:inline">শিক্ষাবর্ষ: 2025–26</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-400 font-bold">সার্ভার সচল 🟢</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:bg-slate-950/95 dark:border-slate-800/90 shadow-xs">
        <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
          
          {/* Logo & Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl shrink-0 min-w-0"
          >
            <div className="relative flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white shadow-sm border border-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-4.5 w-4.5 sm:h-6 sm:w-6 text-emerald-300" />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-[15px] sm:text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                  SSC TUTOR AI
                </span>
                <span className="hidden md:inline-flex bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 font-bn whitespace-nowrap shrink-0">
                  জাতীয় শিক্ষা পোর্টাল
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 font-bn tracking-wide hidden md:inline-block whitespace-nowrap">
                বোর্ড প্রশ্নব্যাংক, টেস্ট পেপার ও এআই ক্লাসরুম
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2 font-bn">
            {/* Home */}
            <Link
              to="/"
              className={cn(
                "text-sm font-bold transition-all py-2 px-3 rounded-xl",
                location.pathname === "/"
                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50"
                  : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-slate-900"
              )}
            >
              হোম
            </Link>

            {/* Subjects Mega-Menu Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
                onMouseEnter={() => setIsSubjectsOpen(true)}
                className={cn(
                  "flex items-center gap-1 text-sm font-bold transition-all py-2 px-3 rounded-xl",
                  location.pathname.startsWith("/subjects")
                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50"
                    : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-slate-900"
                )}
              >
                <span>বিষয়সমূহ</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-400 transition-transform duration-200",
                    isSubjectsOpen && "rotate-180 text-emerald-600"
                  )}
                />
              </button>

              {/* Clean Categorized Mega Menu Dropdown */}
              <AnimatePresence>
                {isSubjectsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    onMouseLeave={() => setIsSubjectsOpen(false)}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[720px] rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5 z-50 font-bn"
                  >
                    <div className="grid grid-cols-3 gap-5">
                      {subjectCategories.map((cat, idx) => {
                        const IconComponent = cat.icon;
                        return (
                          <div key={idx} className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                              <span className={cn("p-1.5 rounded-lg", cat.bg, cat.color)}>
                                <IconComponent className="h-4 w-4" />
                              </span>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {cat.title}
                              </h4>
                            </div>

                            <div className="space-y-1">
                              {cat.items.map((item) => (
                                <Link
                                  key={item.code}
                                  to={item.path}
                                  className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                >
                                  <span className="truncate">{item.name}</span>
                                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-600 font-mono">
                                    {item.code}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        এনসিটিবি সিলেবাস অনুযায়ী সকল বিষয়ের অধ্যায়ভিত্তিক নোট ও সুপার সাজেশন
                      </span>
                      <Link
                        to="/subjects"
                        className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>সকল বিষয় একসাথে &rarr;</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Test Paper & Exam */}
            <Link
              to="/model-tests?mode=test_paper"
              className={cn(
                "text-sm font-bold transition-all py-2 px-3 rounded-xl flex items-center gap-1.5",
                location.pathname.startsWith("/model-tests")
                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50"
                  : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-slate-900"
              )}
            >
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>টেস্ট পেপার ও পরীক্ষা</span>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-extrabold border border-emerald-300 dark:border-emerald-800">
                PDF
              </span>
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={cn(
                "text-sm font-bold transition-all py-2 px-3 rounded-xl",
                location.pathname === "/about"
                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50"
                  : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-slate-900"
              )}
            >
              আমাদের লক্ষ্য
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 font-bn shrink-0">
            {/* Primary Action: AI Tutor */}
            <Link
              to="/tutor"
              className="inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-extrabold px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <BrainCircuit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-200 shrink-0" />
              <span className="hidden sm:inline">এআই শিক্ষক ভাইয়া</span>
              <span className="sm:hidden">এআই শিক্ষক</span>
            </Link>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={cycleTheme}
              aria-label="Toggle theme"
              className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none shrink-0"
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
                    <Moon className="h-4 w-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="light"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4 text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none shrink-0"
            >
              <Menu className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl flex flex-col font-bn"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
                    <GraduationCap className="h-4 w-4 text-emerald-300" />
                  </div>
                  <span className="font-sans text-base font-black text-slate-900 dark:text-white">
                    SSC TUTOR AI
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
                <Link
                  to="/"
                  className="flex items-center justify-between p-3 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <span>হোম</span>
                </Link>

                <Link
                  to="/model-tests?mode=test_paper"
                  className="flex items-center justify-between p-3.5 rounded-xl font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span>টেস্ট পেপার ও পরীক্ষা</span>
                  </span>
                  <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[10px] px-2 py-0.5 rounded font-extrabold">
                    PDF
                  </span>
                </Link>

                <Link
                  to="/tutor"
                  className="flex items-center justify-between p-3.5 rounded-xl font-bold bg-primary-50 dark:bg-primary-950/60 text-primary-800 dark:text-primary-200"
                >
                  <span className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-primary-600" />
                    <span>এআই শিক্ষক ভাইয়া</span>
                  </span>
                </Link>

                {/* Collapsible Subjects in Mobile */}
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setMobileSubjectsExpanded(!mobileSubjectsExpanded)}
                    className="w-full flex items-center justify-between p-3 font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-slate-500" />
                      <span>বিষয়সমূহ ও সাজেশন</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform",
                        mobileSubjectsExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {mobileSubjectsExpanded && (
                    <div className="px-3 pb-3 pt-1 space-y-1 bg-slate-50 dark:bg-slate-900/50">
                      {subjectCategories.flatMap((c) => c.items).map((item) => (
                        <Link
                          key={item.code}
                          to={item.path}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.code}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/about"
                  className="flex items-center justify-between p-3 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <span>আমাদের লক্ষ্য</span>
                </Link>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-100 dark:border-slate-800 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                গণপ্রজাতন্ত্রী বাংলাদেশ অনুমোদিত এনসিটিবি কারিকুলাম
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
