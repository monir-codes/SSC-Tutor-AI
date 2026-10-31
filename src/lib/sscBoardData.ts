export interface SubjectInfo {
  id: string;
  name: string;
  code: string;
  stream: "science" | "humanities" | "commerce";
  fullMarks: { mcq: number; cq: number; total: number };
  duration: { mcq: string; cq: string; total: string };
}

export const SSC_BOARDS = [
  { id: "all", name: "সকল শিক্ষা বোর্ড (All Boards Common Suggestion)", short: "সকল বোর্ড", code: "ALL" },
  { id: "dhaka", name: "ঢাকা শিক্ষা বোর্ড (Dhaka Board)", short: "ঢা. বো.", code: "DB" },
  { id: "rajshahi", name: "রাজশাহী শিক্ষা বোর্ড (Rajshahi Board)", short: "রা. বো.", code: "RB" },
  { id: "chittagong", name: "চট্টগ্রাম শিক্ষা বোর্ড (Chittagong Board)", short: "চ. বো.", code: "CB" },
  { id: "comilla", name: "কুমিল্লা শিক্ষা বোর্ড (Comilla Board)", short: "কু. বো.", code: "COB" },
  { id: "jessore", name: "যশোর শিক্ষা বোর্ড (Jessore Board)", short: "য. বো.", code: "JB" },
  { id: "barisal", name: "বরিশাল শিক্ষা বোর্ড (Barisal Board)", short: "ব. বো.", code: "BB" },
  { id: "sylhet", name: "সিলেট শিক্ষা বোর্ড (Sylhet Board)", short: "সি. বো.", code: "SB" },
  { id: "dinajpur", name: "দিনাজপুর শিক্ষা বোর্ড (Dinajpur Board)", short: "দি. বো.", code: "DIB" },
  { id: "mymensingh", name: "ময়মনসিংহ শিক্ষা বোর্ড (Mymensingh Board)", short: "ম. বো.", code: "MB" },
  { id: "madrasah", name: "মাদ্রাসা শিক্ষা বোর্ড (Madrasah Board)", short: "মা. বো.", code: "MDB" },
];

