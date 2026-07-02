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
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <SEO 
        title="Bookmarks" 
        description="Access your saved SSC subjects, chapters, questions, and important AI explanations."
        href="/bookmarks"
      />
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Bookmarks</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Your saved subjects, chapters, and important AI explanations.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Types</option>
            <option value="subject">Subjects</option>
            <option value="chapter">Chapters</option>
            <option value="chat_answer">AI Explanations</option>
          </select>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <BookMarked className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No bookmarks found</h3>
            <p className="text-slate-500 mt-2">You haven't bookmarked anything yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookmarks.map(bookmark => (
              <div key={bookmark.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    {getIcon(bookmark.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{bookmark.title}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <span className="capitalize">{bookmark.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{format(bookmark.addedAt, 'MMM d, yyyy')}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    to={bookmark.url}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center"
                  >
                    <span className="sr-only">Open</span>
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={() => removeBookmark(bookmark.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="sr-only">Remove</span>
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
