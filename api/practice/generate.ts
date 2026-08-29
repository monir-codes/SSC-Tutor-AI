import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const envKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean) : [];
  const API_KEYS = envKeys.length > 0 ? envKeys : [];

  if (API_KEYS.length === 0) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

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

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const data = JSON.parse(response.text || "[]");
      return res.status(200).json({ questions: data });
    } catch (error: any) {
      if (error.status === 429 || (error.message && error.message.includes('429'))) {
        continue;
      }
      console.error("Practice Gen Error:", error);
      break;
    }
  }

  res.status(500).json({ error: "Failed to generate practice questions." });
}
