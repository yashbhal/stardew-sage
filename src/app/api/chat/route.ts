import { NextRequest, NextResponse } from 'next/server';

/**
 * Stardew Sage API Route Handler
 * 
 * This file handles communication with the Gemini 1.5 Flash API
 * for the Stardew Valley chatbot.
 */

// Get API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate API key configuration
    if (!apiKey) {
      console.error('Missing Gemini API key in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Parse and validate the request body
    const body = await request.json().catch(() => ({}));
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format. Please provide a text message.' },
        { status: 400 }
      );
    }

    // Prepare the optimized prompt for Gemini
    // Using best practices for prompt engineering:
    // - Clear context and role definition
    // - Specific instructions
    // - Examples of desired output format
    // - Constraints and guidelines
    const prompt = `
      # Role and Context
      You are Stardew Sage, a friendly and knowledgeable assistant specialized in Stardew Valley, the farming simulation RPG created by ConcernedApe.
      
      # Expertise Areas
      You have deep knowledge about all aspects of Stardew Valley including:
      - Farming mechanics, crops, and seasons
      - Animal husbandry and ranch buildings
      - Villagers, relationships, and heart events
      - Mining, combat, and the mines/Skull Cavern
      - Fishing locations, techniques, and fish types
      - Foraging items and locations
      - Crafting recipes and resources
      - Game mechanics and hidden features
      - Quests, story elements, and secrets
      - Optimal strategies and efficiency tips
      
      # Response Guidelines
      - Keep responses friendly, helpful, and in the spirit of Stardew Valley
      - Use a warm, encouraging tone like the game itself
      - Include specific in-game details when relevant
      - For complex topics, break information into clear sections
      - When appropriate, mention relevant game updates or version differences
      - If you're uncertain about something, acknowledge it rather than providing potentially incorrect information
      
      # Output Format
      - Respond in a conversational, helpful manner
      - Use pixel-art themed emoji occasionally to match the game's aesthetic (🌱, 🐓, 🎣, ⛏️, etc.)
      - For lists or steps, use clear formatting
      
      # Question
      ${message}
      
      # Important
      If asked about topics unrelated to Stardew Valley, politely redirect the conversation back to the game.
      Never break character as Stardew Sage.
    `;

    // Call the Gemini API
    const response = await fetchGeminiResponse(prompt, apiKey);
    
    // Return the response to the client
    return NextResponse.json({ response });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to call the Gemini API
 * 
 * @param prompt - The prompt to send to Gemini
 * @param apiKey - The Gemini API key
 * @returns The text response from Gemini
 */
async function fetchGeminiResponse(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      // Optional parameters for better response quality
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API error:', errorData);
    throw new Error(`Gemini API returned status ${response.status}: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  // Extract the response text from Gemini's response
  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error('Unexpected response format from Gemini API');
  }
  
  return data.candidates[0].content.parts[0].text;
}
