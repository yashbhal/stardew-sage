'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { SavedTipsPanel } from '@/components/chat/SavedTipsPanel';
import { PromptCarousel } from '@/components/chat/PromptCarousel';
import { LoadingIndicator } from '@/components/chat/LoadingIndicator';
import { ErrorBanner } from '@/components/chat/ErrorBanner';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useSavedTips } from '../hooks/useSavedTips';
import { copyTextToClipboard } from '../lib/clipboard';
import { trackUmamiEvent } from '../lib/umami';
import type { ChatMessage as Message } from '../types/chat';
import type { SavedTip } from '../types/tips';
import { PROMPT_COUNT, PROMPT_POOL, type PromptSuggestion } from '../constants/prompts';

const INITIAL_ASSISTANT_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi there! I'm Stardew Sage, your friendly Stardew Valley assistant. Ask me anything about crops, villagers, fishing, mining, or any other aspect of the game!",
  timestamp: new Date(),
};

const shufflePrompts = (pool: readonly PromptSuggestion[]) => {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getMessageTimestampIso = (timestamp?: Message['timestamp']) => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp.toISOString();
  if (typeof timestamp === 'string') return timestamp;
  return null;
};

const buildMessageKey = (message: Message, index: number) => {
  const iso = getMessageTimestampIso(message.timestamp);
  return iso ? `${message.role}-${iso}` : `${message.role}-${index}`;
};

const formatTranscript = (messages: Message[]) =>
  messages
    .map((message) => {
      const timestamp =
        message.timestamp instanceof Date
          ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';
      const speaker = message.role === 'user' ? 'You' : 'Stardew Sage';
      const prefix = timestamp ? `[${timestamp}] ` : '';
      return `${prefix}${speaker}: ${message.content}`;
    })
    .join('\n\n');

const generateTipId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<PromptSuggestion | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isSavedTipsOpen, setIsSavedTipsOpen] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { savedTips, isTipSaved, saveTip, removeTip, removeTipByContent, clearTips } = useSavedTips();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptSuggestions = useMemo(
    () => shufflePrompts(PROMPT_POOL).slice(0, PROMPT_COUNT),
    [],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [messages, prefersReducedMotion]);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    },
    [],
  );

  const scheduleCopyFeedback = useCallback((id: string) => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    setCopiedMessageId(id);
    copyTimeoutRef.current = setTimeout(() => setCopiedMessageId(null), 2000);
  }, []);

  const sendMessage = useCallback(
    async (message: string, options: { clearInput?: boolean } = {}) => {
      if (isLoading) return;
      const { clearInput = true } = options;
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return;

      const userMessage: Message = {
        role: 'user',
        content: trimmedMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      if (clearInput) {
        setInput('');
      }
      setIsLoading(true);
      trackUmamiEvent('message_sent');

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
        setMessages((prev) => [...prev, assistantMessage]);
        trackUmamiEvent('message_received');
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
    },
    [isLoading],
  );

  const handleCopyMessage = useCallback(
    async (messageId: string, content: string) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) return;

      const copied = await copyTextToClipboard(trimmedContent);
      if (!copied) return;

      scheduleCopyFeedback(messageId);
    },
    [scheduleCopyFeedback],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim()) return;
      void sendMessage(input);
    },
    [input, sendMessage],
  );

  const handleToggleBookmark = useCallback(
    (messageKey: string, message: Message) => {
      const content = message.content.trim();
      if (!content) return;

      if (isTipSaved(content)) {
        removeTipByContent(content);
        trackUmamiEvent('saved_tip_removed');
        return;
      }

      const newTip: SavedTip = {
        id: messageKey || generateTipId(),
        content,
        timestamp: getMessageTimestampIso(message.timestamp),
        savedAt: new Date().toISOString(),
      };

      saveTip(newTip);
      trackUmamiEvent('saved_tip_added');
    },
    [isTipSaved, removeTipByContent, saveTip],
  );

  const handleRemoveTip = useCallback(
    (tipId: string) => {
      removeTip(tipId);
      trackUmamiEvent('saved_tip_removed');
    },
    [removeTip],
  );

  const handleClearSavedTips = useCallback(() => {
    if (savedTips.length === 0) return;
    clearTips();
    trackUmamiEvent('saved_tip_removed', { reason: 'clear_all' });
  }, [clearTips, savedTips.length]);

  const handleCopyTranscript = useCallback(async () => {
    const transcript = formatTranscript(messages);
    if (!transcript.trim()) return;

    const copied = await copyTextToClipboard(transcript);
    if (!copied) return;

    trackUmamiEvent('transcript_copied');
    scheduleCopyFeedback('transcript');
  }, [messages, scheduleCopyFeedback]);

  const handlePromptClick = useCallback(
    async (prompt: PromptSuggestion) => {
      if (isLoading) return;
      setActivePrompt(prompt);
      setInput(prompt);
      trackUmamiEvent('prompt_clicked', { prompt });
      try {
        await sendMessage(prompt, { clearInput: false });
      } finally {
        setActivePrompt(null);
      }
      inputRef.current?.focus();
    },
    [isLoading, sendMessage],
  );

  const renderMessage = useCallback(
    (message: Message, index: number) => {
      const messageKey = buildMessageKey(message, index);
      return (
        <ChatMessage
          key={messageKey}
          message={message}
          messageKey={messageKey}
          prefersReducedMotion={prefersReducedMotion}
          copiedMessageId={copiedMessageId}
          isBookmarked={isTipSaved(message.content)}
          onToggleBookmark={handleToggleBookmark}
          onCopyMessage={handleCopyMessage}
        />
      );
    },
    [copiedMessageId, handleCopyMessage, handleToggleBookmark, isTipSaved, prefersReducedMotion],
  );

  const errorMessageId = error ? 'chat-error-message' : undefined;
  const isTranscriptCopied = copiedMessageId === 'transcript';

  return (
    <div className="flex flex-col max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 min-h-[100dvh]">
      <SavedTipsPanel
        isOpen={isSavedTipsOpen}
        savedTips={savedTips}
        onToggle={() => setIsSavedTipsOpen((prev) => !prev)}
        onClear={handleClearSavedTips}
        onRemove={handleRemoveTip}
      />

      <section
        className="flex flex-col h-[85vh] sm:h-[80vh] bg-[#F6F1E5] rounded-stardew-lg overflow-hidden shadow-stardew-xl border-2 border-menu-border"
        aria-label="Chat conversation"
        id="chat-interface"
      >
        <ChatHeader
          onCopyTranscript={handleCopyTranscript}
          isTranscriptCopied={isTranscriptCopied}
          prefersReducedMotion={prefersReducedMotion}
        />

        <div
          className="flex-1 p-3 sm:p-5 overflow-y-auto bg-paper-texture bg-repeat bg-[#F6F1E5] bg-opacity-90 space-y-3 sm:space-y-4"
          role="log"
          aria-live="polite"
          aria-atomic="false"
          tabIndex={0}
          aria-label="Stardew Sage conversation"
          id="chat-log"
        >
          {messages.map(renderMessage)}
          {isLoading && <LoadingIndicator prefersReducedMotion={prefersReducedMotion} />}
          <ErrorBanner error={error} errorMessageId={errorMessageId} />
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t-2 border-menu-border bg-menu-paper px-2 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-4">
          <PromptCarousel
            prompts={promptSuggestions}
            activePrompt={activePrompt}
            isLoading={isLoading}
            onPromptClick={handlePromptClick}
          />
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 sm:gap-3"
            aria-label="Send a message to Stardew Sage"
            aria-controls="chat-log"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
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
