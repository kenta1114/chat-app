// Frontend should not hold the OpenAI API key. Use the backend proxy at /api/openai
export const chatWithGPT = async (message: string): Promise<string> => {
  try {
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'あなたは可愛いリスのアシスタントです。やさしく丁寧に対応してください。'
        },
        {
          role: 'user',
          content: message
        }
      ]
    };

    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('OpenAI proxy error:', res.status, err);
      return 'エラーが発生しました。もう一度お試しください。';
    }

    const data = await res.json();

    // Expecting the proxy to forward OpenAI response unchanged
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    }

    return '申し訳ありません。返答を生成できませんでした。';
  } catch (error) {
    console.error('OpenAI proxy request failed:', error);
    return 'エラーが発生しました。もう一度お試しください。';
  }
};
