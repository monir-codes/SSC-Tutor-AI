import https from "https";

export default async function handler(req: any, res: any) {
  const text = (req.query.text || req.body?.text) as string;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const encoded = encodeURIComponent(text.slice(0, 300));
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encoded}`;

  https.get(
    url,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    },
    (ttsRes) => {
      if (ttsRes.statusCode !== 200) {
        return res.status(500).json({ error: "TTS failed" });
      }
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      ttsRes.pipe(res);
    }
  ).on("error", (err) => {
    console.error("TTS serverless stream error:", err);
    res.status(500).json({ error: "TTS error" });
  });
}
