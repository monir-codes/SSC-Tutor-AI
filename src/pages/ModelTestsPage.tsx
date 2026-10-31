import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BrainCircuit,
  Loader2,
  Clock,
  Target,
  ChevronRight,
  ChevronLeft,
  Flag,
  Bot,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Landmark,
  BookOpen,
  Award,
  FileText,
  Download,
  Printer,
  Layers,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useUserStore } from "@/store/userStore";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import {
  SSC_BOARDS,
  SSC_SUBJECTS,
  SSC_YEAR_OPTIONS,
  CURATED_BOARD_PAPERS,
  TestPaperData,
  MCQQuestion,
  CQQuestion,
} from "@/lib/sscBoardData";
import { BoardHallTestPaper } from "@/components/BoardHallTestPaper";

export function ModelTestsPage() {
  const [searchParams] = useSearchParams();
  const { width, height } = useWindowSize();

  // Page View State: setup | loading | test_paper_view | exam | results
  const [examState, setExamState] = useState<
    "setup" | "loading" | "test_paper_view" | "exam" | "results"
  >("setup");

  const { addExamResult } = useUserStore();

  // Setup Form State
  const initialMode = (searchParams.get("mode") as any) || "test_paper";
  const [examMode, setExamMode] = useState<"test_paper" | "board_exam" | "chapter_drill">(
    initialMode === "board_exam" ? "board_exam" : initialMode === "chapter_drill" ? "chapter_drill" : "test_paper"
  );
  const [stream, setStream] = useState<"science" | "humanities" | "commerce">("science");
  const [subjectId, setSubjectId] = useState(searchParams.get("subject") || "physics");
  const [boardId, setBoardId] = useState(searchParams.get("board") || "all");
  const [yearId, setYearId] = useState(searchParams.get("year") || "suggestion_2025");
  const [chapter, setChapter] = useState(searchParams.get("chapter") || "");
  const [difficulty, setDifficulty] = useState("Board Standard");
  const [paperFormat, setPaperFormat] = useState<"full" | "mcq" | "cq">("full");
  const [questionCount, setQuestionCount] = useState("10");
  const [durationStr, setDurationStr] = useState("15"); // minutes

  // Active Test Paper & Questions State
  const [testPaper, setTestPaper] = useState<TestPaperData | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Available subjects for the selected stream
  const availableSubjects = SSC_SUBJECTS.filter((s) => s.stream === stream);
  const currentSubject =
    availableSubjects.find((s) => s.id === subjectId) || availableSubjects[0] || SSC_SUBJECTS[0];

  const currentBoard = SSC_BOARDS.find((b) => b.id === boardId) || SSC_BOARDS[0];
  const currentYearObj = SSC_YEAR_OPTIONS.find((y) => y.id === yearId) || SSC_YEAR_OPTIONS[0];

  // Generate Test Paper or Online Exam
  const handleGenerate = async (targetView: "test_paper" | "exam") => {
    setExamState("loading");
    setAnswers({});
    setFlags({});
    setCurrentIdx(0);

    const count = parseInt(questionCount) || 10;

    try {
      const res = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: currentSubject.name,
          subjectCode: currentSubject.code,
          stream,
          board: currentBoard.id,
          year: currentYearObj.name,
          chapter,
          difficulty,
          examMode,
          paperType: paperFormat,
          count,
        }),
      });

      const data = await res.json();

      let receivedQuestions: MCQQuestion[] = [];
      let receivedCqs: CQQuestion[] = [];
      let receivedPaperMetadata: any = null;

      if (data && (data.questions || data.testPaper || Array.isArray(data))) {
        receivedQuestions = Array.isArray(data)
          ? data
          : data.questions || [];
        receivedCqs = data.creativeQuestions || [];
        receivedPaperMetadata = data.testPaper;
      }

      // If backend was unable to return questions (e.g. quota limit), fallback gracefully to curated verified bank
      if (receivedQuestions.length === 0 && receivedCqs.length === 0) {
        const curated = CURATED_BOARD_PAPERS[currentSubject.id] || CURATED_BOARD_PAPERS["physics"];
        receivedQuestions = curated.questions;
        receivedCqs = curated.creativeQuestions;
        toast.info("বোর্ড প্রশ্নব্যাংক হতে সর্বাধিক কমন ও নির্ভুল প্রশ্ন সংকলন প্রদর্শন করা হচ্ছে।");
      }

      // Format questions for state
      const formattedQuestions = receivedQuestions.map((q: any, i: number) => ({
        ...q,
        id: q.id ? String(q.id) : `q-${i + 1}`,
        question: q.question || q.text || "",
        boardInfo: q.boardInfo || `${currentBoard.short || "ঢাকা বোর্ড"} ${currentYearObj.name.substring(0, 4)}`,
        frequencyTag: q.frequencyTag || "সর্বাধিক কমন প্রশ্ন",
      }));

      const fullPaperData: TestPaperData = {
        title: receivedPaperMetadata?.title || `মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষা 2025 — টেস্ট পেপার ও সুপার সাজেশন`,
        subjectName: currentSubject.name,
        subjectCode: currentSubject.code,
        boardName: currentBoard.name,
        year: currentYearObj.name,
        paperType: paperFormat,
        mcqTime: currentSubject.duration.mcq || "25 মিনিট",
        mcqMarks: paperFormat === "cq" ? 0 : formattedQuestions.length,
        cqTime: currentSubject.duration.cq || "2 ঘণ্টা 35 মিনিট",
        cqMarks: paperFormat === "mcq" ? 0 : receivedCqs.length * 10,
        totalMarks:
          (paperFormat === "cq" ? 0 : formattedQuestions.length) +
          (paperFormat === "mcq" ? 0 : receivedCqs.length * 10),
        instructions: receivedPaperMetadata?.instructions || [
          "সরবরাহকৃত বহুনির্বাচনি অভীক্ষার উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে প্রদত্ত বর্ণসংবলিত বৃত্তটি বল পয়েন্ট কলম দ্বারা সম্পূর্ণ ভরাট করো। প্রতিটি প্রশ্নের মান 1।",
          "সৃজনশীল অংশে উদ্দীপকটি মনোযোগ সহকারে পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও।",
          "ক্যালকুলেটর ব্যবহার বিধিসম্মত। খসড়া করার জন্য অতিরিক্ত কাগজ দেওয়া হবে না।"
        ],
        questions: formattedQuestions,
        creativeQuestions: receivedCqs,
        watermarkText: "SSC TUTOR AI • ssc-tutor-ai.vercel.app",
      };

      setTestPaper(fullPaperData);
      setQuestions(formattedQuestions);

      if (targetView === "test_paper") {
        setExamState("test_paper_view");
      } else {
        setTimeLeft(parseInt(durationStr) * 60);
        setTimeSpent(0);
        setExamState("exam");
      }
    } catch (err) {
      console.error("Test generation error:", err);
      // Fallback to verified local curated bank
      const curated = CURATED_BOARD_PAPERS[currentSubject.id] || CURATED_BOARD_PAPERS["physics"];
      const formattedQuestions = curated.questions;
      const formattedCqs = curated.creativeQuestions;

      const fallbackPaper: TestPaperData = {
        title: `মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষা 2025 — সুপার সাজেশন টেস্ট পেপার`,
        subjectName: currentSubject.name,
        subjectCode: currentSubject.code,
        boardName: currentBoard.name,
        year: currentYearObj.name,
        paperType: paperFormat,
        mcqTime: currentSubject.duration.mcq || "25 মিনিট",
        mcqMarks: formattedQuestions.length,
        cqTime: currentSubject.duration.cq || "2 ঘণ্টা 35 মিনিট",
        cqMarks: formattedCqs.length * 10,
        totalMarks: formattedQuestions.length + formattedCqs.length * 10,
        instructions: [
          "সরবরাহকৃত বহুনির্বাচনি অভীক্ষার উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে সঠিক বৃত্তটি বল পয়েন্ট কলম দ্বারা ভরাট করো। প্রতিটি প্রশ্নের মান 1।",
          "সৃজনশীল অংশে প্রতিটি প্রশ্নের মান 10।"
        ],
        questions: formattedQuestions,
        creativeQuestions: formattedCqs,
        watermarkText: "SSC TUTOR AI • ssc-tutor-ai.vercel.app",
      };

      setTestPaper(fallbackPaper);
      setQuestions(formattedQuestions);

      if (targetView === "test_paper") {
        setExamState("test_paper_view");
      } else {
        setTimeLeft(parseInt(durationStr) * 60);
        setTimeSpent(0);
        setExamState("exam");
      }
      toast.info("বোর্ড প্রশ্নব্যাংক হতে কমন প্রশ্নপত্র লোড করা হয়েছে।");
    }
  };

  // Timer Effect for Interactive Exam
  useEffect(() => {
    if (examState === "exam" && timeLeft > 0) {
      if (timeLeft === 60) {
        toast.warning("মাত্র 1 মিনিট বাকি আছে!", { id: "timer-warning" });
      }

      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else if (examState === "exam" && timeLeft === 0 && questions.length > 0) {
      submitExam();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, examState, questions.length]);

  const handleAnswer = (opt: string) => {
    const qId = questions[currentIdx].id;
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const toggleFlag = () => {
    const qId = questions[currentIdx].id;
    setFlags((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const submitExam = () => {
    setExamState("results");

    const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    const modeTitle =
      examMode === "board_exam"
        ? `${currentBoard.name.split(" (")[0]} ${currentYearObj.name}`
        : examMode === "chapter_drill"
        ? `অধ্যায়: ${chapter || "All"}`
        : "সুপার সাজেশন বোর্ড টেস্ট";

    addExamResult({
      subject: currentSubject.name,
      chapter: modeTitle,
      score: correctCount,
      total: questions.length,
      percentage,
      timeTaken: timeSpent,
      type: "model_test",
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Results calculation
  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const answeredCount = Object.keys(answers).length;
  const wrongCount = answeredCount - correctCount;
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  let grade = "F";
  if (percentage >= 80) grade = "A+";
  else if (percentage >= 70) grade = "A";
  else if (percentage >= 60) grade = "A-";
  else if (percentage >= 50) grade = "B";
  else if (percentage >= 40) grade = "C";
  else if (percentage >= 33) grade = "D";

  const currentQ = questions[currentIdx];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <SEO
        title="এসএসসি 2025/2026 টেস্ট পেপার ও সুপার সাজেশন PDF | SSC Test Paper Solution — SSC Tutor AI"
        description="বাংলাদেশের ১০টি শিক্ষা বোর্ডের বিগত 7 বছরের আসল এসএসসি টেস্ট পেপার সলভ, বোল্ড উত্তরসহ বহুনির্বাচনি ও সৃজনশীল মডেল উত্তর। সরাসরি হলের মতো A4 PDF ডাউনলোড করুন ফ্রিতে।"
        href="/model-tests"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "SSC Official Board Test Paper & Exam Simulator",
          url: "https://ssc-tutor-ai.vercel.app/model-tests",
          description: "Download official SSC board exam test papers in authentic hall layout with past board citations and PDF download.",
          applicationCategory: "EducationalApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BDT"
          }
        }}
      />

      {/* SETUP VIEW */}
      {examState === "setup" && (
        <>
          <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-4 font-bn">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span>গণপ্রজাতন্ত্রী বাংলাদেশ অনুমোদিত এনসিটিবি কারিকুলাম • জাতীয় মাধ্যমিক ডিজিটাল পরীক্ষা সংকলন</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white font-bn">
                  জাতীয় বোর্ড পরীক্ষা প্রশ্নব্যাংক, টেস্ট পেপার ও সিমুলেটর
                </h1>
                <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-bn">
                  বিগত 7 বছরের (2018–2024) সকল শিক্ষা বোর্ডের সর্বাধিক কমন প্রশ্ন নিয়ে পরীক্ষার হলের মতো টেস্ট পেপার তৈরি করুন, বোল্ড উত্তরসহ A4 PDF সংগ্রহ করুন অথবা ঘড়ি ধরে অনলাইন পরীক্ষায় অংশ নিন।
                </p>
              </motion.div>
            </div>
          </section>

          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 w-full">
            <div className="rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
              
              {/* Feature Mode Tabs - Responsive */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-6 sm:mb-8 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setExamMode("test_paper")}
                  className={`flex-1 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 font-bn ${
                    examMode === "test_paper"
                      ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                  <span className="sm:hidden">টেস্ট পেপার & PDF</span>
                  <span className="hidden sm:inline">হলের টেস্ট পেপার (PDF)</span>
                </button>
                <button
                  onClick={() => setExamMode("board_exam")}
                  className={`flex-1 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 font-bn ${
                    examMode === "board_exam"
                      ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Landmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                  <span className="sm:hidden">অনলাইন পরীক্ষা</span>
                  <span className="hidden sm:inline">অনলাইন পরীক্ষা (Exam)</span>
                </button>
                <button
                  onClick={() => setExamMode("chapter_drill")}
                  className={`flex-1 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 font-bn ${
                    examMode === "chapter_drill"
                      ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                  <span className="sm:hidden">অধ্যায় ড্রিল</span>
                  <span className="hidden sm:inline">অধ্যায়ভিত্তিক ড্রিল</span>
                </button>
              </div>

              <div className="space-y-6 font-bn">
                {/* Stream & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      বিভাগ (Stream)
                    </label>
                    <select
                      value={stream}
                      onChange={(e) => {
                        const newStream = e.target.value as any;
                        setStream(newStream);
                        const firstSub = SSC_SUBJECTS.find((s) => s.stream === newStream);
                        if (firstSub) setSubjectId(firstSub.id);
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                    >
                      <option value="science">বিজ্ঞান বিভাগ (Science)</option>
                      <option value="humanities">মানবিক বিভাগ (Humanities)</option>
                      <option value="commerce">ব্যবসায় শিক্ষা / বাণিজ্য (Commerce)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      বিষয় ও কোড (Subject & Code)
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                    >
                      {availableSubjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} [কোড: {s.code}]
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Board & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      শিক্ষা বোর্ড নির্বাচন করো (Select Board)
                    </label>
                    <select
                      value={boardId}
                      onChange={(e) => setBoardId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                    >
                      {SSC_BOARDS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      পরীক্ষার সাল বা সাজেশন (Exam Year / Suggestion)
                    </label>
                    <select
                      value={yearId}
                      onChange={(e) => setYearId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                    >
                      {SSC_YEAR_OPTIONS.map((y) => (
                        <option key={y.id} value={y.id}>
                          {y.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Paper Format (MCQ / CQ / Full) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    টেস্ট পেপারের ধরণ (Paper Format)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaperFormat("full")}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                        paperFormat === "full"
                          ? "bg-primary-600 text-white border-primary-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      পূর্ণাঙ্গ প্রশ্নপত্র (MCQ + CQ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperFormat("mcq")}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                        paperFormat === "mcq"
                          ? "bg-primary-600 text-white border-primary-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      শুধু বহুনির্বাচনি (MCQ Only)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperFormat("cq")}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                        paperFormat === "cq"
                          ? "bg-primary-600 text-white border-primary-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      শুধু সৃজনশীল (CQ Only)
                    </button>
                  </div>
                </div>

                {examMode === "chapter_drill" && (
                  <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      অধ্যায় / টপিকের নাম (Chapter Name)
                    </label>
                    <input
                      type="text"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      placeholder="যেমন: বল ও গতি, আলোর প্রতিফলন, পরমাণুর গঠন, ত্রিকোণমিতি..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors placeholder:text-slate-400"
                    />
                  </div>
                )}

                {/* Questions Count & Timer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      প্রশ্নের সংখ্যা (MCQ Questions Count)
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      disabled={paperFormat === "cq"}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors disabled:opacity-50"
                    >
                      <option value="10">10 টি বহুনির্বাচনি প্রশ্ন (স্ট্যান্ডার্ড)</option>
                      <option value="15">15 টি বহুনির্বাচনি প্রশ্ন (পূর্ণাঙ্গ ড্রিল)</option>
                      <option value="25">25 টি বহুনির্বাচনি প্রশ্ন (অফিসিয়াল বোর্ড পেপার)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      অনলাইন পরীক্ষার সময়সীমা (Exam Timer)
                    </label>
                    <select
                      value={durationStr}
                      onChange={(e) => setDurationStr(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                    >
                      <option value="10">10 মিনিট (স্পিড টেস্ট)</option>
                      <option value="15">15 মিনিট (স্ট্যান্ডার্ড)</option>
                      <option value="25">25 মিনিট (হলের আসল বহুনির্বাচনি সময়)</option>
                      <option value="45">45 মিনিট (প্র্যাকটিস সেশন)</option>
                    </select>
                  </div>
                </div>

                {/* Primary Dual Action Buttons - Responsive */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => handleGenerate("test_paper")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm md:text-base font-bold transition-all shadow-md active:scale-98"
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 shrink-0" />
                    <span>হলের টেস্ট পেপার ও PDF</span>
                  </button>

                  <button
                    onClick={() => handleGenerate("exam")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm md:text-base font-bold transition-all shadow-md active:scale-98"
                  >
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    <span>অনলাইনে পরীক্ষা শুরু করো</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* LOADING VIEW */}
      {examState === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center mt-12 sm:mt-20">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 font-bn">
            বোর্ড প্রশ্নপত্র ও টেস্ট পেপার সংকলন প্রস্তুত হচ্ছে...
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md font-bn">
            {currentBoard.name} ও বিগত বছরের সর্বাধিক কমন প্রশ্ন এবং নির্ভুল সমাধান সাজানো হচ্ছে...
          </p>
        </div>
      )}

      {/* TEST PAPER VIEW (Authentic Hall Examination Paper with PDF Download & Watermark) */}
      {examState === "test_paper_view" && testPaper && (
        <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8 w-full flex flex-col items-center">
          <div className="no-print w-full max-w-5xl flex justify-between items-center mb-4">
            <button
              onClick={() => setExamState("setup")}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors font-bn"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>আরেকটি বিষয় নির্বাচন করো</span>
            </button>
          </div>

          <BoardHallTestPaper
            paper={testPaper}
            onStartOnlineExam={() => {
              setTimeLeft(parseInt(durationStr) * 60);
              setTimeSpent(0);
              setExamState("exam");
            }}
          />
        </div>
      )}

      {/* INTERACTIVE TIMED EXAM VIEW */}
      {examState === "exam" && questions.length > 0 && currentQ && (
        <div className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 mt-6 sm:mt-8 w-full">
          {/* Header Bar */}
          <div className="flex flex-wrap justify-between items-center bg-white dark:bg-slate-950 p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 gap-3">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm border border-primary-200 dark:border-primary-800">
                Question {currentIdx + 1} / {questions.length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold truncate max-w-[150px] sm:max-w-none font-bn">
                {currentSubject.name} [কোড: {currentSubject.code}]
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-5">
              <div
                className={`flex items-center text-sm sm:text-base font-extrabold ${
                  timeLeft < 60 ? "text-red-600 animate-pulse" : "text-slate-900 dark:text-white"
                }`}
              >
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 text-primary-500" />
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={submitExam}
                className="bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors active:scale-95 font-bn"
              >
                খাতা জমা দাও (Submit)
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-950 p-5 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[380px] flex flex-col">
                <div className="mb-5 flex justify-between items-start gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <Landmark className="h-3.5 w-3.5" />
                    <span>{currentQ.boardInfo || "SSC Board Standard"}</span>
                  </span>

                  <button
                    onClick={toggleFlag}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      flags[currentQ.id]
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 dark:border-orange-700"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Flag
                      className={`h-3.5 w-3.5 ${
                        flags[currentQ.id] ? "fill-orange-500 text-orange-500" : ""
                      }`}
                    />
                    <span>{flags[currentQ.id] ? "Flagged" : "Flag"}</span>
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-6 leading-relaxed font-bn">
                  {currentQ.question}
                </h3>

                <div className="space-y-3 mt-auto">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border text-sm sm:text-base font-medium transition-all font-bn flex items-center ${
                          isSelected
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/30"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border flex items-center justify-center mr-3 shrink-0 ${
                            isSelected
                              ? "border-primary-500 bg-primary-500 text-white"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                        </div>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-5">
                <button
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center space-x-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIdx === questions.length - 1}
                  className="flex items-center space-x-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 dark:bg-primary-600 rounded-xl font-medium text-xs sm:text-sm text-white hover:bg-slate-800 dark:hover:bg-primary-700 disabled:opacity-40 transition-colors shadow-sm"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sidebar Navigator */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 lg:sticky lg:top-24">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm font-bn">
                  প্রশ্ন নেভিগেটর
                </h3>
                <div className="flex lg:grid lg:grid-cols-4 gap-1.5 sm:gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {questions.map((q, idx) => {
                    const isAns = !!answers[q.id];
                    const isFlagged = flags[q.id];
                    const isCurrent = currentIdx === idx;

                    let bg =
                      "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent";
                    if (isCurrent)
                      bg =
                        "bg-primary-600 text-white ring-2 ring-primary-300 dark:ring-primary-600 ring-offset-2 dark:ring-offset-slate-900";
                    else if (isFlagged)
                      bg =
                        "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-700";
                    else if (isAns)
                      bg =
                        "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300 border-green-300 dark:border-green-700";

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-9 w-9 shrink-0 lg:w-full rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-bn">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div> উত্তর দেওয়া হয়েছে ({answeredCount})
                  </div>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></div>{" "}
                    বাকি আছে ({questions.length - answeredCount})
                  </div>
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-orange-500 mr-2"></div> ফ্ল্যাগ করা ({Object.values(flags).filter(Boolean).length})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS VIEW */}
      {examState === "results" && (
        <>
          <Confetti width={width} height={height} recycle={false} numberOfPieces={400} gravity={0.15} />
          <div className="mx-auto max-w-4xl px-3.5 sm:px-6 lg:px-8 mt-8 sm:mt-12 w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-white dark:bg-slate-950 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Result Header */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-10 text-white text-center relative overflow-hidden">
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-primary-300 mb-3 border border-white/10 font-bn">
                    <Award className="h-3.5 w-3.5" />
                    <span>
                      {currentBoard.name} — {currentYearObj.name}
                    </span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 font-bn">পরীক্ষার ফলাফল ও মূল্যায়ন</h2>
                  <p className="text-slate-300 text-sm sm:text-base mb-6 font-bn">
                    {currentSubject.name} [কোড: {currentSubject.code}]
                  </p>

                  <div className="flex justify-center items-end space-x-2 mb-2">
                    <span className="text-5xl sm:text-6xl font-extrabold">{percentage}%</span>
                  </div>
                  <div className="text-slate-300 font-medium tracking-widest uppercase text-xs sm:text-sm">
                    Grade:{" "}
                    <span
                      className={`font-bold text-xl sm:text-2xl ${
                        grade === "A+"
                          ? "text-green-400"
                          : grade.includes("A")
                          ? "text-blue-400"
                          : grade === "F"
                          ? "text-red-400"
                          : "text-amber-400"
                      }`}
                    >
                      {grade}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 font-bn">
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {questions.length}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    মোট নম্বর
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {correctCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    সঠিক উত্তর
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {wrongCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ভুল উত্তর
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {formatTime(timeSpent)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ব্যয়িত সময়
                  </div>
                </div>
              </div>

              {/* Quick Actions: View as Hall Test Paper & Download PDF */}
              {testPaper && (
                <div className="p-4 bg-primary-50 dark:bg-primary-950/40 border-y border-primary-200 dark:border-primary-800/60 flex flex-wrap items-center justify-between gap-3 font-bn">
                  <div className="text-xs sm:text-sm font-bold text-primary-900 dark:text-primary-200">
                    এই প্রশ্নপত্রটির হুবহু হলের টেস্ট পেপার ভিউ দেখতে চাও?
                  </div>
                  <button
                    onClick={() => setExamState("test_paper_view")}
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    <FileText className="h-4 w-4" />
                    <span>হলের টেস্ট পেপার রূপে দেখো ও PDF ডাউনলোড করো</span>
                  </button>
                </div>
              )}

              {/* Detailed Question Review */}
              <div className="p-5 sm:p-8 bg-slate-50 dark:bg-slate-900/60 font-bn">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                  প্রশ্নভিত্তিক বিস্তারিত সমাধান ও ব্যাখ্যা
                </h3>

                <div className="space-y-6">
                  {questions.map((q, idx) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;

                    return (
                      <div
                        key={q.id || idx}
                        className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-start space-x-3">
                            <span
                              className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold text-white shrink-0 mt-0.5 ${
                                isCorrect ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                              {q.question}
                            </h4>
                          </div>

                          <span className="shrink-0 inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {q.boardInfo}
                          </span>
                        </div>

                        <div className="pl-0 sm:pl-9 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                            <div
                              className={`p-3 rounded-xl border text-xs sm:text-sm ${
                                isCorrect
                                  ? "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800"
                                  : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
                              }`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-500 dark:text-slate-400">
                                তোমার উত্তর
                              </span>
                              <span
                                className={`font-semibold ${
                                  isCorrect
                                    ? "text-green-800 dark:text-green-300"
                                    : "text-red-800 dark:text-red-300"
                                }`}
                              >
                                {userAnswer || "উত্তর দেওয়া হয়নি"}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="p-3 rounded-xl border bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-xs sm:text-sm">
                                <span className="text-[10px] font-bold text-green-800 dark:text-green-300 uppercase tracking-wider block mb-1">
                                  সঠিক উত্তর
                                </span>
                                <span className="font-semibold text-green-800 dark:text-green-300">
                                  {q.correctAnswer}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-2">
                              <h5 className="font-semibold text-slate-900 dark:text-white flex items-center text-xs sm:text-sm">
                                <BrainCircuit className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
                                শিক্ষক সুলভ সহজ ব্যাখ্যা
                              </h5>
                              <Link
                                to={`/tutor?subject=${encodeURIComponent(currentSubject.name)}&prompt=${encodeURIComponent(
                                  `এই বোর্ড প্রশ্নটি আমাকে শিক্ষক হিসেবে সহজ করে বুঝিয়ে দাও:\n\nপ্রশ্ন: ${q.question}\nসঠিক উত্তর: ${q.correctAnswer}\nবোর্ড: ${q.boardInfo}\n\nধাপে ধাপে বাস্তব উদাহরণসহ ব্যাখ্যা করে দাও ভাইয়া।`
                                )}`}
                                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 px-3 py-1 rounded-full transition-colors flex items-center"
                              >
                                <Bot className="h-3.5 w-3.5 mr-1" /> শিক্ষকের সাথে চ্যাটে বোঝো
                              </Link>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {q.explanation}
                            </p>

                            {q.tips && (
                              <div className="mt-3 bg-primary-50 dark:bg-primary-950/60 rounded-xl p-3 border border-primary-100 dark:border-primary-800/60">
                                <h6 className="text-[10px] font-bold text-primary-800 dark:text-primary-300 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                  <HelpCircle className="h-3 w-3" />
                                  <span>মনে রাখার টেকনিক / টিপস</span>
                                </h6>
                                <p className="text-xs sm:text-sm text-primary-700 dark:text-primary-300">
                                  {q.tips}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    onClick={() => setExamState("setup")}
                    className="flex items-center space-x-2 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm sm:text-base font-bn"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>আরেকটি পরীক্ষা বা টেস্ট পেপার তৈরি করো</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
