import { Link } from "react-router-dom";
import { BookOpen, Github, Linkedin, Globe, CheckCircle2, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-12 sm:pt-16 pb-8 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand & About */}
          <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-4">
            <div>
              <Link to="/" className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  SSC Tutor AI
                </span>
              </Link>
              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200 font-bn">
                বাংলাদেশের শিক্ষার্থীদের জন্য সহজ, নির্ভুল ও বিনামূল্যে ডিজিটাল শিক্ষা।
              </p>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              NCTB কারিকুলাম অনুযায়ী প্রতিটি বিষয়ের সহজবোধ্য ব্যাখ্যা, প্র্যাকটিস প্রশ্ন ও এআই সহায়তা।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 sm:mt-6 space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "AI Tutor", href: "/tutor" },
                { name: "Practice", href: "/practice" },
                { name: "Model Tests", href: "/model-tests" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Streams</h3>
            <ul className="mt-4 sm:mt-6 space-y-3">
              {[
                { name: "📘 Science (বিজ্ঞান)", href: "/subjects" },
                { name: "📙 Humanities (মানবিক)", href: "/subjects" },
                { name: "📗 Commerce (বাণিজ্য)", href: "/subjects" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400 font-bn"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Free & Open */}
          <div className="flex flex-col gap-4">
             <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Free & Open</h3>
                <div className="mt-4 sm:mt-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200 dark:border-slate-800">
                  <ul className="space-y-2.5">
                    {["100% Free to Use", "No Subscription Needed", "Open for Everyone"].map((item) => (
                      <li key={item} className="flex items-center text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="mr-2.5 h-4 w-4 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
             </div>
          </div>

          {/* Connect & Feedback */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Connect</h3>
              <div className="mt-4 sm:mt-6 flex space-x-3">
                <a
                  href="https://www.linkedin.com/in/moniruzzaman-rumman/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-[#0A66C2] hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/monir-codes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-900 hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://monir-uzzaman.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portfolio"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-primary-600 hover:text-white"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 sm:mt-16 flex flex-col items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 sm:pt-8 sm:flex-row gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            © 2026 SSC Tutor AI by Md. Moniruzzaman. All Rights Reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center sm:justify-start text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Made with <Heart className="mx-1 h-3.5 w-3.5 text-red-500 fill-red-500 shrink-0" /> in Bangladesh for every SSC Student.
          </p>
        </div>
      </div>
    </footer>
  );
}
