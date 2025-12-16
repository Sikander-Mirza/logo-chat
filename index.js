// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { siteContent } from "./siteContent.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lower = message.toLowerCase().trim();

    // Heuristic: "definition-style" or general knowledge question
    const isGenericDefinition =
      lower.startsWith("what is ") ||
      lower.startsWith("who is ") ||
      lower.startsWith("tell me about ") ||
      lower === "hi" ||
      lower === "hello" ||
      lower === "hey";

    // Naive relevance against siteContent
    const relevant = siteContent
      .filter((c) =>
        lower
          .split(/\s+/)
          .some((word) => c.text.toLowerCase().includes(word))
      )
      .slice(0, 5);

    let hasContext = relevant.length > 0;
    const contextText = relevant.map((r) => r.text).join("\n\n");

    // If it's a generic knowledge question, FORCE free mode
    if (isGenericDefinition) {
      hasContext = false;
    }

    console.log("Has context:", hasContext);
    if (hasContext) {
      console.log("Using grounded mode. Relevant chunks:", relevant.length);
    } else {
      console.log("Using free mode (no relevant content or generic question).");
    }

    let prompt;

    if (hasContext) {
      // ===== GROUNDED MODE: answer only from website content =====
      prompt = `
You are the assistant for "The Logo Wall Street LLC" website.

Here is content from the website (including pricing packages):
${contextText}

User question: "${message}"

Answer only based on the website content above.

When answering, follow this format in Markdown:
- If the user asks about all packages:
  - Group by category (e.g., "Logo Design", "Web Solutions", etc.).
  - Under each category, list each package as:
    **Package Name** – **$CurrentPrice** (was $OldPrice)
- If the user asks about a specific package (e.g. "Logo Elite Package", "Starter Web", etc.):
  - Show:
    **Package Name** – **$CurrentPrice** (was $OldPrice)
    Then a bulleted list of features using "-".
- Do not invent features or prices that are not in the content.
`;
    } else {
      // ===== FREE MODE: general knowledge / greetings =====
      prompt = `
You are a helpful, knowledgeable assistant.

The user is chatting from the website of "The Logo Wall Street LLC".

User question: "${message}"

Answer based on your general knowledge.
You do NOT need to refer to the website content in this case.
Give a clear, concise explanation.
`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
  res.send("✅ Backend deployed and running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Chat server running on port", PORT);
});