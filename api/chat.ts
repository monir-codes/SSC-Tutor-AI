import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const envKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean) : [];
  const API_KEYS = envKeys.length > 0 ? envKeys : [];

  const { message, history, subject, chapter } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const contents = [];
  if (history && Array.isArray(history)) {
    for (const msg of history) {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }],
      });
    }
  }
  
  let systemContext = SYSTEM_PROMPT;
  if (subject) {
    systemContext += `\n\nCURRENT SUBJECT CONTEXT: The student is studying ${subject}. Help them master this subject with warm examples and encouragement!`;
  }
  if (chapter) {
    systemContext += `\nCURRENT CHAPTER CONTEXT: The student is studying the chapter: ${chapter}.`;
  }

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  let lastError: any = null;

  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const ai = new GoogleGenAI({
        apiKey: API_KEYS[i],
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemContext,
          temperature: 0.7,
        },
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      if (res.flushHeaders) {
        res.flushHeaders();
      }

      for await (const chunk of responseStream) {
        try {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        } catch (err) {
          // ignore chunk error
        }
      }
      res.write("data: [DONE]\n\n");
      return res.end();

    } catch (error: any) {
      lastError = error;
      const errorMessage = error.message || "";
      
      if (error.status === 429 || errorMessage.includes('429') || errorMessage.includes("GenerateRequestsPerDay") || errorMessage.includes("limit: 20")) {
        console.warn(`Key ${i + 1} exhausted, rotating...`);
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
}
