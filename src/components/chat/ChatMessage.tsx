import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  messageKey: string;
  prefersReducedMotion: boolean;
  copiedMessageId: string | null;
  isBookmarked: boolean;
  onToggleBookmark: (messageKey: string, message: ChatMessageType) => void;
  onCopyMessage: (messageKey: string, content: string) => Promise<void>;
}

export const ChatMessage = ({
  message,
  messageKey,
  prefersReducedMotion,
  copiedMessageId,
  isBookmarked,
  onToggleBookmark,
  onCopyMessage,
}: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const timestampLabel =
    message.timestamp instanceof Date
      ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : undefined;

  return (
    <article
      className={`mb-4 ${prefersReducedMotion ? '' : 'animate-fadeIn'} ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
      aria-label={`${isUser ? 'Your' : 'Stardew Sage'} message`}
      role="group"
    >
      {!isUser && <Avatar src="/icons/stardew-sage.jpg" alt="Stardew Sage" position="left" />}

      <div
        className={`
          max-w-[80%] sm:max-w-[68%] rounded-stardew-lg px-4 py-3 shadow-stardew-sm
          ${isUser ? 'bg-stardew-blue-400 text-white rounded-tr-none' : 'bg-menu-paper border border-menu-border rounded-tl-none'}
        `}
      >
        <div className={`mb-2 ${isUser ? 'font-pixel text-base leading-relaxed' : 'font-body text-base leading-relaxed'}`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:font-pixel prose-headings:text-stardew-brown-700 prose-p:text-stardew-brown-800 prose-strong:text-stardew-brown-900 prose-strong:font-semibold prose-li:text-stardew-brown-800">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        <div
          className={`mt-2 flex items-center justify-end gap-2 text-xs ${isUser ? 'text-stardew-blue-100' : 'text-stardew-brown-400'}`}
        >
          {!isUser && (
            <>
              <button
                type="button"
                onClick={() => onToggleBookmark(messageKey, message)}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-stardew-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-stardew-blue-400 focus:ring-offset-1 focus:ring-offset-menu-paper ${isBookmarked ? 'bg-stardew-gold-100 border-stardew-gold-300 text-stardew-gold-600' : 'bg-white/80 border-menu-border text-stardew-brown-500 hover:bg-white'}`}
                aria-label={isBookmarked ? 'Remove from saved tips' : 'Save this tip'}
                aria-pressed={isBookmarked}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onCopyMessage(messageKey, message.content)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-stardew-sm border border-menu-border bg-white/80 text-stardew-brown-500 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-stardew-blue-400 focus:ring-offset-1 focus:ring-offset-menu-paper"
                aria-label="Copy assistant response"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z" />
                </svg>
              </button>
              {copiedMessageId === messageKey && (
                <span className="text-[9px] font-body text-stardew-brown-500" aria-live="polite">
                  Copied!
                </span>
              )}
            </>
          )}
          {timestampLabel && <time>{timestampLabel}</time>}
        </div>
      </div>

      {isUser && <Avatar src="/icons/user-icon.jpg" alt="You" position="right" />}
    </article>
  );
};

const Avatar = ({ src, alt, position }: { src: string; alt: string; position: 'left' | 'right' }) => (
  <div className={`flex-shrink-0 ${position === 'left' ? 'mr-3' : 'ml-3'}`}>
    <div className="w-10 h-10 rounded-full bg-menu-paper border-2 border-menu-border shadow-stardew-sm overflow-hidden relative">
      <Image src={src} alt={alt} width={40} height={40} className="object-cover" />
    </div>
  </div>
);
