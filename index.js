// server.js
import "dotenv/config";   // or: import dotenv from "dotenv"; dotenv.config();
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { siteContent } from "./siteContent.js";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
console.log((process.env.GEMINI_API_KEY))
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
    console.log(genAI)
    console.log(req.body)
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lower = message.toLowerCase();

    // naive relevance: keep chunks that share words with the question
    const relevant = siteContent
      .filter((c) =>
        lower
          .split(/\s+/)
          .some((word) => c.text.toLowerCase().includes(word))
      )
      .slice(0, 5);

    const contextText = relevant.map((r) => r.text).join("\n\n");

    const prompt = `
You are the assistant for "The Logo Wall Street LLC" website.

Here is content from the website:
${contextText || "(no specific matching content found)."}

User question: "${message}"

Answer only based on the website content above.
If the answer is not in the content, say you don't know and suggest contacting us via phone or email.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    return res
      .status(500)
      .json({ reply: "Sorry, something went wrong. Please try again." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend deployed on Vercel and running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Chat server running on port", PORT);
});