import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Loader2, CheckCircle2, XCircle, Clock, FileText, Target, AlertCircle, ChevronRight, ChevronLeft, Flag, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

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
  ]
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

export function ModelTestsPage() {
  const [examState, setExamState] = useState<"setup" | "loading" | "exam" | "results">("setup");
  
  const { addExamResult } = useUserStore();

  // Setup State
  const [stream, setStream] = useState<keyof typeof subjectData>("science");
  const [subject, setSubject] = useState("math");
  const [syllabusType, setSyllabusType] = useState("Full Syllabus");
  const [difficulty, setDifficulty] = useState("Board Standard");
  const [durationStr, setDurationStr] = useState("15"); // minutes
  
  // Exam State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
          subject: subjectData[stream].find(s => s.id === subject)?.name || subject,
          syllabusType,
          difficulty,
          count: 10
        })
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setTimeLeft(parseInt(durationStr) * 60);
        setExamState("exam");
      } else {
        setExamState("setup");
      }
    } catch (err) {
      console.error(err);
      setExamState("setup");
    }
  };

  useEffect(() => {
    if (examState === "exam" && timeLeft > 0) {
      if (timeLeft === 60) {
        toast.warning("Only 1 minute remaining!", { id: 'timer-warning' });
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = 800; // hz
          
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // volume
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
          
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 1);
        } catch (e) {
          console.error("Audio API not supported");
        }
      }

      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        setTimeSpent(prev => prev + 1);
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
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const toggleFlag = () => {
    const qId = questions[currentIdx].id;
    setFlags(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const submitExam = () => {
    setExamState("results");
    
    // Calculate results for saving
    const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    addExamResult({
      subject: subjectData[stream].find(s => s.id === subject)?.name || subject,
      syllabusType,
      score: correctCount,
      total: questions.length,
      percentage,
      timeTaken: timeSpent,
      type: 'model_test'
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Results calculation
  const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const answeredCount = Object.keys(answers).length;
  const wrongCount = answeredCount - correctCount;
  const unansweredCount = questions.length - answeredCount;
  const percentage = Math.round((correctCount / questions.length) * 100);
  
  let grade = "F";
  if (percentage >= 80) grade = "A+";
  else if (percentage >= 70) grade = "A";
  else if (percentage >= 60) grade = "A-";
  else if (percentage >= 50) grade = "B";
  else if (percentage >= 40) grade = "C";
  else if (percentage >= 33) grade = "D";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <SEO 
        title="Model Tests" 
        description="Take SSC standard model tests for Science, Humanities, and Commerce subjects. Track your score and time with our AI evaluator."
        href="/model-tests"
      />
      {examState === "setup" && (
        <>
          <section className="bg-white border-b border-slate-200 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10 mb-6">
                  NCTB Standard Curriculum
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Model Tests</h1>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                  Evaluate your preparation with full-length model tests designed by AI to match the exact SSC board question pattern.
                </p>
              </motion.div>
            </div>
          </section>

          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-12 w-full">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Setup Your Exam</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stream</label>
                    <select 
                      value={stream} 
                      onChange={(e) => {
                        setStream(e.target.value as any);
                        setSubject(subjectData[e.target.value as keyof typeof subjectData][0].id);
                      }}
                      className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    >
                      <option value="science">Science</option>
                      <option value="humanities">Humanities (Arts)</option>
                      <option value="commerce">Commerce</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <select 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    >
                      {subjectData[stream].map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Syllabus Type</label>
                    <select 
                      value={syllabusType} 
                      onChange={(e) => setSyllabusType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    >
                      <option value="Full Syllabus">Full Syllabus</option>
                      <option value="Chapter-wise">Chapter-wise (Randomizer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                    <select 
                      value={difficulty} 
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    >
                      <option value="Board Standard">Board Standard</option>
                      <option value="Hard">Hard</option>
                      <option value="Medium">Medium</option>
                      <option value="Easy">Easy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                  <select 
                    value={durationStr} 
                    onChange={(e) => setDurationStr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-3 px-4 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                  >
                    <option value="10">10 Minutes (Quick Test)</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button
                    onClick={generateExam}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-primary-600 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                  >
                    <Target className="h-5 w-5" />
                    <span>Start Model Test</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {examState === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center mt-20">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Preparing Your Exam</h2>
          <p className="text-slate-500 max-w-md">Our AI is generating authentic board-standard questions for your selected subject and difficulty...</p>
        </div>
      )}

      {examState === "exam" && questions.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm ring-1 ring-slate-200 mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg font-medium text-sm">
                Question {currentIdx + 1} of {questions.length}
              </div>
              <div className="text-sm text-slate-500 font-medium">
                {subjectData[stream].find(s => s.id === subject)?.name}
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className={`flex items-center text-lg font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <button 
                onClick={submitExam}
                className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 rounded-3xl shadow-sm ring-1 ring-slate-200 min-h-[400px] flex flex-col">
                <div className="mb-6 flex justify-between items-start">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${questions[currentIdx].isBoardQuestion ? 'bg-amber-100 text-amber-800' : 'bg-blue-50 text-blue-700'}`}>
                    {questions[currentIdx].boardInfo}
                  </span>
                  
                  <button 
                    onClick={toggleFlag}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${flags[questions[currentIdx].id] ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <Flag className={`h-4 w-4 ${flags[questions[currentIdx].id] ? 'fill-orange-500' : ''}`} />
                    <span>{flags[questions[currentIdx].id] ? 'Flagged' : 'Flag'}</span>
                  </button>
                </div>
                
                <h3 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
                  {questions[currentIdx].text}
                </h3>
                
                <div className="space-y-3 mt-auto">
                  {questions[currentIdx].options.map((opt, oIdx) => {
                    const isSelected = answers[questions[currentIdx].id] === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full text-left px-5 py-4 rounded-xl border text-base font-medium transition-all ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' 
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-4 ${isSelected ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300'}`}>
                            {isSelected && <div className="h-2 w-2 rounded-full bg-white"></div>}
                          </div>
                          <span>{opt}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIdx === questions.length - 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-900 rounded-xl font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Sidebar Navigator */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200 sticky top-24">
                <h3 className="font-bold text-slate-900 mb-4">Question Navigator</h3>
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, idx) => {
                    const isAns = !!answers[q.id];
                    const isFlagged = flags[q.id];
                    const isCurrent = currentIdx === idx;
                    
                    let bg = "bg-slate-100 text-slate-600";
                    if (isCurrent) bg = "bg-primary-500 text-white ring-2 ring-primary-200 ring-offset-2";
                    else if (isFlagged) bg = "bg-orange-100 text-orange-700 border border-orange-300";
                    else if (isAns) bg = "bg-green-100 text-green-700 border border-green-300";

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-10 w-full rounded-lg font-semibold text-sm flex items-center justify-center transition-all ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div> Answered ({answeredCount})
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="h-3 w-3 rounded-full bg-slate-200 mr-2"></div> Unanswered ({questions.length - answeredCount})
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="h-3 w-3 rounded-full bg-orange-400 mr-2"></div> Flagged ({Object.values(flags).filter(Boolean).length})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {examState === "results" && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-12 w-full">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
            {/* Result Header */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Test Completed</h2>
                <p className="text-slate-300 text-lg mb-8">{subjectData[stream].find(s => s.id === subject)?.name} • {syllabusType}</p>
                
                <div className="flex justify-center items-end space-x-2 mb-2">
                  <span className="text-6xl font-extrabold">{percentage}%</span>
                </div>
                <div className="text-slate-300 font-medium tracking-widest uppercase">
                  Grade: <span className={`font-bold text-2xl ${grade === 'A+' ? 'text-green-400' : grade.includes('A') ? 'text-blue-400' : grade === 'F' ? 'text-red-400' : 'text-amber-400'}`}>{grade}</span>
                </div>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200">
              <div className="bg-white p-6 text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">{questions.length}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Marks</div>
              </div>
              <div className="bg-white p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{correctCount}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Correct</div>
              </div>
              <div className="bg-white p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{wrongCount}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wrong</div>
              </div>
              <div className="bg-white p-6 text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatTime(timeSpent)}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Taken</div>
              </div>
            </div>

            {/* Answer Key */}
            <div className="p-8 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Detailed Analysis</h3>
              
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                          {idx + 1}
                        </span>
                        <h4 className="font-semibold text-slate-900">{q.text}</h4>
                      </div>
                      
                      <div className="pl-9 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <span className="text-xs font-bold uppercase tracking-wider block mb-1">Your Answer</span>
                            <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>{userAnswer || "Not answered"}</span>
                          </div>
                          {!isCorrect && (
                            <div className="p-3 rounded-lg border bg-green-50 border-green-200">
                              <span className="text-xs font-bold text-green-800 uppercase tracking-wider block mb-1">Correct Answer</span>
                              <span className="font-medium text-green-800">{q.correctAnswer}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                           <div className="flex justify-between items-center mb-2">
                             <h5 className="font-semibold text-slate-900 flex items-center text-sm">
                               <BrainCircuit className="h-4 w-4 mr-2 text-primary-600" />
                               AI Explanation
                             </h5>
                             <Link 
                               to={`/tutor?prompt=${encodeURIComponent(`এই প্রশ্নটি আমাকে সহজ করে বুঝিয়ে বলো:\n\nপ্রশ্ন: ${q.text}\nসঠিক উত্তর: ${q.correctAnswer}\n\nধাপে ধাপে ব্যাখ্যা করে দাও।`)}`}
                               className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full transition-colors flex items-center"
                             >
                               <Bot className="h-3 w-3 mr-1" /> Explain in Chat
                             </Link>
                           </div>
                           <p className="text-sm text-slate-600 leading-relaxed">{q.explanation}</p>
                           
                           <div className="mt-3 bg-primary-50 rounded-lg p-3 border border-primary-100">
                             <h6 className="text-xs font-bold text-primary-800 uppercase tracking-wider mb-1">Learning Tip</h6>
                             <p className="text-sm text-primary-700">{q.tips}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setExamState("setup")}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Take Another Test
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
