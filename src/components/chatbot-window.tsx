'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, LiquidButton, MetalButton } from "@/components/ui/button";
import { MessageSquare, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_QUESTIONS = [
  'What are the course fees?',
  'What documents do I need to upload?',
  'Where are the campuses located?',
  'Are there any scholarships?',
];

export default function ChatbotWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your Gowthami Admission Assistant. Ask me anything about our courses, eligibility, fee details, or application processes!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMsg = textToSend.trim();
    setInput('');
    
    // Add user message to stack
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch reply from assistant.');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </Button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 h-[480px] bg-white border border-zinc-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-50 flex items-center justify-center border border-emerald-200">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-zinc-900">Admissions AI Assistant</h3>
                  <span className="text-[9px] text-zinc-500">Online & Ready to Help</span>
                </div>
              </div>
              <Button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Stack */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col max-w-[80%] rounded-xl p-3 text-xs leading-relaxed",
                    m.role === 'user'
                      ? "ml-auto bg-emerald-600 text-white rounded-tr-none"
                      : "bg-white border border-zinc-200 text-zinc-700 rounded-tl-none shadow-sm"
                  )}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-xl rounded-tl-none p-3 text-xs text-zinc-400 max-w-[80%] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce delay-100" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce delay-200" />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Starter Prompt Suggestions */}
              {messages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Recommended Queries:</span>
                  <div className="flex flex-col gap-1.5">
                    {STARTER_QUESTIONS.map(q => (
                      <Button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-[11px] text-zinc-700 bg-white border border-zinc-200 hover:bg-emerald-50 hover:border-emerald-200 px-2.5 py-1.5 rounded-lg text-left w-full transition-colors shadow-sm"
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-zinc-200 bg-white flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about fees, courses, locations..."
                className="flex-1 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-emerald-300 transition-colors"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
