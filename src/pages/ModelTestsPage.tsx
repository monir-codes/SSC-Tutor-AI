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
} from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useUserStore } from "@/store/userStore";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

const subjectData = {
  science: [
    { id: "physics", name: "Physics (পদার্থবিজ্ঞান)" },
    { id: "chemistry", name: "Chemistry (রসায়ন)" },
    { id: "biology", name: "Biology (জীববিজ্ঞান)" },
    { id: "higher-math", name: "Higher Math (উচ্চতর গণিত)" },
    { id: "math", name: "General Math (সাধারণ গণিত)" },
    { id: "ict", name: "ICT (তথ্য ও যোগাযোগ প্রযুক্তি)" },
    { id: "bangla", name: "Bangla (বাংলা)" },
    { id: "english", name: "English (ইংরেজি)" },
  ],
  humanities: [
    { id: "bangla", name: "Bangla (বাংলা)" },
    { id: "english", name: "English (ইংরেজি)" },
    { id: "math", name: "General Math (সাধারণ গণিত)" },
    { id: "ict", name: "ICT (তথ্য ও যোগাযোগ প্রযুক্তি)" },
    { id: "history", name: "History (ইতিহাস)" },
    { id: "geography", name: "Geography (ভূগোল)" },
    { id: "civics", name: "Civics (পৌরনীতি)" },
    { id: "economics", name: "Economics (অর্থনীতি)" },
    { id: "religion", name: "Religion (ধর্ম শিক্ষা)" },
  ],
  commerce: [
    { id: "accounting", name: "Accounting (হিসাববিজ্ঞান)" },
    { id: "finance", name: "Finance & Banking (ফিন্যান্স ও ব্যাংকিং)" },
    { id: "entrepreneurship", name: "Business Entrepreneurship (ব্যবসায় উদ্যোগ)" },
    { id: "math", name: "General Math (সাধারণ গণিত)" },
    { id: "ict", name: "ICT (তথ্য ও যোগাযোগ প্রযুক্তি)" },
    { id: "bangla", name: "Bangla (বাংলা)" },
    { id: "english", name: "English (ইংরেজি)" },
  ],
};

const boardOptions = [
  { id: "all", name: "সকল শিক্ষা বোর্ড (All Boards)" },
  { id: "dhaka", name: "ঢাকা বোর্ড (Dhaka Board)" },
  { id: "rajshahi", name: "রাজশাহী বোর্ড (Rajshahi Board)" },
  { id: "chittagong", name: "চট্টগ্রাম বোর্ড (Chittagong Board)" },
  { id: "comilla", name: "কুমিল্লা বোর্ড (Comilla Board)" },
  { id: "jessore", name: "যশোর বোর্ড (Jessore Board)" },
  { id: "barisal", name: "বরিশাল বোর্ড (Barisal Board)" },
  { id: "sylhet", name: "সিলেট বোর্ড (Sylhet Board)" },
  { id: "dinajpur", name: "দিনাজপুর বোর্ড (Dinajpur Board)" },
  { id: "mymensingh", name: "ময়মনসিংহ বোর্ড (Mymensingh Board)" },
  { id: "madrasah", name: "মাদ্রাসা বোর্ড (Madrasah Board)" },
];

const yearOptions = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];

type Question = {
  id: string;
  text?: string;
  question?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  tips: string;
  isBoardQuestion: boolean;
  boardInfo: string;
};

