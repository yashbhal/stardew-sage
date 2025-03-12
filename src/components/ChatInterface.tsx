'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

// Define types for better type safety
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

/**
 * ChatInterface Component
 * 
 * A responsive chat interface for the Stardew Valley chatbot that handles:
 * - Message display with proper styling and markdown formatting
 * - User input and submission
 * - API communication with Gemini
 * - Loading states and error handling
 * - Responsive design for all device sizes
 */
export default function ChatInterface() {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm Stardew Sage, your friendly Stardew Valley assistant. Ask me anything about crops, villagers, fishing, mining, or any other aspect of the game!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref for auto-scrolling to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handles form submission and API communication
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      // Handle API errors
      if (!response.ok) {
        throw new Error('Failed to get response from Stardew Sage');
      }

      // Process successful response
      const data = await response.json();
      
      // Add assistant message to chat
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renders an individual message with appropriate styling
   */
  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <div
        key={index}
        className={`mb-4 animate-fadeIn ${
          isUser ? 'flex justify-end' : 'flex justify-start'
        }`}
      >
        {/* Bot avatar (only for assistant messages) - Displayed on the left side of assistant messages */}
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
        <div 
          className={`
            max-w-[80%] sm:max-w-[70%] rounded-stardew-lg p-3 shadow-stardew-sm
            ${isUser 
              ? 'bg-stardew-blue-400 text-white rounded-tr-none' 
              : 'bg-menu-paper border border-menu-border rounded-tl-none'
            }
          `}
        >
          {/* Message content with markdown support */}
          <div className={`mb-1 ${isUser ? 'font-pixel text-base' : 'font-body text-base'}`}>
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-headings:font-pixel prose-headings:text-stardew-brown-700 prose-p:text-stardew-brown-800 prose-strong:text-stardew-brown-900 prose-strong:font-semibold prose-li:text-stardew-brown-800">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
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
        
        {/* User avatar (only for user messages) - Displayed on the right side of user messages */}
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
    <div className="flex flex-col h-[80vh] sm:h-[70vh] md:h-[75vh] max-w-3xl mx-auto bg-[#F6F1E5] rounded-stardew-lg overflow-hidden shadow-stardew-xl border-2 border-menu-border">
      {/* Header with Stardew Sage icon - Displayed at the top of the chat interface */}
      <div className="bg-gradient-to-r from-stardew-green-500 to-stardew-green-600 p-3 sm:p-4 text-white flex items-center justify-between border-b-2 border-menu-border">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 relative bg-menu-paper rounded-full overflow-hidden border-2 border-menu-border shadow-stardew">
            <Image 
              src="/icons/stardew-sage.jpg" 
              alt="Stardew Sage" 
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-pixel tracking-pixel">Stardew Sage</h1>
        </div>
        <div className="text-xs sm:text-sm font-pixel bg-stardew-green-700 px-2 py-1 rounded-stardew-sm">
          Powered by Gemini
        </div>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-3 sm:p-4 overflow-y-auto bg-paper-texture bg-repeat bg-[#F6F1E5] bg-opacity-90 space-y-2"
      >
        {/* Render all messages */}
        {messages.map(renderMessage)}
        
        {/* Loading indicator with chicken icon - Displayed when waiting for a response */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
                <Image 
                  src="/icons/stardew-chicken-icon.ico" 
                  alt="LOADING" 
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="bg-menu-paper border border-menu-border rounded-stardew-lg rounded-tl-none p-3 shadow-stardew-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-stardew-brown-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-stardew-brown-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-stardew-brown-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message with chicken icon - Displayed when an error occurs */}
        {error && (
          <div className="flex justify-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
                <Image 
                  src="/icons/stardew-chicken-icon.ico" 
                  alt="Error!" 
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="bg-stardew-red-100 border border-stardew-red-300 rounded-stardew-lg rounded-tl-none p-3 shadow-stardew-sm">
              <p className="text-stardew-red-600 font-body">{error}</p>
            </div>
          </div>
        )}
        
        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <form 
        onSubmit={handleSubmit} 
        className="p-3 sm:p-4 border-t-2 border-menu-border bg-menu-paper"
      >
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Stardew Valley..."
            className="flex-1 p-2 sm:p-3 rounded-stardew-lg rounded-r-none border-2 border-r-0 border-menu-border focus:outline-none focus:border-stardew-blue-400 font-body text-stardew-brown-800 placeholder-stardew-brown-400 bg-white transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-stardew-green-500 hover:bg-stardew-green-600 active:bg-stardew-green-700 text-white font-pixel py-2 px-4 sm:py-3 sm:px-6 rounded-stardew-lg rounded-l-none border-2 border-menu-border shadow-stardew transition-colors disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send message"
          >
            <span className="hidden sm:inline mr-1">Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
