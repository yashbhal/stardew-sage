import ChatInterface from '@/components/ChatInterface';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-paper-texture bg-repeat bg-[#F6F1E5]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 animate-slideUp">
          <h1 className="text-4xl md:text-5xl font-pixel text-stardew-brown-700 mb-2 tracking-pixel">
            Stardew Sage
          </h1>
          <p className="text-xl text-stardew-brown-600 font-body">
            Your friendly Stardew Valley assistant
          </p>
        </div>
        
        <div className="animate-popIn">
          <ChatInterface />
        </div>
        
        <footer className="mt-8 text-center text-stardew-brown-500 font-body text-sm">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span>Powered by</span>
            <Image 
              src="/icons/gemini_logo.png" 
              alt="Gemini" 
              width={20} 
              height={20}
              className="inline-block"
            />
            <span>Gemini 1.5 Flash</span>
          </div>
          <p>Not affiliated with ConcernedApe or Stardew Valley</p>
        </footer>
      </div>
    </main>
  );
}
