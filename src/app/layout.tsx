import './globals.css'
import type { Metadata } from 'next'
import { Inter, VT323 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

// Load Inter font for better readability
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const vt323 = VT323({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
  weight: "400",
});

export const metadata: Metadata = {
  title: 'Stardew Sage | Stardew Valley AI Chatbot Assistant',
  description: 'Get instant answers to all your Stardew Valley questions with Stardew Sage, the AI-powered chatbot dedicated to helping farmers maximize their gameplay experience.',
  keywords: 'Stardew Valley, Stardew Valley chatbot, Stardew Valley assistant, Stardew Valley AI, Stardew Valley GPT, Stardew Valley guide, Stardew Valley help',
  metadataBase: new URL('https://stardew-sage.vercel.app'),
  openGraph: {
    title: 'Stardew Sage | Your Friendly Stardew Valley AI Assistant',
    description: 'Get instant answers to all your Stardew Valley questions with our AI-powered chatbot. Farm smarter, not harder!',
    url: 'https://stardew-sage.vercel.app',
    siteName: 'Stardew Sage',
    images: [
      {
        url: '/icons/stardew-sage.jpg', 
        width: 1200,
        height: 630,
        alt: 'Stardew Sage - AI Chatbot for Stardew Valley',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stardew Sage | Stardew Valley AI Chatbot',
    description: 'Your AI companion for all things Stardew Valley. Get instant answers to gameplay questions!',
    images: ['/icons/stardew-sage.jpg'],
  },
  icons: {
    icon: '/icons/stardew-chicken-icon.ico',
    apple: '/icons/stardew-chicken-icon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://stardew-sage.vercel.app', 
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${vt323.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
