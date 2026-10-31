import { Link } from "react-router-dom";
import { BookOpen, Calculator, FlaskConical, Globe, Microscope, Landmark, ReceiptText, Briefcase, HeartHandshake, History, Map } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

const groups = [
  {
    name: "Science (বিজ্ঞান বিভাগ)",
    color: "bg-blue-500",
    subjects: [
      { id: "physics", name: "Physics (পদার্থবিজ্ঞান)", icon: FlaskConical },
      { id: "chemistry", name: "Chemistry (রসায়ন)", icon: FlaskConical },
      { id: "biology", name: "Biology (জীববিজ্ঞান)", icon: Microscope },
      { id: "higher-math", name: "Higher Math (উচ্চতর গণিত)", icon: Calculator },
    ],
  },
  {
    name: "Compulsory & Humanities (আবশ্যিক ও মানবিক)",
    color: "bg-amber-500",
    subjects: [
      { id: "bangla", name: "Bangla (বাংলা)", icon: BookOpen },
      { id: "english", name: "English (ইংরেজি)", icon: BookOpen },
      { id: "math", name: "General Math (সাধারণ গণিত)", icon: Calculator },
      { id: "ict", name: "ICT (তথ্য ও যোগাযোগ প্রযুক্তি)", icon: Globe },
      { id: "history", name: "History (ইতিহাস)", icon: History },
      { id: "geography", name: "Geography (ভূগোল)", icon: Map },
      { id: "civics", name: "Civics (পৌরনীতি)", icon: Landmark },
      { id: "economics", name: "Economics (অর্থনীতি)", icon: Landmark },
      { id: "religion", name: "Religion (ধর্ম শিক্ষা)", icon: HeartHandshake },
    ],
  },
  {
    name: "Business Studies (ব্যবসায় শিক্ষা / বাণিজ্য)",
    color: "bg-emerald-500",
    subjects: [
      { id: "accounting", name: "Accounting (হিসাববিজ্ঞান)", icon: ReceiptText },
      { id: "finance", name: "Finance & Banking (ফিন্যান্স ও ব্যাংকিং)", icon: Landmark },
      { id: "entrepreneurship", name: "Business Entrepreneurship (ব্যবসায় উদ্যোগ)", icon: Briefcase },
    ],
  },
];

export function SubjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 sm:py-16 transition-colors">
      <SEO 
        title="এসএসসি সকল বিষয় ও গাইড | SSC Subjects Question Bank — SSC Tutor AI" 
        description="বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা বিভাগের সকল বিষয়ের অধ্যায়ভিত্তিক নোট, বিগত 7 বছরের বোর্ড প্রশ্নব্যাংক এবং এআই শিক্ষকের সহায়তা।"
        href="/subjects"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "SSC Subjects Study Materials",
          url: "https://ssc-tutor-ai.vercel.app/subjects",
          description: "Comprehensive list of SSC subjects with chapter-wise notes and AI tutor support for Bangladesh curriculum."
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Select a Subject
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-6 text-slate-600 dark:text-slate-300 font-bn">
            কোন বিষয়টি পড়তে চাও নির্বাচন করো
          </p>
        </div>

        <div className="mt-12 sm:mt-16 space-y-12 sm:space-y-16">
          {groups.map((group, groupIdx) => (
            <div key={group.name}>
              <h2 className="flex items-center text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6">
                <span className={`mr-3 flex h-3 w-3 rounded-full ${group.color}`}></span>
                {group.name}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {group.subjects.map((subject, idx) => {
                  const Icon = subject.icon;
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (groupIdx * 0.1) + (idx * 0.04) }}
                    >
                      <Link
                        to={`/subjects/${subject.id}`}
                        className="group relative flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.03] hover:shadow-md hover:border-primary-400 dark:hover:border-primary-600 active:scale-[0.99]"
                      >
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-950/60 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                        </div>
                        <h3 className="mt-4 sm:mt-5 text-sm sm:text-base font-semibold text-slate-900 dark:text-white text-center font-bn leading-snug">
                          {subject.name}
                        </h3>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
