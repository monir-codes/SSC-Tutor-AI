import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  redirect?: {
    type: 'subject' | 'chapter';
    target: string;
    buttonText: string;
  };
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  isPinned: boolean;
  subject?: string;
  chapter?: string;
};

export type ExamResult = {
  id: string;
  subject: string;
  chapter?: string;
  syllabusType?: string;
  date: number;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  type: 'practice' | 'model_test';
};

export type Bookmark = {
  id: string;
  type: 'subject' | 'chapter' | 'question' | 'chat_answer';
  title: string;
  url: string;
  addedAt: number;
  context?: string;
};

export type RecentActivity = {
  id: string;
  type: 'subject' | 'chapter' | 'practice' | 'model_test' | 'chat';
  title: string;
  url: string;
  viewedAt: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string; // use lucide icon names
  earnedAt: number;
};

interface UserState {
  chatSessions: Record<string, ChatSession>;
  examHistory: ExamResult[];
  bookmarks: Bookmark[];
  recentActivity: RecentActivity[];
  badges: Badge[];
  
  // Chat Actions
  createChatSession: (title: string, context?: { subject?: string; chapter?: string }) => string;
  addChatMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateChatMessage: (sessionId: string, messageId: string, content: string) => void;
  updateChatTitle: (sessionId: string, title: string) => void;
  deleteChatSession: (sessionId: string) => void;
  togglePinChat: (sessionId: string) => void;

  // Exam Actions
  addExamResult: (result: Omit<ExamResult, 'id' | 'date'>) => void;
  
  // Bookmark Actions
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'addedAt'>) => void;
  removeBookmark: (id: string) => void;

  // Recent Activity
  addRecentActivity: (activity: Omit<RecentActivity, 'id' | 'viewedAt'>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      chatSessions: {},
      examHistory: [],
      bookmarks: [],
      recentActivity: [],
      badges: [],

      createChatSession: (title, context?: { subject?: string; chapter?: string }) => {
        const id = uuidv4();
        set((state) => ({
          chatSessions: {
            ...state.chatSessions,
            [id]: {
              id,
              title,
              messages: [],
              updatedAt: Date.now(),
              isPinned: false,
              subject: context?.subject,
              chapter: context?.chapter,
            },
          },
        }));
        return id;
      },

      addChatMessage: (sessionId, message) => {
        set((state) => {
          const session = state.chatSessions[sessionId];
          if (!session) return state;

          return {
            chatSessions: {
              ...state.chatSessions,
              [sessionId]: {
                ...session,
                messages: [
                  ...session.messages,
                  { ...message, id: message.id || uuidv4(), timestamp: Date.now() },
                ],
                updatedAt: Date.now(),
              },
            },
          };
        });
      },

      updateChatMessage: (sessionId, messageId, content) => {
        set((state) => {
          const session = state.chatSessions[sessionId];
          if (!session) return state;
          
          return {
            chatSessions: {
              ...state.chatSessions,
              [sessionId]: {
                ...session,
                messages: session.messages.map(msg => 
                  msg.id === messageId ? { ...msg, content } : msg
                ),
                updatedAt: Date.now(),
              }
            }
          }
        });
      },

      updateChatTitle: (sessionId, title) => {
        set((state) => {
          const session = state.chatSessions[sessionId];
          if (!session) return state;
          return {
            chatSessions: {
              ...state.chatSessions,
              [sessionId]: { ...session, title },
            },
          };
        });
      },

      deleteChatSession: (sessionId) => {
        set((state) => {
          const { [sessionId]: _, ...rest } = state.chatSessions;
          return { chatSessions: rest };
        });
      },

      togglePinChat: (sessionId) => {
        set((state) => {
          const session = state.chatSessions[sessionId];
          if (!session) return state;
          return {
            chatSessions: {
              ...state.chatSessions,
              [sessionId]: { ...session, isPinned: !session.isPinned },
            },
          };
        });
      },

      addExamResult: (result) => {
        set((state) => {
          const newHistory = [
            { ...result, id: uuidv4(), date: Date.now() },
            ...state.examHistory,
          ];
          
          let newBadges = [...(state.badges || [])];
          const hasBadge = (id: string) => newBadges.some(b => b.id === id);
          
          if (newHistory.length === 1 && !hasBadge('early_bird')) {
            newBadges.push({ id: 'early_bird', name: 'Early Bird', description: 'Completed your first exam.', icon: 'Award', earnedAt: Date.now() });
          }
          if (newHistory.length === 5 && !hasBadge('quiz_master')) {
            newBadges.push({ id: 'quiz_master', name: 'Quiz Master', description: 'Completed 5 exams.', icon: 'Trophy', earnedAt: Date.now() });
          }
          if (result.percentage === 100 && !hasBadge('perfect_score')) {
            newBadges.push({ id: 'perfect_score', name: 'Perfect Score', description: 'Got 100% on an exam.', icon: 'Star', earnedAt: Date.now() });
          }

          return {
            examHistory: newHistory,
            badges: newBadges
          };
        });
      },

      addBookmark: (bookmark) => {
        set((state) => {
          // Check if it already exists
          const exists = state.bookmarks.find(b => b.url === bookmark.url);
          if (exists) return state;
          
          return {
            bookmarks: [
              { ...bookmark, id: uuidv4(), addedAt: Date.now() },
              ...state.bookmarks,
            ],
          };
        });
      },

      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },

      addRecentActivity: (activity) => {
        set((state) => {
          // Remove if exists to move to top
          const filtered = state.recentActivity.filter(a => a.url !== activity.url);
          const newActivity = { ...activity, id: uuidv4(), viewedAt: Date.now() };
          
          // Keep only last 20
          const updated = [newActivity, ...filtered].slice(0, 20);
          
          return { recentActivity: updated };
        });
      },
    }),
    {
      name: 'ai-ssc-tutor-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
