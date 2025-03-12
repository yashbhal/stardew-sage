import './globals.css'
import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

// Load Inter font for better readability
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Stardew Sage',
  description: 'Your friendly Stardew Valley assistant',
  icons: {
    // Favicon - Displayed in browser tab
    icon: '/icons/stardew-chicken-icon.ico',
    apple: '/icons/stardew-chicken-icon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
