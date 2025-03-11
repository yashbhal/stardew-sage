import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#F6F1E5]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-stardew-soil mb-2">
            Stardew Sage
          </h1>
          <p className="text-xl text-stardew-brown">
            Your friendly Stardew Valley assistant
          </p>
        </div>
        
        <ChatInterface />
        
        <footer className="mt-8 text-center text-stardew-brown">
          <p>Powered by Gemini 1.5 Flash • Not affiliated with ConcernedApe or Stardew Valley</p>
        </footer>
      </div>
    </main>
  );
}
