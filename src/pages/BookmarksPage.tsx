import { useState } from "react";
import { Link } from "react-router-dom";
import { BookMarked, Search, BookOpen, MessageSquare, Trash2, ExternalLink } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";

export function BookmarksPage() {
  const { bookmarks, removeBookmark } = useUserStore();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredBookmarks = bookmarks.filter(b => {
    if (filter !== "all" && b.type !== filter) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'subject': return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'chapter': return <BookOpen className="h-5 w-5 text-indigo-500" />;
      case 'chat_answer': return <MessageSquare className="h-5 w-5 text-primary-500" />;
      default: return <BookMarked className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      <SEO 
        title="সংরক্ষিত প্রশ্ন ও নোট | Saved Bookmarks — SSC Tutor AI" 
        description="আপনার সেভ করা গুরুত্বপূর্ণ এসএসসি সৃজনশীল ও বহুনির্বাচনি প্রশ্ন, অধ্যায়ভিত্তিক নোট এবং সমাধান সহজে খুঁজে পান।"
        href="/bookmarks"
      />
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bookmarks
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-bn">
            তোমার সেভ করা বিষয়, অধ্যায় এবং গুরুত্বপূর্ণ ব্যাখ্যাসমূহ।
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 w-full">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-colors text-sm sm:text-base placeholder:text-slate-400"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="subject">Subjects</option>
            <option value="chapter">Chapters</option>
            <option value="chat_answer">AI Explanations</option>
          </select>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
            <BookMarked className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No bookmarks found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-bn">
              তুমি এখনো কোনো বিষয় বা অধ্যায় বুকমার্ক করোনি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
            {filteredBookmarks.map(bookmark => (
              <div key={bookmark.id} className="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl shrink-0 border border-slate-100 dark:border-slate-800">
                    {getIcon(bookmark.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg truncate font-bn">{bookmark.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span className="capitalize">{bookmark.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{format(bookmark.addedAt, 'MMM d, yyyy')}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-3">
                  <Link 
                    to={bookmark.url}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/60 rounded-xl transition-colors flex items-center"
                    title="Open"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={() => removeBookmark(bookmark.id)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                    title="Delete bookmark"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
