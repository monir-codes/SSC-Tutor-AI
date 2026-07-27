import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, BookmarkPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { SEO } from "@/components/SEO";

// Mock data
const subjectsData: Record<string, any> = {
  "physics": { name: "Physics (পদার্থবিজ্ঞান)", chapters: ["ভৌত রাশি ও পরিমাপ", "গতি", "বল", "কাজ, ক্ষমতা ও শক্তি", "পদার্থের অবস্থা ও চাপ", "বস্তুর উপর তাপের প্রভাব", "তরঙ্গ ও শব্দ", "আলোর প্রতিফলন", "আলোর প্রতিসরণ", "স্থির তড়িৎ", "চল তড়িৎ", "বিদ্যুতের চৌম্বক ক্রিয়া", "আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স", "জীবন বাঁচাতে পদার্থবিজ্ঞান"] },
  "chemistry": { name: "Chemistry (রসায়ন)", chapters: ["রসায়নের ধারণা", "পদার্থের অবস্থা", "পদার্থের গঠন", "পর্যায় সারণি", "রাসায়নিক বন্ধন", "মোলের ধারণা ও রাসায়নিক গণনা", "রাসায়নিক বিক্রিয়া", "রসায়ন ও শক্তি", "এসিড-ক্ষারক সমতা", "খনিজ সম্পদ: ধাতু-অধাতু", "খনিজ সম্পদ: জীবাশ্ম", "আমাদের জীবনে রসায়ন"] },
  "biology": { name: "Biology (জীববিজ্ঞান)", chapters: ["জীবন পাঠ", "জীবকোষ ও টিস্যু", "কোষ বিভাজন", "জীবনীশক্তি", "খাদ্য, পুষ্টি এবং পরিপাক", "জীবে পরিবহন", "গ্যাসীয় বিনিময়", "রেচন প্রক্রিয়া", "দৃঢ়তা প্রদান ও চলন", "সমন্বয়", "জীবের প্রজনন", "জীবের বংশগতি ও বিবর্তন", "জীবের পরিবেশ", "জীবপ্রযুক্তি"] },
  "higher-math": { name: "Higher Math (উচ্চতর গণিত)", chapters: ["সেট ও ফাংশন", "বীজগণিতীয় রাশি", "জ্যামিতি", "জ্যামিতিক অঙ্কন", "সমীকরণ", "অসমতা", "অসীম ধারা", "ত্রিকোণমিতি", "সূচকীয় ও লগারিদমীয় ফাংশন", "দ্বিপদী বিস্তৃতি", "স্থানাঙ্ক জ্যামিতি", "সমতলীয় ভেক্টর", "ঘন জ্যামিতি", "সম্ভাবনা"] },
  "bangla": { name: "Bangla (বাংলা)", chapters: ["গদ্যাংশ (Prose)", "পদ্যাংশ (Poetry)", "সহপাঠ (কাকতাড়ুয়া ও বহিপীর)", "বাংলা ভাষার ব্যাকরণ", "নির্মিতি (প্রবন্ধ, পত্র, সারাংশ)"] },
  "english": { name: "English (ইংরেজি)", chapters: ["English 1st Paper - Reading", "English 1st Paper - Writing", "English 2nd Paper - Grammar", "English 2nd Paper - Composition"] },
  "math": { name: "General Math (গণিত)", chapters: ["বাস্তব সংখ্যা", "সেট ও ফাংশন", "বীজগাণিতিক রাশি", "সূচক ও লগারিদম", "এক চলকবিশিষ্ট সমীকরণ", "রেখা, কোণ ও ত্রিভুজ", "ব্যবহারিক জ্যামিতি", "বৃত্ত", "ত্রিকোণমিতিক অনুপাত", "দূরত্ব ও উচ্চতা", "বীজগাণিতিক অনুপাত ও সমানুপাত", "দুই চলকবিশিষ্ট সরল সহসমীকরণ", "সসীম ধারা", "অনুপাত, সদৃশতা ও প্রতিসমতা", "ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য", "পরিমিতি", "পরিসংখ্যান"] },
  "ict": { name: "ICT (তথ্য ও যোগাযোগ প্রযুক্তি)", chapters: ["তথ্য ও যোগাযোগ প্রযুক্তি এবং আমাদের বাংলাদেশ", "কম্পিউটার ও কম্পিউটার ব্যবহারকারীর নিরাপত্তা", "আমার শিক্ষায় ইন্টারনেট", "আমার লেখালেখি ও হিসাব", "মাল্টিমিডিয়া ও গ্রাফিক্স", "ডেটাবেজ এর ব্যবহার"] },
  "history": { name: "History (ইতিহাস)", chapters: ["ইতিহাস পরিচিতি", "বিশ্বসভ্যতা", "প্রাচীন বাংলার জনপদ", "প্রাচীন বাংলার রাজনৈতিক ইতিহাস", "প্রাচীন বাংলার আর্থ-সামাজিক ও সাংস্কৃতিক ইতিহাস", "মধ্যযুগের বাংলা", "মধ্যযুগের বাংলার আর্থ-সামাজিক ইতিহাস", "বাংলায় ইংরেজ শাসনের সূচনা", "ইংরেজ শাসন আমলে বাংলায় প্রতিরোধ", "ইংরেজ শাসন আমলে বাংলার স্বাধিকার আন্দোলন", "ভাষা আন্দোলন ও পরবর্তী ঘটনাপ্রবাহ", "সামরিক শাসন ও স্বাধিকার আন্দোলন", "সত্তরের নির্বাচন ও মুক্তিযুদ্ধ", "বঙ্গবন্ধু শেখ মুজিবুর রহমানের শাসনকাল", "সামরিক শাসন ও পরবর্তী ঘটনাবলি"] },
  "geography": { name: "Geography (ভূগোল)", chapters: ["ভূগোল ও পরিবেশ", "মহাবিশ্ব ও আমাদের পৃথিবী", "মানচিত্র পঠন ও ব্যবহার", "পৃথিবীর অভ্যন্তরীণ ও বাহ্যিক গঠন", "বায়ুমণ্ডল", "বারিমণ্ডল", "জনসংখ্যা", "মানব বসতি", "সম্পদ ও অর্থনৈতিক কার্যাবলি", "বাংলাদেশের ভৌগোলিক বিবরণ", "বাংলাদেশের সম্পদ ও শিল্প", "বাংলাদেশের যোগাযোগ ব্যবস্থা ও বাণিজ্য", "বাংলাদেশের উন্নয়ন কর্মকাণ্ড", "প্রাকৃতিক দুর্যোগ", "টেকসই উন্নয়ন অভীষ্ট (SDG)"] },
  "civics": { name: "Civics (পৌরনীতি)", chapters: ["পৌরনীতি ও নাগরিকতা", "নাগরিক ও নাগরিকতা", "আইন, স্বাধীনতা ও সাম্য", "রাষ্ট্র ও সরকার ব্যবস্থা", "সংবিধান", "বাংলাদেশের সরকার ব্যবস্থা", "গণতন্ত্রে রাজনৈতিক দল ও নির্বাচন", "বাংলাদেশের স্থানীয় সরকার ব্যবস্থা", "নাগরিক সমস্যা ও আমাদের করণীয়", "স্বাধীন বাংলাদেশের অভ্যুদয়ে নাগরিক চেতনা", "বাংলাদেশ ও আন্তর্জাতিক সংগঠন"] },
  "economics": { name: "Economics (অর্থনীতি)", chapters: ["অর্থনীতির পরিচয়", "অর্থনীতির গুরুত্বপূর্ণ ধারণাসমূহ", "উপযোগ, চাহিদা, জোগান ও ভারসাম্য", "উৎপাদন ও সংগঠন", "বাজার", "জাতীয় আয় ও এর পরিমাপ", "অর্থ ও ব্যাংক ব্যবস্থা", "বাংলাদেশের অর্থনীতি", "বাংলাদেশের গুরুত্বপূর্ণ অর্থনৈতিক প্রসঙ্গ", "বাংলাদেশ সরকারের অর্থ ব্যবস্থা"] },
  "religion": { name: "Religion (ধর্ম ও নৈতিক শিক্ষা)", chapters: ["আকাইদ ও নৈতিক জীবন", "শরিয়তের উৎস", "ইবাদত", "আখলাক", "আদর্শ জীবনচরিত"] },
  "accounting": { name: "Accounting (হিসাববিজ্ঞান)", chapters: ["হিসাববিজ্ঞান পরিচিতি", "লেনদেন", "দুতরফা দাখিলা পদ্ধতি", "মূলধন ও মুনাফাজাতীয় লেনদেন", "হিসাব", "জাবেদা", "খতিয়ান", "নগদান বই", "রেওয়ামিল", "আর্থিক অবস্থার বিবরণী", "পণ্যের ক্রয়মূল্য, উৎপাদন ব্যয় ও বিক্রয়মূল্য", "পারিবারিক উদ্যোগের হিসাব"] },
  "finance": { name: "Finance & Banking (ফিন্যান্স ও ব্যাংকিং)", chapters: ["অর্থায়ন ও ব্যবসায় অর্থায়ন", "অর্থায়নের উৎস", "অর্থের সময়মূল্য", "ঝুঁকি ও অনিশ্চয়তা", "মূলধনি আয়-ব্যয় প্রাক্কলন", "মূলধন ব্যয়", "শেয়ার, বন্ড ও ডিবেঞ্চার", "মুদ্রা, ব্যাংক ও ব্যাংকিং", "ব্যাংকিং ব্যবসায় ও তার ধরন", "বাণিজ্যিক ব্যাংক ও তার পরিচিতি", "ব্যাংকের আমানত", "ব্যাংক ও গ্রাহক", "কেন্দ্রীয় ব্যাংক"] },
  "entrepreneurship": { name: "Business Entrepreneurship (ব্যবসায় উদ্যোগ)", chapters: ["ব্যবসায় পরিচিতি", "ব্যবসায় উদ্যোগ ও উদ্যোক্তা", "আত্মকর্মসংস্থান", "মালিকানার ভিত্তিতে ব্যবসায়", "ব্যবসায়ের আইনগত দিক", "ব্যবসায় পরিকল্পনা", "বাংলাদেশের শিল্প", "ব্যবসায়ের ব্যবস্থাপনা", "বিপণন", "উদ্যোক্তা উন্নয়নে সহায়ক সেবা", "ব্যবসায় নৈতিকতা ও সামাজিক দায়বদ্ধতা", "সফল উদ্যোক্তাদের জীবনী পাঠ"] }
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

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ssc-tutor-ai.vercel.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Subjects",
          "item": "https://ssc-tutor-ai.vercel.app/subjects"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": subject.name,
          "item": `https://ssc-tutor-ai.vercel.app${url}`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": `SSC ${subject.name}`,
      "description": `Study ${subject.name} for SSC. Chapter-wise interactive guide and AI explanations.`,
      "provider": {
        "@type": "EducationalOrganization",
        "name": "SSC Tutor AI",
        "sameAs": "https://ssc-tutor-ai.vercel.app/"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <SEO 
        title={`SSC ${subject.name} | Chapter-wise Notes, Practice & AI Tutor | SSC Tutor AI`} 
        description={`Study ${subject.name} for SSC. Chapter-wise interactive guide, examples, board questions, and AI explanations.`}
        href={url}
        jsonLd={jsonLd}
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
                to={`/tutor?subject=${encodeURIComponent(subject.name)}&chapter=${encodeURIComponent(chapter)}&prompt=Explain the chapter ${chapter} from ${subject.name}`}
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
