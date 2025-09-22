require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// OpenAI API用プロキシ
const axios = require("axios");
app.use(express.json());

// セキュリティのためAPIキーはここで管理
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/openai", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "OpenAI APIリクエスト失敗" });
    }
  }
});

// 静的ファイルを提供
  console.log(`🚀 チャットアプリがWeb版で起動しました！`);
  console.log(`📱 ブラウザで以下のURLを開いてください:`);
  console.log(`   http://localhost:${PORT}`);
app.use(express.static(__dirname));

// ルートパスでindex.htmlを提供
  console.log("\n👋 サーバーを停止しています..."); 
  process.exit(0);
});

// サーバーを起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 チャットアプリがWeb版で起動しました！`);
  console.log(`📱 ブラウザで以下のURLを開いてください:`);
  console.log(`   http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("\n👋 サーバーを停止しています...");
  process.exit(0);
});
