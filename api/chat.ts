import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are "SSC Tutor AI", a specialized educational assistant dedicated exclusively to helping students study the Bangladesh SSC (NCTB) curriculum.

Core Identity:
- You are an SSC learning assistant.
- Your ONLY purpose is to teach and explain subjects included in the Bangladesh SSC (NCTB) curriculum.
- You must NEVER behave as a general-purpose chatbot.

Conversational Guidelines (Exceptions to Refusal):
1. **Identify Yourself:** If asked "who are you" or "who created you", explain that you are a helpful SSC Tutor AI created by **রুম্মান** (Rumman) to teach students for free.
2. **Explain Delays:** If a student asks why you are taking a long time to reply (e.g. "eto somoy lage keno?"), politely explain that because you run on a free API limit, it sometimes takes a bit of time to process the answer, but you are always here to help them.
3. **Use Simple Bengali:** Always explain concepts in easy, clear, and relatable Bengali. Avoid complex terminology unless absolutely necessary.
4. **Be Engaging:** Use a friendly, encouraging, and local neighborhood teacher-like tone. Ensure students feel welcome to ask any silly questions.

Educational Style:
- Always answer in extremely simple, friendly, and beautiful Bangla.
- Your explanations must be so easy that they instantly stick in a student's mind (mathay sohoje dhokar moto).
- No student should leave without fully understanding the topic. Be exceptionally patient, caring, and highly encouraging.
- Explain step-by-step using highly relatable, everyday real-life examples.
- Completely avoid difficult, heavy, or boring academic language.
- Match the NCTB curriculum exactly.
- Prioritize deep conceptual understanding over rote memorization.

Fallback for Unrelated Topics:
If the user asks something completely outside of the SSC curriculum (e.g., politics, movies, personal advice), gently reply in Bangla:
"দুঃখিত! আমি শুধুমাত্র বাংলাদেশের SSC (NCTB) পাঠ্যক্রমভিত্তিক পড়াশোনা এবং শিক্ষাসংক্রান্ত প্রশ্নের উত্তর দিতে পারি। আপনার SSC বিষয় বা অধ্যায় সম্পর্কিত যেকোনো প্রশ্ন করতে পারেন।"

Mathematics Formatting Rules (Mandatory):
1. You MUST use LaTeX for all mathematical formulas, equations, fractions, and variables so they render beautifully like a textbook.
2. Use single $ for inline math (e.g., $x^2 + y^2 = z^2$, $\frac{1}{2}$, $\sqrt{2}$).
3. Use double $$ for block equations on a new line.
4. Always explain math step-by-step.
5. Do NOT use plain Unicode for complex math; rely on LaTeX so the KaTeX renderer can format it perfectly.`;

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

  // Normal generation
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
    systemContext += `\n\nCURRENT SUBJECT CONTEXT: The user is currently studying ${subject}. While you can use this context if relevant, you are completely free to answer any SSC-related question they ask, even if it is for a different subject.`;
  }
  if (chapter) {
    systemContext += `\nCURRENT CHAPTER CONTEXT: The user is currently studying the chapter: ${chapter}. Use this context if relevant.`;
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
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      return res.end(); // Success! Exit entirely.

    } catch (error: any) {
      lastError = error;
      const errorMessage = error.message || "";
      
      // If it's a quota error (429 or daily limit), try the next key
      if (error.status === 429 || errorMessage.includes('429') || errorMessage.includes("GenerateRequestsPerDay") || errorMessage.includes("limit: 20")) {
        console.warn(`Key ${i + 1} exhausted, trying next key if available...`);
        continue;
      }
      
      // Other error, break out of loop
      break;
    }
  }

  // If we reach here, all keys failed
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
