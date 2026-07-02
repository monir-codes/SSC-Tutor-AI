import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ArrowLeft, Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <SEO 
        title="404 - Page Not Found | SSC Tutor AI"
        description="The page you are looking for does not exist."
        href="/404"
      />
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Page Not Found</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 bg-white text-slate-700 px-6 py-3 rounded-xl shadow-sm ring-1 ring-slate-200 font-semibold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          <Link 
            to="/"
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl shadow-sm font-semibold hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