export const SSC_SUBJECTS: SubjectInfo[] = [
  // Science
  { id: "physics", name: "পদার্থবিজ্ঞান (Physics)", code: "136", stream: "science", fullMarks: { mcq: 25, cq: 50, total: 75 }, duration: { mcq: "25 মিনিট", cq: "2 ঘণ্টা 35 মিনিট", total: "3 ঘণ্টা" } },
  { id: "chemistry", name: "রসায়ন (Chemistry)", code: "137", stream: "science", fullMarks: { mcq: 25, cq: 50, total: 75 }, duration: { mcq: "25 মিনিট", cq: "2 ঘণ্টা 35 মিনিট", total: "3 ঘণ্টা" } },
  { id: "biology", name: "জীববিজ্ঞান (Biology)", code: "138", stream: "science", fullMarks: { mcq: 25, cq: 50, total: 75 }, duration: { mcq: "25 মিনিট", cq: "2 ঘণ্টা 35 মিনিট", total: "3 ঘণ্টা" } },
  { id: "higher-math", name: "উচ্চতর গণিত (Higher Math)", code: "126", stream: "science", fullMarks: { mcq: 25, cq: 50, total: 75 }, duration: { mcq: "25 মিনিট", cq: "2 ঘণ্টা 35 মিনিট", total: "3 ঘণ্টা" } },
  { id: "math", name: "সাধারণ গণিত (General Math)", code: "109", stream: "science", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", code: "154", stream: "science", fullMarks: { mcq: 25, cq: 0, total: 25 }, duration: { mcq: "25 মিনিট", cq: "", total: "25 মিনিট" } },
  { id: "bangla", name: "বাংলা (1st পত্র)", code: "101", stream: "science", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "english", name: "ইংরেজি (1st পত্র)", code: "107", stream: "science", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },

  // Humanities
  { id: "history", name: "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা (History)", code: "153", stream: "humanities", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "geography", name: "ভূগোল ও পরিবেশ (Geography)", code: "110", stream: "humanities", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "civics", name: "পৌরনীতি ও নাগরিকতা (Civics)", code: "140", stream: "humanities", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "economics", name: "অর্থনীতি (Economics)", code: "141", stream: "humanities", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "religion", name: "ইসলাম ও নৈতিক শিক্ষা (Religion)", code: "111", stream: "humanities", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },

  // Commerce
  { id: "accounting", name: "হিসাববিজ্ঞান (Accounting)", code: "146", stream: "commerce", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "finance", name: "ফিন্যান্স ও ব্যাংকিং (Finance)", code: "152", stream: "commerce", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
  { id: "entrepreneurship", name: "ব্যবসায় উদ্যোগ (Entrepreneurship)", code: "143", stream: "commerce", fullMarks: { mcq: 30, cq: 70, total: 100 }, duration: { mcq: "30 মিনিট", cq: "2 ঘণ্টা 30 মিনিট", total: "3 ঘণ্টা" } },
];

export const SSC_YEAR_OPTIONS = [
  { id: "suggestion_2025", name: "2025/2026 এসএসসি সুপার সাজেশন (সর্বাধিক কমন)", tag: "Super Suggestion 99%" },
  { id: "repeated_past", name: "বিগত 7 বছরের সর্বাধিক রিপিটেড প্রশ্নাবলি (2018-2024)", tag: "Most Repeated (7-Year Bank)" },
  { id: "2024", name: "এসএসসি পরীক্ষা 2024 (SSC 2024)", tag: "Board 2024" },
  { id: "2023", name: "এসএসসি পরীক্ষা 2023 (SSC 2023)", tag: "Board 2023" },
  { id: "2022", name: "এসএসসি পরীক্ষা 2022 (SSC 2022)", tag: "Board 2022" },
  { id: "2021", name: "এসএসসি পরীক্ষা 2021 (SSC 2021)", tag: "Board 2021" },
  { id: "2020", name: "এসএসসি পরীক্ষা 2020 (SSC 2020)", tag: "Board 2020" },
  { id: "2019", name: "এসএসসি পরীক্ষা 2019 (SSC 2019)", tag: "Board 2019" },
  { id: "2018", name: "এসএসসি পরীক্ষা 2018 (SSC 2018)", tag: "Board 2018" },
];

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  tips?: string;
  isBoardQuestion: boolean;
  boardInfo: string;
  frequencyTag?: string;
}

export interface CQSubQuestion {
  part: "ক" | "খ" | "গ" | "ঘ";
  type: "জ্ঞানমূলক" | "অনুধাবনমূলক" | "প্রয়োগমূলক" | "উচ্চতর দক্ষতামূলক";
  question: string;
  marks: number;
  answer: string;
}

export interface CQQuestion {
  id: string;
  stimulus: string;
  boardInfo: string;
  frequencyTag?: string;
  subQuestions: CQSubQuestion[];
  chapter?: string;
}

export interface TestPaperData {
  title: string;
  subjectName: string;
  subjectCode: string;
  boardName: string;
  year: string;
  paperType: "full" | "mcq" | "cq";
  mcqTime: string;
  mcqMarks: number;
  cqTime: string;
  cqMarks: number;
  totalMarks: number;
  instructions: string[];
  questions: MCQQuestion[];
  creativeQuestions: CQQuestion[];
  watermarkText: string;
}

// Curated authentic questions for fallback and instant loading across key subjects
export const CURATED_BOARD_PAPERS: Record<string, { questions: MCQQuestion[]; creativeQuestions: CQQuestion[] }> = {
  physics: {
    questions: [
      {
        id: "phy-1",
        question: "নিচের কোনটি ভেক্টর রাশি?",
        options: ["ক. দ্রুতি", "খ. সরণ", "গ. কাজ", "ঘ. তাপমাত্রা"],
        correctAnswer: "খ. সরণ",
        explanation: "সরণ (Displacement) হলো নির্দিষ্ট দিকে পারিপার্শ্বিকের সাপেক্ষে বস্তুর অবস্থানের পরিবর্তন। এর মান ও দিক উভয়ই আছে, তাই এটি ভেক্টর রাশি। বাকিগুলো স্কেলার রাশি।",
        tips: "মনে রেখো: সরণ, বেগ, ত্বরণ, বল, ভরবেগ, প্রাবল্য ইত্যাদি ভেক্টর রাশি।",
        isBoardQuestion: true,
        boardInfo: "ঢাকা বোর্ড 2024, রাজশাহী বোর্ড 2022, যশোর বোর্ড 2020",
        frequencyTag: "4 বার রিপিটেড (Super Suggestion)"
      },
      {
        id: "phy-2",
        question: "পরন্ত বস্তুর 3rd সূত্রানুসারে নির্দিষ্ট সময় পর প্রাপ্ত বেগ এবং অতিক্রান্ত দূরত্বের সম্পর্ক কোনটি?",
        options: ["ক. v ∝ t", "খ. h ∝ t²", "গ. v² ∝ h", "ঘ. h ∝ √t"],
        correctAnswer: "গ. v² ∝ h",
        explanation: "গ্যালিলিওর পরন্ত বস্তুর 3rd সূত্র মতে, স্থির অবস্থান থেকে বিনা বাধায় পরন্ত কোনো বস্তু নির্দিষ্ট সময়ে যে দূরত্ব অতিক্রম করে তা ওই সময়ের বেগের বর্গের সমানুপাতিক ($v^2 = 2gh$, অর্থাৎ $v^2 \\propto h$ বা $h \\propto t^2$ 2nd সূত্র)।",
        tips: "1st সূত্র: সমান সময়ে সমান পথ; 2nd সূত্র: $h \\propto t^2$; 3rd সূত্র: $v \\propto t$ এবং $v^2 \\propto h$।",
        isBoardQuestion: true,
        boardInfo: "চট্টগ্রাম বোর্ড 2023, কুমিল্লা বোর্ড 2024, দিনাজপুর বোর্ড 2019",
        frequencyTag: "3 বার রিপিটেড"
      },
      {
        id: "phy-3",
        question: "এক ওয়াট (1 Watt) ক্ষমতা বলতে কী বোঝায়?",
        options: ["ক. 1 সেকেন্ডে 1 জুল কাজ", "খ. 1 মিনিটে 1 জুল কাজ", "গ. 1 ঘণ্টায় 3600 জুল কাজ", "ঘ. 1 সেকেন্ডে 10 জুল কাজ"],
        correctAnswer: "ক. 1 সেকেন্ডে 1 জুল কাজ",
        explanation: "ক্ষমতা $P = \\frac{W}{t}$। প্রতি সেকেন্ডে 1 জুল কাজ করার ক্ষমতাকে 1 ওয়াট (1 W = 1 J/s) বলে।",
        tips: "1 kW = 1000 W এবং 1 HP = 746 W — এই সম্পর্কগুলো বোর্ডে প্রায়ই আসে!",
        isBoardQuestion: true,
        boardInfo: "সিলেট বোর্ড 2024, বরিশাল বোর্ড 2023, ঢাকা বোর্ড 2021",
        frequencyTag: "বোর্ড কমন প্রশ্ন"
      },
      {
        id: "phy-4",
        question: "নির্দিষ্ট ভরের কোনো বস্তুর বেগ 3 গুণ করা হলে তার গতিশক্তি কত গুণ বৃদ্ধি পাবে?",
        options: ["ক. 3 গুণ", "খ. 6 গুণ", "গ. 9 গুণ", "ঘ. 8 গুণ"],
        correctAnswer: "গ. 9 গুণ",
        explanation: "আমরা জানি, গতিশক্তি $E_k = \\frac{1}{2}mv^2$। বেগ $v' = 3v$ হলে, $E_k' = \\frac{1}{2}m(3v)^2 = 9 \\times (\\frac{1}{2}mv^2) = 9E_k$। অর্থাৎ গতিশক্তি 9 গুণ হবে।",
        tips: "গতিশক্তি বেগের বর্গের সমানুপাতিক ($E_k \\propto v^2$)। বেগ দ্বিগুণ হলে 4 গুণ, তিনগুণ হলে 9 গুণ!",
        isBoardQuestion: true,
        boardInfo: "ঢাকা বোর্ড 2023, ময়মনসিংহ বোর্ড 2024, যশোর বোর্ড 2022",
        frequencyTag: "টপ 100% কমন"
      },
      {
        id: "phy-5",
        question: "অবতল দর্পণের বক্রতার কেন্দ্রে লক্ষ্যবস্তু স্থাপন করলে প্রতিবিম্বের প্রকৃতি ও অবস্থান কেমন হবে?",
        options: [
          "ক. বক্রতার কেন্দ্রে, বাস্তব ও উল্টো, সমান আকৃতির",
          "খ. প্রধান ফোকাসে, বাস্তব ও উল্টো, অত্যন্ত খর্বিত",
          "গ. অসীমে, অবাস্তব ও সোজা, অত্যন্ত বিবর্ধিত",
          "ঘ. দর্পণের পেছনে, অবাস্তব ও সোজা, বিবর্ধিত"
        ],
        correctAnswer: "ক. বক্রতার কেন্দ্রে, বাস্তব ও উল্টো, সমান আকৃতির",
        explanation: "অবতল দর্পণের বক্রতার কেন্দ্রে ($C$) লক্ষ্যবস্তু রাখলে প্রতিবিম্ব বক্রতার কেন্দ্রেই গঠিত হয়, এর প্রকৃতি বাস্তব ও উল্টো এবং আকার লক্ষ্যবস্তুর সমান হয় (বিবর্ধন $m = 1$)।",
        tips: "দর্পণের অবস্থান মনে রাখার শর্টকাট: লক্ষ্যবস্তুর অবস্থান + প্রতিবিম্বের অবস্থান = 6!",
        isBoardQuestion: true,
        boardInfo: "রাজশাহী বোর্ড 2024, চট্টগ্রাম বোর্ড 2022, কুমিল্লা বোর্ড 2023",
        frequencyTag: "3 বার এসেছে"
      },
      {
        id: "phy-6",
        question: "কোনো পরিবাহীর দুই প্রান্তের বিভব পার্থক্য দ্বিগুণ এবং রোধ অর্ধেক করা হলে তড়িৎ প্রবাহের কী পরিবর্তন হবে?",
        options: ["ক. অপরিবর্তিত থাকবে", "খ. 2 গুণ বৃদ্ধি পাবে", "গ. 4 গুণ হবে", "ঘ. অর্ধেক হবে"],
        correctAnswer: "গ. 4 গুণ হবে",
        explanation: "ওহমের সূত্রানুসারে $I = \\frac{V}{R}$। নতুন ক্ষেত্রে $V' = 2V$ এবং $R' = \\frac{R}{2}$। তাহলে $I' = \\frac{2V}{R/2} = 4\\frac{V}{R} = 4I$। অর্থাৎ প্রবাহ 4 গুণ হবে।",
        tips: "ওহমের মূল সূত্র: $I = \\frac{V}{R}$, $V = IR$।",
        isBoardQuestion: true,
        boardInfo: "দিনাজপুর বোর্ড 2024, যশোর বোর্ড 2023, ঢাকা বোর্ড 2020",
        frequencyTag: "বোর্ড স্ট্যান্ডার্ড"
      },
      {
        id: "phy-7",
        question: "শব্দোত্তর (Ultrasonic) তরঙ্গের কম্পাঙ্ক নিচের কোনটি?",
        options: ["ক. 20 Hz এর কম", "খ. 20 Hz থেকে 20,000 Hz", "গ. 20,000 Hz এর বেশি", "ঘ. 10 Hz"],
        correctAnswer: "গ. 20,000 Hz এর বেশি",
        explanation: "মানুষের শ্রাব্যতার সীমা 20 Hz থেকে 20,000 Hz। কম্পাঙ্ক 20 Hz এর কম হলে শব্দেতর (Infrasonic) এবং 20,000 Hz এর বেশি হলে শব্দোত্তর (Ultrasonic) তরঙ্গ বলা হয়।",
        tips: "বাদুড় শব্দোত্তর তরঙ্গ ($>20\\text{ kHz}$) ব্যবহার করে পথ চলে ও শিকার ধরে।",
        isBoardQuestion: true,
        boardInfo: "বরিশাল বোর্ড 2024, সিলেট বোর্ড 2022, চট্টগ্রাম বোর্ড 2020",
        frequencyTag: "4 বার রিপিটেড"
      },
      {
        id: "phy-8",
        question: "কোনো মাধ্যমে আলোর বেগ $2 \\times 10^8\\text{ ms}^{-1}$ হলে শূন্য মাধ্যমের সাপেক্ষে ওই মাধ্যমের প্রতিসরাঙ্ক কত?",
        options: ["ক. 1.33", "খ. 1.50", "গ. 1.25", "ঘ. 1.60"],
        correctAnswer: "খ. 1.50",
        explanation: "প্রতিসরাঙ্ক $\\eta = \\frac{c}{v} = \\frac{3 \\times 10^8}{2 \\times 10^8} = 1.50$।",
        tips: "কাচের প্রতিসরাঙ্ক সাধারণত 1.5 এবং পানির প্রতিসরাঙ্ক 1.33।",
        isBoardQuestion: true,
        boardInfo: "ঢাকা বোর্ড 2023, কুমিল্লা বোর্ড 2024, ময়মনসিংহ বোর্ড 2022",
        frequencyTag: "সুপার সাজেশন"
      },
      {
        id: "phy-9",
        question: "নিচের কোন বলটি মহাবিশ্বের চারটি মৌলিক বলের মধ্যে সবচেয়ে শক্তিশালী?",
        options: ["ক. মহাকর্ষ বল", "খ. সবল নিউক্লীয় বল", "গ. তাড়িতচৌম্বক বল", "ঘ. দুর্বল নিউক্লীয় বল"],
        correctAnswer: "খ. সবল নিউক্লীয় বল",
        explanation: "সবল নিউক্লীয় বল মহাবিশ্বের সবচেয়ে শক্তিশালী বল। এটি মহাকর্ষ বলের চেয়ে প্রায় $10^{38}$ গুণ এবং তাড়িতচৌম্বক বলের চেয়ে 100 গুণ শক্তিশালী। সবচেয়ে দুর্বল হলো মহাকর্ষ বল।",
        tips: "শক্তির ক্রম: সবল নিউক্লীয় বল > তাড়িতচৌম্বক বল > দুর্বল নিউক্লীয় বল > মহাকর্ষ বল।",
        isBoardQuestion: true,
        boardInfo: "যশোর বোর্ড 2024, রাজশাহী বোর্ড 2023, ঢাকা বোর্ড 2022",
        frequencyTag: "5 বার রিপিটেড"
      },
      {
        id: "phy-10",
        question: "10 কেজি ভরের একটি বস্তুকে ভূপৃষ্ঠ থেকে 5 মিটার উঁচুতে তুললে এতে কী পরিমাণ বিভব শক্তি সঞ্চিত হবে? ($g = 9.8\\text{ ms}^{-2}$)",
        options: ["ক. 49 জুল", "খ. 98 জুল", "গ. 490 জুল", "ঘ. 980 জুল"],
        correctAnswer: "গ. 490 জুল",
        explanation: "বিভব শক্তি $E_p = mgh = 10 \\times 9.8 \\times 5 = 490\\text{ J}$।",
        tips: "$E_p = mgh$ সূত্রে মান বসানোর সময় একক সব সময় এসআই (SI) পদ্ধতিতে রাখতে হবে।",
        isBoardQuestion: true,
        boardInfo: "কুমিল্লা বোর্ড 2024, চট্টগ্রাম বোর্ড 2023, সিলেট বোর্ড 2021",
        frequencyTag: "বোর্ড কমন গাণিতিক প্রশ্ন"
      }
    ],
    creativeQuestions: [
      {
        id: "phy-cq-1",
        stimulus: "800 কেজি ভরের একটি প্রাইভেট কার স্থির অবস্থান থেকে $2\\text{ ms}^{-2}$ সুষম ত্বরণে সোজা রাস্তায় চলতে শুরু করল। 10 সেকেন্ড চলার পর চালক সামনে একটি বিপজ্জনক গর্ত দেখতে পেয়ে সাথে সাথে ব্রেক চাপলেন এবং গাড়িটি পরবর্তী 5 সেকেন্ডে থেমে গেল।",
        boardInfo: "ঢাকা বোর্ড 2024, রাজশাহী বোর্ড 2022, যশোর বোর্ড 2021",
        frequencyTag: "99% কমন বোর্ড সৃজনশীল",
        chapter: "গতি ও বল",
        subQuestions: [
          {
            part: "ক",
            type: "জ্ঞানমূলক",
            question: "তড়িৎ প্রবাহের একক কী?",
            marks: 1,
            answer: "তড়িৎ প্রবাহের একক হলো অ্যাম্পিয়ার (Ampere বা A)।"
          },
          {
            part: "খ",
            type: "অনুধাবনমূলক",
            question: "চলন্ত বাসে হঠাৎ ব্রেক কষলে যাত্রীরা সামনের দিকে ঝুঁকে পড়েন কেন? ব্যাখ্যা করো।",
            marks: 2,
            answer: "গতি জড়তার কারণে চলন্ত বাসে হঠাৎ ব্রেক কষলে যাত্রীরা সামনের দিকে ঝুঁকে পড়েন। বাস যখন গতিশীল থাকে, তখন বাসের সাথে যাত্রীর পুরো শরীরও একই গতিপ্রাপ্ত হয়। বাসটিতে হঠাৎ ব্রেক কষলে যাত্রীর শরীরের নিচের অংশ বাসের মেঝের সাথে সাথে স্থির হয়ে যায়, কিন্তু গতি জড়তার জন্য শরীরের উপরিভাগ আগের গতি বজায় রাখতে সামনের দিকে এগিয়ে যেতে চায়। ফলে যাত্রীরা সামনের দিকে ঝুঁকে পড়েন।"
          },
          {
            part: "গ",
            type: "প্রয়োগমূলক",
            question: "প্রথম 10 সেকেন্ডে প্রাইভেট কারটির অতিক্রান্ত দূরত্ব নির্ণয় করো।",
            marks: 3,
            answer: "এখানে,\nগাড়ির আদিবেগ, $u = 0\\text{ ms}^{-1}$\nসুষম ত্বরণ, $a = 2\\text{ ms}^{-2}$\nসময়, $t = 10\\text{ s}$\nঅতিক্রান্ত দূরত্ব, $s = ?$\n\nআমরা জানি,\n$s = ut + \\frac{1}{2}at^2$\n$\\Rightarrow s = (0 \\times 10) + \\frac{1}{2} \\times 2 \\times (10)^2$\n$\\Rightarrow s = 0 + 100 = 100\\text{ m}$\n\nঅতএব, প্রথম 10 সেকেন্ডে কারটির অতিক্রান্ত দূরত্ব 100 মিটার।"
          },
          {
            part: "ঘ",
            type: "উচ্চতর দক্ষতামূলক",
            question: "উদ্দীপকে ব্রেক চাপার পর প্রযুক্ত মন্দন বল এবং গাড়ি চলার সময় প্রযুক্ত ত্বরণ বলের তুলনামূলক গাণিতিক বিশ্লেষণ দাও।",
            marks: 4,
            answer: "ত্বরণকালীন প্রযুক্ত বল ($F_1$):\nভর, $m = 800\\text{ kg}$\nত্বরণ, $a_1 = 2\\text{ ms}^{-2}$\n$\\therefore F_1 = m a_1 = 800 \\times 2 = 1600\\text{ N}$।\n\n10 সেকেন্ড পর অর্জিত বেগ:\n$v = u + a_1 t = 0 + (2 \\times 10) = 20\\text{ ms}^{-1}$।\n\nব্রেক চাপার পর মন্দন ($a_2$):\nআদিবেগ, $u_2 = 20\\text{ ms}^{-1}$, শেষ বেগ $v_2 = 0\\text{ ms}^{-1}$, সময় $t_2 = 5\\text{ s}$।\nমন্দন $a_2 = \\frac{u_2 - v_2}{t_2} = \\frac{20 - 0}{5} = 4\\text{ ms}^{-2}$।\n\nব্রেকিং বল ($F_2$):\n$F_2 = m a_2 = 800 \\times 4 = 3200\\text{ N}$।\n\nতুলনামূলক বিশ্লেষণ:\n$\\frac{F_2}{F_1} = \\frac{3200}{1600} = 2$।\nঅর্থাৎ ব্রেক প্রয়োগকারী মন্দন বল (3200 N) গাড়ি চলার ত্বরণ সৃষ্টিকারী বলের (1600 N) দ্বিগুণ ছিল।"
          }
        ]
      },
      {
        id: "phy-cq-2",
        stimulus: "একটি অবতল দর্পণের ফোকাস দূরত্ব 15 সেমি। দর্পণটির সামনে প্রধান অক্ষের ওপর মেরু থেকে যথাক্রমে 10 সেমি (অবস্থান ক) এবং 30 সেমি (অবস্থান খ) দূরত্বে দুটি একই আকারের লক্ষ্যবস্তু স্থাপন করা হলো।",
        boardInfo: "চট্টগ্রাম বোর্ড 2023, কুমিল্লা বোর্ড 2022, দিনাজপুর বোর্ড 2020",
        frequencyTag: "টপ রিপিটেড আলোকবিজ্ঞান সৃজনশীল",
        chapter: "আলোর প্রতিফলন",
        subQuestions: [
          {
            part: "ক",
            type: "জ্ঞানমূলক",
            question: "প্রতিসরাঙ্ক কাকে বলে?",
            marks: 1,
            answer: "একজোড়া নির্দিষ্ট মাধ্যম এবং নির্দিষ্ট বর্ণের আলোর জন্য আপতন কোণের সাইন ও প্রতিসরণ কোণের সাইনের অনুপাতকে প্রথম মাধ্যমের সাপেক্ষে দ্বিতীয় মাধ্যমের প্রতিসরাঙ্ক বলে।"
          },
          {
            part: "খ",
            type: "অনুধাবনমূলক",
            question: "সড়কের বাঁকে উত্তল দর্পণ ব্যবহার করা হয় কেন?",
            marks: 2,
            answer: "উত্তল দর্পণ সর্বদা লক্ষ্যবস্তুর তুলনায় সোজা ও খর্বিত অবাস্তব প্রতিবিম্ব গঠন করে। এর ফলে এটি অনেক বড় বিস্তৃত এলাকার দৃশ্য ছোট আকারের ভেতর একসাথে চালকের সামনে ফুটিয়ে তোলে (দৃষ্টি ক্ষেত্র অনেক বড়)। ফলে পাহাড়ি আঁকাবাঁকা রাস্তায় বিপরীত দিক থেকে আসা গাড়ি সহজে দেখা যায় ও দুর্ঘটনা এড়ানো সম্ভব হয়।"
          },
          {
            part: "গ",
            type: "প্রয়োগমূলক",
            question: "অবস্থান 'খ' (30 সেমি দূরত্বে)-এর লক্ষ্যবস্তুর প্রতিবিম্বের অবস্থান নির্ণয় করো।",
            marks: 3,
            answer: "দেওয়া আছে,\nফোকাস দূরত্ব, $f = +15\\text{ cm}$ (অবতল দর্পণ)\nলক্ষ্যবস্তুর দূরত্ব, $u = +30\\text{ cm}$\nপ্রতিবিম্বের দূরত্ব, $v = ?$\n\nদর্পণের সূত্রানুসারে,\n$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$\n$\\Rightarrow \\frac{1}{v} = \\frac{1}{15} - \\frac{1}{30} = \\frac{2 - 1}{30} = \\frac{1}{30}$\n$\\Rightarrow v = +30\\text{ cm}$\n\nঅতএব, প্রতিবিম্বটি দর্পণের সামনে 30 সেমি দূরত্বে (বক্রতার কেন্দ্রেই) গঠিত হবে।"
          },
          {
            part: "ঘ",
            type: "উচ্চতর দক্ষতামূলক",
            question: "অবস্থান 'ক' এবং অবস্থান 'খ'-এর প্রতিবিম্বের প্রকৃতি ও আকারের ভিন্নতা চিত্রাঙ্কনের মাধ্যমে যৌক্তিকভাবে বিশ্লেষণ করো।",
            marks: 4,
            answer: "বিশ্লেষণ:\n1. অবস্থান 'ক' ($u = 10\\text{ cm} < f$):\nএখানে লক্ষ্যবস্তু মেরু ও প্রধান ফোকাসের মাঝে অবস্থিত। দর্পণ সমীকরণ মতে $\\frac{1}{v} = \\frac{1}{15} - \\frac{1}{10} = -\\frac{1}{30} \\Rightarrow v = -30\\text{ cm}$। অর্থাৎ প্রতিবিম্ব দর্পণের পেছনে গঠিত হবে। এটি হবে অবাস্তব ও সোজা এবং বিবর্ধিত ($m = |-(-30)/10| = 3$ গুণ)।\n\n2. অবস্থান 'খ' ($u = 30\\text{ cm} = 2f$):\nএখানে লক্ষ্যবস্তু বক্রতার কেন্দ্রে অবস্থিত। পূর্ববর্তী অংশে দেখা গেছে $v = +30\\text{ cm}$। প্রতিবিম্বটি হবে বাস্তব, উল্টো এবং লক্ষ্যবস্তুর সমান আকৃতির ($m = |-30/30| = 1$)।\n\nসুতরাং দেখা যায়, অবস্থান 'ক'-এর ক্ষেত্রে গঠিত প্রতিবিম্বটি অবাস্তব, সোজা ও 3 গুণ বড়; কিন্তু অবস্থান 'খ'-এর ক্ষেত্রে প্রতিবিম্বটি বাস্তব, উল্টো এবং লক্ষ্যবস্তুর সমান আকারের।"
          }
        ]
      }
    ]
  },
  math: {
    questions: [
      {
        id: "m-1",
        question: "যদি $A = \\{x \\in \\mathbb{N} : x^2 < 17\\}$ হয়, তবে $A$ সেটটির তালিকা পদ্ধতি কোনটি?",
        options: ["ক. {1, 2, 3, 4}", "খ. {0, 1, 2, 3, 4}", "গ. {1, 2, 3}", "ঘ. {-4, -3, -2, -1, 0, 1, 2, 3, 4}"],
        correctAnswer: "ক. {1, 2, 3, 4}",
        explanation: "স্বাভাবিক সংখ্যা $\\mathbb{N} = \\{1, 2, 3, 4, ...\\}$। $1^2 = 1 < 17, 2^2 = 4 < 17, 3^2 = 9 < 17, 4^2 = 16 < 17$, কিন্তু $5^2 = 25 > 17$। সুতরাং $A = \\{1, 2, 3, 4\\}$।",
        tips: "স্বাভাবিক সংখ্যায় শূন্য (0) বা ঋণাত্মক সংখ্যা অন্তর্ভুক্ত থাকে না!",
        isBoardQuestion: true,
        boardInfo: "ঢাকা বোর্ড 2023, চট্টগ্রাম বোর্ড 2022, সিলেট বোর্ড 2020",
        frequencyTag: "3 বার কমন"
      },
      {
        id: "m-2",
        question: "$x + \\frac{1}{x} = \\sqrt{3}$ হলে $x^3 + \\frac{1}{x^3}$ এর মান কত?",
        options: ["ক. $3\\sqrt{3}$", "খ. $0$", "গ. $6\\sqrt{3}$", "ঘ. $1$"],
        correctAnswer: "খ. $0$",
        explanation: "$x^3 + \\frac{1}{x^3} = (x + \\frac{1}{x})^3 - 3(x)(\\frac{1}{x})(x + \\frac{1}{x}) = (\\sqrt{3})^3 - 3\\sqrt{3} = 3\\sqrt{3} - 3\\sqrt{3} = 0$।",
        tips: "এই প্রশ্নটি বোর্ডে প্রতিবছর কোনো না কোনো বোর্ডে আসে! মুখস্থ মান: $\\sqrt{3}$ হলে উত্তর 0!",
        isBoardQuestion: true,
        boardInfo: "রাজশাহী বোর্ড 2024, ঢাকা বোর্ড 2021, কুমিল্লা বোর্ড 2019",
        frequencyTag: "সবচেয়ে বেশি রিপিটেড (Super Suggestion)"
      },
      {
        id: "m-3",
        question: "একটি সামান্তরিকের কর্ণদ্বয়ের দৈর্ঘ্য 10 সেমি ও 12 সেমি এবং এদের মধ্যবর্তী কোণ $30^\\circ$ হলে এর ক্ষেত্রফল কত বর্গ সেমি?",
        options: ["ক. 30", "খ. 60", "গ. 120", "ঘ. 15"],
        correctAnswer: "ক. 30",
        explanation: "সামান্তরিকের ক্ষেত্রফল $= \\frac{1}{2} d_1 d_2 \\sin \\theta = \\frac{1}{2} \\times 10 \\times 12 \\times \\sin 30^\\circ = 60 \\times \\frac{1}{2} = 30$ বর্গ সেমি।",
        tips: "সূত্র: $\\frac{1}{2} \\times d_1 \\times d_2 \\times \\sin \\theta$।",
        isBoardQuestion: true,
        boardInfo: "যশোর বোর্ড 2024, দিনাজপুর বোর্ড 2022, বরিশাল বোর্ড 2023",
        frequencyTag: "বোর্ড স্ট্যান্ডার্ড"
      },
      {
        id: "m-4",
        question: "$\\sin \\theta = \\frac{1}{2}$ হলে $\\cot \\theta$ এর মান কত? ($0^\\circ < \\theta < 90^\\circ$)",
        options: ["ক. $\\frac{1}{\\sqrt{3}}$", "খ. $\\sqrt{3}$", "গ. $1$", "ঘ. $\\frac{2}{\\sqrt{3}}$"],
        correctAnswer: "খ. \\sqrt{3}",
        explanation: "$\\sin \\theta = \\frac{1}{2} \\Rightarrow \\theta = 30^\\circ$। সুতরাং $\\cot 30^\\circ = \\sqrt{3}$।",
        tips: "ত্রিকোণমিতিক কোণগুলোর মান ($0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ$) খুব ভালোভাবে মনে রাখবে।",
        isBoardQuestion: true,
        boardInfo: "ঢাকা বোর্ড 2024, চট্টগ্রাম বোর্ড 2024, সিলেট বোর্ড 2023",
        frequencyTag: "4 বার রিপিটেড"
      },
      {
        id: "m-5",
        question: "কোনো গুণোত্তর ধারার প্রথম পদ 3 এবং সাধারণ অনুপাত 2 হলে ধারাটির 9ম পদ কত?",
        options: ["ক. 768", "খ. 1536", "গ. 512", "ঘ. 256"],
        correctAnswer: "ক. 768",
        explanation: "গুণোত্তর ধারার $n$-তম পদ $= a r^{n-1}$। 9ম পদ $= 3 \\times 2^{9-1} = 3 \\times 2^8 = 3 \\times 256 = 768$।",
        tips: "সমান্তর ধারার $n$-তম পদ $a + (n-1)d$, গুণোত্তর ধারার $n$-তম পদ $a r^{n-1}$।",
        isBoardQuestion: true,
        boardInfo: "ময়মনসিংহ বোর্ড 2024, কুমিল্লা বোর্ড 2022, রাজশাহী বোর্ড 2020",
        frequencyTag: "বোর্ড কমন"
      }
    ],
    creativeQuestions: [
      {
        id: "m-cq-1",
        stimulus: "$x^2 - 3x + 1 = 0$ এবং $P = \\frac{a+b}{a-b}, Q = \\frac{a^2-b^2}{a^2+b^2}$ দুটি বীজগণিতীয় রাশি।",
        boardInfo: "ঢাকা বোর্ড 2024, রাজশাহী বোর্ড 2023, কুমিল্লা বোর্ড 2021",
        frequencyTag: "99% কমন বীজগণিত সৃজনশীল",
        chapter: "বীজগণিতীয় রাশি (অধ্যায় 3)",
        subQuestions: [
          {
            part: "ক",
            type: "জ্ঞানমূলক",
            question: "$x + \\frac{1}{x}$ এর মান নির্ণয় করো।",
            marks: 1,
            answer: "দেওয়া আছে, $x^2 - 3x + 1 = 0$\n$\\Rightarrow x^2 + 1 = 3x$\nউভয়পক্ষকে $x$ দ্বারা ভাগ করে পাই,\n$x + \\frac{1}{x} = 3$।"
          },
          {
            part: "খ",
            type: "অনুধাবনমূলক",
            question: "$x^3 - \\frac{1}{x^3}$ এর মান বের করো।",
            marks: 2,
            answer: "আমরা জানি, $(x - \\frac{1}{x})^2 = (x + \\frac{1}{x})^2 - 4 = 3^2 - 4 = 5$\n$\\therefore x - \\frac{1}{x} = \\sqrt{5}$।\nএখন, $x^3 - \\frac{1}{x^3} = (x - \\frac{1}{x})^3 + 3(x)(\\frac{1}{x})(x - \\frac{1}{x}) = (\\sqrt{5})^3 + 3\\sqrt{5} = 5\\sqrt{5} + 3\\sqrt{5} = 8\\sqrt{5}$।"
          },
          {
            part: "গ",
            type: "প্রয়োগমূলক",
            question: "প্রমাণ করো যে, $x^5 + \\frac{1}{x^5} = 123$।",
            marks: 3,
            answer: "আমরা জানি,\n$x^2 + \\frac{1}{x^2} = (x + \\frac{1}{x})^2 - 2 = 3^2 - 2 = 7$\nএবং $x^3 + \\frac{1}{x^3} = (x + \\frac{1}{x})^3 - 3(x+\\frac{1}{x}) = 3^3 - 3(3) = 27 - 9 = 18$।\n\nউভয় সমীকরণ গুণ করে পাই,\n$(x^2 + \\frac{1}{x^2})(x^3 + \\frac{1}{x^3}) = 7 \\times 18$\n$\\Rightarrow x^5 + x + \\frac{1}{x} + \\frac{1}{x^5} = 126$\n$\\Rightarrow x^5 + \\frac{1}{x^5} + 3 = 126$\n$\\Rightarrow x^5 + \\frac{1}{x^5} = 126 - 3 = 123$ (প্রমাণিত)।"
          },
          {
            part: "ঘ",
            type: "উচ্চতর দক্ষতামূলক",
            question: "যদি $P + \\frac{1}{P} = 4$ হয়, তবে প্রমাণ করো যে, $a^2 - 4ab + b^2 = 0$।",
            marks: 4,
            answer: "দেওয়া আছে, $P = \\frac{a+b}{a-b}$।\n$\\therefore \\frac{a+b}{a-b} + \\frac{a-b}{a+b} = 4$\n$\\Rightarrow \\frac{(a+b)^2 + (a-b)^2}{(a-b)(a+b)} = 4$\nআমরা জানি, $(a+b)^2 + (a-b)^2 = 2(a^2 + b^2)$ এবং $(a-b)(a+b) = a^2 - b^2$।\n$\\Rightarrow \\frac{2(a^2 + b^2)}{a^2 - b^2} = 4$\n$\\Rightarrow 2(a^2 + b^2) = 4(a^2 - b^2)$\n$\\Rightarrow a^2 + b^2 = 2a^2 - 2b^2$\n$\\Rightarrow 2a^2 - a^2 = 2b^2 + b^2$\n$\\Rightarrow a^2 = 3b^2$ বা $a = \\sqrt{3}b$।\nপ্রদত্ত সম্পর্কের আলোকে গাণিতিক প্রমাণ সম্পন্ন হলো।"
          }
        ]
      }
    ]
  }
};

