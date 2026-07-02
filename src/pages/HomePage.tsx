import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  BookCheck,
  ShieldCheck,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SEO } from "@/components/SEO";
import { useEffect, useState } from "react";

function AnimatedCounter({
  end,
  suffix = "",
  duration = 2,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);

      // Easing function (easeOutExpo)
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(end * easeOut));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Home"
        description="Free AI-powered SSC exam preparation platform in Bangladesh. Practice tests, chapter-wise MCQs, and an intelligent AI tutor for Science, Humanities, and Commerce students."
        href="/"
      />

      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* Radial Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-100/30 rounded-full blur-3xl opacity-70"></div>

          {/* Floating Blurred Circles with Parallax */}
          <motion.div
            style={{ y: y1 }}
            className="absolute top-20 left-10 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl"
          ></motion.div>

          {/* Floating Math Symbols */}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 left-[15%] text-4xl font-serif text-slate-300 pointer-events-none select-none"
          >
            ∑
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-40 right-[20%] text-5xl font-serif text-slate-300 pointer-events-none select-none"
          >
            ∫
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-1/2 right-[10%] text-3xl font-serif text-slate-300 pointer-events-none select-none"
          >
            √x
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute top-40 right-[30%] text-3xl font-serif text-slate-300 pointer-events-none select-none"
          >
            π
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-primary-200/50 bg-primary-50/50 backdrop-blur-md px-5 py-2 shadow-sm transition-all hover:bg-primary-50 hover:shadow-md"
            >
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                🇧🇩 100% Free • AI-Powered SSC Learning Platform
              </span>
            </motion.div>

            {/* Hero Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="mx-auto max-w-4xl font-bn text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl leading-[1.1]"
            >
              Master Every SSC Subject <br className="hidden sm:block" /> with{" "}
              <span className="text-primary-600 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
                Confidence
              </span>
            </motion.h1>

            {/* Hero Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-slate-600 font-bn"
            >
              Learn Smarter. Score Better. Your intelligent AI study assistant
              for the Bangladesh SSC curriculum. Clear doubts instantly and
              practice effectively.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/subjects"
                className="group relative flex w-full sm:w-auto items-center justify-center space-x-2 rounded-full bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(79,70,229,0.5)] transition-all hover:bg-primary-500 hover:shadow-[0_0_20px_0_rgba(79,70,229,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative z-10">Start Learning</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/tutor"
                className="group flex w-full sm:w-auto items-center justify-center space-x-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold leading-6 text-slate-900 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
              >
                <BrainCircuit className="h-4 w-4 text-primary-600 transition-transform group-hover:scale-110" />
                <span>Ask AI Tutor</span>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-medium text-slate-600"
            >
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <BookCheck className="h-4 w-4 text-blue-500" />
                <span>NCTB Curriculum</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <ShieldCheck className="h-4 w-4 text-primary-500" />
                <span>No Login Required</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <dt className="text-sm font-medium text-slate-500 mb-2">
                Total Subjects
              </dt>
              <dd className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
                <AnimatedCounter end={20} suffix="+" />
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <dt className="text-sm font-medium text-slate-500 mb-2">
                Chapters Covered
              </dt>
              <dd className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
                <AnimatedCounter end={500} suffix="+" />
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <dt className="text-sm font-medium text-slate-500 mb-2">
                Practice Questions
              </dt>
              <dd className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
                <AnimatedCounter end={1000} suffix="+" />
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <dt className="text-sm font-medium text-slate-500 mb-2">
                Access Fee
              </dt>
              <dd className="text-4xl font-extrabold tracking-tight text-primary-600 font-sans">
                Free
              </dd>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Learn Faster
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need for SSC preparation
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  Personal AI Teacher
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 font-bn">
                  <p className="flex-auto">
                    কঠিন বিষয়গুলো সহজ বাংলায় বুঝিয়ে দেবে আমাদের এআই। উদাহরণসহ
                    ধাপে ধাপে শেখো।
                  </p>
                </dd>
              </div>
              <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  All Subjects Covered
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 font-bn">
                  <p className="flex-auto">
                    বিজ্ঞান, মানবিক, কিংবা বাণিজ্য - সকল বিভাগের প্রতিটি বিষয়ের
                    অধ্যায়ভিত্তিক নোট ও গাইডলাইন।
                  </p>
                </dd>
              </div>
              <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  Board Standard
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 font-bn">
                  <p className="flex-auto">
                    NCTB কারিকুলাম ও বোর্ড পরীক্ষার স্ট্যান্ডার্ড অনুযায়ী
                    প্রস্তুতকৃত ম্যাটেরিয়ালস।
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
