import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Target, Activity, FileText, Clock, ArrowRight, RotateCcw, BookOpen, Award, Trophy, Star, Shield } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export function ProgressPage() {
  const { examHistory, recentActivity, badges = [] } = useUserStore();
  const [activeTab, setActiveTab] = useState<'exams' | 'recent' | 'badges'>('exams');

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Prepare data for the trend chart
  const trendData = useMemo(() => {
    return [...examHistory]
      .reverse() // chronological order
      .map((exam) => ({
        date: format(exam.date, 'MMM d'),
        percentage: exam.percentage,
        subject: exam.subject,
      }));
  }, [examHistory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <SEO 
        title="My Progress" 
        description="Track your performance, recent learning, and exam history on SSC Tutor AI."
        href="/progress"
      />
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">My Progress</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Track your performance, recent learning, and exam history.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 w-full">
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-full max-w-md mb-8">
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'exams' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Exam History
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'recent' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'badges' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Badges
          </button>
        </div>

        {activeTab === 'exams' && (
          <div className="space-y-8">
            {examHistory.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <Target className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No exams taken yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Start practicing to track your scores.</p>
                <Link to="/practice" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-500">
                  Go to Practice
                </Link>
              </div>
            ) : (
              <>
                {/* Visual Chart */}
                {trendData.length > 1 && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Performance Trend</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                          />
                          <YAxis 
                            stroke="#94a3b8" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            dx={-10}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`${value}%`, 'Score']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="percentage" 
                            stroke="#2563eb" 
                            strokeWidth={3}
                            dot={{ fill: '#2563eb', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
                
                {/* List of Exams */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Exam Logs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {examHistory.map(exam => (
                    <div key={exam.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${exam.type === 'model_test' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                          {exam.type === 'model_test' ? 'Model Test' : 'Practice'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {format(exam.date, 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{exam.subject}</h3>
                      {exam.chapter && <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{exam.chapter}</p>}
                      
                      <div className="grid grid-cols-3 gap-4 mb-6 mt-auto">
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Score</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white">{exam.score}/{exam.total}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Result</div>
                          <div className={`text-lg font-bold ${exam.percentage >= 80 ? 'text-green-600 dark:text-green-400' : exam.percentage >= 60 ? 'text-blue-600 dark:text-blue-400' : exam.percentage >= 40 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                            {exam.percentage}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Time</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-slate-400" />
                            {formatTime(exam.timeTaken)}
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        to={exam.type === 'model_test' ? '/model-tests' : '/practice'}
                        className="w-full flex items-center justify-center py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retake Similar
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <Activity className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No recent activity</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Explore subjects to build your history.</p>
              </div>
            ) : (
              recentActivity.map(activity => (
                <Link key={activity.id} to={activity.url} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                      {activity.type === 'subject' && <BookOpen className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'chapter' && <FileText className="h-5 w-5 text-indigo-500" />}
                      {activity.type === 'chat' && <Activity className="h-5 w-5 text-primary-500" />}
                      {activity.type === 'practice' && <Target className="h-5 w-5 text-emerald-500" />}
                      {activity.type === 'model_test' && <Target className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{activity.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{activity.type.replace('_', ' ')} • {format(activity.viewedAt, 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                  <div className="text-slate-300 dark:text-slate-500 group-hover:text-primary-500 transition-colors pr-2">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-4">
            {badges.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No badges yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Complete exams and get high scores to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
                    <div className="mb-4 p-4 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {badge.icon === 'Award' && <Award className="h-10 w-10" />}
                      {badge.icon === 'Trophy' && <Trophy className="h-10 w-10" />}
                      {badge.icon === 'Star' && <Star className="h-10 w-10" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{badge.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{badge.description}</p>
                    <span className="text-xs text-slate-400 font-medium mt-auto">
                      Earned: {format(badge.earnedAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
