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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { SEO } from "@/components/SEO";

const subjectData = {
  science: [
    { id: "math", name: "Mathematics" },
    { id: "higher-math", name: "Higher Mathematics" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "biology", name: "Biology" },
  ],
  humanities: [
    { id: "bangla", name: "Bangla" },
    { id: "english", name: "English" },
    { id: "history", name: "History" },
    { id: "geography", name: "Geography" },
    { id: "civics", name: "Civics" },
    { id: "economics", name: "Economics" },
    { id: "ict", name: "ICT" },
    { id: "religion", name: "Religion" },
  ],
  commerce: [
    { id: "accounting", name: "Accounting" },
    { id: "finance", name: "Finance & Banking" },
    { id: "entrepreneurship", name: "Business Entrepreneurship" },
    { id: "ict", name: "ICT" },
    { id: "bangla", name: "Bangla" },
    { id: "english", name: "English" },
    { id: "math", name: "Mathematics" },
    { id: "religion", name: "Religion" },
  ],
};

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
  const [subject, setSubject] = useState("math");
  const [chapter, setChapter] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionType, setQuestionType] = useState("MCQ");

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const { addExamResult } = useUserStore();

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
          subject:
            subjectData[stream].find((s) => s.id === subject)?.name || subject,
          chapter,
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
      subject:
        subjectData[stream].find((s) => s.id === subject)?.name || subject,
      chapter: chapter || "Full Syllabus",
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
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <SEO
        title="Practice Questions"
        description="Generate custom, board-standard practice questions powered by AI. Authentic SSC board questions included."
        href="/practice"
      />
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AI Practice Center
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Generate custom, board-standard practice questions powered by AI.
              Authentic board questions included where available.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2 text-primary-600" />
              Practice Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stream
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
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                >
                  <option value="science">Science</option>
                  <option value="humanities">Humanities (Arts)</option>
                  <option value="commerce">Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                >
                  {subjectData[stream].map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Chapter / Topic
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Set & Functions, Force"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Board Standard">Board Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Type
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                >
                  <option value="MCQ">MCQ</option>
                </select>
              </div>

              <button
                onClick={generatePractice}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4" />{" "}
                    <span>Generate Practice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {!loading && questions.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200 h-full flex flex-col items-center justify-center">
              <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900">
                Ready to practice?
              </h3>
              <p className="mt-2 text-slate-500 max-w-md">
                Select your subject and topic on the left, then click Generate
                to create custom SSC standard practice questions powered by AI.
              </p>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200 h-full flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">
                Generating Questions...
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Scanning NCTB curriculum and previous board questions.
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
                <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white shadow-lg text-center">
                  <h2 className="text-3xl font-bold">
                    Score: {score} / {questions.length}
                  </h2>
                  <p className="text-primary-100 mt-2">
                    {score === questions.length
                      ? "Excellent! Perfect score."
                      : score >= questions.length / 2
                        ? "Good job! Keep practicing to improve."
                        : "Don't worry, review the explanations and try again."}
                  </p>
                </div>
              )}

              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${q.isBoardQuestion ? "bg-amber-100 text-amber-800" : "bg-blue-50 text-blue-700"}`}
                    >
                      {q.boardInfo}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    {q.text}
                  </h3>

                  <div className="space-y-3">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === opt;
                      const isCorrect = showResults && opt === q.correctAnswer;
                      const isWrong =
                        showResults && isSelected && opt !== q.correctAnswer;

                      let btnClass =
                        "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ";
                      if (isCorrect) {
                        btnClass +=
                          "border-green-500 bg-green-50 text-green-700";
                      } else if (isWrong) {
                        btnClass += "border-red-500 bg-red-50 text-red-700";
                      } else if (isSelected) {
                        btnClass +=
                          "border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500";
                      } else {
                        btnClass +=
                          "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(q.id, opt)}
                          disabled={showResults}
                          className={btnClass}
                        >
                          <div className="flex justify-between items-center">
                            <span>{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            {isWrong && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 pt-6 border-t border-slate-100"
                    >
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-slate-900 flex items-center">
                            <BrainCircuit className="h-4 w-4 mr-2 text-primary-600" />
                            Explanation
                          </h4>
                          <Link
                            to={`/tutor?prompt=${encodeURIComponent(`এই প্রশ্নটি আমাকে সহজ করে বুঝিয়ে বলো:\n\nপ্রশ্ন: ${q.text}\nসঠিক উত্তর: ${q.correctAnswer}\n\nধাপে ধাপে ব্যাখ্যা করে দাও।`)}`}
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full transition-colors flex items-center"
                          >
                            <Bot className="h-3 w-3 mr-1" /> Explain in Chat
                          </Link>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          {q.explanation}
                        </p>

                        <div className="bg-primary-50 rounded-lg p-3">
                          <h4 className="text-xs font-bold text-primary-800 uppercase tracking-wider mb-1">
                            Learning Tip
                          </h4>
                          <p className="text-sm text-primary-700">{q.tips}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {!showResults && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={submitPractice}
                    disabled={Object.keys(answers).length !== questions.length}
                    className="flex items-center space-x-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <span>Submit Answers</span>
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
