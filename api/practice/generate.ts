import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const fallbackKeys = "AQ.Ab8RN6JZgov0_t7RfyUGk2fsyoHNgc9Smxl5DZpjTime6-EPeg,AQ.Ab8RN6KDRdb80PYGXjsAg6l8umueLApOL0LZ8_zI9ga_u0qa4g";
  const apiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || fallbackKeys)
    .split(",")
    .map(k => k.trim())
    .filter(k => k.length > 0);

  if (apiKeys.length === 0) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
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
    const { subject, chapter, difficulty, questionType, count = 5 } = req.body;

    const prompt = `Generate ${count} practice questions for a Bangladesh SSC student (NCTB curriculum).
      Subject: ${subject}
      Chapter: ${chapter || "Full Syllabus"}
      Difficulty: ${difficulty}
      Question Type: ${questionType} (e.g. MCQ)

      IMPORTANT RULES:
      1. Be conceptually accurate and match SSC board exam standards.
      2. YOU MUST ONLY GENERATE AUTHENTIC, REAL PREVIOUS SSC BOARD QUESTIONS that appeared in past exams (e.g., Dhaka Board 2023, Rajshahi Board 2019, etc.). 
      3. DO NOT generate random, made-up, or generic practice questions. EVERY single question must be an actual past board question.
      4. Label each question with its actual board and year in the \`boardInfo\` field. Set \`isBoardQuestion\` to true for all of them. Do NOT invent or hallucinate board questions.
      5. Provide a detailed explanation for the correct answer, and explain why other options are incorrect.
      6. Provide a learning tip for each question.
      7. Output must be perfectly valid JSON.

      Response format (JSON array of objects):
      [
        {
          "id": "unique_string",
          "text": "The question text in Bangla",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "The exact text of the correct option",
          "explanation": "Detailed step-by-step explanation in Bangla...",
          "tips": "Short learning tip...",
          "isBoardQuestion": true,
          "boardInfo": "SSC Dhaka Board 2023"
        }
      ]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const data = JSON.parse(response.text || "[]");
    res.status(200).json({ questions: data });
  } catch (error) {
    console.error("Practice Gen Error:", error);
    res.status(500).json({ error: "Failed to generate questions." });
  }
}
