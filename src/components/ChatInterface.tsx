'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

/**
 * Message Type Definition
 * 
 * Defines the structure of chat messages exchanged between the user and the assistant.
 * - role: Identifies whether the message is from the 'user' or the 'assistant'
 * - content: The actual text content of the message
 * - timestamp: Optional timestamp when the message was created
 */
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

/**
 * ChatInterface Component
 * 
 * A comprehensive chat interface for the Stardew Valley assistant that provides:
 * 
 * 1. User Experience Features:
 *    - Real-time message display with user and assistant avatars
 *    - Markdown rendering for rich text formatting in responses
 *    - Automatic scrolling to the newest messages
 *    - Visual loading indicators during API requests
 *    - Error handling with user-friendly messages
 * 
 * 2. Technical Implementation:
 *    - React state management for messages, input, loading states
 *    - API communication with the Gemini model
 *    - Responsive design using Tailwind CSS
 *    - Optimized rendering with proper React patterns
 * 
 * 3. Styling:
 *    - Custom Stardew Valley-inspired visual design
 *    - Responsive layout for all device sizes
 *    - Animated message transitions
 */
export default function ChatInterface() {
  // =========================================================================
  // State Management
  // =========================================================================
  
  /**
   * Messages State
   * Stores the conversation history between user and assistant
   * Initialized with a welcome message from the assistant
   */
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm Stardew Sage, your friendly Stardew Valley assistant. Ask me anything about crops, villagers, fishing, mining, or any other aspect of the game!",
      timestamp: new Date(),
    },
  ]);
  
  /**
   * Input State
   * Tracks the current value of the user's input field
   */
  const [input, setInput] = useState('');
  
  /**
   * Loading State
   * Indicates whether a request to the API is in progress
   * Used to display loading indicators and disable the input field
   */
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Error State
   * Stores error messages when API requests fail
   * Displayed to the user in a friendly format
   */
  const [error, setError] = useState<string | null>(null);
  
  // =========================================================================
  // Refs for DOM Manipulation
  // =========================================================================
  
  /**
   * Reference to the end of the messages container
   * Used for auto-scrolling to the newest message
   */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  /**
   * Reference to the chat container
   * Used for scrolling and container manipulation
   */
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // =========================================================================
  // Effects
  // =========================================================================
  
  /**
   * Auto-scroll Effect
   * Scrolls to the bottom of the chat when new messages are added
   * Uses smooth scrolling for a better user experience
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // =========================================================================
  // Event Handlers
  // =========================================================================
  
  /**
   * Form Submission Handler
   * 
   * Processes the user's message submission:
   * 1. Prevents default form submission behavior
   * 2. Validates the input to ensure it's not empty
   * 3. Adds the user's message to the chat
   * 4. Sends the message to the API
   * 5. Handles the response and any errors
   * 6. Updates the UI accordingly
   * 
   * @param e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input - don't submit if empty
    if (!input.trim()) return;

    // Add user message to chat immediately for better UX
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Clear input field
    setIsLoading(true); // Show loading indicator
    setError(null); // Clear any previous errors

    try {
      // Send message to API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      // Handle API errors with appropriate messaging
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
      setIsLoading(false); // Hide loading indicator
    }
  };

  // =========================================================================
  // UI Rendering Functions
  // =========================================================================
  
  /**
   * Message Renderer
   * 
   * Renders an individual message with appropriate styling based on the sender:
   * - User messages: Right-aligned with blue background
   * - Assistant messages: Left-aligned with paper background and markdown support
   * 
   * Each message includes:
   * - Sender avatar (user or assistant)
   * - Message content with appropriate formatting
   * - Timestamp showing when the message was sent
   * 
   * @param message - The message object to render
   * @param index - The index of the message in the messages array
   * @returns A JSX element representing the message
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
        
        {/* Message content container with conditional styling based on sender */}
        <div 
          className={`
            max-w-[80%] sm:max-w-[70%] rounded-stardew-lg p-3 shadow-stardew-sm
            ${isUser 
              ? 'bg-stardew-blue-400 text-white rounded-tr-none' 
              : 'bg-menu-paper border border-menu-border rounded-tl-none'
            }
          `}
        >
          {/* Message content with markdown support for assistant messages */}
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
          
          {/* Timestamp display */}
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

  // =========================================================================
  // Main Component Render
  // =========================================================================
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
      
      {/* Messages Container - Scrollable area that displays all messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-3 sm:p-4 overflow-y-auto bg-paper-texture bg-repeat bg-[#F6F1E5] bg-opacity-90 space-y-2"
      >
        {/* Render all messages using the renderMessage function */}
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
      
      {/* Input Form - User input area at the bottom of the chat */}
      <form 
        onSubmit={handleSubmit} 
        className="p-3 sm:p-4 border-t-2 border-menu-border bg-menu-paper"
      >
        <div className="flex items-center">
          {/* Text input field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Stardew Valley..."
            className="flex-1 p-2 sm:p-3 rounded-stardew-lg rounded-r-none border-2 border-r-0 border-menu-border focus:outline-none focus:border-stardew-blue-400 font-body text-stardew-brown-800 placeholder-stardew-brown-400 bg-white transition-colors"
            disabled={isLoading}
          />
          
          {/* Submit button */}
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
