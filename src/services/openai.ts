import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const chatWithGPT = async (message: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "あなたは可愛いリスのアシスタントです。やさしく丁寧に対応してください。" 
        },
        { 
          role: "user", 
          content: message 
        }
      ],
    });
    return response.choices[0].message.content || "申し訳ありません。返答を生成できませんでした。";
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    return "エラーが発生しました。もう一度お試しください。";
  }
};
