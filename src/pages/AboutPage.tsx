import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Github, Globe, Linkedin, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AboutPage() {
  const features = [
    { title: "AI-powered explanations", icon: BrainCircuit },
    { title: "Covers all SSC subjects", icon: BookOpen },
    { title: "NCTB curriculum focused", icon: BookOpen },
    { title: "Easy language", icon: Sparkles },
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-24 border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              About This Platform
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-slate-600">
              Making SSC Learning Easier, Smarter, and Accessible for Everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission & Why */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Our Mission</h2>
              <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                <p>
                  This platform was created especially for Class 9, Class 10, and SSC students of Bangladesh following the latest NCTB curriculum.
                </p>
                <p>
                  Every lesson is explained in a simple, accurate, student-friendly, and easy-to-understand way so that students can understand difficult topics as if they were learning from an experienced private tutor.
                </p>
                <p>
                  Powered by AI, the platform focuses on conceptual understanding instead of memorization. Learning should be enjoyable, interactive, and accessible to everyone.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center rounded-3xl bg-primary-50 p-8 sm:p-10 lg:p-12 ring-1 ring-primary-100"
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why This Exists</h2>
              <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-700">
                <p>
                  Many students cannot afford quality coaching or private tutors. Many struggle to understand textbook language.
                </p>
                <p>
                  Many become afraid of Mathematics, Science, English, and other subjects because explanations are often too difficult. This platform was built to remove those barriers.
                </p>
                <p className="font-semibold text-primary-700">
                  Our goal is to make high-quality education available to every SSC student completely free of cost. Students should feel confident, curious, and motivated to learn.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">What Makes This Platform Different</h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-200 hover:bg-white"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-slate-900">{feature.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 bg-slate-900 p-12 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-400 via-transparent to-transparent"></div>
                <h3 className="text-primary-400 font-semibold tracking-wider text-sm uppercase">Meet the Creator</h3>
                <h2 className="mt-2 text-4xl font-bold">Md. Moniruzzaman (Rumman)</h2>
                <p className="mt-4 text-xl font-light text-slate-300">Full Stack (MERN) Developer</p>
                <p className="mt-6 text-base leading-relaxed text-slate-400">
                  Passionate Full Stack Developer dedicated to building modern, user-friendly, and impactful digital solutions that make education more accessible for everyone.
                </p>
                
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="https://www.linkedin.com/in/moniruzzaman-rumman/" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#0A66C2]">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://github.com/monir-codes" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-slate-700">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://monir-uzzaman.vercel.app" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary-500">
                    <Globe className="h-5 w-5" />
                  </a>
                  <a href="mailto:Monir.webdev@gmail.com" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-red-500">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-7 p-10 sm:p-12">
                <div className="prose prose-slate max-w-none">
                  <p className="lead text-lg text-slate-600">
                    Hi, I'm Md. Moniruzzaman (Rumman), a Full Stack (MERN) Developer with a strong passion for creating scalable, modern, and user-centric web applications.
                  </p>
                  <p>
                    I enjoy solving real-world problems through technology and continuously explore modern tools, AI, and innovative development practices to build meaningful digital experiences.
                  </p>
                  <p>
                    This educational platform reflects my belief that quality education should never be limited by financial barriers. Every student deserves access to clear explanations, reliable learning resources, and an engaging learning experience.
                  </p>
                  <p>
                    My goal is not only to build software but also to create solutions that positively impact students and society.
                  </p>
                </div>

                <div className="mt-12">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-200/50">
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
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Future Vision</h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-slate-300">
            <p>
              This platform is only the beginning.
            </p>
            <p>
              Our vision is to continuously improve and expand this learning platform with more interactive features, smarter AI assistance, chapter-wise practice, model tests, progress tracking, and personalized learning experiences.
            </p>
            <p>
              In the future, we aim to support HSC students, helping them prepare for higher-level academic challenges with the same commitment to simplicity, quality, and accessibility.
            </p>
            <p className="font-semibold text-white">
              We also aspire to build one of Bangladesh's most trusted AI-powered educational platforms, where every learner—regardless of financial background—can access high-quality education completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 bg-white text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <blockquote className="text-2xl sm:text-3xl font-medium text-slate-900 italic leading-relaxed">
            "Education becomes truly meaningful when quality learning is accessible to everyone."
          </blockquote>
          <p className="mt-10 text-lg text-slate-600">
            Thank you for being a part of this journey.
            <br />
            Together, let's make learning simpler, smarter, and available to every student.
          </p>
        </div>
      </section>
    </div>
  );
}
