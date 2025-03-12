'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

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
 * - Message display with proper styling
 * - User input and submission
 * - API communication with Gemini
 * - Loading states and error handling
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
        className={`chat-message ${
          isUser ? 'user-message' : 'bot-message'
        }`}
      >
        {/* Message content */}
        <div className="mb-1">{message.content}</div>
        
        {/* Timestamp (optional) */}
        {message.timestamp && (
          <div className="text-xs opacity-70 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-[#F6F1E5] rounded-lg pixel-border overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-stardew-green p-4 text-white flex items-center">
        <div className="w-10 h-10 mr-3 relative">
          <Image 
            src="/stardew-icon.png" 
            alt="Stardew Sage" 
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-pixel">Stardew Sage</h1>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#F6F1E5] bg-opacity-90">
        {/* Render all messages */}
        {messages.map(renderMessage)}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="chat-message bot-message">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-stardew-soil rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-stardew-soil rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-stardew-soil rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="chat-message bot-message text-red-500">
            {error}
          </div>
        )}
        
        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t-2 border-stardew-brown">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Stardew Valley..."
            className="flex-1 p-2 rounded-l-md border-2 border-stardew-brown focus:outline-none focus:border-stardew-blue font-pixel transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-stardew-green hover:bg-stardew-blue text-white font-pixel py-2 px-4 rounded-r-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
