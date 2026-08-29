import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Authentic Bangladeshi Local Teacher & SSC AI Tutor System Prompt
  const SYSTEM_PROMPT = `You are "SSC Tutor AI" (এসএসসি টিউটর ভাইয়া/টিচার), a warm, caring, highly experienced, and student-favorite private tutor in Bangladesh dedicated to teaching the NCTB SSC curriculum.

Core Identity & Persona:
- You speak in natural, beautiful, friendly, and 100% authentic conversational Bengali (খাঁটি বাংলা).
- You are like a caring elder brother (ভাইয়া) or favorite neighborhood teacher (পছন্দের শিক্ষক) who explains everything with endless patience and encouragement.
- STRICT RULE: DO NOT write dry, boring, mechanical textbook reading. DO NOT sound like a robotic translation. Instead, talk directly to the student as if sitting beside them with a pen and notebook!

Teaching Methodology & Tone:
1. **Warm Greeting & Empathy:** Use gentle, encouraging phrases (e.g. "শোনো ভাইয়া/আপু...", "ব্যাপারটা কিন্তু অনেক সহজ!", "চলো একটা চমৎকার বাস্তব উদাহরণ দিয়ে বুঝি...", "দারুণ একটা প্রশ্ন করেছ!").
2. **Relatable Real-World Analogies (বাস্তব জীবনের দারুণ উদাহরণ):**
   - Physics (পদার্থবিজ্ঞান): রিকশায় ব্রেক কষলে কেন সামনে হেলে পড়ি (গতি জড়তা), ক্রিকেট বল ক্যাচ ধরার সময় হাত পেছনে নেওয়া (ভরবেগের পরিবর্তন ও আঘাত কমানো), ফ্যানের সুইচ বন্ধ করার পর কেন কিছুক্ষণ ঘোরে।
   - Chemistry (রসায়ন): রান্নায় লবণ ($NaCl$) দেওয়া, চা বানানোর সময় চিনি গোলানো (দ্রবণ ও দ্রাবক), লোহার গ্রিলে মরিচা পড়ার কারণ।
   - Biology (জীববিজ্ঞান): গাছের পাতাকে রান্নাঘরের সাথে তুলনা করে সালোকসংশ্লেষণ বোঝানো, রক্তনালীকে শহরের সুপেয় পানির পাইপলাইনের সাথে তুলনা।
   - Mathematics (গণিত ও উচ্চতর গণিত): বাজারের কেনাকাটা, পিঠা ভাগাভাগি, খেলার মাঠের ক্ষেত্রফল ও জ্যামিতিক উচ্চতা।
3. **Step-by-Step Breakdown:** জটিল বিষয়কে ছোট ছোট অংশে ভাগ করে ধাপে ধাপে বুঝিয়ে দাও।
4. **Active Encouragement:** শেষে শিক্ষার্থীকে বুস্ট করার জন্য মিষ্টি একটি টিপস বা শর্টকাট টেকনিক বলে দাও।

Allowed Topics:
- Bangladesh SSC (NCTB) curriculum: Science (Physics, Chemistry, Biology, Higher Math), Humanities/Arts (Bangla, English, ICT, History, Geography, Civics, Economics, Religion), Commerce/Business Studies (Accounting, Finance & Banking, Business Entrepreneurship, General Math).
- Allowed actions: Explaining topics, solving textbook problems, past SSC Board Questions (Dhaka, Rajshahi, Chittagong, etc.), formula derivations, model test feedback, and exam tips.

Restricted Topics:
- If a question is totally outside the SSC curriculum (politics, movies, gaming hacks, general adult topics), gently redirect in sweet Bengali:
"দুঃখিত ভাইয়া/আপু! আমি শুধুমাত্র তোমাদের SSC (NCTB) পাঠ্যক্রমের বিষয়গুলো সহজ করে বুঝিয়ে দিতে পারি। তোমার কোনো বই বা অধ্যায়ের প্রশ্ন থাকলে আমাকে বলো, আমি সুন্দর করে বুঝিয়ে দিচ্ছি!"

Mathematics & Scientific Notation Rules:
1. Always use LaTeX for formulas and equations: Single $ for inline math ($E = mc^2$, $s = ut + \\frac{1}{2}at^2$) and double $$ for block equations.
2. Step-by-step calculation with clear reasons for each step.`;

  const envKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean) : [];
  const API_KEYS = envKeys.length > 0 ? envKeys : [];

  const runWithKeyRotation = async (res: any, operation: (ai: any) => Promise<any>) => {
    let lastError: any = null;
    
    for (let i = 0; i < API_KEYS.length; i++) {
      try {
        const ai = new GoogleGenAI({
          apiKey: API_KEYS[i],
          httpOptions: { headers: { "User-Agent": "aistudio-build" } },
        });
        
        await operation(ai);
        return; // Success! Exit loop
      } catch (error: any) {
        lastError = error;
        const errorMessage = error.message || "";
        
        // Quota rotation
        if (error.status === 429 || errorMessage.includes('429') || errorMessage.includes("GenerateRequestsPerDay") || errorMessage.includes("limit: 20")) {
          console.warn(`Key ${i + 1} exhausted, rotating to next key...`);
          continue;
        }
        break;
      }
    }
    
    console.error("All API keys failed or exhausted. Last Error:", lastError);
    const errorMessage = lastError?.message || "";
    
    if (errorMessage.includes("GenerateRequestsPerDay") || errorMessage.includes("limit: 20")) {
      res.status(429).json({ error: "Daily limit exceeded for all keys.", type: "DAILY_QUOTA" });
    } else if (lastError?.status === 429 || errorMessage.includes('429')) {
      res.status(429).json({ error: "Rate limit exceeded for all keys. Please wait.", type: "MINUTE_QUOTA" });
    } else {
      res.status(500).json({ error: "Failed to communicate with SSC Tutor AI." });
    }
  };

  // Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    await runWithKeyRotation(res, async (ai) => {
      const { message, history, subject, chapter } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      let systemContext = SYSTEM_PROMPT;
      if (subject) {
        systemContext += `\n\nCURRENT SUBJECT CONTEXT: The student is studying ${subject}. Help them master this subject with warm examples and encouragement!`;
      }
      if (chapter) {
        systemContext += `\nCURRENT CHAPTER CONTEXT: The student is studying the chapter: ${chapter}.`;
      }

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemContext,
          temperature: 0.7,
        }
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      for await (const chunk of responseStream) {
        try {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        } catch (err) {
          // Ignore partial metadata chunk errors
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    });
  });

  // Practice & Board Question Generator
  app.post("/api/practice/generate", async (req, res) => {
    await runWithKeyRotation(res, async (ai) => {
      const { subject, chapter, difficulty, questionType, board, year, count = 5 } = req.body;

      let boardRequirement = "";
      if (board && board !== "all") {
        boardRequirement += `\n- Target Board: ${board.toUpperCase()} BOARD (or recent board questions if specific year).`;
      }
      if (year && year !== "all") {
        boardRequirement += `\n- Target Year: ${year}.`;
      }

      const prompt = `Generate ${count} authentic SSC practice questions for a Bangladesh SSC student (NCTB curriculum).
Subject: ${subject}
Chapter: ${chapter || 'Full Syllabus'}
Difficulty: ${difficulty}
Question Type: ${questionType || 'MCQ'}
${boardRequirement}

IMPORTANT RULES:
1. Be conceptually accurate and match Bangladesh SSC board exam standards.
2. YOU MUST ONLY GENERATE AUTHENTIC, REAL PREVIOUS SSC BOARD QUESTIONS from past exams (e.g. Dhaka Board 2024/2023, Rajshahi Board 2023, Chittagong Board 2022, Comilla Board 2023, Jessore Board 2024, Dinajpur Board, etc.).
3. Label each question with its exact board and year in the \`boardInfo\` field (e.g. "ঢাকা বোর্ড ২০২৩", "রাজশাহী বোর্ড ২০২৪", "যশোর বোর্ড ২০২২"). Set \`isBoardQuestion\` to true.
4. Provide a friendly, teacher-style step-by-step explanation in Bangla for the correct answer.
5. Provide an easy learning tip for each question.
6. Output must be valid JSON array of objects.

Response format:
[
  {
    "id": "q-1",
    "text": "প্রশ্নটি বাংলায়...",
    "options": ["ক. অপশন ১", "খ. অপশন ২", "গ. অপশন ৩", "ঘ. অপশন ৪"],
    "correctAnswer": "ক. অপশন ১",
    "explanation": "শিক্ষক সুলভ সহজ ভাষায় ধাপে ধাপে ব্যাখ্যা...",
    "tips": "মনে রাখার সহজ টেকনিক...",
    "isBoardQuestion": true,
    "boardInfo": "ঢাকা বোর্ড ২০২৩"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const data = JSON.parse(response.text || '[]');
      res.json({ questions: data });
    });
  });

  // Model Tests & Board Exam Papers Generator
  app.post("/api/tests/generate", async (req, res) => {
    await runWithKeyRotation(res, async (ai) => {
      const { subject, syllabusType, difficulty, board, year, examMode, chapter, count = 10 } = req.body;

      let modeDescription = "";
      if (examMode === "board_exam") {
        modeDescription = `Generate a genuine SSC Board Examination Paper consisting of ${count} authentic questions.
Target Board: ${board ? board.toUpperCase() : 'ALL BOARDS'}
Target Year: ${year ? year : '2024/2023'}`;
      } else if (examMode === "chapter_drill") {
        modeDescription = `Generate a Chapter-wise Board Drill of ${count} questions focusing exclusively on Chapter: ${chapter || 'Important Chapters'} from past SSC Board exams.`;
      } else {
        modeDescription = `Generate a Full Syllabus SSC Model Test of ${count} questions matching board exam standards.`;
      }

      const prompt = `${modeDescription}
Subject: ${subject}
Difficulty: ${difficulty || 'Board Standard'}

CRITICAL INSTRUCTIONS:
1. ONLY USE REAL, AUTHENTIC SSC BOARD QUESTIONS that appeared in actual SSC exams (২০১৮ থেকে ২০২৪).
2. DO NOT make up fake or generic questions.
3. In \`boardInfo\`, write the exact board and year in Bengali (e.g. "ঢাকা বোর্ড ২০২৪", "রাজশাহী বোর্ড ২০২৩", "চট্টগ্রাম বোর্ড ২০২২", "কুমিল্লা বোর্ড ২০২৪", "যশোর বোর্ড ২০২৩", "দিনাজপুর বোর্ড ২০২৪", "বরিশাল বোর্ড ২০২২", "সিলেট বোর্ড ২০২৩", "ময়মনসিংহ বোর্ড ২০২৪").
4. Make every question in the paper unique, testing diverse sub-topics.
5. Provide a warm, clear step-by-step teacher explanation in Bengali for the correct answer.

Return ONLY a raw JSON array matching this exact format:
[
  {
    "id": "1",
    "question": "প্রশ্নটি বাংলায়...",
    "options": ["ক. অপশন ১", "খ. অপশন ২", "গ. অপশন ৩", "ঘ. অপশন ৪"],
    "correctAnswer": "ক. অপশন ১",
    "explanation": "ধাপে ধাপে সহজ ভাষায় সমাধান ও ব্যাখ্যা...",
    "tips": "সংক্ষিপ্ত মনে রাখার টিপস...",
    "isBoardQuestion": true,
    "boardInfo": "ঢাকা বোর্ড ২০২৪"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const data = JSON.parse(response.text || '[]');
      res.json({ questions: data });
    });
  });

  app.get("/api/tts", (req, res) => {
    const text = (req.query.text || "") as string;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const encoded = encodeURIComponent(text.slice(0, 300));
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encoded}`;

    https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
      },
      (ttsRes) => {
        if (ttsRes.statusCode !== 200) {
          return res.status(500).json({ error: "TTS upstream failed" });
        }
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        ttsRes.pipe(res);
      }
    ).on("error", (err) => {
      console.error("TTS error:", err);
      res.status(500).json({ error: "TTS streaming error" });
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve production build for lightning-fast instant loading
  const fs = await import("fs");
  const distPath = path.join(process.cwd(), "dist");
  const distIndexExists = fs.existsSync(path.join(distPath, "index.html"));

  if (distIndexExists) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 SSC Tutor AI Server running instantly at http://localhost:${PORT}`);
    });
  } else {
    const http = await import("http");
    const server = http.createServer(app);
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server } },
      appType: "spa",
    });
    app.use(vite.middlewares);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer().catch(console.error);
