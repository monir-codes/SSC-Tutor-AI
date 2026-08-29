import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Bot,
  Sparkles,
  HelpCircle,
  Landmark
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { SEO } from "@/components/SEO";

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

const yearOptions = ["all", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  tips: string;
  isBoardQuestion: boolean;
  boardInfo: string;
};

export function PracticePage() {
  const [stream, setStream] = useState<keyof typeof subjectData>("science");
  const [subject, setSubject] = useState("physics");
  const [chapter, setChapter] = useState("");
  const [board, setBoard] = useState("all");
  const [year, setYear] = useState("all");
  const [difficulty, setDifficulty] = useState("Board Standard");
  const [questionType, setQuestionType] = useState("MCQ");

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const { addExamResult } = useUserStore();

  const selectedSubjectObj = subjectData[stream].find((s) => s.id === subject) || subjectData[stream][0];

  const generatePractice = async () => {
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setShowResults(false);

    try {
      const res = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubjectObj.name,
          chapter,
          board,
          year,
          difficulty,
          questionType,
          count: 5,
        }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setStartTime(Date.now());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qId: string, answer: string) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const submitPractice = () => {
    setShowResults(true);
    const score = questions.filter(
      (q) => answers[q.id] === q.correctAnswer,
    ).length;
    const percentage = Math.round((score / questions.length) * 100);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    addExamResult({
      subject: selectedSubjectObj.name,
      chapter: chapter || "Board Question Drill",
      score,
      total: questions.length,
      percentage,
      timeTaken,
      type: "practice",
    });
  };

  const score = questions.filter(
    (q) => answers[q.id] === q.correctAnswer,
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <SEO
        title="Chapter-wise SSC Practice Questions & Quizzes | SSC Tutor AI"
        description="Generate custom, board-standard practice questions powered by AI. Authentic SSC board questions included for Science, Humanities and Commerce."
        href="/practice"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "SSC Practice Center",
          url: "https://ssc-tutor-ai.vercel.app/practice",
          description: "Custom practice questions and quizzes for SSC students.",
          applicationCategory: "EducationalApplication"
        }}
      />
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>NCTB Board Questions Generator</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-bn">
              অধ্যায়ভিত্তিক বোর্ড প্রশ্ন প্র্যাকটিস
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-bn">
              অধ্যায়ভিত্তিক বিগত বছরের বোর্ড প্রশ্ন প্র্যাকটিস করো এবং বোর্ড পরীক্ষার স্ট্যান্ডার্ড অনুযায়ী নিজেকে যাচাই করো।
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center text-base font-bn">
              <BrainCircuit className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
              প্র্যাকটিস সেটিংস
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-bn">
                  বিভাগ (Stream)
                </label>
                <select
                  value={stream}
                  onChange={(e) => {
                    setStream(e.target.value as any);
                    setSubject(
                      subjectData[e.target.value as keyof typeof subjectData][0]
                        .id,
                    );
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2.5 px-3 text-sm focus:border-primary-500 outline-none font-bn"
                >
                  <option value="science">বিজ্ঞান (Science)</option>
                  <option value="humanities">মানবিক (Arts)</option>
                  <option value="commerce">বাণিজ্য (Commerce)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-bn">
                  বিষয় (Subject)
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2.5 px-3 text-sm focus:border-primary-500 outline-none font-bn"
                >
                  {subjectData[stream].map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-bn">
                  অধ্যায় / টপিক
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="যেমন: বল, আলোর প্রতিফলন, সেট ও ফাংশন..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2.5 px-3 text-sm focus:border-primary-500 outline-none font-bn placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-bn">
                  বোর্ড ফিল্টার (Board Filter)
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2.5 px-3 text-sm focus:border-primary-500 outline-none font-bn"
                >
                  {boardOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-bn">
                  সাল (Year)
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2.5 px-3 text-sm focus:border-primary-500 outline-none"
                >
                  <option value="all">বিগত সকল বছর (All Years)</option>
                  {yearOptions.slice(1).map((y) => (
                    <option key={y} value={y}>
                      SSC {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={generatePractice}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white px-4 py-3 text-sm font-bold shadow-sm transition-all focus:outline-none disabled:opacity-70 mt-3 active:scale-[0.99] font-bn"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    <span>বোর্ড প্রশ্ন খোঁজা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4" />{" "}
                    <span>বোর্ড প্রশ্ন তৈরি করো</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {!loading && questions.length === 0 && (
            <div className="rounded-2xl bg-white dark:bg-slate-950 p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 min-h-[350px] flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-bn">
                প্র্যাকটিস শুরু করতে প্রস্তুত?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md font-bn">
                বাম পাশের প্যানেল থেকে তোমার বিষয় ও অধ্যায় সিলেক্ট করে <strong>বোর্ড প্রশ্ন তৈরি করো</strong> বাটনে ক্লিক করো।
              </p>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl bg-white dark:bg-slate-950 p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 min-h-[350px] flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white font-bn">
                বোর্ড প্রশ্ন লোড হচ্ছে...
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-bn">
                এনসিটিবি সিলেবাস ও বিগত বছরের বোর্ড প্রশ্নব্যাংক থেকে আসল প্রশ্নপত্র বের করা হচ্ছে...
              </p>
            </div>
          )}

          {questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {showResults && (
                <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg text-center">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-bn">
                    স্কোর: {score} / {questions.length}
                  </h2>
                  <p className="text-primary-100 mt-2 text-sm sm:text-base font-bn">
                    {score === questions.length
                      ? "অসাধারণ! সম্পূর্ণ সঠিক উত্তর দিয়েছো।"
                      : score >= questions.length / 2
                        ? "খুব ভালো হয়েছে! ব্যাখ্যাগুলো দেখে আরেকটু ঝালাই করে নাও।"
                        : "মন খারাপ করার কিছু নেই, শিক্ষকের ব্যাখ্যা পড়ে আবার চেষ্টা করো।"}
                  </p>
                </div>
              )}

              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="rounded-2xl bg-white dark:bg-slate-950 p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Question {idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Landmark className="h-3 w-3" />
                      <span>{q.boardInfo}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-5 font-bn leading-relaxed">
                    {q.text}
                  </h3>

                  <div className="space-y-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === opt;
                      const isCorrect = showResults && opt === q.correctAnswer;
                      const isWrong =
                        showResults && isSelected && opt !== q.correctAnswer;

                      let btnClass =
                        "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all font-bn flex items-center justify-between gap-3 ";
                      if (isCorrect) {
                        btnClass +=
                          "border-green-500 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 font-semibold ring-1 ring-green-500";
                      } else if (isWrong) {
                        btnClass +=
                          "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 ring-1 ring-red-500";
                      } else if (isSelected) {
                        btnClass +=
                          "border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500";
                      } else {
                        btnClass +=
                          "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60";
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(q.id, opt)}
                          disabled={showResults}
                          className={btnClass}
                        >
                          <span className="leading-snug">{opt}</span>
                          {isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                          )}
                          {isWrong && (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800"
                    >
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-3">
                          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center text-sm font-bn">
                            <BrainCircuit className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
                            শিক্ষক সুলভ সহজ সমাধান ও ব্যাখ্যা
                          </h4>
                          <Link
                            to={`/tutor?subject=${encodeURIComponent(
                              selectedSubjectObj.name
                            )}&prompt=${encodeURIComponent(
                              `এই বোর্ড প্রশ্নটি আমাকে শিক্ষক হিসেবে সহজ করে বুঝিয়ে দাও:\n\nপ্রশ্ন: ${q.text}\nসঠিক উত্তর: ${q.correctAnswer}\nবোর্ড: ${q.boardInfo}\n\nধাপে ধাপে বাস্তব উদাহরণসহ বুঝিয়ে বলো ভাইয়া।`,
                            )}`}
                            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 border border-primary-200 dark:border-primary-800 px-3 py-1.5 rounded-full transition-colors flex items-center font-bn"
                          >
                            <Bot className="h-3.5 w-3.5 mr-1" /> শিক্ষকের সাথে চ্যাটে বোঝো
                          </Link>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 font-bn leading-relaxed">
                          {q.explanation}
                        </p>

                        {q.tips && (
                          <div className="bg-primary-50 dark:bg-primary-950/60 rounded-xl p-3 border border-primary-100 dark:border-primary-800/60">
                            <h4 className="text-[11px] font-bold text-primary-800 dark:text-primary-300 uppercase tracking-wider mb-1 flex items-center gap-1 font-bn">
                              <HelpCircle className="h-3.5 w-3.5" />
                              <span>মনে রাখার শর্টকাট টিপস</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-primary-700 dark:text-primary-300 font-bn">
                              {q.tips}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {!showResults && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={submitPractice}
                    disabled={Object.keys(answers).length !== questions.length}
                    className="flex items-center space-x-2 rounded-xl bg-slate-900 dark:bg-primary-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 dark:hover:bg-primary-700 active:scale-95 disabled:opacity-50 shadow-md font-bn"
                  >
                    <span>উত্তর জমা দাও (Submit Answers)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
