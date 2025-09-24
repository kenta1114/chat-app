import express from "express";
// Load environment variables from .env
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint for OpenAI: forwards requests to the OpenAI API using a server-side key
const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

app.post("/api/openai", async (req, res) => {
  console.log(
    "Received /api/openai POST, body keys:",
    Object.keys(req.body || {})
  );
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key missing on server");
    return res
      .status(500)
      .json({ error: "Server misconfiguration: OpenAI API key missing" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    // Try to parse JSON; if it fails, wrap text in JSON so client always receives JSON
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch (err) {
      console.warn(
        "OpenAI proxy returned non-JSON response; returning JSON wrapper"
      );
      return res.status(response.status).json({ error: text });
    }
  } catch (err) {
    console.error("OpenAI proxy request failed:", err);
    return res.status(502).json({ error: "OpenAI proxy request failed" });
  }
});

// ステータスチェック／テスト用のGETハンドラ
app.get("/api/openai", (req, res) => {
  res.status(405).json({
    error: "Method Not Allowed",
    message:
      "This endpoint only supports POST. Send a JSON payload to receive a chat response.",
  });
});

// Serve the built files only if they exist (production mode)
const distPath = path.join(__dirname, "..", "dist");
const indexPath = path.join(distPath, "index.html");

// Check if built files exist before trying to serve them
import fs from "fs";
if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
  console.log("Serving static files from:", distPath);
  app.use(express.static(distPath));

  // Fallback to index.html for SPA navigation (Express v5 compatible)
  app.use((req, res) => {
    res.sendFile(indexPath);
  });
} else {
  console.log(
    "Static files not found. Running in development mode - use Vite dev server for frontend."
  );
  console.log("API server is running on port", PORT);
  console.log("Available endpoints: /api/openai");
}

// 最低限のトップページレスポンス
app.get("/", (req, res) => {
  res.json({
    message: "API server is running. Use Vite dev server for frontend.",
    api_endpoints: ["/api/openai"],
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serving production build on 0.0.0.0:${PORT}`);
});
