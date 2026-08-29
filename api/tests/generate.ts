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

  const { subject, syllabusType, difficulty, board, year, examMode, chapter, count = 10 } = req.body;

  let modeDescription = "";
  if (examMode === "board_exam") {
    modeDescription = `Generate a genuine SSC Board Examination Paper of ${count} questions.
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
      console.error("Test Gen Error:", error);
      break;
    }
  }

  res.status(500).json({ error: "Failed to generate model test." });
}
