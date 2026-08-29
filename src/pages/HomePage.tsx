import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  BookCheck,
  ShieldCheck,
  Gift,
  Library,
  FileQuestion,
  FileText,
  Unlock,
  Landmark,
  Award,
  ChevronRight
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SEO } from "@/components/SEO";

const popularBoardExams = [
  {
    board: "ঢাকা বোর্ড (Dhaka Board)",
    year: "2024",
    subject: "Physics (পদার্থবিজ্ঞান)",
    subjectId: "physics",
    boardId: "dhaka",
    color: "from-blue-600 to-indigo-600",
    badge: "🔥 Hot",
  },
  {
    board: "রাজশাহী বোর্ড (Rajshahi Board)",
    year: "2023",
    subject: "General Math (সাধারণ গণিত)",
    subjectId: "math",
    boardId: "rajshahi",
    color: "from-emerald-600 to-teal-600",
    badge: "⚡ Most Practiced",
  },
  {
    board: "চট্টগ্রাম বোর্ড (Chittagong Board)",
    year: "2024",
    subject: "Chemistry (রসায়ন)",
    subjectId: "chemistry",
    boardId: "chittagong",
    color: "from-purple-600 to-pink-600",
    badge: "✨ Authentic",
  },
  {
    board: "যশোর বোর্ড (Jessore Board)",
    year: "2023",
    subject: "Higher Math (উচ্চতর গণিত)",
    subjectId: "higher-math",
    boardId: "jessore",
    color: "from-amber-600 to-orange-600",
    badge: "🎯 High Scoring",
  },
  {
    board: "কুমিল্লা বোর্ড (Comilla Board)",
    year: "2024",
    subject: "Biology (জীববিজ্ঞান)",
    subjectId: "biology",
    boardId: "comilla",
    color: "from-rose-600 to-red-600",
    badge: "📘 Full Board Paper",
  },
  {
    board: "দিনাজপুর বোর্ড (Dinajpur Board)",
    year: "2023",
    subject: "Accounting (হিসাববিজ্ঞান)",
    subjectId: "accounting",
    boardId: "dinajpur",
    color: "from-cyan-600 to-blue-600",
    badge: "💼 Commerce",
  },
];

