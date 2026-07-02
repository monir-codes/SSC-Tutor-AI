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
    return res
      .status(500)
      .json({
        error:
          "GEMINI_API_KEY is missing. Please set it in Settings > Secrets.",
      });
  }

  try {
    const { message, history, subject, chapter } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    let validationResult = { subject: null, chapter: null, isValid: true, reason: "" };

    if (subject) {
      // Programmatic Validation
      const validationPrompt = `Analyze the following student question and determine its subject and chapter context in the Bangladesh SSC curriculum.
      Question: "${message}"
      
      Respond in perfectly valid JSON with the following structure:
      {
        "detectedSubject": "The subject name (in English, e.g., 'Physics', 'Bangla', 'Mathematics', 'English', etc.), or null if unknown.",
        "detectedChapter": "The chapter name (if any), or null if unknown."
      }`;

      try {
        const validationResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: validationPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });
        
        const data = JSON.parse(validationResponse.text || '{}');
        const detectedSubject = data.detectedSubject;
        const detectedChapter = data.detectedChapter;
        
        const normalize = (str: string) => str?.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        
        const idMap: Record<string, string> = {
          "physics": "physics",
          "chemistry": "chemistry",
          "biology": "biology",
          "math": "math",
          "mathematics": "math",
          "higher mathematics": "higher-math",
          "bangla": "bangla",
          "english": "english",
          "ict": "ict",
          "religion": "religion",
          "accounting": "accounting",
          "finance": "finance",
          "economics": "economics",
          "history": "history",
          "geography": "geography",
          "civics": "civics",
          "entrepreneurship": "entrepreneurship",
          "business entrepreneurship": "entrepreneurship"
        };
        
        if (detectedSubject && normalize(detectedSubject) !== normalize(subject)) {
          // Different subject detected
          const subjectMap: Record<string, string> = {
            "physics": "পদার্থবিজ্ঞান",
            "chemistry": "রসায়ন",
            "biology": "জীববিজ্ঞান",
            "math": "গণিত",
            "mathematics": "গণিত",
            "higher mathematics": "উচ্চতর গণিত",
            "bangla": "বাংলা",
            "english": "ইংরেজি",
            "ict": "তথ্য ও যোগাযোগ প্রযুক্তি",
            "religion": "ধর্ম শিক্ষা",
            "accounting": "হিসাববিজ্ঞান",
            "finance": "ফিন্যান্স ও ব্যাংকিং",
            "economics": "অর্থনীতি",
            "history": "ইতিহাস",
            "geography": "ভূগোল",
            "civics": "পৌরনীতি",
            "entrepreneurship": "ব্যবসায় উদ্যোগ",
            "business entrepreneurship": "ব্যবসায় উদ্যোগ"
          };
          const currentSubName = subjectMap[normalize(subject)] || subject;
          const detectedSubName = subjectMap[normalize(detectedSubject)] || detectedSubject;
          
          const detectedId = idMap[normalize(detectedSubject)];
          const targetUrl = detectedId ? `/subjects/${detectedId}` : '/subjects';
          
          return res.status(200).json({
            text: `📚 আপনি বর্তমানে **${currentSubName}** বিষয়ের চ্যাটে রয়েছেন।\n\nআপনার প্রশ্নটি **${detectedSubName}** বিষয়ের সাথে সম্পর্কিত।\n\nসঠিক ও বিষয়ভিত্তিক সহায়তা পেতে অনুগ্রহ করে **${detectedSubName}** বিষয়ের চ্যাট খুলে সেখানে প্রশ্ন করুন।\n\nপ্রতিটি বিষয়ের জন্য আলাদা AI সহায়তা রাখা হয়েছে যাতে উত্তর আরও নির্ভুল ও প্রাসঙ্গিক হয়।`,
            redirect: {
              type: 'subject',
              target: targetUrl,
              buttonText: `Open ${detectedSubject}`
            }
          });
        }
        
        if (chapter && detectedChapter && detectedSubject && normalize(detectedSubject) === normalize(subject)) {
            // Check chapter if both are present
            if (normalize(detectedChapter) !== normalize(chapter)) {
              // Different chapter detected, but we might want to just gently remind them, 
              // or let it pass if it's related. The prompt says:
              // "If the question belongs to another chapter of the same subject, reply like: আপনার প্রশ্নটি এই অধ্যায়ের পরিবর্তে "বীজগণিত" অধ্যায়ের সাথে সম্পর্কিত..."
              // Let's only enforce if it's very clearly another chapter, but we can't be too strict
              // Let's implement the redirect.
              const currentId = idMap[normalize(subject)];
              const chapterTargetUrl = currentId ? `/subjects/${currentId}` : '/subjects';
              return res.status(200).json({
                text: `আপনার প্রশ্নটি এই অধ্যায়ের পরিবর্তে **"${detectedChapter}"** অধ্যায়ের সাথে সম্পর্কিত।\n\nআরও নির্ভুল ব্যাখ্যার জন্য অনুগ্রহ করে সেই অধ্যায়টি নির্বাচন করুন।`,
                redirect: {
                  type: 'chapter',
                  target: chapterTargetUrl,
                  buttonText: `Open Chapter`
                }
              });
            }
        }
      } catch (e) {
        console.error("Validation error:", e);
        // Fallback to normal flow if validation fails
      }
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
      systemContext += `\n\nCURRENT SUBJECT CONTEXT: You are currently acting as the Tutor for the subject: ${subject}. Only answer questions related to ${subject}.`;
    }
    if (chapter) {
      systemContext += `\nCURRENT CHAPTER CONTEXT: You are currently teaching the chapter: ${chapter}. Prioritize explanations based on this chapter.`;
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
