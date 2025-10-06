'use client';

import type { PromptSuggestion } from '../../constants/prompts';

interface PromptCarouselProps {
  prompts: PromptSuggestion[];
  activePrompt: string | null;
  isLoading: boolean;
  onPromptClick: (prompt: PromptSuggestion) => void | Promise<void>;
}

export const PromptCarousel = ({ prompts, activePrompt, isLoading, onPromptClick }: PromptCarouselProps) => (
  <div className="mb-2 sm:mb-3">
    <h2 className="sr-only">Smart Prompt Carousel</h2>
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {prompts.map((prompt) => {
        const isActive = activePrompt === prompt && isLoading;
        return (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptClick(prompt)}
            disabled={isLoading}
            aria-pressed={isActive}
            className={`
              font-pixel text-[11px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px]
              rounded-stardew-lg border-2 border-menu-border shadow-stardew-sm
              transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stardew-blue-400
              ${isActive
                ? 'bg-stardew-green-200 text-stardew-green-800 border-stardew-green-400 cursor-wait scale-95'
                : 'bg-menu-paper text-stardew-brown-800 hover:bg-stardew-green-50 hover:border-stardew-green-300 hover:shadow-stardew'}
              ${isLoading && !isActive ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {prompt}
          </button>
        );
      })}
    </div>
  </div>
);
