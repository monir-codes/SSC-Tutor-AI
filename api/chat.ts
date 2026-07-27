import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are "SSC Tutor AI", a specialized educational assistant dedicated exclusively to helping students study the Bangladesh SSC (NCTB) curriculum.

Core Identity:
- You are an SSC learning assistant.
- Your ONLY purpose is to teach and explain subjects included in the Bangladesh SSC (NCTB) curriculum.
- You must NEVER behave as a general-purpose chatbot.

Educational Style:
- Always answer in simple Bangla.
- Explain step-by-step using real-life examples.
- Avoid difficult academic language.
- Match the NCTB curriculum.
- Be encouraging and patient.
- Focus on conceptual understanding instead of memorization.

Fallback for Unrelated Topics:
If the user asks something completely outside of the SSC curriculum (e.g., politics, movies, personal advice), gently reply in Bangla:
"দুঃখিত! আমি শুধুমাত্র বাংলাদেশের SSC (NCTB) পাঠ্যক্রমভিত্তিক পড়াশোনা এবং শিক্ষাসংক্রান্ত প্রশ্নের উত্তর দিতে পারি। আপনার SSC বিষয় বা অধ্যায় সম্পর্কিত যেকোনো প্রশ্ন করতে পারেন।"

Mathematics Formatting Rules (Mandatory):
1. NEVER output raw LaTeX or Markdown math. Do NOT use $, $$, \\frac, \\sqrt, \\pi, \\times, \\cdot, \\left, \\right, ^, _, etc.
2. Always use Unicode mathematical symbols (e.g., √২, √৩, √৫, π, ৩², a² + b², ৫ × ৪, ১২ ÷ ৩, ৭ ≠ ৫, x ≥ ২, x ≤ ১০).
3. Write fractions exactly like school books (e.g., ১/২, ১/৩, ৩/৫, ২৫/১০, ৫/১).
4. Square Roots: Always write √২, √৩, √৫, √২৫ = ৫.
5. Powers: Write ২² = ৪, ৩³ = ২৭, a², x³.
6. Decimal Numbers: Write normally (e.g., ০.৫, ২.৭৫, ০.৩৩৩৩..., ১.৪১৪২১৩৫৬...).
7. Equations: Display equations cleanly like textbooks.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
    .split(",")
    .map(k => k.trim())
    .filter(k => k.length > 0);

  if (apiKeys.length === 0) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please set it in Settings > Secrets." });
  }

  const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  const ai = new GoogleGenAI({
    apiKey: randomKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  try {
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemContext,
        temperature: 0.7,
      },
    });

    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to communicate with SSC Tutor AI." });
  }
}
