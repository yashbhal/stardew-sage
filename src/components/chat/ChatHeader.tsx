import Image from 'next/image';

interface ChatHeaderProps {
  onCopyTranscript: () => void;
  isTranscriptCopied: boolean;
  prefersReducedMotion: boolean;
}

export const ChatHeader = ({
  onCopyTranscript,
  isTranscriptCopied,
  prefersReducedMotion,
}: ChatHeaderProps) => (
  <header
    className={`bg-gradient-to-r from-stardew-green-500 to-stardew-green-600 px-3 py-2 sm:p-3 text-white flex items-center justify-between border-b-2 border-menu-border ${prefersReducedMotion ? '' : 'animate-slideUp'}`}
  >
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
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={onCopyTranscript}
        className="flex items-center gap-1 rounded-stardew-sm border border-white/30 bg-white/10 px-2 py-1 text-[10px] sm:text-xs font-pixel tracking-pixel text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-1 focus:ring-offset-stardew-green-600"
        aria-label="Copy entire conversation"
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
        <span>Copy chat</span>
        {isTranscriptCopied && (
          <span className="text-[9px] font-body text-white/80" aria-live="polite">
            Copied!
          </span>
        )}
      </button>
      <div className="text-[10px] sm:text-xs font-pixel bg-stardew-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-stardew-sm">
        Powered by Gemini
      </div>
    </div>
  </header>
);
