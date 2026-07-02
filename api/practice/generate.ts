import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  if (!ai) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  try {
    const { subject, chapter, difficulty, questionType, count = 5 } = req.body;

    const prompt = `Generate ${count} practice questions for a Bangladesh SSC student (NCTB curriculum).
      Subject: ${subject}
      Chapter: ${chapter || "Full Syllabus"}
      Difficulty: ${difficulty}
      Question Type: ${questionType} (e.g. MCQ)

      IMPORTANT RULES:
      1. Be conceptually accurate and match SSC board exam standards.
      2. If you know an authentic, real previous SSC board question for this topic, include it. Label it with the actual board and year (e.g., "SSC Dhaka Board 2023"). Do NOT invent or hallucinate board questions.
      3. If it's not a real board question, label it as "Practice Question (SSC Exam Style)".
      4. Provide a detailed explanation for the correct answer, and explain why other options are incorrect.
      5. Provide a learning tip for each question.
      6. Output must be perfectly valid JSON.

      Response format (JSON array of objects):
      [
        {
          "id": "unique_string",
          "text": "The question text in Bangla",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "The exact text of the correct option",
          "explanation": "Detailed step-by-step explanation in Bangla...",
          "tips": "Short learning tip...",
          "isBoardQuestion": true/false,
          "boardInfo": "SSC Dhaka Board 2023" (if isBoardQuestion is true, else "Practice Question (SSC Exam Style)")
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
