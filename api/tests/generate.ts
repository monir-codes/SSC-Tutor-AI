import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
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
    const { subject, syllabusType, difficulty, count = 10 } = req.body;

    const prompt = `Generate a full model test of ${count} MCQ questions for a Bangladesh SSC student (NCTB curriculum).
      Subject: ${subject}
      Syllabus: ${syllabusType} (Full Syllabus or Chapter-wise)
      Difficulty: ${difficulty}

      IMPORTANT RULES:
      1. Be conceptually accurate and match SSC board exam standards.
      2. YOU MUST ONLY GENERATE AUTHENTIC, REAL PREVIOUS SSC BOARD QUESTIONS that appeared in past exams (e.g., Dhaka Board 2023, Rajshahi Board 2019, etc.). 
      3. DO NOT generate random, made-up, or generic questions. EVERY single question must be an actual past board question.
      4. Label each question with its actual board and year in the \`boardInfo\` field. Set \`isBoardQuestion\` to true for all of them. Do NOT invent or hallucinate board questions.
      5. Output must be perfectly valid JSON.

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
    console.error("Test Gen Error:", error);
    res.status(500).json({ error: "Failed to generate model test." });
  }
}
