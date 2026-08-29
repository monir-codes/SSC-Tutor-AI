import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare,
  Plus,
  Trash2,
  Pin,
  Mic,
  MicOff,
  Download,
  ArrowRight,
  Info,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Menu,
  X,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { useUserStore, ChatMessage } from "@/store/userStore";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

const QUICK_SUGGESTIONS = [
  { text: "নিউটনের ৩টি গতিসূত্র রিকশা ও ক্রিকেটের বাস্তব উদাহরণ দিয়ে বুঝিয়ে বলো ভাইয়া", icon: "⚡" },
  { text: "পর্যায় সারণির গ্রুপ ও পর্যায় চেনার সহজ টেকনিক বুঝিয়ে দাও", icon: "🧪" },
  { text: "ত্রিকোণমিতির sin, cos, tan সূত্র মনে রাখার সহজ ট্রিকস কী?", icon: "📐" },
  { text: "উদ্ভিদের সালোকসংশ্লেষণ প্রক্রিয়াটি রান্নাঘরের উদাহরণ দিয়ে বলো", icon: "🌱" },
  { text: "Right form of verbs এর বোর্ড পরীক্ষায় আসা গুরুত্বপূর্ণ নিয়মগুলো বলো", icon: "📝" },
  { text: "জড়তা ও ভরবেগের পার্থক্য বাস্তব জীবনের উদাহরণ দিয়ে বুঝিয়ে দাও", icon: "💡" },
];

