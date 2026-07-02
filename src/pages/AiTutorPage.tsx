import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Send, Bot, User, Loader2, MessageSquare, Plus, Trash2, Pin, Mic, MicOff, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useUserStore, ChatMessage, ChatSession } from "@/store/userStore";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export function AiTutorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPrompt = searchParams.get("prompt");
  const urlSessionId = searchParams.get("session");
  
  const { 
    chatSessions, 
    createChatSession, 
    addChatMessage, 
    deleteChatSession,
    togglePinChat,
    updateChatTitle
  } = useUserStore();

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(urlSessionId);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const recognition = useRef<any>(null);

  const currentSession = currentSessionId ? chatSessions[currentSessionId] : null;
  const messages = currentSession?.messages || [
    {
      id: "init",
      role: "assistant",
      content: "হ্যালো! আমি তোমার পার্সোনাল এআই টিউটর। এসএসসি পরীক্ষার যেকোনো বিষয়ের কোনো টপিক বুঝতে অসুবিধা হলে আমাকে জিজ্ঞেস করতে পারো।",
      timestamp: Date.now()
    } as ChatMessage
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current?.parentElement) {
      chatContainerRef.current.parentElement.scrollTo({
        top: chatContainerRef.current.parentElement.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (urlSessionId && chatSessions[urlSessionId]) {
      setCurrentSessionId(urlSessionId);
    }
  }, [urlSessionId, chatSessions]);

  useEffect(() => {
    if (initialPrompt && !hasInitialized.current) {
        hasInitialized.current = true;
        setInput(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = true;
        recognition.current.lang = 'bn-BD'; // Support Bengali
        
        recognition.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          setInput(transcript);
        };
        
        recognition.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          toast.error("Speech recognition failed. Please try again.");
        };
        
        recognition.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleDownloadPDF = async () => {
    if (!chatContainerRef.current) return;
    
    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF...");
    
    try {
      const canvas = await html2canvas(chatContainerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`AI_SSC_Tutor_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNewChat = () => {
    navigate('/tutor');
    setCurrentSessionId(null);
    setInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      // Create new session
      const title = input.slice(0, 30) + (input.length > 30 ? "..." : "");
      sessionId = createChatSession(title);
      setCurrentSessionId(sessionId);
      navigate(`/tutor?session=${sessionId}`, { replace: true });
      
      // Add initial system message to store as well
      addChatMessage(sessionId, {
        role: "assistant",
        content: "হ্যালো! আমি তোমার পার্সোনাল এআই টিউটর। এসএসসি পরীক্ষার যেকোনো বিষয়ের কোনো টপিক বুঝতে অসুবিধা হলে আমাকে জিজ্ঞেস করতে পারো।"
      });
    }

    const userInputText = input.trim();
    setInput("");
    setIsLoading(true);

    addChatMessage(sessionId, { role: "user", content: userInputText });

    try {
      // Prepare history for API
      const history = currentSession 
        ? currentSession.messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', text: m.content })) 
        : [];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: userInputText,
            history
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      addChatMessage(sessionId, { role: "assistant", content: data.text });
      
      // Update title if it's still generic (optional)
      if (currentSession && currentSession.messages.length === 2 && currentSession.title.includes("...")) {
        // We could generate a title with AI, but for now just leave it
      }

    } catch (error: any) {
      addChatMessage(sessionId, {
        role: "assistant",
        content: `Error: ${error.message || "An error occurred. Please try again."}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group sessions
  const sortedSessions = Object.values(chatSessions).sort((a, b) => b.updatedAt - a.updatedAt);
  const pinnedSessions = sortedSessions.filter(s => s.isPinned);
  const unpinnedSessions = sortedSessions.filter(s => !s.isPinned);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row bg-slate-50">
      <SEO 
        title="AI Tutor" 
        description="Chat with your personal SSC Tutor AI. Ask questions, get explanations, and clear your doubts instantly."
        href="/tutor"
      />
      {/* Sidebar for chat history (Desktop) */}
      <div className="hidden lg:flex w-80 flex-col border-r border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-200">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {pinnedSessions.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Pinned</h3>
              <div className="space-y-1">
                {pinnedSessions.map(session => (
                  <div key={session.id} className="group relative flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        navigate(`/tutor?session=${session.id}`);
                      }}
                      className={cn(
                        "flex-1 text-left px-3 py-2.5 rounded-lg text-sm font-medium truncate transition-colors",
                        currentSessionId === session.id ? "bg-primary-50 text-primary-700" : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <div className="flex items-center">
                        <Pin className="h-3 w-3 mr-2 text-primary-500" />
                        <span className="truncate">{session.title}</span>
                      </div>
                    </button>
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                       <button onClick={() => togglePinChat(session.id)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200">
                         <Pin className="h-3.5 w-3.5 fill-current" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unpinnedSessions.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Recent</h3>
              <div className="space-y-1">
                {unpinnedSessions.map(session => (
                  <div key={session.id} className="group relative flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        navigate(`/tutor?session=${session.id}`);
                      }}
                      className={cn(
                        "flex-1 text-left px-3 py-2.5 rounded-lg text-sm font-medium truncate pr-14 transition-colors",
                        currentSessionId === session.id ? "bg-primary-50 text-primary-700" : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <div className="flex items-center">
                        <MessageSquare className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        <span className="truncate">{session.title}</span>
                      </div>
                    </button>
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white/90 shadow-sm rounded-md ring-1 ring-slate-200">
                       <button onClick={() => togglePinChat(session.id)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-l-md hover:bg-slate-100 border-r border-slate-200">
                         <Pin className="h-3.5 w-3.5" />
                       </button>
                       <button onClick={() => {
                         deleteChatSession(session.id);
                         if (currentSessionId === session.id) handleNewChat();
                       }} className="p-1.5 text-slate-400 hover:text-red-600 rounded-r-md hover:bg-slate-100">
                         <Trash2 className="h-3.5 w-3.5" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header (Mobile & Actions) */}
        <div className="flex items-center justify-end px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-10 lg:bg-transparent lg:border-none lg:shadow-none lg:absolute lg:top-0 lg:right-0 lg:p-4">
           <button
             onClick={handleDownloadPDF}
             disabled={isDownloading || messages.length <= 1}
             className="flex items-center space-x-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
           >
             {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
             <span className="hidden sm:inline">Download PDF</span>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div ref={chatContainerRef} className="mx-auto max-w-3xl space-y-8 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start gap-4",
                    msg.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                      msg.role === "user" ? "bg-slate-900 text-white" : "bg-primary-600 text-white"
                    )}
                  >
                    {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-6 py-4 text-base shadow-sm font-bn max-w-[85%] sm:max-w-[75%]",
                      msg.role === "user"
                        ? "bg-white text-slate-900 border border-slate-200"
                        : "bg-primary-50 border border-primary-100 text-slate-900 leading-relaxed overflow-hidden"
                    )}
                  >
                    <div className={cn("prose prose-slate max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0 prose-headings:my-2 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base", msg.role === "assistant" && "prose-p:leading-relaxed")}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex items-center rounded-2xl bg-primary-50 px-6 py-4 shadow-sm border border-primary-100">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                  <span className="ml-3 text-sm text-primary-700 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your SSC subjects (e.g. নিউটনের ৩য় সূত্রটা বুঝিয়ে বলো)..."
                disabled={isLoading || isListening}
                className="w-full rounded-full border border-slate-300 bg-slate-50 px-6 py-4 pr-24 text-base outline-none transition-colors focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500 disabled:opacity-50 font-bn"
              />
              <div className="absolute right-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all disabled:opacity-50",
                    isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  )}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !isListening)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-transform hover:scale-105 hover:bg-primary-500 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="h-5 w-5 ml-1" />
                </button>
              </div>
            </form>
            <div className="mt-3 text-center text-xs text-slate-500">
              AI can make mistakes. Always verify important information with your textbooks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
