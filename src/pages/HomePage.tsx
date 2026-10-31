import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  BookCheck,
  ShieldCheck,
  Gift,
  Library,
  FileQuestion,
  FileText,
  Unlock,
  Landmark,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Check,
  Star,
  Users,
  MessageSquareQuote,
  HelpCircle,
  Layers,
  Play,
  RotateCcw,
  Bell,
  Scale,
  Building2,
  ExternalLink,
  Flame,
  Clock,
  Laptop,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import { SSC_BOARDS, SSC_SUBJECTS } from "@/lib/sscBoardData";

// Hero Slider Data: Educational & Board / NCTB Focused Imagery
const heroSlides = [
  {
    id: 1,
    tag: "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) • অনুমোদিত মাধ্যমিক সংকলন",
    tagIcon: Landmark,
    title: "বিগত 7 বছরের আসল টেস্ট পেপার ও সুপার সাজেশন",
    subtitle:
      "ঢাকা, রাজশাহী, চট্টগ্রামসহ 10টি শিক্ষা বোর্ডের সর্বাধিক কমন ও রিপিটেড প্রশ্নাবলি নিয়ে হুবহু হলের আদলে টেস্ট পেপার, বোল্ড উত্তরসহ A4 PDF ডাউনলোড এবং এনসিটিবি কারিকুলামের নির্ভুল সমাধান।",
    primaryBtn: {
      text: "টেস্ট পেপার সলভ ও PDF",
      link: "/model-tests?mode=test_paper",
      icon: FileText,
    },
    secondaryBtn: {
      text: "অনলাইন বোর্ড পরীক্ষা দিন",
      link: "/model-tests?mode=board_exam",
      icon: Play,
    },
    metaPills: ["10টি শিক্ষা বোর্ড", "2018–2024 প্রশ্নব্যাংক", "অফিশিয়াল A4 PDF"],
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=85",
    accentColor: "emerald",
  },
  {
    id: 2,
    tag: "সার্বক্ষণিক দেশীয় এআই শিক্ষক ভাইয়া • 24/7 ফ্রি ক্লাসরুম",
    tagIcon: BrainCircuit,
    title: "বইয়ের কঠিন পড়া এখন পছন্দের শিক্ষকের মতো সহজ বাংলায়",
    subtitle:
      "রিকশার জড়তা, ক্রিকেটের ভরবেগ কিংবা রান্নার রসায়ন—বাস্তব জীবনের মিষ্টি উদাহরণ দিয়ে বিজ্ঞান, গণিত ও যেকোনো বিষয়ের ডাউট ক্লিয়ার করো এক নিমিষে।",
    primaryBtn: {
      text: "এআই শিক্ষক ভাইয়ার ক্লাসরুম",
      link: "/tutor",
      icon: BrainCircuit,
    },
    secondaryBtn: {
      text: "সকল বিষয়ের অধ্যায় গাইড",
      link: "/subjects",
      icon: BookOpen,
    },
    metaPills: ["বাস্তব জীবনের উদাহরণ", "LaTeX গাণিতিক সূত্র", "ধাপে ধাপে সমাধান"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=85",
    accentColor: "blue",
  },
  {
    id: 3,
    tag: "রিয়েল-টাইম বোর্ড এক্সাম হল সিমুলেটর • ঘড়ি ধরে হলের প্রস্তুতি",
    tagIcon: Clock,
    title: "পরীক্ষার হলে যাওয়ার আগেই সম্পূর্ণ ভয় দূর করুন",
    subtitle:
      "25 মিনিটে 25টি বহুনির্বাচনি ও 2 ঘণ্টা 35 মিনিটে 5টি সৃজনশীল লেখার সঠিক টাইম ম্যানেজমেন্ট শিখুন, ওএমআর শিট ফিলআপ করুন এবং অটো স্কোরকার্ড পান।",
    primaryBtn: {
      text: "অনলাইন পরীক্ষা শুরু করুন",
      link: "/model-tests?mode=board_exam",
      icon: Landmark,
    },
    secondaryBtn: {
      text: "টেস্ট পেপার সংগ্রহ করুন",
      link: "/model-tests?mode=test_paper",
      icon: FileText,
    },
    metaPills: ["OMR উত্তরমালা", "স্বয়ংক্রিয় মূল্যায়ন", "নেগেটিভ মার্কিং ফ্রি"],
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2000&q=85",
    accentColor: "purple",
  },
];

const officialBoards = [
  {
    id: "all",
    name: "কেন্দ্রীয় সুপার সাজেশন ভল্ট",
    subtitle: "বিগত 7 বছরের সর্বাধিক কমন ও রিপিটেড প্রশ্নাবলি",
    code: "NCTB-ALL",
    est: "2018–2024",
    color: "from-blue-700 to-indigo-900",
    badge: "99% সুপার সাজেশন",
    icon: Award,
    isSuper: true,
  },
  {
    id: "dhaka",
    name: "ঢাকা শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Dhaka",
    code: "DB-101",
    est: "1921",
    color: "from-emerald-700 to-slate-900",
    badge: "সর্বাধিক পরীক্ষার্থী",
    icon: Landmark,
  },
  {
    id: "rajshahi",
    name: "রাজশাহী শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Rajshahi",
    code: "RB-102",
    est: "1961",
    color: "from-blue-800 to-slate-900",
    badge: "উচ্চ পাসের হার",
    icon: Landmark,
  },
  {
    id: "chittagong",
    name: "চট্টগ্রাম শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Chattogram",
    code: "CB-103",
    est: "1995",
    color: "from-teal-800 to-slate-900",
    badge: "মানসম্মত প্রশ্নপত্র",
    icon: Landmark,
  },
  {
    id: "comilla",
    name: "কুমিল্লা শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Cumilla",
    code: "COB-104",
    est: "1962",
    color: "from-cyan-800 to-slate-900",
    badge: "ঐতিহ্যবাহী বোর্ড",
    icon: Landmark,
  },
  {
    id: "jessore",
    name: "যশোর শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Jashore",
    code: "JB-105",
    est: "1963",
    color: "from-amber-800 to-slate-900",
    badge: "দক্ষিণ-পশ্চিমাঞ্চল",
    icon: Landmark,
  },
  {
    id: "dinajpur",
    name: "দিনাজপুর শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Dinajpur",
    code: "DIB-106",
    est: "2006",
    color: "from-purple-800 to-slate-900",
    badge: "উত্তরাঞ্চল জোন",
    icon: Landmark,
  },
  {
    id: "barisal",
    name: "বরিশাল শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Barishal",
    code: "BB-107",
    est: "1999",
    color: "from-rose-800 to-slate-900",
    badge: "দক্ষিণাঞ্চল জোন",
    icon: Landmark,
  },
  {
    id: "sylhet",
    name: "সিলেট শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Sylhet",
    code: "SB-108",
    est: "1999",
    color: "from-indigo-800 to-slate-900",
    badge: "পূর্বাঞ্চল জোন",
    icon: Landmark,
  },
  {
    id: "mymensingh",
    name: "ময়মনসিংহ শিক্ষা বোর্ড",
    subtitle: "Board of Intermediate & Secondary Education, Mymensingh",
    code: "MB-109",
    est: "2017",
    color: "from-emerald-900 to-slate-950",
    badge: "নতুন বোর্ড প্রশ্ন",
    icon: Landmark,
  },
  {
    id: "madrasah",
    name: "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড",
    subtitle: "Bangladesh Madrasah Education Board (দাখিল)",
    code: "MDB-110",
    est: "1979",
    color: "from-green-800 to-slate-900",
    badge: "দাখিল পরীক্ষা",
    icon: Landmark,
  },
];

const testimonials = [
  {
    name: "তাহসিন আহমেদ",
    role: "এসএসসি 2025 পরীক্ষার্থী (বিজ্ঞান বিভাগ)",
    institution: "ঢাকা রেসিডেন্সিয়াল মডেল কলেজ",
    quote:
      "বিগত 7 বছরের বোর্ড প্রশ্নগুলো একদম পরীক্ষার হলের মতো 2-কলাম অফিসিয়াল লেআউটে পেয়েছি। বহুনির্বাচনির বোল্ড উত্তর এবং নিচে ওএমআর শিট থাকায় সময় ধরে প্র্যাকটিস করা ও A4 PDF প্রিন্ট নেওয়া দারুণ সহজ হয়েছে।",
    rating: 5,
  },
  {
    name: "সামিয়া আক্তার",
    role: "এসএসসি পরীক্ষার্থী",
    institution: "ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ",
    quote:
      "সৃজনশীল প্রশ্নের ক, খ, গ, ঘ এর এত নিখুঁত ও এনসিটিবি গাইডলাইনসম্মত মডেল সমাধান ইন্টারনেটে আর কোথাও পাইনি। প্রতিটি প্রশ্নের সাথে কোন কোন বোর্ডে কতবার রিপিট হয়েছে তা উল্লেখ থাকায় রিভিশনে সময় বাঁচে।",
    rating: 5,
  },
  {
    name: "এম. এ. রহমান",
    role: "সিনিয়র শিক্ষক (পদার্থবিজ্ঞান ও গণিত)",
    institution: "রাজশাহী গভ. মডেল স্কুল অ্যান্ড কলেজ",
    quote:
      "আমার ব্যাচের শিক্ষার্থীদের এখন এই পোর্টাল থেকে টেস্ট পেপার প্রিন্ট দিয়ে মক টেস্ট নেই। ওয়াটারমার্ক, ফন্ট ও লেআউট একদম সরকারি পরীক্ষার প্রশ্নপত্রের সমমানের। এটি দেশের শিক্ষার্থীদের জন্য একটি মাইলফলক।",
    rating: 5,
  },
];

const institutionalFaqs = [
  {
    q: "এই পোর্টালের প্রশ্নগুলো কি সরকারি এসএসসি পরীক্ষার আসল বিগত বছরের প্রশ্ন?",
    a: "হ্যাঁ, সম্পূর্ণভাবে। জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত পাঠ্যক্রম অনুযায়ী 2018 থেকে 2024 সাল পর্যন্ত ঢাকা, রাজশাহী, চট্টগ্রাম, কুমিল্লা, যশোর, দিনাজপুর, বরিশাল, সিলেট, ময়মনসিংহ ও মাদ্রাসা বোর্ডের অনুষ্ঠিত পরীক্ষার মূল প্রশ্নপত্র পর্যালোচনা করে এটি তৈরি করা হয়েছে।",
  },
  {
    q: "টেস্ট পেপারে বহুনির্বাচনি (MCQ) উত্তরগুলো কি বোল্ড করা থাকবে?",
    a: "হ্যাঁ! সলভড টেস্ট পেপার মোডে বহুনির্বাচনির সঠিক উত্তরটি অফিশিয়াল প্রশ্নপত্রে বোল্ড (Bold & Underlined) করা থাকে। এছাড়াও শিক্ষক বা পরীক্ষার্থীর সুবিধার্থে এক ক্লিকে 'পরীক্ষার্থী কপি' নির্বাচন করে উত্তরবিহীন আসল ব্ল্যাংক প্রশ্নপত্র দেখার এবং প্রিন্ট করার ব্যবস্থাও রয়েছে।",
  },
  {
    q: "সৃজনশীল (CQ) প্রশ্নের উদ্দীপক ও উত্তরগুলো কি নির্ভুল?",
    a: "আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী ও এআই মডেল প্রতিটি সৃজনশীলের উদ্দীপক, জ্ঞানমূলক (1), অনুধাবনমূলক (2), প্রয়োগমূলক (3) এবং উচ্চতর দক্ষতামূলক (4) প্রশ্নের ধাপে ধাপে এনসিটিবি মানবণ্টন অনুযায়ী 100% নির্ভুল মডেল উত্তর প্রস্তুত করেছে।",
  },
  {
    q: "মোবাইল বা ল্যাপটপ থেকে সরাসরি A4 PDF কীভাবে ডাউনলোড করা যাবে?",
    a: "যেকোনো টেস্ট পেপার ওপেন করার পর উপরের টুলবার থেকে 'PDF ডাউনলোড' বাটনে ক্লিক করলেই আপনার ডিভাইসে স্বয়ংক্রিয়ভাবে ঝকঝকে হাই-রেজ্যুলেশন A4 সাইজের ওয়াটারমার্কযুক্ত PDF ফাইল সেভ হয়ে যাবে। এছাড়া সরাসরি 'প্রিন্ট' অপশন দিয়েও প্রিন্ট নেওয়া যাবে।",
  },
  {
    q: "এই জাতীয় ডিজিটাল সেবা কি সম্পূর্ণ বিনামূল্যে উন্মুক্ত?",
    a: "হ্যাঁ, এটি বাংলাদেশের 64 জেলার সকল প্রান্তের শিক্ষার্থীদের জন্য শতভাগ বিনামূল্যে উন্মুক্ত একটি জাতীয় ডিজিটাল শিক্ষা উদ্যোগ। কোনো প্রকার সাবস্ক্রিপশন ফি বা সাইন-আপের প্রয়োজন নেই।",
  },
];

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeStream, setActiveStream] = useState<"science" | "humanities" | "commerce">("science");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play Slider effect
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5500);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const filteredSubjects = SSC_SUBJECTS.filter((s) => s.stream === activeStream);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEO
        title="SSC Tutor AI | National Secondary Board Examination Portal & Digital Academy"
        description="Official National Digital Learning & Examination Platform for Bangladesh SSC Candidates. Access past 7 years authentic board test papers, watermarked A4 PDFs, bold answers, CQ model solutions, and intelligent AI tutoring."
        href="/"
      />

      {/* OFFICIAL GOVERNMENT ANNOUNCEMENT BULLETIN TICKER */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-3 sm:px-6 lg:px-8 text-xs font-bn overflow-hidden select-none">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          {/* Fixed Badge on the left */}
          <div className="flex items-center gap-1.5 bg-red-600 text-white font-black px-2.5 py-1 rounded shadow-sm text-[11px] tracking-wide uppercase shrink-0 z-20">
            <Bell className="h-3.5 w-3.5 animate-pulse text-amber-300" />
            <span className="whitespace-nowrap">জরুরি বুলেটিন</span>
          </div>

          {/* Continuous Infinite Marquee with Soft Edge Gradients */}
          <Link
            to="/model-tests?mode=test_paper"
            className="relative flex-1 overflow-hidden block py-0.5 group cursor-pointer"
            title="জরুরি বুলেটিন ও টেস্ট পেপার সংগ্রহ করতে ক্লিক করুন"
          >
            {/* Left and right soft edge gradients */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-900 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-900 to-transparent z-10" />

            <div className="animate-bulletin-marquee items-center text-slate-300 font-medium text-xs sm:text-sm">
              {/* Announcement Block 1 */}
              <span className="inline-flex items-center gap-6 pr-6">
                <span>
                  📢 <strong className="text-white font-bold">মাধ্যমিক স্কুল সার্টিফিকেট (এসএসসি) পরীক্ষা 2025–26:</strong> সকল শিক্ষা বোর্ডের বিগত 7 বছরের আসল প্রশ্নব্যাংক ও নির্ভুল টেস্ট পেপার সম্পূর্ণ বিনামূল্যে উন্মুক্ত করা হয়েছে।
                </span>
                <span className="text-slate-600">•</span>
                <span>
                  ★ <strong className="text-white font-bold">হুবহু বোর্ড মানবণ্টন:</strong> বহুনির্বাচনির বোল্ড উত্তর এবং সৃজনশীল (CQ) মডেল সমাধানসহ হলের আদলে A4 সাইজের PDF ডাউনলোড করুন।
                </span>
                <span className="text-slate-600">•</span>
                <span>
                  ★ <strong className="text-white font-bold">24/7 এআই শিক্ষক:</strong> যেকোনো বিষয়ের কঠিন সমীকরণ বা পড়া এক ক্লিকে সহজ বাংলায় ক্লাসরুমে বুঝে নিন।
                </span>
              </span>

              {/* Announcement Block 2 (Duplicate for seamless infinite scroll) */}
              <span className="inline-flex items-center gap-6 pr-6" aria-hidden="true">
                <span>
                  📢 <strong className="text-white font-bold">মাধ্যমিক স্কুল সার্টিফিকেট (এসএসসি) পরীক্ষা 2025–26:</strong> সকল শিক্ষা বোর্ডের বিগত 7 বছরের আসল প্রশ্নব্যাংক ও নির্ভুল টেস্ট পেপার সম্পূর্ণ বিনামূল্যে উন্মুক্ত করা হয়েছে।
                </span>
                <span className="text-slate-600">•</span>
                <span>
                  ★ <strong className="text-white font-bold">হুবহু বোর্ড মানবণ্টন:</strong> বহুনির্বাচনির বোল্ড উত্তর এবং সৃজনশীল (CQ) মডেল সমাধানসহ হলের আদলে A4 সাইজের PDF ডাউনলোড করুন।
                </span>
                <span className="text-slate-600">•</span>
                <span>
                  ★ <strong className="text-white font-bold">24/7 এআই শিক্ষক:</strong> যেকোনো বিষয়ের কঠিন সমীকরণ বা পড়া এক ক্লিকে সহজ বাংলায় ক্লাসরুমে বুঝে নিন।
                </span>
              </span>
            </div>
          </Link>

          {/* Quick Vault Action Link */}
          <Link
            to="/model-tests?mode=test_paper"
            className="hidden md:inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 font-bold shrink-0 text-xs transition-colors hover:underline"
          >
            <span>টেস্ট পেপার ভল্ট &rarr;</span>
          </Link>
        </div>
      </div>

      {/* FULL-WIDTH HIGH-IMPACT EDUCATION HERO SLIDER / SWIPER */}
      <section
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            {/* Background Image with Deep National Institutional Overlay */}
            <img
              src={currentHero.image}
              alt={currentHero.title}
              className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
            />
            {/* Multi-layered Vignette & Dark Gradients for 100% Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50"></div>
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/60 to-slate-950/90"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(2,6,23,0.95)_100%)]"></div>
          </motion.div>
        </AnimatePresence>

        {/* Foreground Content Container with Unclipped Bengali Typography */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 w-full">
          <div className="max-w-3xl font-bn">
            {/* Official Badge Pill with generous line-height */}
            <motion.div
              key={`badge-${currentHero.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-emerald-300 mb-4 sm:mb-6 shadow-sm max-w-full"
            >
              <currentHero.tagIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
              <span className="leading-normal truncate sm:whitespace-normal">{currentHero.tag}</span>
            </motion.div>

            {/* Main Headline - Fixed top clipping with leading-[1.3] and py-1.5 */}
            <motion.div
              key={`title-${currentHero.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="py-1"
            >
              <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.3] sm:leading-[1.32] drop-shadow-sm">
                {currentHero.title}
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              key={`sub-${currentHero.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="mt-3 sm:mt-5 text-sm sm:text-lg md:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl drop-shadow-xs"
            >
              {currentHero.subtitle}
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              key={`actions-${currentHero.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 font-bn"
            >
              <Link
                to={currentHero.primaryBtn.link}
                className="flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black shadow-xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <currentHero.primaryBtn.icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 shrink-0" />
                <span>{currentHero.primaryBtn.text}</span>
                <ArrowRight className="h-4 w-4 ml-1 shrink-0" />
              </Link>

              <Link
                to={currentHero.secondaryBtn.link}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md px-5 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <currentHero.secondaryBtn.icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 shrink-0" />
                <span>{currentHero.secondaryBtn.text}</span>
              </Link>
            </motion.div>

            {/* Trust Pills under Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-slate-300">
              {currentHero.metaPills.map((pill, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-xs"
                >
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 shrink-0" />
                  <span>{pill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Left & Right Slider Arrow Navigation (Hidden on mobile to never block text) */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all hover:scale-110 shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all hover:scale-110 shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom Pagination Controls (Responsive on all screen sizes) */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="md:hidden text-white/70 hover:text-white p-1"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-6 sm:w-8 bg-emerald-400 shadow-md"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="md:hidden text-white/70 hover:text-white p-1"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* QUICK STATS & DIRECTORY HIGHLIGHT STRIP */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 font-bn">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">10টি</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">শিক্ষা বোর্ড প্রশ্নব্যাংক</div>
            </div>
            <div className="p-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">7 বছর</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">আসল প্রশ্ন (2018–2024)</div>
            </div>
            <div className="p-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">100%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">এনসিটিবি কারিকুলাম মানসম্মত</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-primary-600 dark:text-primary-400">0 টাকা</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">সম্পূর্ণ জাতীয় ডিজিটাল সেবা</div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 OFFICIAL EDUCATION BOARDS DIRECTORY */}
      <section className="py-16 sm:py-24 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-bn">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800 mb-2">
                <Building2 className="h-3.5 w-3.5" />
                <span>জাতীয় শিক্ষা বোর্ড ডিরেক্টরি</span>
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white">
                10টি শিক্ষা বোর্ডের আসল প্রশ্নপত্র সংগ্রহশালা
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                আপনার নিজ শিক্ষা বোর্ড নির্বাচন করে বিগত 2018 থেকে 2024 সালের অনুষ্ঠিত পরীক্ষার সম্পূর্ণ প্রশ্নপত্র ও টেস্ট পেপার সংগ্রহ করুন।
              </p>
            </div>

            <Link
              to="/model-tests?mode=test_paper"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-primary-700 dark:text-primary-400 hover:text-primary-800 self-start md:self-auto"
            >
              <span>সকল বোর্ড পেপার ভল্ট</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Boards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {officialBoards.map((board) => {
              const IconComponent = board.icon;

              return (
                <div
                  key={board.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    board.isSuper
                      ? "bg-gradient-to-br from-slate-900 via-primary-950 to-slate-950 text-white border-primary-500/40 shadow-md sm:col-span-2 lg:col-span-1 xl:col-span-2"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 shadow-2xs hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase font-sans ${
                          board.isSuper
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {board.code}
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          board.isSuper ? "text-amber-300" : "text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {board.badge}
                      </span>
                    </div>

                    <div className="flex items-start space-x-3 mb-2">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          board.isSuper
                            ? "bg-primary-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3
                          className={`font-black text-base sm:text-lg leading-snug ${
                            board.isSuper ? "text-white" : "text-slate-950 dark:text-white"
                          }`}
                        >
                          {board.name}
                        </h3>
                        <p
                          className={`text-xs mt-0.5 line-clamp-1 ${
                            board.isSuper ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {board.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs font-bold">
                    <Link
                      to={`/model-tests?mode=test_paper&board=${board.id}`}
                      className={`flex-1 py-2 px-2 sm:px-2.5 rounded-lg text-center transition-colors flex items-center justify-center gap-1 min-w-0 ${
                        board.isSuper
                          ? "bg-white text-slate-950 hover:bg-slate-100 font-extrabold"
                          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">টেস্ট পেপার ও PDF</span>
                    </Link>

                    <Link
                      to={`/model-tests?mode=board_exam&board=${board.id}`}
                      className={`py-2 px-2.5 sm:px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1 shrink-0 ${
                        board.isSuper
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs"
                      }`}
                      title="অনলাইন পরীক্ষা"
                    >
                      <Play className="h-3 w-3 fill-current shrink-0" />
                      <span>পরীক্ষা</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NATIONAL TEST PAPER & SUBJECT VAULT */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-bn">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
              <BookCheck className="h-3.5 w-3.5" />
              <span>এনসিটিবি অনুমোদিত বিষয়সমূহ</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white">
              বিষয়ভিত্তিক টেস্ট পেপার ও প্রশ্নব্যাংক ভল্ট
            </h2>
            <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400">
              অফিশিয়াল বিষয় কোড অনুযায়ী প্রতিটি বিষয়ের বহুনির্বাচনি ও সৃজনশীল পূর্ণাঙ্গ প্রশ্নপত্র।
            </p>

            {/* Responsive Stream Filter Switcher */}
            <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl max-w-md mx-auto mt-6 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveStream("science")}
                className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeStream === "science"
                    ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="sm:hidden">বিজ্ঞান</span>
                <span className="hidden sm:inline">বিজ্ঞান বিভাগ</span>
              </button>
              <button
                onClick={() => setActiveStream("humanities")}
                className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeStream === "humanities"
                    ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="sm:hidden">মানবিক</span>
                <span className="hidden sm:inline">মানবিক বিভাগ</span>
              </button>
              <button
                onClick={() => setActiveStream("commerce")}
                className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeStream === "commerce"
                    ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="sm:hidden">ব্যবসায়</span>
                <span className="hidden sm:inline">ব্যবসায় শিক্ষা</span>
              </button>
            </div>
          </div>

          {/* Subject Dossiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredSubjects.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      কোড: {sub.code}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      পূর্ণমান: {sub.fullMarks.total}
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-slate-950 dark:text-white mb-1">
                    {sub.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    <div>MCQ: {sub.fullMarks.mcq} নম্বর ({sub.duration.mcq})</div>
                    {sub.fullMarks.cq > 0 && <div>CQ: {sub.fullMarks.cq} নম্বর ({sub.duration.cq})</div>}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-bold">
                  <Link
                    to={`/model-tests?mode=test_paper&subject=${sub.id}`}
                    className="flex-1 py-2 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-center flex items-center justify-center gap-1 transition-colors min-w-0"
                  >
                    <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">টেস্ট পেপার ও PDF</span>
                  </Link>

                  <Link
                    to={`/subjects/${sub.id}`}
                    className="py-2 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors shrink-0"
                    title="অধ্যায়ভিত্তিক নোট"
                  >
                    নোট
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PEDAGOGICAL ARCHITECTURE & RESEARCH STANDARDS */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden font-bn">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-primary-300 border border-white/10 mb-3">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>জাতীয় আধুনিক শিক্ষণ পদ্ধতি</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
              বোর্ড পরীক্ষার সম্পূর্ণ প্রস্তুতির 4টি স্তম্ভ
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg">
              মুখস্থবিদ্যা নয়, বাস্তব জীবনের দারুণ উদাহরণ আর নির্ভুল অনুশীলনের মাধ্যমে নিশ্চিত করো এ-প্লাস।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">1. হলের আসল পেপার নকশা</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                অফিসিয়াল 2-কলাম প্রশ্নপত্র, বিষয় কোড এবং বিশেষ দ্রষ্টব্য সহ হুবহু বোর্ডের পরীক্ষার কাগজের অনুরূপ।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">2. বোর্ড রিপিটিশন গবেষণা</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                বিগত 7 বছরের প্রশ্নগুলোর মধ্যে কোনগুলো বিভিন্ন বোর্ডে বারবার কমন এসেছে তা যাচাই করে সেরা সংকলন।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                <BookCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">3. বোল্ড উত্তর ও CQ মানবণ্টন</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                MCQ-এর সঠিক উত্তর স্পষ্ট বোল্ড করা এবং সৃজনশীল অংশের ক, খ, গ, ঘ এর পূর্ণাঙ্গ শিক্ষক-সুলভ সঠিক মডেল সমাধান।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">4. অফিশিয়াল A4 PDF এক্সপোর্ট</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ssc-tutor-ai.vercel.app জলছাপযুক্ত অফিশিয়াল A4 সাইজের মাল্টি-পেজ PDF এক ক্লিকে ডাউনলোড ও প্রিন্ট।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-bn">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-2">
              <Users className="h-3.5 w-3.5 text-primary-600" />
              <span>বিভাগীয় শিক্ষার্থী ও শিক্ষক মতামত</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white">
              সারাদেশের শিক্ষার্থীদের অভিজ্ঞতা
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-500 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-950 dark:text-white text-base">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.role} • {t.institution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FAQ */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-bn">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800 mb-2">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>সহায়তা ও সাধারণ জিজ্ঞাসা</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলি (FAQ)
            </h2>
          </div>

          <div className="space-y-3.5">
            {institutionalFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left font-bold text-base sm:text-lg text-slate-950 dark:text-white flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRAND CALL TO ACTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white text-center font-bn relative overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-white/10 text-xs font-bold mb-4">
            <Scale className="h-4 w-4" />
            <span>বাংলাদেশ জাতীয় মাধ্যমিক শিক্ষা উদ্যোগ • সম্পূর্ণ মুক্ত ও উন্মুক্ত</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            পরীক্ষার হলে সর্বোচ্চ আত্মবিশ্বাসের সাথে অংশ নিন
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            বিগত 7 বছরের আসল টেস্ট পেপার, বোল্ড করা উত্তর ও এআই শিক্ষকের সহায়তা সম্পূর্ণ ফ্রিতে এক ক্লিকে শুরু করুন।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/model-tests?mode=test_paper"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 px-8 py-4 text-base font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>টেস্ট পেপার সলভ ও পরীক্ষা</span>
            </Link>

            <Link
              to="/tutor"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-4 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BrainCircuit className="h-5 w-5 text-emerald-400" />
              <span>এআই শিক্ষক ভাইয়ার ক্লাসরুম</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
