'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { copyTextToClipboard } from '@/lib/clipboard';

const buttonBaseClasses = `
  inline-flex items-center justify-center gap-1.5 px-3 py-2
  rounded-stardew-lg border-2 border-menu-border bg-menu-paper
  font-pixel text-xs sm:text-sm text-stardew-brown-700
  transition-all duration-200 ease-out transform
  hover:scale-[1.02] active:scale-[0.98]
  hover:bg-gradient-to-r hover:from-stardew-green-50 hover:to-white
  hover:border-stardew-green-300 hover:shadow-stardew-sm
  focus:outline-none focus-visible:ring-2 focus-visible:ring-stardew-blue-300
`;

const contactButtonHighlightClasses = `
  relative
  data-[copied=true]:bg-stardew-gold-100
  data-[copied=true]:border-stardew-gold-400
  data-[copied=true]:text-stardew-brown-800
`;

export function FooterLinks() {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const copied = await copyTextToClipboard('yash@gradientfoundry.com');
    if (!copied) return;

    setIsCopied(true);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => setIsCopied(false), 2000);
  }, []);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <a
          href="https://www.gradientfoundry.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonBaseClasses}
        >
          <span aria-hidden="true">🏡</span>
          <span>Owned By</span>
        </a>
        <a
          href="https://www.yashbhalchandra.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonBaseClasses}
        >
          <span aria-hidden="true">🛠️</span>
          <span>Built By</span>
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className={`${buttonBaseClasses} ${contactButtonHighlightClasses}`}
          data-copied={isCopied}
          aria-live="polite"
          aria-label="Copy contact email to clipboard"
        >
          <span aria-hidden="true">📬</span>
          <span>{isCopied ? 'Email Copied!' : 'Contact'}</span>
        </button>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {isCopied ? 'Email copied to clipboard' : 'Contact email ready to copy'}
      </div>
    </div>
  );
}

export default FooterLinks;
