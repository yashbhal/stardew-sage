import Image from 'next/image';

interface ErrorBannerProps {
  error: string | null;
  errorMessageId?: string;
}

export const ErrorBanner = ({ error, errorMessageId }: ErrorBannerProps) => {
  if (!error) return null;

  return (
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
  );
};
