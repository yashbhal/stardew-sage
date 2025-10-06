'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

/**
 * Message Type Definition
 */
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

type SavedTip = {
  id: string;
  content: string;
  timestamp?: string | null;
  savedAt: string;
};

const PROMPT_POOL = [
  'Best crops for Spring year 1?',
  'Optimal Spring crop rotations?',
  'Gift ideas for Sebastian?',
  'Easiest heart events to unlock?',
  'How do I unlock the community center?',
  'Fastest way to earn gold early?',
  'Efficient mining day plan?',
  'Where to find rare fish today?',
  'Tips for perfect fishing?',
  'What should I do on rainy days?',
] as const;

const PROMPT_COUNT = 3;
const SAVED_TIPS_STORAGE_KEY = 'stardew-sage-saved-tips';

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
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [savedTips, setSavedTips] = useState<SavedTip[]>([]);
  const [isSavedTipsOpen, setIsSavedTipsOpen] = useState(false);
  
  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Fallback for Safari < 14
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_TIPS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedTip[];
        setSavedTips(Array.isArray(parsed) ? parsed : []);
      }
    } catch (storageError) {
      console.error('Failed to load saved tips from storage', storageError);
    } finally {
      isInitialLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current) return;
    try {
      localStorage.setItem(SAVED_TIPS_STORAGE_KEY, JSON.stringify(savedTips));
    } catch (storageError) {
      console.error('Failed to persist saved tips', storageError);
    }
  }, [savedTips]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [messages, prefersReducedMotion]);

  // Form submission handler
  const sendMessage = async (message: string, options: { clearInput?: boolean } = {}) => {
    if (isLoading) return;
    const { clearInput = true } = options;
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const userMessage: Message = {
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);
    if (clearInput) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Stardew Sage');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      if (!clearInput) {
        setInput('');
      }
      inputRef.current?.focus();
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    if (!content.trim()) return;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedMessageId(messageId);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (copyError) {
      console.error('Failed to copy message', copyError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
  };

  const handleToggleBookmark = (messageKey: string, message: Message) => {
    if (!message.content.trim()) return;

    setSavedTips(prev => {
      const exists = prev.find(tip => tip.content === message.content);
      if (exists) {
        return prev.filter(tip => tip.content !== message.content);
      }

      const timestampIso = message.timestamp instanceof Date
        ? message.timestamp.toISOString()
        : (typeof message.timestamp === 'string' ? message.timestamp : null);

      const newTip: SavedTip = {
        id: messageKey || (typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
        content: message.content,
        timestamp: timestampIso,
        savedAt: new Date().toISOString(),
      };

      return [newTip, ...prev];
    });
  };

  const handleRemoveTip = (tipId: string) => {
    setSavedTips(prev => prev.filter(tip => tip.id !== tipId));
  };

  const handleClearSavedTips = () => {
    setSavedTips([]);
  };

  const formatSavedTimestamp = (iso?: string | null) => {
    if (!iso) return '';
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const [promptSuggestions, setPromptSuggestions] = useState<Array<typeof PROMPT_POOL[number]>>(
    () => PROMPT_POOL.slice(0, PROMPT_COUNT)
  );

  useEffect(() => {
    const pool = [...PROMPT_POOL];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setPromptSuggestions(pool.slice(0, PROMPT_COUNT));
  }, []);

  const handlePromptClick = async (prompt: typeof PROMPT_POOL[number]) => {
    if (isLoading) return;
    setActivePrompt(prompt);
    setInput(prompt);
    try {
      await sendMessage(prompt, { clearInput: false });
    } finally {
      setActivePrompt(null);
    }
    inputRef.current?.focus();
  };

  // Message renderer
  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    const messageKey = message.timestamp ? `${message.role}-${message.timestamp.toISOString()}` : `${message.role}-${index}`;
    const isBookmarked = savedTips.some(tip => tip.content === message.content);

    return (
      <article
        key={messageKey}
        className={`mb-4 ${prefersReducedMotion ? '' : 'animate-fadeIn'} ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
        aria-label={`${isUser ? 'Your' : 'Stardew Sage'} message`}
        role="group"
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
          max-w-[80%] sm:max-w-[68%] rounded-stardew-lg px-4 py-3 shadow-stardew-sm
          ${isUser 
            ? 'bg-stardew-blue-400 text-white rounded-tr-none' 
            : 'bg-menu-paper border border-menu-border rounded-tl-none'
          }
        `}>
          <div className={`mb-2 ${isUser ? 'font-pixel text-base leading-relaxed' : 'font-body text-base leading-relaxed'}`}>
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-headings:font-pixel prose-headings:text-stardew-brown-700 prose-p:text-stardew-brown-800 prose-strong:text-stardew-brown-900 prose-strong:font-semibold prose-li:text-stardew-brown-800">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
          
          <div className={`mt-2 flex items-center justify-end gap-2 text-xs ${isUser ? 'text-stardew-blue-100' : 'text-stardew-brown-400'}`}>
            {!isUser && (
              <>
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(messageKey, message)}
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-stardew-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-stardew-blue-400 focus:ring-offset-1 focus:ring-offset-menu-paper ${isBookmarked ? 'bg-stardew-gold-100 border-stardew-gold-300 text-stardew-gold-600' : 'bg-white/80 border-menu-border text-stardew-brown-500 hover:bg-white'}`}
                  aria-label={isBookmarked ? 'Remove from saved tips' : 'Save this tip'}
                  aria-pressed={isBookmarked}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyMessage(messageKey, message.content)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-stardew-sm border border-menu-border bg-white/80 text-stardew-brown-500 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-stardew-blue-400 focus:ring-offset-1 focus:ring-offset-menu-paper"
                  aria-label="Copy assistant response"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"
                    />
                  </svg>
                </button>
                {copiedMessageId === messageKey && (
                  <span className="text-[9px] font-body text-stardew-brown-500" aria-live="polite">
                    Copied!
                  </span>
                )}
              </>
            )}
            {message.timestamp && (
              <time>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </time>
            )}
          </div>
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
      </article>
    );
  };

  const errorMessageId = error ? 'chat-error-message' : undefined;

  return (
    <div className="flex flex-col max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 min-h-[100dvh]">
      <section className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
          <div className="flex items-center gap-2">
            {savedTips.length > 0 && (
              <button
                type="button"
                onClick={handleClearSavedTips}
                className="text-xs sm:text-sm font-pixel tracking-pixel text-stardew-red-500 hover:text-stardew-red-600 focus:outline-none focus:ring-2 focus:ring-stardew-red-300 focus:ring-offset-1 focus:ring-offset-menu-paper"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSavedTipsOpen(prev => !prev)}
              className={`inline-flex items-center justify-center gap-1 rounded-stardew-lg border-2 border-menu-border px-3 py-1.5 font-pixel text-xs sm:text-sm transition-colors ${isSavedTipsOpen ? 'bg-stardew-green-100 text-stardew-green-700' : 'bg-menu-paper hover:bg-stardew-green-50 text-stardew-brown-700'}`}
              aria-expanded={isSavedTipsOpen}
              aria-controls="saved-tips-panel"
            >
              {isSavedTipsOpen ? 'Hide saved tips' : 'Show saved tips'}
              <span className="text-[10px] sm:text-xs font-body text-stardew-brown-500">({savedTips.length})</span>
            </button>
          </div>
        </div>

        {isSavedTipsOpen && (
          <div
            id="saved-tips-panel"
            className="mt-3 rounded-stardew-lg border-2 border-menu-border bg-menu-paper p-3 sm:p-4 shadow-stardew-sm"
            role="region"
            aria-label="Saved tips list"
          >
            {savedTips.length === 0 ? (
              <p className="text-sm font-body text-stardew-brown-500">No tips saved yet. Tap the star icon on helpful responses to bookmark them.</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {savedTips.map(tip => (
                  <li key={tip.id} className="rounded-stardew border border-menu-border bg-white/90 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-body text-stardew-brown-700 whitespace-pre-wrap">{tip.content}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTip(tip.id)}
                        className="shrink-0 rounded-stardew border-2 border-stardew-brown-200 bg-stardew-brown-50 px-3 py-1.5 text-[11px] sm:text-xs font-pixel uppercase tracking-pixel text-stardew-brown-600 hover:bg-stardew-brown-100 focus:outline-none focus:ring-2 focus:ring-stardew-blue-400 focus:ring-offset-1 focus:ring-offset-white"
                        aria-label="Remove saved tip"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 text-[11px] font-body text-stardew-brown-400">
                      Saved {formatSavedTimestamp(tip.savedAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Chat interface */}
      <section
        className="flex flex-col h-[85vh] sm:h-[80vh] bg-[#F6F1E5] rounded-stardew-lg overflow-hidden shadow-stardew-xl border-2 border-menu-border"
        aria-label="Chat conversation"
        id="chat-interface"
      >
        {/* Header */}
        <header className={`bg-gradient-to-r from-stardew-green-500 to-stardew-green-600 px-3 py-2 sm:p-3 text-white flex items-center justify-between border-b-2 border-menu-border ${prefersReducedMotion ? '' : 'animate-slideUp'}`}>
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
        </header>
        
        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 p-3 sm:p-5 overflow-y-auto bg-paper-texture bg-repeat bg-[#F6F1E5] bg-opacity-90 space-y-3 sm:space-y-4"
          role="log"
          aria-live="polite"
          aria-atomic="false"
          tabIndex={0}
          aria-label="Stardew Sage conversation"
          id="chat-log"
        >
          {messages.map(renderMessage)}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4" role="status" aria-live="polite" aria-label="Stardew Sage is preparing a response">
              <div className="flex-shrink-0 mr-2 sm:mr-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
                  <Image 
                    src="/icons/stardew-chicken-icon.ico" 
                    alt="Loading response" 
                    fill
                    sizes="(max-width: 640px) 32px, 40px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="bg-menu-paper border border-menu-border rounded-stardew-lg rounded-tl-none p-2 sm:p-3 shadow-stardew-sm">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-stardew-brown-400 rounded-full ${prefersReducedMotion ? '' : 'animate-bounce'}`}
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="flex justify-start mb-4" role="alert" id={errorMessageId}>
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
        
        {/* Smart Prompt Carousel + Input */}
        <div className="border-t-2 border-menu-border bg-menu-paper px-2 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-4">
          <div className="mb-2 sm:mb-3">
            <h2 className="sr-only">Smart Prompt Carousel</h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {promptSuggestions.map((prompt) => {
                const isActive = activePrompt === prompt && isLoading;
                return (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                    disabled={isLoading}
                    aria-pressed={isActive}
                    className={`
                      font-pixel text-[11px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px]
                      rounded-stardew-lg border-2 border-menu-border shadow-stardew-sm
                      transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stardew-blue-400
                      ${isActive
                        ? 'bg-stardew-green-200 text-stardew-green-800 border-stardew-green-400 cursor-wait scale-95'
                        : 'bg-menu-paper text-stardew-brown-800 hover:bg-stardew-green-50 hover:border-stardew-green-300 hover:shadow-stardew'
                      }
                      ${isLoading && !isActive ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                  >
                    {prompt}
                  </button>
                );
              })}
            </div>
          </div>
          <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-2 sm:gap-3"
            aria-label="Send a message to Stardew Sage"
            aria-controls="chat-log"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Stardew Valley..."
              className="h-11 sm:h-12 min-h-[44px] flex-1 px-3 sm:px-4 text-sm sm:text-base rounded-stardew-lg border-2 border-menu-border focus:outline-none focus:border-stardew-green-400 font-body text-stardew-brown-800 placeholder-stardew-brown-400 bg-white transition-colors"
              disabled={isLoading}
              aria-label="Message input"
              ref={inputRef}
              aria-controls="chat-log"
              aria-describedby={errorMessageId}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`
                h-11 sm:h-12 min-h-[44px] min-w-[4.5rem] sm:min-w-[5.5rem] px-3 sm:px-4
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
              aria-controls="chat-log"
            >
              <span className="hidden sm:inline">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
