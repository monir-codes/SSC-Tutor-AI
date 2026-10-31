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

  const {
    subject,
    subjectCode,
    syllabusType,
    difficulty,
    board,
    year,
    examMode,
    chapter,
    count = 10,
    paperType = "full",
  } = req.body;

  const mcqCount = paperType === "cq" ? 0 : Number(count) || 10;
  const cqCount = paperType === "mcq" ? 0 : Math.min(3, Math.max(1, Math.round((Number(count) || 10) / 4)));

  let modeDescription = "";
  if (examMode === "board_exam") {
    modeDescription = `Generate an authentic SSC Board Examination Paper based on past SSC Board exam questions.
Target Board: ${board && board !== 'all' ? board.toUpperCase() : 'ALL BOARDS COMMON SUGGESTION (বিগত 7 বছরের সর্বাধিক কমন ও রিপিটেড প্রশ্ন)'}
Target Year / Session: ${year ? year : '2024/2025'}`;
  } else if (examMode === "chapter_drill") {
    modeDescription = `Generate a Chapter-wise SSC Board Drill focusing exclusively on Chapter: ${chapter || 'Important Chapters'} from past SSC Board exams.`;
  } else {
    modeDescription = `Generate a Full Syllabus Authentic SSC Board Suggestion & Test Paper matching official Bangladesh NCTB examination standards.`;
  }

  const prompt = `You are the chief question paper setter and researcher for the Bangladesh Secondary Education Board (NCTB SSC Examination).
Task: ${modeDescription}

Target Subject: ${subject}
Subject Code: ${subjectCode || "136"}
Paper Type Requested: ${paperType} (full = MCQ + CQ, mcq = only MCQ, cq = only CQ)
Difficulty: ${difficulty || 'Board Standard'}

CRITICAL SSC NCTB EXAMINATION & RESEARCH INSTRUCTIONS:
1. ONLY USE REAL, AUTHENTIC SSC BOARD QUESTIONS that appeared in actual SSC exams (2018 থেকে 2024).
2. RESEARCH REPETITION: For each question, identify which boards and years this question (or its identical concept) appeared in, and record this in \`boardInfo\` (e.g. "ঢাকা বোর্ড 2024, রাজশাহী বোর্ড 2022, যশোর বোর্ড 2020" or "কু. বো. 23, চ. বো. 21").
3. In \`frequencyTag\`, highlight if it is a repeated high-yield question (e.g. "3 বার রিপিটেড (Super Suggestion)" or "99% কমন সৃজনশীল").
4. For MCQs:
   - Provide 4 authentic options in Bengali ("ক. ...", "খ. ...", "গ. ...", "ঘ. ...").
   - Clearly set \`correctAnswer\` to the EXACT string of the correct option.
   - Provide step-by-step teacher explanations in sweet, clear Bengali.
   - Provide a quick memory tip (\`tips\`).
5. For Creative Questions (CQ - সৃজনশীল প্রশ্নাবলি):
   - Provide an authentic, error-free stimulus (\`stimulus\` / উদ্দীপক) based on real NCTB curriculum experiments, tables, or real-life scenarios.
   - Strict 4-tier sub-questions:
     * ক: জ্ঞানমূলক (Knowledge - 1 mark)
     * খ: অনুধাবনমূলক (Comprehension - 2 marks)
     * গ: প্রয়োগমূলক (Application - 3 marks)
     * ঘ: উচ্চতর দক্ষতামূলক (Higher Ability - 4 marks)
   - Detailed, mathematically and conceptually error-free model answers for every sub-question.
6. NUMERAL REQUIREMENT: ALWAYS use standard English/Arabic numerals (1, 2, 3, 2024, 25, 75) for all digits, years, marks, and formulas. NEVER output Bengali numerals (০, ১, ২, ৩, ইত্যাদি) as they render confusingly in fonts.

Return ONLY a raw JSON object with this exact structure:
{
  "testPaper": {
    "title": "মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষা 2025 — টেস্ট পেপার ও সুপার সাজেশন",
    "subjectName": "${subject}",
    "subjectCode": "${subjectCode || "136"}",
    "boardName": "${board && board !== 'all' ? board : 'সকল শিক্ষা বোর্ড (সুপার সাজেশন)'}",
    "year": "${year || '2024-2025'}",
    "paperType": "${paperType}",
    "mcqTime": "25 মিনিট",
    "mcqMarks": ${mcqCount},
    "cqTime": "2 ঘণ্টা 35 মিনিট",
    "cqMarks": ${cqCount * 10},
    "totalMarks": ${mcqCount + (cqCount * 10)},
    "instructions": [
      "সরবরাহকৃত বহুনির্বাচনি অভীক্ষার উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে প্রদত্ত বর্ণসংবলিত বৃত্তটি বল পয়েন্ট কলম দ্বারা সম্পূর্ণ ভরাট করো। প্রতিটি প্রশ্নের মান 1।",
      "সৃজনশীল অংশে উদ্দীপকটি মনোযোগ সহকারে পড়ে সংশ্লিষ্ট প্রশ্নগুলোর যথাযথ উত্তর দাও।",
      "ক্যালকুলেটর ব্যবহার বিধিসম্মত। খসড়া করার জন্য অতিরিক্ত কাগজ দেওয়া হবে না।"
    ]
  },
  "questions": [
    {
      "id": "1",
      "question": "বাস্তব বোর্ড প্রশ্ন বাংলায়...",
      "options": ["ক. অপশন 1", "খ. অপশন 2", "গ. অপশন 3", "ঘ. অপশন 4"],
      "correctAnswer": "ক. অপশন 1",
      "explanation": "ধাপে ধাপে সহজ সমাধান...",
      "tips": "মনে রাখার শর্টকাট টেকনিক...",
      "isBoardQuestion": true,
      "boardInfo": "ঢাকা বোর্ড 2024, রাজশাহী বোর্ড 2022",
      "frequencyTag": "3 বার রিপিটেড (Super Suggestion)"
    }
  ],
  "creativeQuestions": [
    {
      "id": "cq-1",
      "stimulus": "বাস্তবমুখী নির্ভুল উদ্দীপক...",
      "boardInfo": "ঢাকা বোর্ড 2023, চট্টগ্রাম বোর্ড 22",
      "frequencyTag": "99% কমন সৃজনশীল",
      "chapter": "অধ্যায়ের নাম",
      "subQuestions": [
        { "part": "ক", "type": "জ্ঞানমূলক", "question": "জ্ঞানমূলক প্রশ্ন...", "marks": 1, "answer": "নির্ভুল উত্তর..." },
        { "part": "খ", "type": "অনুধাবনমূলক", "question": "অনুধাবনমূলক প্রশ্ন...", "marks": 2, "answer": "নির্ভুল উত্তর..." },
        { "part": "গ", "type": "প্রয়োগমূলক", "question": "প্রয়োগমূলক প্রশ্ন...", "marks": 3, "answer": "ধাপে ধাপে সমাধান..." },
        { "part": "ঘ", "type": "উচ্চতর দক্ষতামূলক", "question": "উচ্চতর দক্ষতামূলক প্রশ্ন...", "marks": 4, "answer": "যৌক্তিক বিশ্লেষণ..." }
      ]
    }
  ]
}
Generate exactly ${mcqCount} MCQs in \`questions\` and ${cqCount} Creative Questions in \`creativeQuestions\`.`;

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

      let data: any = {};
      try {
        data = JSON.parse(response.text || "{}");
      } catch (e) {
        data = {};
      }

      if (Array.isArray(data)) {
        data = {
          questions: data,
          creativeQuestions: [],
          testPaper: {
            title: `মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষা — ${subject}`,
            subjectName: subject,
            subjectCode: subjectCode || "100",
            boardName: board || "সকল শিক্ষা বোর্ড",
            year: year || "2024",
            paperType: "mcq",
            mcqTime: "25 মিনিট",
            mcqMarks: data.length,
            cqTime: "",
            cqMarks: 0,
            totalMarks: data.length,
            instructions: [
              "সরবরাহকৃত বহুনির্বাচনি অভীক্ষার উত্তরপত্রে প্রশ্নের ক্রমিক নম্বরের বিপরীতে সঠিক বৃত্ত ভরাট করো।"
            ]
          }
        };
      }

      if (!data.questions) {
        data.questions = [];
      }
      if (!data.creativeQuestions) {
        data.creativeQuestions = [];
      }

      return res.status(200).json(data);
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
