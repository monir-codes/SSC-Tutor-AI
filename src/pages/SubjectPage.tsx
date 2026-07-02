import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, BookmarkPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { SEO } from "@/components/SEO";

// Mock data
const subjectsData: Record<string, any> = {
  "physics": { name: "Physics (পদার্থবিজ্ঞান)", chapters: ["ভৌত রাশি ও পরিমাপ", "গতি", "বল", "কাজ, ক্ষমতা ও শক্তি", "পদার্থের অবস্থা ও চাপ", "বস্তুর উপর তাপের প্রভাব", "তরঙ্গ ও শব্দ", "আলোর প্রতিফলন"] },
  "chemistry": { name: "Chemistry (রসায়ন)", chapters: ["রসায়নের ধারণা", "পদার্থের অবস্থা", "পদার্থের গঠন", "পর্যায় সারণি", "রাসায়নিক বন্ধন"] },
  "biology": { name: "Biology (জীববিজ্ঞান)", chapters: ["জীবন পাঠ", "জীবকোষ ও টিস্যু", "কোষ বিভাজন", "জীবনীশক্তি"] },
  "higher-math": { name: "Higher Math (উচ্চতর গণিত)", chapters: ["সেট ও ফাংশন", "বীজগাণিতিক রাশি", "জ্যামিতি"] },
  "bangla": { name: "Bangla (বাংলা)", chapters: ["গদ্যাংশ", "পদ্যাংশ", "সহপাঠ"] },
  "english": { name: "English (ইংরেজি)", chapters: ["Grammar", "Composition", "First Paper"] },
  "math": { name: "General Math (গণিত)", chapters: ["বাস্তব সংখ্যা", "সেট ও ফাংশন", "বীজগাণিতিক রাশি", "সূচক ও লগারিদম"] },
  "ict": { name: "ICT (তথ্য ও যোগাযোগ প্রযুক্তি)", chapters: ["তথ্য ও যোগাযোগ প্রযুক্তি এবং আমাদের বাংলাদেশ", "কম্পিউটার নেটওয়ার্ক"] },
  "history": { name: "History (ইতিহাস)", chapters: ["ইতিহাস পরিচিতি", "বিশ্বসভ্যতা", "প্রাচীন বাংলার জনপদ"] },
  "geography": { name: "Geography (ভূগোল)", chapters: ["ভূগোল ও পরিবেশ", "মহাবিশ্ব ও আমাদের পৃথিবী", "মানচিত্র পঠন ও ব্যবহার"] },
  "civics": { name: "Civics (পৌরনীতি)", chapters: ["পৌরনীতি ও নাগরিকতা", "রাষ্ট্র ও নাগরিক", "আইন, স্বাধীনতা ও সাম্য"] },
  "economics": { name: "Economics (অর্থনীতি)", chapters: ["অর্থনীতির পরিচয়", "অর্থনীতির গুরুত্বপূর্ণ ধারণাসমূহ", "উপযোগ, চাহিদা, জোগান ও ভারসাম্য"] },
  "religion": { name: "Religion (ধর্ম ও নৈতিক শিক্ষা)", chapters: ["আকাইদ ও নৈতিক জীবন", "শরিয়তের উৎস", "ইবাদত"] },
  "accounting": { name: "Accounting (হিসাববিজ্ঞান)", chapters: ["হিসাববিজ্ঞান পরিচিতি", "লেনদেন", "দুতরফা দাখিলা পদ্ধতি", "জাবেদা", "খতিয়ান"] },
  "finance": { name: "Finance & Banking (ফিন্যান্স ও ব্যাংকিং)", chapters: ["অর্থায়ন ও ব্যবসায় অর্থায়ন", "অর্থায়নের উৎস", "অর্থের সময়মূল্য"] },
  "entrepreneurship": { name: "Business Entrepreneurship (ব্যবসায় উদ্যোগ)", chapters: ["ব্যবসায় পরিচিতি", "ব্যবসায় উদ্যোগ ও উদ্যোক্তা", "আত্মকর্মসংস্থান"] }
};

export function SubjectPage() {
  const { subjectId } = useParams();
  const subject = subjectsData[subjectId || ""];
  
  const { addRecentActivity, addBookmark, bookmarks } = useUserStore();
  const url = `/subjects/${subjectId}`;
  const isBookmarked = bookmarks.some(b => b.url === url);

  useEffect(() => {
    if (subject) {
      addRecentActivity({
        type: 'subject',
        title: subject.name,
        url: url
      });
    }
  }, [subjectId, subject, addRecentActivity, url]);

  const handleBookmark = () => {
    if (subject && !isBookmarked) {
      addBookmark({
        type: 'subject',
        title: subject.name,
        url: url
      });
    }
  };

  if (!subject) {
    return <div className="p-12 text-center text-xl">Subject not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <SEO 
        title={subject.name} 
        description={`Study ${subject.name} for SSC. Chapter-wise interactive guide and AI explanations.`}
        href={url}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/subjects" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Link>
        
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{subject.name}</h1>
            <p className="mt-4 text-lg text-slate-600 font-bn">অধ্যায়সমূহ নির্বাচন করো</p>
          </div>
          <button 
            onClick={handleBookmark}
            disabled={isBookmarked}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isBookmarked ? 'bg-slate-200 text-slate-500' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
            }`}
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            {isBookmarked ? 'Saved' : 'Bookmark'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {subject.chapters.map((chapter: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                to={`/tutor?prompt=Explain the chapter ${chapter} from ${subject.name}`}
                className="group flex items-center justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-primary-500"
              >
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-slate-900 font-bn">{chapter}</h3>
                </div>
                <div className="text-sm font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Study
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
