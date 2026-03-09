import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { getVictoriaResponse } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content:
        'Hola, soy Victoria de 24 Street Film. ¿En qué puedo ayudarte hoy?\n\nHi, I\'m Victoria from 24 Street Film. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.concat(userMessage).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const responseText = await getVictoriaResponse(chatHistory);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText || 'Lo siento, hubo un error al procesar tu solicitud.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] h-[700px] max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5">
      {/* Header */}
      <div className="bg-black p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <img src="https://raw.githubusercontent.com/victorleyvatv/Assets-for-24-Street-Film-branding/main/24STREETFILM%20ISOTIPO%20WEB.png" alt="24 Street Film" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h2 className="font-semibold text-lg tracking-tight">Victoria</h2>
            <p className="text-xs text-white/60 uppercase tracking-widest font-medium">24 Street Film</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9F9F9]">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-black text-white rounded-tr-none shadow-lg'
                    : 'bg-white text-black border border-black/5 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <Markdown>{message.content}</Markdown>
                </div>
                <p
                  className={`text-[10px] mt-2 opacity-40 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-black/5 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-black/40" />
              <span className="text-xs text-black/40 font-medium uppercase tracking-wider">
                Victoria is typing...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-black/5">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje... / Type your message..."
            className="w-full bg-white text-black placeholder:text-black/40 border border-black/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-center mt-4 text-black/30 uppercase tracking-widest font-semibold">
          Powered by 24 Street Film
        </p>
      </div>
    </div>
  );
}