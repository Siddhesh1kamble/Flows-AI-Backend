const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up GROQ-compatible OpenAI client
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1", // Important: GROQ's base URL
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: "llama3-70b-8192", // Use a GROQ-supported model
      messages: [
        { role: "system", content: "You are a helpful chatbot." },
        { role: "user", content: userMessage }
      ]
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GROQ API Error:", error);
    res.status(500).json({ reply: "Error contacting GROQ API." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


