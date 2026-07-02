import { Link } from "react-router-dom";
import { BookOpen, Calculator, FlaskConical, Globe, Microscope } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

const groups = [
  {
    name: "Science (বিজ্ঞান)",
    color: "bg-blue-500",
    subjects: [
      { id: "physics", name: "Physics", icon: FlaskConical },
      { id: "chemistry", name: "Chemistry", icon: FlaskConical },
      { id: "biology", name: "Biology", icon: Microscope },
      { id: "higher-math", name: "Higher Math", icon: Calculator },
    ],
  },
  {
    name: "Compulsory (আবশ্যিক)",
    color: "bg-green-500",
    subjects: [
      { id: "bangla", name: "Bangla", icon: BookOpen },
      { id: "english", name: "English", icon: BookOpen },
      { id: "math", name: "General Math", icon: Calculator },
      { id: "ict", name: "ICT", icon: Globe },
    ],
  },
];

export function SubjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <SEO 
        title="Subjects" 
        description="Browse all SSC subjects including Science, Humanities, and Commerce. Get chapter-wise study materials and quizzes."
        href="/subjects"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Select a Subject</h1>
          <p className="mt-4 text-lg leading-6 text-slate-600 font-bn">
            কোন বিষয়টি শিখতে চাও নির্বাচন করো
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {groups.map((group, groupIdx) => (
            <div key={group.name}>
              <h2 className="flex items-center text-xl font-bold text-slate-900">
                <span className={`mr-3 flex h-3 w-3 rounded-full ${group.color}`}></span>
                {group.name}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {group.subjects.map((subject, idx) => {
                  const Icon = subject.icon;
                  return (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (groupIdx * 0.2) + (idx * 0.1) }}
                    >
                      <Link
                        to={`/subjects/${subject.id}`}
                        className="group relative flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all hover:scale-105 hover:shadow-md hover:ring-primary-500"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="mt-6 text-base font-semibold text-slate-900">{subject.name}</h3>
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