export function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      <SEO
        title="SSC Tutor AI | All-in-One Digital School & Board Exam Bank for Bangladesh"
        description="SSC Tutor AI is a free AI-powered digital academy for SSC candidates in Bangladesh. Practice authentic previous board questions (2018-2024), chapter-wise tests, and get warm, easy-to-understand explanations from your personal AI tutor."
        href="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SSC Tutor AI",
            url: "https://ssc-tutor-ai.vercel.app/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://ssc-tutor-ai.vercel.app/subjects?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "SSC Tutor AI",
            url: "https://ssc-tutor-ai.vercel.app/",
            logo: "https://ssc-tutor-ai.vercel.app/favicon.svg",
            description: "Free AI-powered SSC learning platform for Bangladesh",
            sameAs: ["https://twitter.com/SSCTutorAI"],
          },
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 sm:pt-24 pb-20 sm:pb-32 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl opacity-70"></div>
          <motion.div
            style={{ y: y1 }}
            className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl"
          ></motion.div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto mb-6 sm:mb-8 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-primary-200/60 dark:border-primary-800 bg-primary-50/70 dark:bg-primary-950/60 backdrop-blur-md px-4 sm:px-5 py-2 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs sm:text-sm font-semibold text-primary-700 dark:text-primary-300 font-bn">
                🇧🇩 বাংলাদেশের শিক্ষার্থীদের জন্য ১০০% ফ্রি অল-ইন-ওয়ান ডিজিটাল স্কুল
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="mx-auto max-w-4xl font-bn text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.15]"
            >
              বোর্ড প্রশ্নব্যাংক ও খাঁটি বাংলা <br className="hidden sm:block" />{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                এআই টিউটর
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mx-auto mt-5 sm:mt-6 max-w-2xl text-base sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-bn"
            >
              বিগত বছরের আসল বোর্ড পরীক্ষা (২০১৮-২০২৪) দাও, অধ্যায়ভিত্তিক ড্রিল প্র্যাকটিস করো এবং পছন্দের শিক্ষকের মতো সহজ বাংলায় সমাধান বুঝে নাও।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
            >
              <Link
                to="/model-tests?mode=board_exam"
                className="group relative flex w-full sm:w-auto items-center justify-center space-x-2 rounded-full bg-primary-600 px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-500 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <Landmark className="relative z-10 h-5 w-5" />
                <span className="relative z-10 font-bn">বোর্ড পরীক্ষা দাও</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/tutor"
                className="group flex w-full sm:w-auto items-center justify-center space-x-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98]"
              >
                <BrainCircuit className="h-4 w-4 text-primary-600 dark:text-primary-400 transition-transform group-hover:scale-110" />
                <span className="font-bn">এআই শিক্ষককে প্রশ্ন করো</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                <Landmark className="h-4 w-4 text-blue-500" />
                <span>বোর্ড প্রশ্নব্যাংক (২০১৮-২০২৪)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>সকল এসএসসি বিষয়</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                <BrainCircuit className="h-4 w-4 text-purple-500" />
                <span>খাঁটি বাংলা টিউটর</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Board Exam Launcher Section */}
      <section className="py-14 sm:py-20 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-2 font-bn">
                <Landmark className="h-3.5 w-3.5" />
                <span>বিগত বছরের আসল বোর্ড প্রশ্নপত্র</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-bn">
                জনপ্রিয় বোর্ড পরীক্ষার প্রশ্নপত্র
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 font-bn">
                সরাসরি ক্লিক করে পছন্দের বোর্ডের ফুল এক্সাম পেপার শুরু করো।
              </p>
            </div>
            <Link
              to="/model-tests?mode=board_exam"
              className="inline-flex items-center text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors font-bn self-start sm:self-auto"
            >
              <span>সকল বোর্ড প্রশ্ন দেখো</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {popularBoardExams.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  to={`/model-tests?mode=board_exam&board=${item.boardId}&year=${item.year}&subject=${item.subjectId}`}
                  className="group block p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 font-mono">
                      SSC {item.year}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-bn group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.subject}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bn mt-1">
                    {item.board}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400 font-bn">
                    <span>পরীক্ষা শুরু করো &rarr;</span>
                    <span className="text-slate-400 font-normal">১০টি MCQ • ১৫ মিনিট</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8">
            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mb-3">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                100% Free
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Full access, no hidden costs
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mb-3">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 font-bn">
                দেশীয় শিক্ষক স্টাইল এআই
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bn">
                বাস্তব উদাহরণ দিয়ে সহজবোধ্য ব্যাখ্যা
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mb-3">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 font-bn">
                বোর্ড প্রশ্নব্যাংক
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bn">
                বিগত ২০১৮-২০২৪ এর আসল প্রশ্ন
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mb-3">
                <Library className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 font-bn">
                অধ্যায়ভিত্তিক গাইড
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bn">
                সকল বিষয়ের সাজানো নোটস
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm sm:text-base font-bold leading-7 text-primary-600 dark:text-primary-400 uppercase tracking-wider font-bn">
              অল-ইন-ওয়ান এসএসসি একাডেমি
            </h2>
            <p className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-bn">
              এসএসসি প্রস্তুতির জন্য যা কিছু প্রয়োজন
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700">
                <dt className="flex items-center gap-x-3 text-base sm:text-lg font-bold text-slate-900 dark:text-white font-bn">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shrink-0">
                    <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  আন্তরিক এআই শিক্ষক
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-bn">
                  <p className="flex-auto">
                    বইয়ের কঠিন ভাষা নয়, একজন অভিজ্ঞ প্রাইভেট টিচারের মতো রিকশার জড়তা, ক্রিকেটের ভরবেগ বা রান্নার তাপগতিবিদ্যার সহজ উদাহরণ দিয়ে বোঝানো।
                  </p>
                </dd>
              </div>

              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700">
                <dt className="flex items-center gap-x-3 text-base sm:text-lg font-bold text-slate-900 dark:text-white font-bn">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shrink-0">
                    <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  আসল বোর্ড প্রশ্ন পরীক্ষা
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-bn">
                  <p className="flex-auto">
                    ঢাকা, চট্টগ্রাম, রাজশাহী, যশোরসহ সকল শিক্ষা বোর্ডের বিগত ২০১৮-২০২৪ সালের আসল প্রশ্ন দিয়ে সময় মেপে টেস্ট পেপারের মতো এক্সাম দেওয়ার সুযোগ।
                  </p>
                </dd>
              </div>

              <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700">
                <dt className="flex items-center gap-x-3 text-base sm:text-lg font-bold text-slate-900 dark:text-white font-bn">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shrink-0">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  বিজ্ঞান, মানবিক ও বাণিজ্য
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-bn">
                  <p className="flex-auto">
                    সকল গ্রুপের প্রতিটি বিষয়ের জন্য সম্পূর্ণ অধ্যায়ভিত্তিক গাইড, টেস্ট প্রশ্ন এবং তাৎক্ষণিক সমাধান।
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
