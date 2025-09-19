import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}
import { chatWithGPT } from './services/openai';  // パスを修正
import './App.css'

export const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await chatWithGPT(input);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f4e79d 0%, #f0d782 50%, #ebcc67 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '28px', color: '#8b4513', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(255,255,255,0.5)', marginBottom: '8px' }}>
          ロリスとのおしゃべりタイム
        </div>
        <div style={{ fontSize: '16px', color: '#a0522d', marginTop: '5px' }}>
          - 心地よいぬいぐるみとの時間 <span style={{ fontSize: '22px', marginLeft: '8px' }}>🐿️</span>
        </div>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        padding: '32px 32px 24px 32px',
        maxWidth: '420px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ width: '100%', marginBottom: '18px', minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic', margin: '20px 0', padding: '15px', background: 'rgba(255,255,255,0.3)', borderRadius: '15px' }}>
              こんにちは！新しいチャットをどうぞ！
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: '10px',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <span style={{ fontSize: '2em' }}>{message.role === 'user' ? '🧑‍🦱' : '🐿️'}</span>
              <div style={{
                background: message.role === 'user' ? 'linear-gradient(135deg, #007aff 0%, #0051d5 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                color: message.role === 'user' ? 'white' : '#333',
                borderRadius: '20px',
                padding: '12px 18px',
                maxWidth: '70%',
                wordWrap: 'break-word',
                boxShadow: message.role === 'user'
                  ? '0 4px 12px rgba(0, 122, 255, 0.3)'
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: message.role === 'user' ? 'right' : 'left',
                fontSize: '16px',
              }}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-start' }}>
              <span style={{ fontSize: '2em' }}>🐿️</span>
              <div style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                color: '#333',
                borderRadius: '20px',
                padding: '12px 18px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '16px',
              }}>
                考え中です...🌰
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力"
            disabled={isLoading}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '12px 18px',
              borderRadius: '20px',
              background: '#f8f9fa',
              fontSize: '16px',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #007aff 0%, #0051d5 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '12px 24px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: isLoading ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 15px rgba(0,122,255,0.3)',
            }}
          >
            {isLoading ? '🌰...' : '送信'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
