import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function ChatTab() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Halo! Aku MindHealth, sahabat AI kamu. Ada yang mau diceritain hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  const { isListening, transcript, toggleListening, setTranscript } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setInput((prev) => {
        // Simple heuristic to append transcript to existing input
        const base = prev.replace(new RegExp(transcript.slice(0, -10) + '.*$'), ''); 
        return transcript;
      });
    }
  }, [transcript]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setTranscript('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.response || data.error }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Maaf, lagi ada masalah koneksi nih. Coba lagi ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
      <div className="bg-emerald-500 p-4 text-white flex items-center gap-3">
        <Bot size={24} />
        <div>
          <h2 className="font-bold text-lg">Chat dengan MindHealth</h2>
          <p className="text-emerald-100 text-sm">Online • Siap mendengarkanmu</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] p-3 rounded-2xl flex gap-3 ${
              msg.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
            }`}>
              {msg.role === 'bot' && <Bot size={20} className="text-emerald-500 shrink-0 mt-1" />}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex gap-2 items-center">
              <Bot size={20} className="text-emerald-500" />
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ceritain perasaanmu..."
          className="flex-1 px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-colors flex items-center justify-center w-12 ${
            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Mic size={20} />
        </button>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors flex items-center justify-center w-12"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
