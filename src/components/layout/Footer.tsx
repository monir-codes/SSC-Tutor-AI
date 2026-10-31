import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Github, Linkedin, Globe, CheckCircle2, Heart, ShieldCheck, FileText, Scale } from "lucide-react";
import { SSC_BOARDS } from "@/lib/sscBoardData";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-12 sm:pt-16 pb-10 transition-colors font-bn">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Institutional Identity Banner */}
        <div className="pb-8 mb-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center space-x-3.5">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white shadow-sm border border-emerald-500/30 shrink-0">
              <GraduationCap className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <span className="font-sans text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white whitespace-nowrap">
                  SSC TUTOR AI
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                  জাতীয় শিক্ষা পোর্টাল
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                বাংলাদেশ জাতীয় মাধ্যমিক ডিজিটাল প্রশ্নব্যাংক, টেস্ট পেপার ও এআই ক্লাসরুম
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>NCTB কারিকুলাম মানসম্মত</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span>10টি বোর্ড প্রশ্নব্যাংক</span>
            </span>
          </div>
        </div>

        {/* Multi-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Mission & Purpose */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider font-sans">
              জাতীয় শিক্ষা অঙ্গীকার
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              বাংলাদেশের প্রতিটি অঞ্চলের এসএসসি পরীক্ষার্থীর জন্য মানসম্মত শিক্ষা, বিগত 7 বছরের আসল বোর্ড প্রশ্ন, নির্ভুল সৃজনশীল মডেল উত্তর এবং হুবহু হলের টেস্ট পেপারের ফ্রি ডিজিটাল অধিকার নিশ্চিত করতে এই প্ল্যাটফর্মটি নির্মিত।
            </p>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-500 font-mono">
              অফিশিয়াল পোর্টাল: https://ssc-tutor-ai.vercel.app
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider font-sans">
              গুরুত্বপূর্ণ লিংকসমূহ
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {[
                { name: "হোম পেজ (Home)", href: "/" },
                { name: "টেস্ট পেপার ভল্ট (PDF Download)", href: "/model-tests?mode=test_paper" },
                { name: "অনলাইন বোর্ড পরীক্ষা (Exam)", href: "/model-tests?mode=board_exam" },
                { name: "এআই শিক্ষক ভাইয়া (AI Tutor)", href: "/tutor" },
                { name: "অধ্যায়ভিত্তিক ড্রিল (Drill)", href: "/practice" },
                { name: "আমাদের লক্ষ্য (About)", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Education Boards */}
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider font-sans">
              শিক্ষা বোর্ডসমূহ
            </h3>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm">
              {SSC_BOARDS.slice(1, 8).map((b) => (
                <li key={b.id}>
                  <Link
                    to={`/model-tests?mode=test_paper&board=${b.id}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {b.name.split(" (")[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Creator */}
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider font-sans">
              প্রকৌশল ও যোগাযোগ
            </h3>
            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              উন্নত এআই প্রযুক্তি ও এনসিটিবি কারিকুলাম সমন্বয়ে পরিচালিত জাতীয় ডিজিটাল সেবা।
            </p>
            <div className="mt-4 flex space-x-2.5">
              <a
                href="https://www.linkedin.com/in/moniruzzaman-rumman/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#0A66C2] hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/monir-codes/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-950 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://monir-uzzaman.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Portfolio"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-slate-500 dark:text-slate-400">
          {/* Copyright & National Initiative */}
          <div className="w-full sm:w-auto text-center sm:text-left leading-relaxed">
            <span className="font-sans font-bold text-slate-700 dark:text-slate-300">© 2026 SSC TUTOR AI</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline text-slate-500 dark:text-slate-400 font-bn mt-0.5 sm:mt-0">
              গণপ্রজাতন্ত্রী বাংলাদেশ জাতীয় মাধ্যমিক ডিজিটাল শিক্ষা উদ্যোগ
            </span>
          </div>

          {/* Credit & Dedication - Fully responsive, perfectly aligned on mobile and desktop */}
          <div className="w-full sm:w-auto text-center sm:text-right leading-relaxed font-sans text-xs">
            <p className="flex flex-wrap items-center justify-center sm:justify-end gap-1">
              <span>Designed &amp; Developed with</span>
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 inline-block shrink-0 mx-0.5" />
              <span className="font-bn">by</span>
              <a
                href="https://monir-uzzaman.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors ml-0.5"
              >
                Md. Moniruzzaman
              </a>
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bn mt-1 text-center sm:text-right">
              দেশের সকল এসএসসি পরীক্ষার্থীর জন্য নিবেদিত
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
