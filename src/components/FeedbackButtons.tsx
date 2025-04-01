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

  useEffect(() => {
    // Initialize fingerprint
    const stored = localStorage.getItem(STORAGE_KEY)
    const newFingerprint = stored || uuidv4()
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, newFingerprint)
    }
    setFingerprint(newFingerprint)

    // Load voted status
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
    <div className="w-full max-w-2xl mx-auto mt-8 px-4">
      <h2 className="text-xl font-semibold text-center mb-4 text-amber-900">
        How do you like Stardew Sage?
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => handleVote('love_website')}
          disabled={votedButtons.includes('love_website') || isLoading}
          className={`
            px-6 py-3 rounded-lg font-medium text-sm
            border-2 border-amber-700
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-amber-500
            ${votedButtons.includes('love_website')
              ? 'bg-amber-100 text-amber-700 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 text-white hover:border-amber-600'
            }
          `}
          aria-label="I love the website"
        >
          <span className="flex items-center gap-2">
            <span>I love the website</span>
            <span className="bg-amber-600/20 px-2 py-0.5 rounded-md border border-amber-600/30">
              {counts.loveWebsite}
            </span>
          </span>
        </button>

        <button
          onClick={() => handleVote('want_app')}
          disabled={votedButtons.includes('want_app') || isLoading}
          className={`
            px-6 py-3 rounded-lg font-medium text-sm
            border-2 border-emerald-700
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            ${votedButtons.includes('want_app')
              ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:border-emerald-600'
            }
          `}
          aria-label="I would prefer a mobile app"
        >
          <span className="flex items-center gap-2">
            <span>I would prefer a mobile app</span>
            <span className="bg-emerald-600/20 px-2 py-0.5 rounded-md border border-emerald-600/30">
              {counts.wantApp}
            </span>
          </span>
        </button>
      </div>

      {votedButtons.length > 0 && (
        <p className="text-center mt-4 text-gray-600 text-sm">
          Thank you for your feedback!
        </p>
      )}
    </div>
  )
}
