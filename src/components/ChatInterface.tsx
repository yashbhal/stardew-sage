'use client';

import { useState } from 'react';

export default function ChatInterface() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-[#F6F1E5] rounded-lg pixel-border overflow-hidden">
      <div className="bg-stardew-green p-4 text-white">
        <h1 className="text-2xl font-bold">Stardew Sage</h1>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-stardew-yellow p-3 rounded-lg mb-4 text-stardew-soil">
          Hi there! I'm Stardew Sage, your friendly Stardew Valley assistant. Ask me anything about the game!
        </div>
      </div>
      
      <div className="p-4 border-t-2 border-stardew-brown">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about Stardew Valley..."
            className="flex-1 p-2 rounded-l-md border-2 border-stardew-brown focus:outline-none"
          />
          <button
            className="bg-stardew-green hover:bg-stardew-blue text-white py-2 px-4 rounded-r-md transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
