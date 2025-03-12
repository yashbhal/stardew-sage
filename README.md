# Stardew Sage

A modern, responsive chatbot assistant for Stardew Valley players, built with Next.js, Tailwind CSS, and powered by Gemini 1.5 Flash.

## Features

- 🌱 **Stardew Valley Expertise**: Get answers about crops, villagers, fishing, mining, and more
- 🎨 **Beautiful UI**: Responsive design with Stardew Valley-inspired aesthetics
- 📱 **Mobile-Friendly**: Works seamlessly across all device sizes
- ✨ **Markdown Support**: Properly formatted responses with rich text styling
- 🔍 **Contextual Responses**: Powered by Gemini 1.5 Flash for accurate information

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS with custom Stardew Valley theme
- **AI**: Google Gemini 1.5 Flash API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stardew-sage.git
   cd stardew-sage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components including the ChatInterface
- `/public` - Static assets like icons and images

## Customization

The project uses a custom Tailwind configuration with Stardew Valley-inspired colors and styling. You can modify the theme in `tailwind.config.js`.

## License

This project is not affiliated with ConcernedApe or Stardew Valley. It is an unofficial fan project.

## Acknowledgements

- Stardew Valley and all related properties are owned by ConcernedApe
- Powered by Google's Gemini 1.5 Flash API
- Icons and visual elements inspired by Stardew Valley's aesthetic
