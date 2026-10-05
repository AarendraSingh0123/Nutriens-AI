import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Bot, User as UserIcon, Cpu, Sparkles } from 'lucide-react';
import { sendVoiceQuery } from '../services/api';
import { DisclaimerBanner } from '../components/Badges';

interface VoiceAssistantProps {
  initialQuery?: string;
  foodContext?: string;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ initialQuery, foodContext }) => {
  const [query, setQuery] = useState<string>(initialQuery || '');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Namaste! I am NutriLens AI. Ask me any question about your meal, portion size, or food pairing.",
      time: 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const presetPrompts = [
    "Can I eat this dosa with diabetes?",
    "What if I add sambar and chutney?",
    "Is biryani okay for me?",
    "What should I eat with this?"
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || query;
    if (!promptText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setIsLoading(true);

    try {
      const res = await sendVoiceQuery(promptText, foodContext);
      const botMsg: Message = {
        sender: 'assistant',
        text: res.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: "In local offline mode: Pair carbohydrates with high protein lentil sambar or curd for optimal glycemic balance.",
        time: 'Just now'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListen = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      alert("Browser speech recognition is not available. Please type your question below.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20">
      
      {/* Central Mic & Header Card */}
      <div className="saas-card p-6 text-center space-y-4">
        <div className="flex justify-center">
          <button
            onClick={toggleListen}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-mic-pulse shadow-lg shadow-red-500/30'
                : 'bg-gradient-to-tr from-brand-600 to-teal-600 text-white shadow-md shadow-brand-600/20 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Ask NutriLens</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask about your meal, portion or food pairing.
          </p>
        </div>

        <div className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
          <span>● Offline AI (Gemma 2B On-Device)</span>
        </div>

        {/* Preset Prompt Chips */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {presetPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="bg-slate-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 text-slate-600 text-xs font-medium px-3 py-1 rounded-full border border-slate-200 transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="saas-card p-5 space-y-3.5 min-h-[280px] max-h-[400px] overflow-y-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`max-w-sm p-3.5 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none font-medium' 
                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200/60 font-normal'
            }`}>
              <div className="flex items-center justify-between mb-1 opacity-80 font-bold text-[10px]">
                <span>{m.sender === 'user' ? 'You' : 'NutriLens AI'}</span>
                <span className="ml-2 opacity-60 font-normal">{m.time}</span>
              </div>
              <p>{m.text}</p>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-brand-600" />
            <span>NutriLens AI generating response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="saas-card p-2 flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about your meal or health..."
          className="flex-1 px-4 py-2 bg-transparent text-xs outline-none text-slate-900 placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSend()}
          className="bg-brand-600 hover:bg-brand-700 text-white p-2.5 rounded-xl font-bold shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
