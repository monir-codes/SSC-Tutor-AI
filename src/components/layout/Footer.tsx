import { Link } from "react-router-dom";
import { BookOpen, Github, Linkedin, Globe, CheckCircle2, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div>
              <Link to="/" className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
                  SSC Tutor AI
                </span>
              </Link>
              <p className="mt-4 text-sm font-medium text-slate-700">
                Learn Every SSC Subject — Simple, Accurate & Student-Friendly.
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              This platform provides easy-to-understand, accurate, and high-quality learning resources for every SSC subject under the Bangladesh NCTB curriculum. Our goal is to make learning easier, clearer, and more enjoyable for every SSC student.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-900">Quick Links</h3>
            <ul className="mt-6 space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Practice", href: "/practice" },
                { name: "Model Tests", href: "/model-tests" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-900">Subjects</h3>
            <ul className="mt-6 space-y-4">
              {[
                { name: "📘 Science", href: "/subjects" },
                { name: "📙 Humanities (Arts)", href: "/subjects" },
                { name: "📗 Business Studies (Commerce)", href: "/subjects" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Free & Open */}
          <div className="lg:col-span-1 flex flex-col gap-6">
             <div>
                <h3 className="text-sm font-semibold text-slate-900">Free & Open</h3>
                <div className="mt-6 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                  <ul className="space-y-3">
                    {["100% Free to Use", "Open for Everyone", "No Hidden Charges"].map((item) => (
                      <li key={item} className="flex items-center text-sm font-medium text-slate-700">
                        <CheckCircle2 className="mr-3 h-5 w-5 text-accent-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-slate-500 italic">
                    "We believe quality education should be accessible to every SSC student."
                  </p>
                </div>
             </div>
          </div>

          {/* Connect & Feedback */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Connect With Me</h3>
              <div className="mt-6 flex space-x-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-[#0A66C2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://portfolio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portfolio"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-primary-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Feedback</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Found an error or have a suggestion? We'd love to hear from you. Your feedback helps improve this platform for everyone.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-200 pt-8 sm:flex-row gap-4 text-center sm:text-left">
          <p className="text-sm text-slate-500">
            © 2026 Monir. All Rights Reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center sm:justify-start text-sm text-slate-500">
            Made with <Heart className="mx-1 h-4 w-4 text-red-500 fill-red-500 shrink-0" /> in Bangladesh for every SSC Student.
          </p>
        </div>
      </div>
    </footer>
  );
}
