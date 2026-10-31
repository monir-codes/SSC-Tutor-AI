import { useState, useRef } from "react";
import {
  Download,
  Printer,
  Eye,
  CheckCircle,
  Award,
  Sparkles,
  BookOpen,
  Landmark,
  Share2,
  PlayCircle,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { TestPaperData, MCQQuestion, CQQuestion } from "@/lib/sscBoardData";

interface BoardHallTestPaperProps {
  paper: TestPaperData;
  onStartOnlineExam?: () => void;
  brandName?: string;
  websiteUrl?: string;
}

export function BoardHallTestPaper({
  paper,
  onStartOnlineExam,
  brandName = "SSC TUTOR AI",
  websiteUrl = "ssc-tutor-ai.vercel.app",
}: BoardHallTestPaperProps) {
  const [solvedMode, setSolvedMode] = useState<boolean>(true);
  const [showModelSolutions, setShowModelSolutions] = useState<boolean>(true);
  const [columns, setColumns] = useState<"two" | "single">("two");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [expandedCqs, setExpandedCqs] = useState<Record<string, boolean>>({ "0": true });

  const paperRef = useRef<HTMLDivElement>(null);

  const toggleCqExpand = (idx: string) => {
    setExpandedCqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Standard clean readable numeric format (eradicates confusing Bengali '১' squiggles)
  const toBn = (num: number | string): string => {
    return String(num);
  };

  // PDF Download using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!paperRef.current) return;
    setIsGeneratingPdf(true);
    const toastId = toast.loading("হলের আসল প্রশ্নপত্র PDF প্রস্তুত হচ্ছে... দয়া করে অপেক্ষা করো");

    try {
      const element = paperRef.current;
      // Capture at high resolution for sharp Bengali text
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;

      // Multi-page handling
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
      }

      const fileName = `${paper.subjectName.replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, "_")}_SSC_Board_TestPaper.pdf`;
      pdf.save(fileName);
      toast.success("অফিসিয়াল টেস্ট পেপার PDF সফলভাবে ডাউনলোড হয়েছে!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("PDF তৈরিতে সাময়িক সমস্যা হয়েছে। আপনি সরাসরি 'প্রিন্ট' অপশন ব্যবহার করতে পারেন।", { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Native Print
  const handlePrint = () => {
    window.print();
  };

  // Helper to check if an option is the correct answer
  const isOptionCorrect = (opt: string, correct: string) => {
    if (!correct) return false;
    const cleanOpt = opt.replace(/^[কখগঘa-dA-D][\.\:\-\)\s]+/, "").trim().toLowerCase();
    const cleanCorrect = correct.replace(/^[কখগঘa-dA-D][\.\:\-\)\s]+/, "").trim().toLowerCase();
    return opt.trim() === correct.trim() || cleanOpt === cleanCorrect || opt.startsWith(correct.substring(0, 3));
  };

  const hasMcqs = paper.questions && paper.questions.length > 0;
  const hasCqs = paper.creativeQuestions && paper.creativeQuestions.length > 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Action Toolbar (Non-printable) */}
      <div className="no-print w-full max-w-5xl mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 font-bn">
        {/* Solved Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setSolvedMode(true)}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              solvedMode
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="sm:hidden">উত্তর বোল্ড (সলভড)</span>
            <span className="hidden sm:inline">সলভড টেস্ট পেপার (উত্তর বোল্ড)</span>
          </button>
          <button
            onClick={() => setSolvedMode(false)}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              !solvedMode
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Eye className="h-3.5 w-3.5 shrink-0" />
            <span className="sm:hidden">ব্ল্যাংক প্রশ্নপত্র</span>
            <span className="hidden sm:inline">পরীক্ষার্থী কপি (ব্ল্যাংক)</span>
          </button>
        </div>

        {/* View Layout & Model Solutions Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          {hasCqs && solvedMode && (
            <button
              onClick={() => setShowModelSolutions(!showModelSolutions)}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                showModelSolutions
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>CQ মডেল উত্তর: {showModelSolutions ? "অন" : "অফ"}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setColumns("two")}
              className={`px-2.5 py-1 rounded-lg ${columns === "two" ? "bg-white dark:bg-slate-700 shadow-xs text-emerald-700 dark:text-emerald-300 font-bold" : "text-slate-600 dark:text-slate-400"}`}
            >
              2 কলাম
            </button>
            <button
              onClick={() => setColumns("single")}
              className={`px-2.5 py-1 rounded-lg ${columns === "single" ? "bg-white dark:bg-slate-700 shadow-xs text-emerald-700 dark:text-emerald-300 font-bold" : "text-slate-600 dark:text-slate-400"}`}
            >
              1 কলাম
            </button>
          </div>
        </div>

        {/* Action Buttons: PDF Download, Print, Online Exam */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {onStartOnlineExam && hasMcqs && (
            <button
              onClick={onStartOnlineExam}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <PlayCircle className="h-4 w-4 shrink-0" />
              <span>অনলাইনে পরীক্ষা</span>
            </button>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{isGeneratingPdf ? "তৈরি হচ্ছে..." : "PDF ডাউনলোড"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
            title="প্রিন্ট করুন বা সেভ করুন"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 
        AUTHENTIC SSC BOARD EXAM PAPER CONTAINER
        Styling: Crisp off-white paper (#fff), classic serif typography (.font-bn),
        Official Bangladesh Secondary Education Board header, watermark overlay, 
        and authentic 2-column examination layout.
      */}
      <div
        ref={paperRef}
        id="ssc-board-paper"
        className="w-full max-w-5xl bg-white text-slate-950 p-4 sm:p-8 md:p-12 shadow-xl border-2 border-slate-300 rounded-sm relative overflow-hidden font-formal selection:bg-amber-100"
        style={{ minHeight: "1120px" }}
      >
        {/* Subtle Diagonal Translucent Watermark Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden flex flex-col justify-around opacity-[0.045] rotate-[-28deg] scale-125"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-around whitespace-nowrap text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest text-slate-900 gap-6"
            >
              <span>{brandName}</span>
              <span>•</span>
              <span className="lowercase tracking-normal">{websiteUrl}</span>
              <span>•</span>
              <span>{brandName}</span>
              <span>•</span>
              <span className="lowercase tracking-normal">{websiteUrl}</span>
            </div>
          ))}
        </div>

        {/* Content Layer (on top of watermark) */}
        <div className="relative z-10">
          {/* Top Paper Header: Government & Board Details */}
          <div className="text-center pb-4 border-b-2 border-slate-900 mb-4">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="h-6 w-6 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-[10px] border border-emerald-700 shrink-0">
                BD
              </div>
              <span className="text-[11px] sm:text-sm font-bold tracking-wide text-slate-800 uppercase leading-snug">
                <span className="hidden sm:inline">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার / </span>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-slate-950 mt-1 leading-snug">
              মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষা — {paper.year}
            </h1>
            <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-600 mt-0.5 font-sans">
              SECONDARY SCHOOL CERTIFICATE EXAMINATION
            </div>
            <div className="inline-block mt-2 px-3.5 py-0.5 border border-slate-900 rounded-md font-bold text-xs sm:text-sm text-slate-900 bg-slate-50">
              {paper.boardName}
            </div>
          </div>

          {/* Subject & Timing Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm font-bold border-b border-slate-400 pb-2 mb-3 gap-1.5 sm:gap-2">
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div>
                বিষয় কোড: <span className="font-extrabold underline">{paper.subjectCode}</span>
              </div>
              <div className="sm:hidden font-extrabold text-slate-950">
                বিষয়: {paper.subjectName}
              </div>
            </div>
            <div className="hidden sm:block text-center sm:text-base font-extrabold text-slate-950">
              বিষয়: {paper.subjectName}
            </div>
            <div className="text-left sm:text-right text-[11px] sm:text-xs text-slate-800">
              {paper.mcqMarks > 0 && <span>বহুনির্বাচনি: {toBn(paper.mcqMarks)} </span>}
              {paper.cqMarks > 0 && <span>| সৃজনশীল: {toBn(paper.cqMarks)} </span>}
              <span>| মোট পূর্ণমান: {toBn(paper.totalMarks)}</span>
            </div>
          </div>

          {/* Time Limit and Special Instructions */}
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-sm mb-6 text-xs text-slate-800 leading-relaxed">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center font-bold mb-1 border-b border-slate-200 pb-1 text-[11px] sm:text-xs gap-1">
              <span>
                সময়: {paper.mcqTime ? `বহুনির্বাচনি ${paper.mcqTime}` : ""}{" "}
                {paper.cqTime ? `| সৃজনশীল ${paper.cqTime}` : ""}
              </span>
              <span className="text-primary-800 font-extrabold text-left sm:text-right">
                {solvedMode ? "★ সলভড টেস্ট পেপার (বোল্ড উত্তর ও বোর্ড রেফারেন্সসহ)" : "★ পরীক্ষার্থী প্রশ্নপত্র (ব্ল্যাংক কপি)"}
              </span>
            </div>
            <p className="font-medium">
              [বিশেষ দ্রষ্টব্য: সরবরাহকৃত বহুনির্বাচনি অভীক্ষার উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে প্রদত্ত বর্ণসংবলিত বৃত্তটি বল পয়েন্ট কলম দ্বারা সম্পূর্ণ ভরাট করো। প্রতিটি প্রশ্নের মান 1। সৃজনশীল অংশে উদ্দীপক পড়ে যথাযথ উত্তর প্রদান করো।]
            </p>
          </div>

          {/* SECTION 1: বহুনির্বাচনি অভীক্ষা (MCQ) */}
          {hasMcqs && (
            <div className="mb-10">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1 mb-4">
                <h2 className="text-sm sm:text-base font-extrabold tracking-wide text-slate-950 uppercase flex items-center gap-1.5">
                  <Landmark className="h-4 w-4" />
                  <span>ক-বিভাগ: বহুনির্বাচনি অভীক্ষা (মান: {toBn(paper.mcqMarks || paper.questions.length)})</span>
                </h2>
                <span className="text-xs font-bold text-slate-600">
                  সময়: {paper.mcqTime || "25 মিনিট"}
                </span>
              </div>

              {/* 2-Column Board Examination Layout */}
              <div
                className={`grid gap-x-8 gap-y-5 ${
                  columns === "two" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {paper.questions.map((q: MCQQuestion, idx: number) => {
                  return (
                    <div
                      key={q.id || idx}
                      className="break-inside-avoid text-xs sm:text-sm text-slate-900 border-b md:border-b-0 pb-3 md:pb-0"
                    >
                      {/* Question Line with Number and Board Citation Tag */}
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div className="font-bold leading-snug">
                          <span className="font-extrabold mr-1 text-slate-950">{toBn(idx + 1)}.</span>
                          <span>{q.question}</span>
                        </div>
                      </div>

                      {/* Board Citation Badge (Pashe ba Niche - As requested by user) */}
                      {q.boardInfo && (
                        <div className="mb-1.5 flex flex-wrap items-center gap-1">
                          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            [{q.boardInfo}]
                          </span>
                          {q.frequencyTag && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                              {q.frequencyTag}
                            </span>
                          )}
                        </div>
                      )}

                      {/* 4 Options Grid (ক, খ, গ, ঘ) - Responsive for mobile & desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 pl-2 sm:pl-4 my-1.5 text-xs sm:text-[13px]">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = isOptionCorrect(opt, q.correctAnswer);
                          const shouldBold = solvedMode && isCorrect;

                          return (
                            <div
                              key={oIdx}
                              className={`flex items-start gap-1 py-0.5 ${
                                shouldBold
                                  ? "font-extrabold text-slate-950 underline decoration-slate-950 decoration-2"
                                  : "text-slate-800 font-normal"
                              }`}
                            >
                              {shouldBold && (
                                <Check className="h-3.5 w-3.5 text-green-700 shrink-0 mt-0.5 no-print" />
                              )}
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Optional Explanation Dropdown in Solved Mode */}
                      {solvedMode && q.explanation && (
                        <div className="mt-1 pl-4 text-[11px] text-slate-600 border-l-2 border-slate-300 py-0.5">
                          <span className="font-bold text-slate-800">ব্যাখ্যা:</span> {q.explanation}
                          {q.tips && (
                            <div className="text-emerald-700 font-semibold mt-0.5">
                              টিপস: {q.tips}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* OMR / Answer Sheet Key at bottom of MCQ */}
              {solvedMode && (
                <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-400 bg-slate-50 p-3 rounded-sm">
                  <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2 flex items-center justify-between">
                    <span>বহুনির্বাচনি উত্তরমালা (OMR Answer Key):</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      SSC Tutor AI Verified Answer Sheet
                    </span>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center text-xs">
                    {paper.questions.map((q, idx) => {
                      const optLabel = q.correctAnswer
                        ? q.correctAnswer.charAt(0)
                        : "-";
                      return (
                        <div
                          key={idx}
                          className="bg-white border border-slate-300 py-1 rounded text-[11px] font-bold"
                        >
                          <div className="text-slate-500 text-[9px]">{toBn(idx + 1)}</div>
                          <div className="text-slate-950 font-extrabold">{optLabel}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: সৃজনশীল প্রশ্নাবলি (CQ) */}
          {hasCqs && (
            <div className="mb-10 pt-4 border-t-2 border-slate-900">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1 mb-4">
                <h2 className="text-sm sm:text-base font-extrabold tracking-wide text-slate-950 uppercase flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>খ-বিভাগ: সৃজনশীল প্রশ্নাবলি (মান: {toBn(paper.cqMarks || paper.creativeQuestions.length * 10)})</span>
                </h2>
                <span className="text-xs font-bold text-slate-600">
                  সময়: {paper.cqTime || "2 ঘণ্টা 35 মিনিট"}
                </span>
              </div>

              <div className="text-xs text-slate-700 italic mb-4">
                [বিশেষ দ্রষ্টব্য: উদ্দীপকটি মনোযোগ দিয়ে পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও। প্রতিটি প্রশ্নের মান 10।]
              </div>

              <div className="space-y-6">
                {paper.creativeQuestions.map((cq: CQQuestion, cqIdx: number) => {
                  const isExpanded = expandedCqs[String(cqIdx)] ?? true;

                  return (
                    <div
                      key={cq.id || cqIdx}
                      className="border border-slate-300 rounded-sm p-4 bg-white break-inside-avoid"
                    >
                      {/* CQ Header & Board Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                        <div className="font-extrabold text-sm sm:text-base text-slate-950">
                          প্রশ্ন নং {toBn(cqIdx + 1)}:
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {cq.boardInfo && (
                            <span className="text-[11px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                              [{cq.boardInfo}]
                            </span>
                          )}
                          {cq.frequencyTag && (
                            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                              {cq.frequencyTag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stimulus (উদ্দীপক) */}
                      <div className="bg-slate-50 border-l-4 border-slate-800 p-3 mb-4 text-xs sm:text-sm text-slate-900 leading-relaxed font-serif">
                        <span className="font-bold underline mr-1.5">উদ্দীপক:</span>
                        <span>{cq.stimulus}</span>
                      </div>

                      {/* 4 Sub-questions: ক (১), খ (২), গ (৩), ঘ (৪) */}
                      <div className="space-y-2 text-xs sm:text-sm pl-2 mb-4">
                        {cq.subQuestions.map((sub, sIdx) => (
                          <div key={sIdx} className="flex justify-between items-start gap-3">
                            <div className="flex items-start gap-1.5">
                              <span className="font-extrabold text-slate-950 min-w-[20px]">
                                ({sub.part})
                              </span>
                              <span className="text-slate-900 font-medium">{sub.question}</span>
                            </div>
                            <span className="font-bold text-slate-700 shrink-0 text-xs sm:text-sm">
                              [{toBn(sub.marks)}]
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Model Solution / উত্তর নির্দেশিকা (Toggleable or Printable in Solved Mode) */}
                      {solvedMode && showModelSolutions && (
                        <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50/70 p-3 rounded text-xs text-slate-800">
                          <button
                            onClick={() => toggleCqExpand(String(cqIdx))}
                            className="no-print flex items-center justify-between w-full font-bold text-primary-800 text-xs pb-1 mb-2 border-b border-slate-200"
                          >
                            <span className="flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5 text-primary-600" />
                              <span>প্রশ্ন নং {toBn(cqIdx + 1)} এর নির্ভুল মডেল সমাধান ও মানবণ্টন নির্দেশিকা</span>
                            </span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          {/* Print Always Shows Full Solution; On-screen toggles */}
                          <div className={`space-y-3 ${isExpanded ? "block" : "hidden sm:block"}`}>
                            {cq.subQuestions.map((sub, sIdx) => (
                              <div key={sIdx} className="pl-2 border-l-2 border-primary-300">
                                <div className="font-bold text-slate-900 flex items-center justify-between">
                                  <span>
                                    ({sub.part}) {sub.type} (মান: {toBn(sub.marks)}):
                                  </span>
                                </div>
                                <div className="mt-1 text-slate-700 whitespace-pre-line leading-relaxed font-serif">
                                  {sub.answer}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Paper Footer with Branding & Watermark Text */}
          <div className="mt-10 pt-4 border-t-2 border-slate-900 flex flex-wrap justify-between items-center text-[10px] sm:text-xs text-slate-600 gap-2">
            <div>
              <span className="font-extrabold text-slate-900">{brandName}</span> — এনসিটিবি এসএসসি পাঠ্যক্রম ও বিগত 7 বছরের বোর্ড প্রশ্নব্যাংক বিশ্লেষণ
            </div>
            <div className="font-semibold text-slate-500">
              ওয়েবসাইট: {websiteUrl} | পরীক্ষার্থীর প্রস্তুতি নিশ্চিতকরণ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

