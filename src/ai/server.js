import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Confirm key is loaded
console.log("Loaded API key?", process.env.OPENAI_API_KEY ? "Yes" : "No");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/**
 * POST /summarize
 * Accepts applicant answers and returns a concise summary from OpenAI.
 */
app.post("/summarize", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.trim().length === 0) {
      return res.status(400).json({ error: "No answers provided" });
    }

    // Send request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an assistant that summarizes applicant interview answers for HR.
            - Output only a concise summary in clear bullet points.
            - Each bullet should be one insight or theme.
            - Focus on skills, clarity of communication, and overall impression.`,
          },
          { role: "user", content: answers },
        ],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    console.log("OpenAI API raw response:", data);

    if (!data.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: data.error || "Invalid response from OpenAI" });
    }

    res.json({ summary: data.choices[0].message.content });
  } catch (err) {
    console.error("Summarize API failed:", err);
    res.status(500).json({ error: "Summarization failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
