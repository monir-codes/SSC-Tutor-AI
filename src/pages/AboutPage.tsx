import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Github, Globe, Linkedin, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

export function AboutPage() {
  const features = [
    { title: "AI-powered explanations", icon: BrainCircuit },
    { title: "Covers all SSC subjects", icon: BookOpen },
    { title: "NCTB curriculum focused", icon: BookOpen },
    { title: "Easy Bengali language", icon: Sparkles },
    { title: "Chapter-wise learning", icon: BookOpen },
    { title: "Real-life examples", icon: Sparkles },
    { title: "Exam-focused preparation", icon: BookOpen },
    { title: "Practice questions", icon: BookOpen },
    { title: "Student-friendly UI", icon: Sparkles },
    { title: "Completely Free", icon: CheckCircle2 },
    { title: "Open for Everyone", icon: CheckCircle2 },
  ];

  const skills = [
    "React", "Next.js", "Node.js", "Express.js", "MongoDB", "TypeScript", 
    "Tailwind CSS", "Firebase", "REST API", "AI Integration", "UI/UX Design", 
    "Figma", "Git", "GitHub", "Framer Motion", "Swiper", "TanStack Query", 
    "Axios", "JWT Authentication", "SEO Optimization"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <SEO 
        title="আমাদের লক্ষ্য ও উদ্যোগ | About SSC Tutor AI — Bangladesh Education"
        description="বাংলাদেশের ১০টি শিক্ষা বোর্ডের শিক্ষার্থীদের জন্য মানসম্মত ও সম্পূর্ণ বিনামূল্যে এসএসসি টেস্ট পেপার, বিগত 7 বছরের বোর্ড প্রশ্নব্যাংক ও এআই টিউটরিং প্ল্যাটফর্ম।"
        href="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About SSC Tutor AI",
          url: "https://ssc-tutor-ai.vercel.app/about",
          description: "Learn about the mission, vision, and creator behind SSC Tutor AI.",
          mainEntity: {
            "@type": "Person",
            name: "Md. Moniruzzaman (Rumman)",
            jobTitle: "Full Stack (MERN) Developer",
            url: "https://monir-uzzaman.vercel.app"
          }
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 sm:pt-20 pb-20 sm:pb-24 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              About This Platform
            </h1>
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300 font-bn">
              বাংলাদেশের প্রতিটি এসএসসি শিক্ষার্থীর জন্য মানসম্মত শিক্ষা সম্পূর্ণ বিনামূল্যে ও সহজবোধ্য করার এক উদ্যোগ।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission & Why */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Our Mission</h2>
              <div className="mt-6 space-y-5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-bn">
                <p>
                  এই প্ল্যাটফর্মটি তৈরি করা হয়েছে বিশেষ করে বাংলাদেশের 9ম, 10ম শ্রেণি এবং এসএসসি পরীক্ষার্থীদের জন্য, যা সম্পূর্ণভাবে জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)-এর সিলেবাস অনুসরণ করে।
                </p>
                <p>
                  প্রতিটি পাঠ্য বিষয়কে সহজ, নির্ভুল এবং ছাত্রবান্ধব ভাষায় ধাপে ধাপে উপস্থাপন করা হয়েছে, যাতে একজন শিক্ষার্থী ঘরে বসেই একজন অভিজ্ঞ প্রাইভেট শিক্ষকের মতো সহায়তা পায়।
                </p>
                <p>
                  কৃত্রিম বুদ্ধিমত্তা (AI) প্রযুক্তির সাহায্যে মুখস্থ বিদ্যার পরিবর্তে গভীর ধারণাগত বোঝাপড়াকে প্রাধান্য দিয়ে শিক্ষাকে আনন্দময় ও সহজলভ্য করাই আমাদের মূল লক্ষ্য।
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center rounded-3xl bg-primary-50 dark:bg-slate-950 p-6 sm:p-10 lg:p-12 border border-primary-100 dark:border-slate-800 shadow-sm"
            >
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Why This Exists</h2>
              <div className="mt-6 space-y-5 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-bn">
                <p>
                  অনেক শিক্ষার্থীর পক্ষেই ব্যয়বহুল কোচিং কিংবা প্রাইভেট টিউটর রাখা সম্ভব হয় না। আবার পাঠ্যবইয়ের কঠিন ভাষা বুঝতে গিয়ে অনেকের বিজ্ঞানের বিষয় ও গণিতে ভীতি তৈরি হয়।
                </p>
                <p>
                  এই সমস্যার সমাধান হিসেবে বিনামূল্যে এবং নির্ভুলভাবে যে কেউ যেন তার পড়ালেখার সব সন্দেহ দূর করতে পারে, সেই উদ্দেশ্যেই এই প্ল্যাটফর্মের জন্ম।
                </p>
                <p className="font-semibold text-primary-700 dark:text-primary-400">
                  আমাদের লক্ষ্য দেশের প্রত্যন্ত অঞ্চলসহ প্রতিটি এসএসসি শিক্ষার্থীর কাছে সর্বোচ্চ মানের ডিজিটাল শিক্ষা পৌঁছে দেওয়া।
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-slate-950 py-16 sm:py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              What Makes This Platform Different
            </h2>
          </div>
          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 sm:p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 hover:bg-white dark:hover:bg-slate-900"
                >
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">{feature.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white dark:bg-slate-950 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-900 p-8 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-400 via-transparent to-transparent"></div>
                <h3 className="text-primary-400 font-semibold tracking-wider text-xs sm:text-sm uppercase">Meet the Creator</h3>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Md. Moniruzzaman (Rumman)</h2>
                <p className="mt-3 text-lg sm:text-xl font-light text-slate-300">Full Stack (MERN) Developer</p>
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-400">
                  Passionate Full Stack Developer dedicated to building modern, user-friendly, and impactful digital solutions that make education more accessible for everyone.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="https://www.linkedin.com/in/moniruzzaman-rumman/" target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-[#0A66C2]">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://github.com/monir-codes/" target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-slate-700">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://monir-uzzaman.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-primary-500">
                    <Globe className="h-5 w-5" />
                  </a>
                  <a href="mailto:Monir.webdev@gmail.com" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-red-500">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12">
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base">
                  <p className="lead text-base sm:text-lg text-slate-600 dark:text-slate-300">
                    Hi, I'm Md. Moniruzzaman (Rumman), a Full Stack (MERN) Developer with a strong passion for creating scalable, modern, and user-centric web applications.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    I enjoy solving real-world problems through technology and continuously explore modern tools, AI, and innovative development practices to build meaningful digital experiences.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    This educational platform reflects my belief that quality education should never be limited by financial barriers. Every student deserves access to clear explanations, reliable learning resources, and an engaging learning experience.
                  </p>
                </div>

                <div className="mt-8 sm:mt-10">
                  <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="bg-slate-900 py-16 sm:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Future Vision</h2>
          <div className="mt-6 sm:mt-8 space-y-5 text-sm sm:text-lg leading-relaxed text-slate-300 font-bn">
            <p>
              আমাদের লক্ষ্য এই প্ল্যাটফর্মকে প্রতিনিয়ত উন্নত করা এবং ভবিষ্যতে এইচএসসি (HSC) শিক্ষার্থীদের জন্যও একই ধরণের মানসম্মত ও সহজবোধ্য লার্নিং ম্যাটেরিয়ালস যুক্ত করা।
            </p>
            <p className="font-semibold text-white">
              বাংলাদেশের প্রতিটি শিক্ষার্থী যাতে সমান সুযোগ নিয়ে নিজের মেধার সর্বোচ্চ বিকাশ ঘটাতে পারে, সেই অঙ্গীকার নিয়ে আমরা সামনে এগিয়ে যাচ্ছি।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
