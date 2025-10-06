import { useState, useEffect } from 'react'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { ButtonType } from '@/lib/supabase/types'

const STORAGE_KEY = 'stardew-feedback-fingerprint'
const VOTED_KEY = 'stardew-feedback-voted'

export function FeedbackButtons() {
  const [counts, setCounts] = useState({ loveWebsite: 0, wantApp: 0 })
  const [votedButtons, setVotedButtons] = useState<ButtonType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fingerprint, setFingerprint] = useState<string>('')

  // Initialize user fingerprint and load voted status on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const newFingerprint = stored || uuidv4()
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, newFingerprint)
    }
    setFingerprint(newFingerprint)

    const voted = localStorage.getItem(VOTED_KEY)
    if (voted) {
      setVotedButtons(JSON.parse(voted))
    }

    // Fetch initial counts
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => setCounts(data))
      .catch(console.error)
  }, [])

  // Handle button click and update votes
  const handleVote = useCallback(async (type: ButtonType) => {
    if (votedButtons.includes(type) || isLoading || !fingerprint) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, fingerprint }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit feedback')
      }

      // Update local storage and state
      const newVoted = [...votedButtons, type]
      localStorage.setItem(VOTED_KEY, JSON.stringify(newVoted))
      setVotedButtons(newVoted)

      // Fetch updated counts
      const updatedCounts = await fetch('/api/feedback').then(res => res.json())
      setCounts(updatedCounts)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }, [votedButtons, isLoading, fingerprint])

  return (
    <div className="w-full max-w-2xl mx-auto opacity-90 hover:opacity-100 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <p className="text-sm sm:text-base font-pixel text-stardew-brown-600 whitespace-nowrap">
          How do you like Stardew Sage?
        </p>
        
        <div className="flex flex-row gap-2 justify-center items-center">
          <button
            onClick={() => handleVote('love_website')}
            disabled={votedButtons.includes('love_website') || isLoading}
            className={`
              min-w-[100px] sm:min-w-[120px]
              px-3 py-1.5 rounded text-sm font-pixel
              border border-menu-border
              transition-all duration-300 ease-in-out
              transform hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-1 focus:ring-stardew-blue-400
              ${votedButtons.includes('love_website')
                ? 'bg-stardew-green-100/50 text-stardew-brown-500 cursor-not-allowed border-stardew-green-200'
                : 'bg-menu-paper hover:bg-gradient-to-r hover:from-stardew-green-50 hover:to-white text-stardew-brown-800 hover:border-stardew-green-300 hover:shadow-stardew-sm'
              }
            `}
            aria-label="I love the website"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span>Love it!</span>
                {!votedButtons.includes('love_website') && (
                  <span className="text-stardew-green-600">♥</span>
                )}
              </span>
              <span className={`
                px-2 py-0.5 rounded text-xs border min-w-[24px]
                transition-colors duration-300
                ${votedButtons.includes('love_website')
                  ? 'bg-white/60 border-stardew-green-200 text-stardew-green-700'
                  : 'bg-white/80 border-menu-border text-stardew-brown-700'
                }
              `}>
                {counts.loveWebsite}
              </span>
            </span>
          </button>

          <button
            onClick={() => handleVote('want_app')}
            disabled={votedButtons.includes('want_app') || isLoading}
            className={`
              min-w-[100px] sm:min-w-[120px]
              px-3 py-1.5 rounded text-sm font-pixel
              border border-menu-border
              transition-all duration-300 ease-in-out
              transform hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-1 focus:ring-stardew-blue-400
              ${votedButtons.includes('want_app')
                ? 'bg-stardew-blue-100/50 text-stardew-brown-500 cursor-not-allowed border-stardew-blue-200'
                : 'bg-menu-paper hover:bg-gradient-to-r hover:from-stardew-blue-50 hover:to-white text-stardew-brown-800 hover:border-stardew-blue-300 hover:shadow-stardew-sm'
              }
            `}
            aria-label="I would prefer a mobile app"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span>Want app</span>
                {!votedButtons.includes('want_app') && (
                  <span className="text-stardew-blue-600">📱</span>
                )}
              </span>
              <span className={`
                px-2 py-0.5 rounded text-xs border min-w-[24px]
                transition-colors duration-300
                ${votedButtons.includes('want_app')
                  ? 'bg-white/60 border-stardew-blue-200 text-stardew-blue-700'
                  : 'bg-white/80 border-menu-border text-stardew-brown-700'
                }
              `}>
                {counts.wantApp}
              </span>
            </span>
          </button>
        </div>
      </div>

      {votedButtons.length > 0 && (
        <p className="text-xs text-center mt-2 text-stardew-brown-500 font-pixel animate-fade-in">
          Thanks for your feedback!
        </p>
      )}
    </div>
  )
}
