import ChatInterface from '@/components/ChatInterface';
import FooterLinks from '@/components/FooterLinks';
import Image from 'next/image';

/**
 * Home Page Component
 * 
 * This is the main landing page for the Stardew Sage application.
 * It provides a welcoming interface with:
 * 
 * 1. A Stardew Valley themed header
 * 2. The main ChatInterface component for user interaction
 * 3. A footer with attribution and disclaimer
 * 
 * The page uses a paper texture background and custom animations to create an authentic Stardew Valley feel.
 */
export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 from-stardew-brown-100 to-[#F6F1E5] bg-paper-texture bg-repeat">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 animate-slideUp bg-menu-paper border-2 border-menu-border rounded-stardew-lg p-6 shadow-stardew">
          {/* Application Title */}
          <h1 className="text-4xl md:text-5xl font-pixel text-stardew-brown-600 mb-4 tracking-pixel">
            Stardew Sage
          </h1>
          {/* Application Tagline */}
          <p className="text-xl text-stardew-brown-500 font-body">
            Your friendly Stardew Valley AI chatbot assistant
          </p>
        </div>
        
        {/* SEO-friendly introduction - concise version */}
        <section className="mb-6 text-stardew-brown-600 font-body text-center">
          <p className="mb-2">
            Get instant answers to all your Stardew Valley questions from the Stadew Sage. <br />
            An AI chatbot that is an expert on farming, mining, fishing, villagers, and more!
          </p>
        </section>
        
        {/* Main Chat Interface Component */}
        <div className="animate-popIn">
          <ChatInterface />
        </div>
        
        {/* Footer Section with Attribution */}
        <footer className="mt-8 text-center text-stardew-brown-500 font-body text-sm">
          {/* AI Provider Attribution */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span>Powered by</span>
            <Image 
              src="/icons/gemini_logo.png" 
              alt="Gemini" 
              width={20} 
              height={20}
              className="inline-block"
            />
            <span>Gemini 2.0 Flash</span>
          </div>    
          {/* Legal Disclaimer */}
          <p>Not affiliated with ConcernedApe or Stardew Valley</p>
          <p>Made with ❤️ for the Stardew Valley community</p>

          <FooterLinks />
        </footer>
      </div>
    </main>
  );
}
