'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { FeedbackButtons } from './FeedbackButtons';

/**
 * Message Type Definition
 */
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

/**
 * ChatInterface Component
 * 
 * A comprehensive chat interface for the Stardew Valley assistant that combines:
 * - Interactive chat functionality with markdown support
 * - User feedback system with rate limiting
 * - Stardew Valley-inspired visual design
 * - Responsive layout and animations
 */
export default function ChatInterface() {
  // State Management
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi there! I'm Stardew Sage, your friendly Stardew Valley assistant. Ask me anything about crops, villagers, fishing, mining, or any other aspect of the game!",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Stardew Sage');
      }

      const data = await response.json();
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Message renderer
  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={index}
        className={`mb-4 animate-fadeIn ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
      >
        {/* Bot avatar */}
        {!isUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
              <Image 
                src="/icons/stardew-sage.jpg" 
                alt="Stardew Sage" 
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Message content */}
        <div className={`
          max-w-[80%] sm:max-w-[70%] rounded-stardew-lg p-3 shadow-stardew-sm
          ${isUser 
            ? 'bg-stardew-blue-400 text-white rounded-tr-none' 
            : 'bg-menu-paper border border-menu-border rounded-tl-none'
          }
        `}>
          <div className={`mb-1 ${isUser ? 'font-pixel text-base' : 'font-body text-base'}`}>
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-headings:font-pixel prose-headings:text-stardew-brown-700 prose-p:text-stardew-brown-800 prose-strong:text-stardew-brown-900 prose-strong:font-semibold prose-li:text-stardew-brown-800">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          {message.timestamp && (
            <div className={`text-xs ${isUser ? 'text-stardew-blue-100' : 'text-stardew-brown-400'} text-right`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
        
        {/* User avatar */}
        {isUser && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-10 h-10 rounded-full bg-stardew-blue-300 border-2 border-stardew-blue-500 shadow-stardew-sm overflow-hidden relative">
              <Image 
                src="/icons/user-icon.jpg" 
                alt="You" 
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto px-3 sm:px-4 py-2 min-h-screen">
      {/* Chat interface */}
      <div className="flex flex-col h-[85vh] sm:h-[80vh] bg-[#F6F1E5] rounded-stardew-lg overflow-hidden shadow-stardew-xl border-2 border-menu-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-stardew-green-500 to-stardew-green-600 px-3 py-2 sm:p-3 text-white flex items-center justify-between border-b-2 border-menu-border">
          <div className="flex items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 mr-2 sm:mr-2.5 relative bg-menu-paper rounded-full overflow-hidden border-2 border-menu-border shadow-stardew">
              <Image 
                src="/icons/stardew-sage.jpg" 
                alt="Stardew Sage" 
                fill
                sizes="(max-width: 640px) 28px, 32px"
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-base sm:text-lg font-pixel tracking-pixel">Stardew Sage</h1>
          </div>
          <div className="text-[10px] sm:text-xs font-pixel bg-stardew-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-stardew-sm">
            Powered by Gemini
          </div>
        </div>
        
        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 p-2 sm:p-4 overflow-y-auto bg-paper-texture bg-repeat bg-[#F6F1E5] bg-opacity-90 space-y-2"
        >
          {messages.map(renderMessage)}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex-shrink-0 mr-2 sm:mr-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
                  <Image 
                    src="/icons/stardew-chicken-icon.ico" 
                    alt="LOADING" 
                    fill
                    sizes="(max-width: 640px) 32px, 40px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="bg-menu-paper border border-menu-border rounded-stardew-lg rounded-tl-none p-2 sm:p-3 shadow-stardew-sm">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-stardew-brown-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-stardew-brown-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-stardew-brown-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="flex justify-start mb-4">
              <div className="flex-shrink-0 mr-2 sm:mr-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
                  <Image 
                    src="/icons/stardew-chicken-icon.ico" 
                    alt="Error!" 
                    fill
                    sizes="(max-width: 640px) 32px, 40px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="bg-stardew-red-100 border border-stardew-red-300 rounded-stardew-lg rounded-tl-none p-2 sm:p-3 shadow-stardew-sm">
                <p className="text-stardew-red-600 font-body text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Form */}
        <form 
          onSubmit={handleSubmit} 
          className="p-2 sm:p-4 border-t-2 border-menu-border bg-menu-paper"
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Stardew Valley..."
              className="h-10 sm:h-11 flex-1 px-3 sm:px-4 text-sm sm:text-base rounded-stardew-lg border-2 border-menu-border focus:outline-none focus:border-stardew-green-400 font-body text-stardew-brown-800 placeholder-stardew-brown-400 bg-white transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`
                h-10 sm:h-11 min-w-[4.5rem] sm:min-w-[5.5rem] px-3 sm:px-4
                rounded-stardew-lg border-2 border-menu-border
                font-pixel text-xs sm:text-sm
                transition-all duration-300 ease-in-out
                transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-1 focus:ring-stardew-blue-400
                flex items-center justify-center gap-1.5 sm:gap-2
                ${!input.trim() || isLoading
                  ? 'bg-stardew-brown-100/50 text-stardew-brown-500 cursor-not-allowed border-stardew-brown-200'
                  : 'bg-menu-paper hover:bg-gradient-to-r hover:from-stardew-green-50 hover:to-white text-stardew-brown-800 hover:border-stardew-green-300 hover:shadow-stardew-sm'
                }
              `}
              aria-label="Send message"
            >
              <span className="hidden sm:inline">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Feedback buttons at the bottom */}
      <div className="w-full max-w-2xl mx-auto pb-4">
        <FeedbackButtons />
      </div>
    </div>
  );
}