export function ModelTestsPage() {
  const [searchParams] = useSearchParams();
  const { width, height } = useWindowSize();
  const [examState, setExamState] = useState<"setup" | "loading" | "exam" | "results">("setup");

  const { addExamResult } = useUserStore();

  // Setup State
  const initialMode = (searchParams.get("mode") as any) || "board_exam";
  const [examMode, setExamMode] = useState<"board_exam" | "chapter_drill" | "mock_test">(initialMode);
  const [stream, setStream] = useState<keyof typeof subjectData>("science");
  const [subject, setSubject] = useState(searchParams.get("subject") || "physics");
  const [board, setBoard] = useState(searchParams.get("board") || "dhaka");
  const [year, setYear] = useState(searchParams.get("year") || "2024");
  const [chapter, setChapter] = useState(searchParams.get("chapter") || "");
  const [difficulty, setDifficulty] = useState("Board Standard");
  const [durationStr, setDurationStr] = useState("15"); // minutes
  const [questionCount, setQuestionCount] = useState("10");

  // Exam State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedSubjectObj = subjectData[stream].find((s) => s.id === subject) || subjectData[stream][0];

  const generateExam = async () => {
    setExamState("loading");
    setAnswers({});
    setFlags({});
    setCurrentIdx(0);

    try {
      const res = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubjectObj.name,
          examMode,
          board,
          year,
          chapter,
          difficulty,
          count: parseInt(questionCount),
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const formatted = data.questions.map((q: any, i: number) => ({
          ...q,
          id: q.id ? String(q.id) : `q-${i + 1}`,
          text: q.text || q.question || "",
        }));
        setQuestions(formatted);
        setTimeLeft(parseInt(durationStr) * 60);
        setTimeSpent(0);
        setExamState("exam");
      } else {
        toast.error("Failed to generate test questions. Please try again.");
        setExamState("setup");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
      setExamState("setup");
    }
  };

  useEffect(() => {
    if (examState === "exam" && timeLeft > 0) {
      if (timeLeft === 60) {
        toast.warning("Only 1 minute remaining!", { id: "timer-warning" });
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
    const percentage = Math.round((correctCount / questions.length) * 100);

    const modeTitle =
      examMode === "board_exam"
        ? `${boardOptions.find((b) => b.id === board)?.name.split(" (")[0]} ${year}`
        : examMode === "chapter_drill"
        ? `Chapter: ${chapter || "All"}`
        : "Full Mock Test";

    addExamResult({
      subject: selectedSubjectObj.name,
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
        title="SSC Board Question Exam & Test Paper Simulator | SSC Tutor AI"
        description="Take authentic SSC Board Exam papers (Dhaka, Rajshahi, Chittagong, Jessore 2018-2024). Chapter-wise board drills with timer, scorecard, and instant AI tutor explanations."
        href="/model-tests"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "SSC Board Exam Simulator",
          url: "https://ssc-tutor-ai.vercel.app/model-tests",
          description: "Online SSC Board Exam question simulator for Bangladesh NCTB curriculum.",
          applicationCategory: "EducationalApplication",
        }}
      />

      {examState === "setup" && (
        <>
          <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>NCTB SSC Board Question Bank (২০১৮ - ২০২৪)</span>
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-bn">
                  বোর্ড পরীক্ষার প্রশ্নব্যাংক ও এক্সাম সিমুলেটর
                </h1>
                <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-bn">
                  বিগত বছরের আসল বোর্ড প্রশ্ন দিয়ে ঘড়ি ধরে রিয়েল এক্সাম দাও এবং এআই শিক্ষকের কাছ থেকে প্রতিটি প্রশ্নের সহজ সমাধান বুঝে নাও।
                </p>
              </motion.div>
            </div>
          </section>

          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 w-full">
            <div className="rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
              
              {/* Exam Mode Tabs */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setExamMode("board_exam")}
                  className={`flex-1 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 font-bn ${
                    examMode === "board_exam"
                      ? "bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Landmark className="h-4 w-4" />
                  <span>বোর্ড পরীক্ষা (Board Exam)</span>
                </button>
                <button
                  onClick={() => setExamMode("chapter_drill")}
                  className={`flex-1 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 font-bn ${
                    examMode === "chapter_drill"
                      ? "bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>অধ্যায়ভিত্তিক বোর্ড ড্রিল</span>
                </button>
                <button
                  onClick={() => setExamMode("mock_test")}
                  className={`flex-1 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 font-bn ${
                    examMode === "mock_test"
                      ? "bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Target className="h-4 w-4" />
                  <span>মডেল টেস্ট (Mock Test)</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      বিভাগ (Stream)
                    </label>
                    <select
                      value={stream}
                      onChange={(e) => {
                        setStream(e.target.value as any);
                        setSubject(subjectData[e.target.value as keyof typeof subjectData][0].id);
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
                      বিষয় (Subject)
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors font-bn"
                    >
                      {subjectData[stream].map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conditional Inputs based on Exam Mode */}
                {examMode === "board_exam" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        শিক্ষা বোর্ড নির্বাচন করো (Select Board)
                      </label>
                      <select
                        value={board}
                        onChange={(e) => setBoard(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors font-bn"
                      >
                        {boardOptions.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        পরীক্ষার সাল (Exam Year)
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                      >
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>
                            SSC Exam {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {examMode === "chapter_drill" && (
                  <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      অধ্যায় / টপিকের নাম (Chapter Name)
                    </label>
                    <input
                      type="text"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                      placeholder="যেমন: বল (Force), আলোর প্রতিফলন, গতি, সেট ও ফাংশন..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors font-bn placeholder:text-slate-400"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      প্রশ্নের সংখ্যা (Number of Questions)
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                    >
                      <option value="5">৫ টি প্রশ্ন (Quick Drill)</option>
                      <option value="10">১০ টি প্রশ্ন (Standard Test)</option>
                      <option value="15">১৫ টি প্রশ্ন (Full Board Paper)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      সময়সীমা (Time Limit)
                    </label>
                    <select
                      value={durationStr}
                      onChange={(e) => setDurationStr(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-4 text-sm focus:border-primary-500 outline-none transition-colors"
                    >
                      <option value="5">৫ মিনিট (Speed Test)</option>
                      <option value="10">১০ মিনিট</option>
                      <option value="15">১৫ মিনিট (Standard)</option>
                      <option value="25">২৫ মিনিট (Full Exam Pace)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={generateExam}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white px-6 py-4 text-base font-bold transition-all shadow-md active:scale-98"
                  >
                    <Award className="h-5 w-5" />
                    <span className="font-bn">
                      {examMode === "board_exam"
                        ? "বোর্ড পরীক্ষা শুরু করো (Start Board Exam)"
                        : examMode === "chapter_drill"
                        ? "অধ্যায়ভিত্তিক বোর্ড ড্রিল শুরু করো"
                        : "মডেল টেস্ট শুরু করো"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {examState === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center mt-12 sm:mt-20">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 font-bn">
            বোর্ড প্রশ্নপত্র প্রস্তুত হচ্ছে...
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md font-bn">
            {examMode === "board_exam"
              ? `${boardOptions.find((b) => b.id === board)?.name} (${year}) এর আসল প্রশ্ন স্ক্যান করা হচ্ছে...`
              : "এনসিটিবি কারিকুলাম ও বিগত বছরের প্রশ্নপত্র সাজানো হচ্ছে..."}
          </p>
        </div>
      )}

      {examState === "exam" && questions.length > 0 && currentQ && (
        <div className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 mt-6 sm:mt-8 w-full">
          {/* Header Bar */}
          <div className="flex flex-wrap justify-between items-center bg-white dark:bg-slate-950 p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 gap-3">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm border border-primary-200 dark:border-primary-800">
                Question {currentIdx + 1} / {questions.length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold truncate max-w-[150px] sm:max-w-none font-bn">
                {selectedSubjectObj.name}
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
                  {currentQ.text}
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-primary-300 mb-3 border border-white/10">
                    <Award className="h-3.5 w-3.5" />
                    <span>
                      {examMode === "board_exam"
                        ? `${boardOptions.find((b) => b.id === board)?.name} (${year})`
                        : examMode === "chapter_drill"
                        ? `Chapter Drill: ${chapter || "All"}`
                        : "Full Mock Test"}
                    </span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 font-bn">পরীক্ষার ফলাফল ও মূল্যায়ন</h2>
                  <p className="text-slate-300 text-sm sm:text-base mb-6 font-bn">
                    {selectedSubjectObj.name}
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800">
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {questions.length}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bn">
                    মোট নম্বর
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {correctCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bn">
                    সঠিক উত্তর
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {wrongCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bn">
                    ভুল উত্তর
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {formatTime(timeSpent)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bn">
                    ব্যয়িত সময়
                  </div>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="p-5 sm:p-8 bg-slate-50 dark:bg-slate-900/60">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 font-bn">
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
                            <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white font-bn">
                              {q.text}
                            </h4>
                          </div>

                          <span className="shrink-0 inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {q.boardInfo}
                          </span>
                        </div>

                        <div className="pl-0 sm:pl-9 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                            <div
                              className={`p-3 rounded-xl border text-xs sm:text-sm font-bn ${
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
                              <div className="p-3 rounded-xl border bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-xs sm:text-sm font-bn">
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
                              <h5 className="font-semibold text-slate-900 dark:text-white flex items-center text-xs sm:text-sm font-bn">
                                <BrainCircuit className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
                                শিক্ষক সুলভ সহজ ব্যাখ্যা
                              </h5>
                              <Link
                                to={`/tutor?subject=${encodeURIComponent(selectedSubjectObj.name)}&prompt=${encodeURIComponent(
                                  `এই বোর্ড প্রশ্নটি আমাকে শিক্ষক হিসেবে সহজ করে বুঝিয়ে দাও:\n\nপ্রশ্ন: ${q.text}\nসঠিক উত্তর: ${q.correctAnswer}\nবোর্ড: ${q.boardInfo}\n\nধাপে ধাপে বাস্তব উদাহরণসহ ব্যাখ্যা করে দাও ভাইয়া।`
                                )}`}
                                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 px-3 py-1 rounded-full transition-colors flex items-center font-bn"
                              >
                                <Bot className="h-3.5 w-3.5 mr-1" /> শিক্ষকের সাথে চ্যাটে বোঝো
                              </Link>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-bn">
                              {q.explanation}
                            </p>

                            {q.tips && (
                              <div className="mt-3 bg-primary-50 dark:bg-primary-950/60 rounded-xl p-3 border border-primary-100 dark:border-primary-800/60">
                                <h6 className="text-[10px] font-bold text-primary-800 dark:text-primary-300 uppercase tracking-wider mb-0.5 flex items-center gap-1 font-bn">
                                  <HelpCircle className="h-3 w-3" />
                                  <span>মনে রাখার টেকনিক / টিপস</span>
                                </h6>
                                <p className="text-xs sm:text-sm text-primary-700 dark:text-primary-300 font-bn">
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

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setExamState("setup")}
                    className="flex items-center space-x-2 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm sm:text-base font-bn"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>আরেকটি বোর্ড পরীক্ষা দাও</span>
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
