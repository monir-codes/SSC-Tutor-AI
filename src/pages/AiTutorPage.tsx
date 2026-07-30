import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Send, Bot, User, Loader2, MessageSquare, Plus, Trash2, Pin, Mic, MicOff, Download, ArrowRight, Info, Volume2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { useUserStore, ChatMessage, ChatSession } from "@/store/userStore";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export function AiTutorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPrompt = searchParams.get("prompt");
  const subjectParam = searchParams.get("subject");
  const urlSessionId = searchParams.get("session");
  
  const { 
    chatSessions, 
    createChatSession, 
    addChatMessage, 
    updateChatMessage,
    deleteChatSession,
    togglePinChat,
    updateChatTitle
  } = useUserStore();

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(urlSessionId);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const recognition = useRef<any>(null);

  const currentSession = currentSessionId ? chatSessions[currentSessionId] : null;
  const messages = currentSession?.messages || [
    {
      id: "init",
      role: "assistant",
      content: "হ্যালো! আমি তোমার পার্সোনাল এআই টিউটর। ফ্রি এপিআই (Free API) লিমিট থাকায় আমার উত্তর দিতে মাঝে মাঝে একটু সময় লাগতে পারে, দয়া করে একটু অপেক্ষা করো। এসএসসি পরীক্ষার যেকোনো বিষয়ের কোনো টপিক বুঝতে অসুবিধা হলে আমাকে জিজ্ঞেস করতে পারো।",
      timestamp: Date.now()
    } as ChatMessage
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
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

  const handleTTS = (text: string) => {
    if (!window.speechSynthesis) {
      toast.error("Text-to-speech is not supported in your browser.");
      return;
    }
    window.speechSynthesis.cancel();
    
    // Strip markdown characters before speaking for a cleaner voice output
    const cleanText = text.replace(/[*#`_]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'bn-BD';
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadPDF = async () => {
    if (!messagesContainerRef.current) return;
    
    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF...");
    
    try {
      const canvas = await toCanvas(messagesContainerRef.current, {
        pixelRatio: 2,
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
    if (!input.trim() || isLoading || isCooldown) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      // Create new session
      const title = input.slice(0, 30) + (input.length > 30 ? "..." : "");
      
      const subject = searchParams.get("subject") || undefined;
      const chapter = searchParams.get("chapter") || undefined;
      
      sessionId = createChatSession(title, { subject, chapter });
      setCurrentSessionId(sessionId);
      navigate(`/tutor?session=${sessionId}`, { replace: true });
      
      // Add initial system message to store as well
      addChatMessage(sessionId, {
        role: "assistant",
        content: "হ্যালো! আমি তোমার পার্সোনাল এআই টিউটর। ফ্রি এপিআই (Free API) লিমিট থাকায় আমার উত্তর দিতে মাঝে মাঝে একটু সময় লাগতে পারে, দয়া করে একটু অপেক্ষা করো। এসএসসি পরীক্ষার যেকোনো বিষয়ের কোনো টপিক বুঝতে অসুবিধা হলে আমাকে জিজ্ঞেস করতে পারো।"
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

      const messageId = "msg-" + Date.now();
      addChatMessage(sessionId, { 
        id: messageId,
        role: "assistant", 
        content: "" 
      } as any);

      // Start a 10-second timer for the temporary waiting message
      let hasStartedReceiving = false;
      const waitingTimeout = setTimeout(() => {
        if (!hasStartedReceiving) {
          updateChatMessage(sessionId, messageId, "অনুগ্রহ করে একটু অপেক্ষা করুন, সার্ভারের ব্যস্ততার কারণে সময় লাগছে...");
        }
      }, 10000);

      let success = false;

      while (!success) {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
              message: userInputText,
              history,
              subject: currentSession?.subject || searchParams.get("subject"),
              chapter: currentSession?.chapter || searchParams.get("chapter"),
          }),
        });

        if (!response.ok) {
          let errorData: any = {};
          try { errorData = await response.json(); } catch(e){}

          if (response.status === 429) {
            if (errorData.type === "DAILY_QUOTA") {
               clearTimeout(waitingTimeout);
               updateChatMessage(sessionId, messageId, "⚠️ আজকের জন্য আপনার এপিআই লিমিট (২০টি মেসেজ) শেষ হয়ে গেছে! অনুগ্রহ করে আগামীকাল আবার চেষ্টা করুন।");
               success = true;
               break;
            }
            // Wait 15 seconds before retrying
            await new Promise(r => setTimeout(r, 15000));
            continue;
          }
          throw new Error("Failed to get response from server. Please try again.");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let assistantResponse = "";
        let done = false;
        let buffer = "";

        while (reader && !done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            hasStartedReceiving = true;
            clearTimeout(waitingTimeout);

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split("\n");
            
            // Keep the last incomplete line in the buffer
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data.trim() === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    assistantResponse += parsed.text;
                    // Because assistantResponse starts at "", the first chunk will completely overwrite the temporary waiting message!
                    updateChatMessage(sessionId, messageId, assistantResponse);
                  }
                } catch (e) {
                  // Ignore parse errors from partial chunks
                }
              }
            }
          }
        }
        success = true;
      }
      
      clearTimeout(waitingTimeout);
      
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
      
      // Add a 2-second cooldown to prevent Gemini API rate limit (429) errors
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 2000);
    }
  };

  // Group sessions
  const sortedSessions = Object.values(chatSessions).sort((a, b) => b.updatedAt - a.updatedAt);
  const pinnedSessions = sortedSessions.filter(s => s.isPinned);
  const unpinnedSessions = sortedSessions.filter(s => !s.isPinned);

  return (
    <div className="absolute inset-0 flex flex-col lg:flex-row bg-slate-50">
      <SEO 
        title="AI Tutor | Smart SSC Assistant" 
        description="Chat with your personal SSC Tutor AI. Ask questions, get easy Bengali explanations, and clear your doubts instantly for Physics, Chemistry, Math, Biology and more."
        href="/tutor"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SSC AI Tutor",
          "url": "https://ssc-tutor-ai.vercel.app/tutor",
          "description": "AI-powered tutor for SSC students in Bangladesh, providing instant answers and explanations for all subjects.",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "All"
        }}
      />
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar for chat history */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 flex flex-col border-r border-slate-200 bg-white shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <button 
            onClick={() => {
              handleNewChat();
              setIsMobileSidebarOpen(false);
            }}
            className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden ml-3 p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <X className="h-5 w-5" />
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
                        setIsMobileSidebarOpen(false);
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
                        setIsMobileSidebarOpen(false);
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
      <div className="flex-1 flex flex-col relative min-w-0 min-h-0 overflow-hidden">
        {/* Header (Mobile & Actions) */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm z-10 lg:bg-transparent lg:border-none lg:shadow-none lg:absolute lg:top-0 lg:right-0 lg:p-4">
           <button
             onClick={() => setIsMobileSidebarOpen(true)}
             className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
           >
             <Menu className="h-5 w-5" />
           </button>
           
           <button
             onClick={handleDownloadPDF}
             disabled={isDownloading || messages.length <= 1}
             className="flex items-center space-x-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
           >
             {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
             <span className="hidden sm:inline">Download PDF</span>
           </button>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div ref={messagesContainerRef} className="mx-auto max-w-3xl space-y-8 pb-4">
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
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-md border border-white/20",
                      msg.role === "user" ? "bg-gradient-to-br from-slate-700 to-slate-900 text-white" : "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-primary-500/30"
                    )}
                  >
                    {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-6 py-4 text-base shadow-sm font-bn max-w-[85%] sm:max-w-[75%] relative group/msg",
                      msg.role === "user"
                        ? "bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30 border border-white/20 rounded-tr-sm font-semibold tracking-wide drop-shadow-sm"
                        : msg.redirect 
                          ? "bg-blue-50/50 border border-blue-100 text-slate-900 overflow-hidden" 
                          : "bg-primary-50 border border-primary-100 text-slate-900 leading-relaxed overflow-hidden"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <button 
                        onClick={() => handleTTS(msg.content)}
                        className="absolute -right-10 top-2 opacity-0 group-hover/msg:opacity-100 transition-opacity p-2 text-slate-400 hover:text-primary-600 rounded-full hover:bg-white border border-transparent hover:border-slate-200 shadow-sm"
                        title="Listen"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    )}
                    {msg.redirect && (
                      <div className="flex items-center space-x-2 text-blue-700 font-semibold mb-3 border-b border-blue-100 pb-3">
                        <Info className="h-5 w-5" />
                        <span>বিষয়ভিত্তিক সহায়তা</span>
                      </div>
                    )}
                    <div className={cn("prose prose-slate max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0 prose-headings:my-2 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base", msg.role === "assistant" && !msg.redirect && "prose-p:leading-relaxed", msg.redirect && "text-slate-700")}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      {msg.redirect && (
                        <div className="mt-5 flex justify-start pt-2">
                          <button
                            onClick={() => navigate(msg.redirect!.target)}
                            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
                          >
                            <span>{msg.redirect.buttonText}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
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
                <div className="flex flex-col gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-4 shadow-sm w-[75%] max-w-sm">
                  <div className="h-4 w-3/4 rounded-md bg-slate-200 animate-pulse"></div>
                  <div className="h-4 w-1/2 rounded-md bg-slate-200 animate-pulse"></div>
                  <div className="h-4 w-5/6 rounded-md bg-slate-200 animate-pulse"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isCooldown ? "Please wait a moment..." :
                  subjectParam
                    ? `Ask anything about ${subjectParam.split(" (")[0]}...`
                    : "Ask anything about your SSC subjects (e.g. নিউটনের ৩য় সূত্রটা বুঝিয়ে বলো)..."
                }
                disabled={isLoading || isListening || isCooldown}
                className="w-full rounded-full border border-slate-300 bg-slate-50 px-6 py-4 pr-24 text-base outline-none transition-colors focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500 disabled:opacity-50 font-bn"
              />
              <div className="absolute right-2 flex items-center space-x-1 bg-white pl-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading || isCooldown}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all disabled:opacity-50",
                    isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  )}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isCooldown || (!input.trim() && !isListening)}
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
