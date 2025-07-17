import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import OpenAI from "openai";

config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Server läuft ✅");
});

app.post("/gpt", async (req, res) => {
  try {
    const userMessage = req.body.message;

    console.log("📥 Eingehende Nachricht von Superchat:", userMessage);

    // ⛔ Input prüfen
    if (!userMessage || typeof userMessage !== "string") {
      console.error("❌ Ungültiger Input:", userMessage);
      return res.json({ reply: "Sorry, da ist was schiefgelaufen." });
    }

    // ✅ GPT antwortet
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = completion.choices[0].message.content;
    console.log("🧠 GPT-Antwort:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("❌ Fehler beim GPT-Request:", error);
    res.json({ reply: "Sorry, da ist was schiefgelaufen." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server läuft auf Port ${port}`);
});
