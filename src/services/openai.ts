// Frontend should not hold the OpenAI API key. Use the backend proxy at /api/openai
export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const SYSTEM_PROMPT =
  "あなたは可愛いリスのアシスタントです。やさしく丁寧に対応してください。";

const MAX_HISTORY = 12; // send up to last 12 turns (messages array items)

export const chatWithGPT = async (history: ChatMessage[]): Promise<string> => {
  try {
    // Normalize and limit history; ensure only expected roles are forwarded
    const trimmed = (history || [])
      .filter(
        (m) =>
          m &&
          (m.role === "user" ||
            m.role === "assistant" ||
            m.role === "system") &&
          typeof m.content === "string"
      )
      .slice(-MAX_HISTORY);

    // Prepend our system prompt if not present
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...trimmed,
    ];

    const payload = {
      model: "gpt-3.5-turbo",
      messages,
    };

    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenAI proxy error:", res.status, text);
      // Missing API key
      if (res.status === 500) {
        return "こんにちは！🐿️ 申し訳ありませんが、現在OpenAI APIキーが設定されていないため、実際のAIチャットは利用できません。.envファイルにOPENAI_API_KEYを設定してください。";
      }
      // Authentication error
      if (res.status === 401 || res.status === 403) {
        return `認証エラー(${res.status})：APIキーを確認してください。`;
      }
      // Other errors: return status and message
      return `エラー(${res.status})：${text}`;
    }

    const data = await res.json();

    // Expecting the proxy to forward OpenAI response unchanged
    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return data.choices[0].message.content;
    }

    return "申し訳ありません。返答を生成できませんでした。";
  } catch (error) {
    console.error("OpenAI proxy request failed:", error);
    return "サーバーに接続できませんでした。バックエンドサーバーが起動しているか確認してください。🌰";
  }
};
