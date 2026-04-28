import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Image as ImageIcon, Paperclip, MoreVertical, Bot } from 'lucide-react';
import { Message } from '../lib/gemini';
import Markdown from 'react-markdown';

interface ChatAreaProps {
  contactName: string;
  contactRole: string;
  isBot?: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export function ChatArea({ contactName, contactRole, isBot, messages, onSendMessage, isLoading }: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#e5ddd5]/20 h-full">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {isBot ? (
            <div className="w-10 h-10 rounded-full bg-[#003399] flex items-center justify-center text-[#D4AF37]">
              <Bot size={20} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <span className="font-bold">{contactName.charAt(0)}</span>
            </div>
          )}
          <div>
            <h2 className="font-medium text-gray-900">{contactName}</h2>
            <p className="text-xs text-gray-500">{contactRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <MoreVertical size={20} className="cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 relative shadow-sm ${
                msg.isMe 
                  ? 'bg-[#003399] text-white rounded-t-xl rounded-bl-xl' 
                  : 'bg-white text-gray-800 rounded-t-xl rounded-br-xl'
              }`}
            >
              {!msg.isMe && msg.sender && (
                <div className="text-xs font-semibold text-[#D4AF37] mb-1">
                  {msg.sender}
                </div>
              )}
              <div className={`text-sm ${msg.isBot ? 'markdown-body' : ''}`}>
                {msg.isBot ? (
                    <Markdown>{msg.text}</Markdown>
                ) : (
                  msg.text
                )}
              </div>
              <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                msg.isMe ? 'text-white/70' : 'text-gray-500'
              }`}>
                {msg.time}
                {msg.isMe && <span>✓✓</span>}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 rounded-t-xl rounded-br-xl px-4 py-3 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-[#003399] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#003399] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#003399] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2 flex items-center min-h-[44px]">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="w-full bg-transparent border-none focus:outline-none text-sm"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="p-3 bg-[#003399] hover:bg-[#002266] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px] min-h-[44px]"
          >
            <Send size={18} className="translate-x-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
