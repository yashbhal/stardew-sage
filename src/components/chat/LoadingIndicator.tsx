import Image from 'next/image';

interface LoadingIndicatorProps {
  prefersReducedMotion: boolean;
}

export const LoadingIndicator = ({ prefersReducedMotion }: LoadingIndicatorProps) => (
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
);