export function AiTutorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPrompt = searchParams.get("prompt");
  const subjectParam = searchParams.get("subject");
  const chapterParam = searchParams.get("chapter");
  const urlSessionId = searchParams.get("session");

  const {
    chatSessions,
    createChatSession,
    addChatMessage,
    updateChatMessage,
    deleteChatSession,
    togglePinChat,
  } = useUserStore();

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(urlSessionId);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const recognition = useRef<any>(null);
  const isAutoScrollEnabled = useRef(true);
  const scrollRafId = useRef<number | null>(null);

  const currentSession = currentSessionId ? chatSessions[currentSessionId] : null;
  const messages = currentSession?.messages || [
    {
      id: "init",
      role: "assistant",
      content:
        "হ্যালো! আমি তোমার পার্সোনাল এআই টিউটর। ফ্রি এপিআই (Free API) লিমিট থাকায় আমার উত্তর দিতে মাঝে মাঝে একটু সময় লাগতে পারে, দয়া করে একটু অপেক্ষা করো। এসএসসি পরীক্ষার যেকোনো বিষয়ের কোনো টপিক বুঝতে অসুবিধা হলে আমাকে জিজ্ঞেস করতে পারো।",
      timestamp: Date.now(),
    } as ChatMessage,
  ];

  // Anti-Jitter Scroll Engine
  const scrollToBottom = useCallback((smooth = false) => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    if (smooth) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    } else {
      if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current);
      scrollRafId.current = requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = distanceFromBottom < 100;
    isAutoScrollEnabled.current = isNearBottom;
    setShowScrollBottomBtn(!isNearBottom && scrollHeight > clientHeight + 150);
  }, []);

  // Sync scroll on streaming or new messages
  useEffect(() => {
    if (isAutoScrollEnabled.current) {
      scrollToBottom(false);
    }
  }, [messages, scrollToBottom]);

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

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = true;
        recognition.current.lang = "bn-BD";

        recognition.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");
          setInput(transcript);
        };

        recognition.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast.error("Speech recognition failed. Please try again.");
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    return () => {
      if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current);
    };
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

  // High-Quality Native Bengali Audio Engine (Male/Female Teacher Voice & Pace Control)
  interface SpeechState {
    msgId: string | null;
    status: "idle" | "playing" | "paused";
    chunkIndex: number;
    totalChunks: number;
  }

  const [speechState, setSpeechState] = useState<SpeechState>({
    msgId: null,
    status: "idle",
    chunkIndex: 0,
    totalChunks: 0,
  });

  const [voiceGender, setVoiceGender] = useState<"male" | "female">("male");
  const [voiceSpeed, setVoiceSpeed] = useState<number>(0.88);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechChunksRef = useRef<string[]>([]);
  const activeMsgIdRef = useRef<string | null>(null);

  const cleanTextForBanglaTTS = (raw: string): string => {
    return raw
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => `সমীকরণ: ${math}`)
      .replace(/\$([^$]+)\$/g, (_, math) => math)
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 ভাগ $2")
      .replace(/\\times/g, " গুণ ")
      .replace(/\\div/g, " ভাগ ")
      .replace(/\\pm/g, " প্লাস মাইনাস ")
      .replace(/\\sqrt\{([^}]+)\}/g, "রুট $1")
      .replace(/\^2/g, " স্কয়ার ")
      .replace(/\^3/g, " কিউব ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[#*_`~>-]/g, " ")
      .replace(/[•●▪]/g, " ")
      .replace(/m\/s\^2/gi, "মিটার পার সেকেন্ড স্কয়ার")
      .replace(/m\/s/gi, "মিটার পার সেকেন্ড")
      .replace(/kg/gi, "কেজি")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  };

  const splitIntoBengaliSentences = (text: string): string[] => {
    const rawSentences = text
      .split(/([।?!;\n]+)/)
      .reduce((acc: string[], cur: string, idx: number) => {
        if (idx % 2 === 0) {
          acc.push(cur);
        } else if (acc.length > 0) {
          acc[acc.length - 1] += cur;
        }
        return acc;
      }, []);

    const chunks: string[] = [];
    for (const item of rawSentences) {
      const trimmed = item.trim();
      if (!trimmed) continue;
      if (trimmed.length <= 150) {
        chunks.push(trimmed);
      } else {
        const commaSplits = trimmed.split(/([,]+)/);
        let curChunk = "";
        for (const part of commaSplits) {
          if ((curChunk + part).length > 150 && curChunk.length > 0) {
            chunks.push(curChunk.trim());
            curChunk = part;
          } else {
            curChunk += part;
          }
        }
        if (curChunk.trim()) {
          chunks.push(curChunk.trim());
        }
      }
    }
    return chunks.length > 0 ? chunks : [text.slice(0, 150)];
  };

  const getBrowserBengaliVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    
    // Strict filter: Voice MUST be explicitly Bengali!
    const bnVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith("bn") ||
        v.name.toLowerCase().includes("bangla") ||
        v.name.toLowerCase().includes("bengali")
    );
    
    // If no real Bengali voice is installed in the OS, return null so we use the authentic Bengali MP3 audio stream!
    if (bnVoices.length === 0) {
      return null;
    }

    // 1. Try male-specific Bengali voice if available
    const maleVoice = bnVoices.find(
      (v) =>
        v.name.toLowerCase().includes("bashir") ||
        v.name.toLowerCase().includes("pradeep") ||
        v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("man")
    );
    if (maleVoice) return maleVoice;

    // 2. Return any genuine Bengali voice
    return bnVoices[0];
  };

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playAudioChunk = (msgId: string, chunks: string[], index: number) => {
    if (index >= chunks.length) {
      setSpeechState({
        msgId: null,
        status: "idle",
        chunkIndex: 0,
        totalChunks: 0,
      });
      activeMsgIdRef.current = null;
      if (currentAudioRef.current) {
        currentAudioRef.current = null;
      }
      return;
    }

    setSpeechState({
      msgId,
      status: "playing",
      chunkIndex: index,
      totalChunks: chunks.length,
    });
    activeMsgIdRef.current = msgId;

    const chunkText = chunks[index];

    // Priority 1: If browser has a genuine native Bengali voice installed
    const bnVoice = getBrowserBengaliVoice();
    if (bnVoice && typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.voice = bnVoice;
        utterance.lang = bnVoice.lang;
        utterance.pitch = 0.58; // Authentic deep masculine baritone pitch
        utterance.rate = 1.0;

        utterance.onend = () => {
          playAudioChunk(msgId, chunks, index + 1);
        };

        utterance.onerror = (e: any) => {
          if (e?.error === "canceled" || e?.error === "interrupted") return;
          playAudioStreamFallback(msgId, chunks, index);
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn("SpeechSynthesis error, using authentic Bengali audio stream:", err);
      }
    }

    // Priority 2: 100% Guaranteed Authentic Bengali MP3 Audio Stream
    playAudioStreamFallback(msgId, chunks, index);
  };

  const playAudioStreamFallback = (msgId: string, chunks: string[], index: number) => {
    const chunkText = chunks[index];
    const audioUrl = `/api/tts?text=${encodeURIComponent(chunkText)}`;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
    }

    const audio = new Audio(audioUrl);
    audio.playbackRate = voiceSpeed;
    currentAudioRef.current = audio;

    // Apply Male Voice Equalizer DSP (Deep Bass + Warmth)
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } catch {
      // AudioContext fallback
    }

    audio.onended = () => {
      playAudioChunk(msgId, chunks, index + 1);
    };

    audio.onerror = () => {
      playAudioChunk(msgId, chunks, index + 1);
    };

    audio.play().catch((err) => {
      if (err?.name === "AbortError") return;
      console.warn("Audio stream interrupted:", err);
    });
  };

  const handleStartOrResumeSpeech = (
    msgId: string,
    rawText: string,
    fromBeginning = false
  ) => {
    const cleanFullText = cleanTextForBanglaTTS(rawText);
    if (!cleanFullText) return;

    // 1. If currently playing THIS message and user clicked Pause
    if (speechState.msgId === msgId && speechState.status === "playing" && !fromBeginning) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeechState((prev) => ({ ...prev, status: "paused" }));
      return;
    }

    // 2. If currently paused on THIS message and user clicked Resume
    if (speechState.msgId === msgId && speechState.status === "paused" && !fromBeginning) {
      if (currentAudioRef.current && currentAudioRef.current.src) {
        currentAudioRef.current
          .play()
          .then(() => {
            setSpeechState((prev) => ({ ...prev, status: "playing" }));
          })
          .catch(() => {
            playAudioChunk(msgId, speechChunksRef.current, speechState.chunkIndex);
          });
      } else {
        playAudioChunk(msgId, speechChunksRef.current, speechState.chunkIndex);
      }
      return;
    }

    // 3. New start or restart from beginning
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const chunks = splitIntoBengaliSentences(cleanFullText);
    speechChunksRef.current = chunks;

    const startIdx = fromBeginning ? 0 : speechState.msgId === msgId ? speechState.chunkIndex : 0;
    playAudioChunk(msgId, chunks, startIdx);
  };

  const handleStopSpeech = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeechState({
      msgId: null,
      status: "idle",
      chunkIndex: 0,
      totalChunks: 0,
    });
    activeMsgIdRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!messagesContainerRef.current) return;

    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const canvas = await toCanvas(messagesContainerRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`AI_SSC_Tutor_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNewChat = () => {
    navigate("/tutor");
    setCurrentSessionId(null);
    setInput("");
    isAutoScrollEnabled.current = true;
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInput(suggestionText);
    submitPrompt(suggestionText);
  };

  const submitPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading || isCooldown) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      const title = promptText.slice(0, 30) + (promptText.length > 30 ? "..." : "");
      const subject = searchParams.get("subject") || undefined;
      const chapter = searchParams.get("chapter") || undefined;

      sessionId = createChatSession(title, { subject, chapter });
      setCurrentSessionId(sessionId);
      navigate(`/tutor?session=${sessionId}`, { replace: true });

      addChatMessage(sessionId, {
        role: "assistant",
        content:
          "হ্যালো! আমি তোমার পার্সোনাল এআই টিউটর। ফ্রি এপিআই (Free API) লিমিট থাকায় আমার উত্তর দিতে মাঝে মাঝে একটু সময় লাগতে পারে, দয়া করে একটু অপেক্ষা করো। এসএসসি পরীক্ষার যেকোনো বিষয়ের কোনো টপিক বুঝতে অসুবিধা হলে আমাকে জিজ্ঞেস করতে পারো।",
      });
    }

    const userInputText = promptText.trim();
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);
    isAutoScrollEnabled.current = true;

    addChatMessage(sessionId, { role: "user", content: userInputText });
    scrollToBottom(true);

    const messageId = "msg-" + Date.now();
    // Add empty assistant bubble ready for streaming
    addChatMessage(sessionId, {
      id: messageId,
      role: "assistant",
      content: "",
    } as any);

    let hasStartedReceiving = false;
    const waitingTimeout = setTimeout(() => {
      if (!hasStartedReceiving) {
        updateChatMessage(
          sessionId!,
          messageId,
          "অনুগ্রহ করে একটু অপেক্ষা করুন, সার্ভারের ব্যস্ততার কারণে সময় লাগছে..."
        );
      }
    }, 10000);

    try {
      const history = currentSession
        ? currentSession.messages
            .filter((m) => m.id !== messageId && m.content.trim() !== "")
            .map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              text: m.content,
            }))
        : [];

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
          try {
            errorData = await response.json();
          } catch (e) {}

          if (response.status === 429) {
            if (errorData.type === "DAILY_QUOTA") {
              clearTimeout(waitingTimeout);
              updateChatMessage(
                sessionId,
                messageId,
                "⚠️ আজকের জন্য আপনার এপিআই লিমিট (২০টি মেসেজ) শেষ হয়ে গেছে! অনুগ্রহ করে আগামীকাল আবার চেষ্টা করুন।"
              );
              success = true;
              break;
            }
            await new Promise((r) => setTimeout(r, 15000));
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
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data.trim() === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    assistantResponse += parsed.text;
                    updateChatMessage(sessionId, messageId, assistantResponse);
                  }
                } catch (e) {
                  // Ignore partial json parse errors
                }
              }
            }
          }
        }
        success = true;
      }
      clearTimeout(waitingTimeout);
    } catch (error: any) {
      clearTimeout(waitingTimeout);
      updateChatMessage(
        sessionId,
        messageId,
        `⚠️ Error: ${error.message || "An error occurred. Please try again."}`
      );
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 2000);
      if (isAutoScrollEnabled.current) {
        scrollToBottom(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPrompt(input);
  };

  // Group sessions
  const sortedSessions = Object.values(chatSessions).sort((a, b) => b.updatedAt - a.updatedAt);
  const pinnedSessions = sortedSessions.filter((s) => s.isPinned);
  const unpinnedSessions = sortedSessions.filter((s) => !s.isPinned);
  const isOnlyInitialMessage = messages.length <= 1;

  const currentSubjectLabel =
    currentSession?.subject || subjectParam ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 truncate max-w-[200px] sm:max-w-xs">
        <BookOpen className="h-3 w-3 shrink-0" />
        <span className="truncate">
          {currentSession?.subject || subjectParam}
          {currentSession?.chapter || chapterParam ? ` • ${currentSession?.chapter || chapterParam}` : ""}
        </span>
      </span>
    ) : null;

  return (
    <div className="h-full w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 overflow-hidden relative select-text">
      <SEO
        title="AI Tutor | Smart SSC Assistant"
        description="Chat with your personal SSC Tutor AI. Ask questions, get easy Bengali explanations, and clear your doubts instantly for Physics, Chemistry, Math, Biology and more."
        href="/tutor"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "SSC AI Tutor",
          url: "https://ssc-tutor-ai.vercel.app/tutor",
          description:
            "AI-powered tutor for SSC students in Bangladesh, providing instant answers and explanations for all subjects.",
          applicationCategory: "EducationalApplication",
          operatingSystem: "All",
        }}
      />

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar for chat history */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              handleNewChat();
              setIsMobileSidebarOpen(false);
            }}
            className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-primary-600 dark:bg-primary-500 px-4 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
          {pinnedSessions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">
                Pinned
              </h3>
              <div className="space-y-1">
                {pinnedSessions.map((session) => (
                  <div key={session.id} className="group relative flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        navigate(`/tutor?session=${session.id}`);
                        setIsMobileSidebarOpen(false);
                        isAutoScrollEnabled.current = true;
                      }}
                      className={cn(
                        "flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-medium truncate transition-colors",
                        currentSessionId === session.id
                          ? "bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <div className="flex items-center">
                        <Pin className="h-3.5 w-3.5 mr-2 text-primary-500 fill-current shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </div>
                    </button>
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                      <button
                        onClick={() => togglePinChat(session.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Unpin"
                      >
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
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">
                Recent Chats
              </h3>
              <div className="space-y-1">
                {unpinnedSessions.map((session) => (
                  <div key={session.id} className="group relative flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        navigate(`/tutor?session=${session.id}`);
                        setIsMobileSidebarOpen(false);
                        isAutoScrollEnabled.current = true;
                      }}
                      className={cn(
                        "flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-medium truncate pr-14 transition-colors",
                        currentSessionId === session.id
                          ? "bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <div className="flex items-center">
                        <MessageSquare className="h-3.5 w-3.5 mr-2 text-slate-400 shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </div>
                    </button>
                    <div className="absolute right-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center bg-white/95 dark:bg-slate-800/95 shadow-sm rounded-lg ring-1 ring-slate-200 dark:ring-slate-700">
                      <button
                        onClick={() => togglePinChat(session.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-l-lg hover:bg-slate-100 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700"
                        title="Pin chat"
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteChatSession(session.id);
                          if (currentSessionId === session.id) handleNewChat();
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-r-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sortedSessions.length === 0 && (
            <div className="text-center py-10 px-4 text-slate-400 dark:text-slate-500 text-xs">
              No previous chats yet. Start asking questions to save conversations!
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full relative overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Sleek Top Chat Header (Mobile & Desktop Unified) */}
        <div className="shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    SSC AI Tutor
                  </span>
                  {currentSubjectLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Start New Chat"
            >
              <Plus className="h-3.5 w-3.5 text-primary-500" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading || messages.length <= 1}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
              title="Download chat as PDF"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 text-primary-500" />
              )}
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll Container */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 overscroll-contain relative custom-scrollbar"
        >
          <div ref={messagesContainerRef} className="mx-auto max-w-3xl space-y-6 pb-6">
            {messages.map((msg, index) => {
              const isLastMessage = index === messages.length - 1;
              const isStreamingThis = isLastMessage && isLoading && msg.role === "assistant";
              const isWaitingInitialChunk = isStreamingThis && msg.content.trim() === "";

              return (
                <div
                  key={msg.id || index}
                  className={cn(
                    "flex items-start gap-3 sm:gap-4 group/msg",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm border",
                      msg.role === "user"
                        ? "bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white border-slate-600/30"
                        : "bg-gradient-to-br from-primary-600 to-primary-700 text-white border-primary-400/30 shadow-primary-500/20"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base shadow-sm font-bn max-w-[88%] sm:max-w-[80%] relative",
                      msg.role === "user"
                        ? "bg-primary-600 text-white rounded-tr-sm font-medium tracking-wide shadow-primary-500/20"
                        : msg.redirect
                        ? "bg-blue-50/80 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-sm"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-tl-sm"
                    )}
                  >
                    {/* Subject Redirect Header */}
                    {msg.redirect && (
                      <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-semibold mb-2.5 border-b border-blue-100 dark:border-slate-700 pb-2 text-xs sm:text-sm">
                        <Info className="h-4 w-4" />
                        <span>বিষয়ভিত্তিক সহায়তা</span>
                      </div>
                    )}

                    {/* Waiting Indicator before first token */}
                    {isWaitingInitialChunk ? (
                      <div className="flex items-center space-x-2 py-1 text-slate-500 dark:text-slate-400">
                        <span className="text-xs sm:text-sm font-bn">উত্তর প্রস্তুত হচ্ছে...</span>
                        <div className="flex space-x-1 items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce"></div>
                        </div>
                      </div>
                    ) : (
                      /* Markdown Content */
                      <div
                        className={cn(
                          "prose prose-slate dark:prose-invert max-w-none break-words overflow-x-auto text-sm sm:text-base",
                          "prose-p:my-1.5 prose-p:leading-relaxed",
                          "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
                          "prose-headings:my-2 prose-headings:font-bold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm",
                          "prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-3 prose-pre:rounded-xl",
                          "prose-code:font-mono prose-code:text-xs prose-code:bg-slate-100 dark:prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
                          msg.role === "user" && "text-white prose-p:text-white prose-strong:text-white"
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.content}
                        </ReactMarkdown>

                        {/* Blinking streaming cursor */}
                        {isStreamingThis && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-primary-500 dark:bg-primary-400 animate-pulse align-middle" />
                        )}

                        {/* Redirect Action Button */}
                        {msg.redirect && (
                          <div className="mt-4 flex justify-start pt-2">
                            <button
                              onClick={() => navigate(msg.redirect!.target)}
                              className="inline-flex items-center space-x-2 rounded-xl bg-primary-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md active:scale-95"
                            >
                              <span>{msg.redirect.buttonText}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Actions Toolbar (Male Teacher Voice & Copy) */}
                    {msg.role === "assistant" && msg.content.trim() !== "" && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-slate-400">
                        {/* Audio Controller */}
                        {speechState.msgId === (msg.id || `${index}`) && speechState.status !== "idle" ? (
                          <div className="flex flex-wrap items-center gap-1.5 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800/80 rounded-xl p-1 text-xs text-primary-700 dark:text-primary-300 shadow-sm">
                            <span className="flex items-center gap-1 font-bn font-semibold px-2 py-0.5">
                              {speechState.status === "playing" ? (
                                <>
                                  <span className="flex space-x-0.5 items-end h-3 mr-1">
                                    <span className="w-0.5 h-2 bg-primary-500 animate-pulse"></span>
                                    <span className="w-0.5 h-3.5 bg-primary-500 animate-pulse [animation-delay:0.15s]"></span>
                                    <span className="w-0.5 h-1.5 bg-primary-500 animate-pulse [animation-delay:0.3s]"></span>
                                  </span>
                                  <span>👨‍🏫 ভাইয়া বলছেন...</span>
                                </>
                              ) : (
                                <span>পজ করা</span>
                              )}
                            </span>

                            {/* Play / Pause toggle */}
                            <button
                              onClick={() => handleStartOrResumeSpeech(msg.id || `${index}`, msg.content, false)}
                              className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/80 rounded-lg transition-colors text-primary-700 dark:text-primary-300"
                              title={speechState.status === "playing" ? "পজ করুন (Pause)" : "চালিয়ে যান (Resume)"}
                            >
                              {speechState.status === "playing" ? (
                                <Pause className="h-3.5 w-3.5" />
                              ) : (
                                <Play className="h-3.5 w-3.5 fill-current" />
                              )}
                            </button>

                            {/* Restart from start */}
                            <button
                              onClick={() => handleStartOrResumeSpeech(msg.id || `${index}`, msg.content, true)}
                              className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/80 rounded-lg transition-colors flex items-center gap-0.5 text-primary-700 dark:text-primary-300"
                              title="প্রথম থেকে শুনুন (Restart from start)"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-bn hidden sm:inline">শুরু থেকে</span>
                            </button>

                            {/* Speed toggle */}
                            <button
                              onClick={() => {
                                const nextSpeed = voiceSpeed === 1.0 ? 1.15 : voiceSpeed === 1.15 ? 1.25 : 1.0;
                                setVoiceSpeed(nextSpeed);
                                if (currentAudioRef.current) {
                                  currentAudioRef.current.playbackRate = nextSpeed;
                                }
                              }}
                              className="px-1.5 py-0.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-primary-200 dark:border-primary-800 rounded-md text-[10px] font-semibold text-primary-700 dark:text-primary-300 font-mono transition-colors"
                              title="কথা বলার গতি পরিবর্তন করুন"
                            >
                              {voiceSpeed}x
                            </button>

                            {/* Stop */}
                            <button
                              onClick={handleStopSpeech}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-950/60 hover:text-red-600 rounded-lg transition-colors"
                              title="ভয়েস বন্ধ করুন (Stop)"
                            >
                              <VolumeX className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Voice Play Button */}
                            <button
                              onClick={() => handleStartOrResumeSpeech(msg.id || `${index}`, msg.content, false)}
                              className="px-2.5 py-1 hover:text-primary-600 dark:hover:text-primary-400 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-colors text-xs flex items-center gap-1.5 font-bn text-slate-700 dark:text-slate-300 font-semibold shadow-xs"
                              title="খাঁটি বাংলায় ভাইয়ার কণ্ঠে শুনুন"
                            >
                              <Volume2 className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                              <span>👨‍🏫 ভাইয়ার কণ্ঠে শোনো</span>
                            </button>

                            {/* Resume button if previously paused */}
                            {speechState.msgId === (msg.id || `${index}`) && speechState.chunkIndex > 0 && (
                              <button
                                onClick={() => handleStartOrResumeSpeech(msg.id || `${index}`, msg.content, false)}
                                className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 hover:bg-primary-200 text-primary-700 dark:text-primary-300 rounded-md text-[10px] font-bn font-semibold transition-colors"
                                title="যেখান থেকে থেমেছিল সেখান থেকে শুনুন"
                              >
                                বাকি অংশ
                              </button>
                            )}
                          </div>
                        )}

                        {/* Copy text button */}
                        <button
                          onClick={() => handleCopyText(msg.id || `${index}`, msg.content)}
                          className="p-1.5 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400"
                          title="কপি করুন"
                        >
                          {copiedMsgId === (msg.id || `${index}`) ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-[10px] text-green-600 dark:text-green-400 font-bn">কপি হয়েছে</span>
                            </>
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Starters for New Chat */}
            {isOnlyInitialMessage && (
              <div className="pt-4 sm:pt-6">
                <div className="flex items-center gap-2 mb-3 px-1 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-primary-500" />
                  <span>জনপ্রিয় কিছু প্রশ্ন (সরাসরি ক্লিক করে জেনে নাও)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {QUICK_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(item.text)}
                      className="text-left p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:border-primary-300 dark:hover:border-primary-700/60 transition-all text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bn shadow-sm group flex items-start gap-2.5 active:scale-[0.99]"
                    >
                      <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="leading-snug">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollBottomBtn && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-24 right-4 sm:right-8 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-transform active:scale-95"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input Bar (Mobile & Tablet Optimized) */}
        <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 sm:p-4 lg:p-5">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isCooldown
                    ? "অনুগ্রহ করে একটু অপেক্ষা করুন..."
                    : subjectParam
                    ? `${subjectParam.split(" (")[0]} সম্পর্কিত যেকোনো প্রশ্ন লিখো...`
                    : "এসএসসি বিষয় সম্পর্কিত যেকোনো প্রশ্ন লিখো (যেমন: নিউটনের ৩য় সূত্র)..."
                }
                disabled={isLoading || isListening || isCooldown}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 sm:px-5 py-3 sm:py-3.5 pr-20 sm:pr-24 text-sm sm:text-base outline-none transition-all focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800/90 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60 font-bn shadow-inner"
              />

              <div className="absolute right-1.5 sm:right-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading || isCooldown}
                  className={cn(
                    "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl transition-all disabled:opacity-50",
                    isListening
                      ? "bg-red-100 dark:bg-red-950/60 text-red-600 animate-pulse ring-1 ring-red-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  )}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isLoading || isCooldown || (!input.trim() && !isListening)}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary-600 text-white transition-all hover:scale-105 hover:bg-primary-700 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-primary-600 shadow-sm"
                  title="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 ml-0.5" />
                  )}
                </button>
              </div>
            </form>

            <div className="mt-1.5 sm:mt-2 text-center text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bn">
              এআই ভুল করতে পারে। গুরুত্বপূর্ণ তথ্যের জন্য পাঠ্যবই অনুসরণ করো।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
