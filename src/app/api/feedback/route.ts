import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { ButtonType } from '@/lib/supabase/types'

interface FeedbackCount {
  count: number
}

interface FeedbackCounts {
  loveWebsite: number
  wantApp: number
}

export async function POST(request: NextRequest) {
  try {
    const { type, fingerprint } = await request.json()
    
    if (!type || !fingerprint || 
        !['love_website', 'want_app'].includes(type as string)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Check if user has already voted for this button
    const { data: existing } = await supabase
      .from('feedback_clicks')
      .select('id')
      .eq('button_type', type as ButtonType)
      .eq('user_fingerprint', fingerprint)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already voted' },
        { status: 409 }
      )
    }

    // Record the new vote
    const { error: insertError } = await supabase
      .from('feedback_clicks')
      .insert({
        button_type: type as ButtonType,
        user_fingerprint: fingerprint
      })

    if (insertError) {
      console.error('Error recording vote:', insertError)
      return NextResponse.json(
        { error: 'Failed to record vote' },
        { status: 500 }
      )
    }

    // Get updated counts
    const { data: counts, error: countError } = await getVoteCounts()

    if (countError) {
      return NextResponse.json(
        { error: 'Vote recorded but failed to fetch updated counts' },
        { status: 200 }
      )
    }

    return NextResponse.json(counts)
  } catch (error) {
    console.error('Error processing feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: counts, error } = await getVoteCounts()

    if (error) {
      throw error
    }

    return NextResponse.json(counts)
  } catch (error) {
    console.error('Error fetching feedback counts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback counts' },
      { status: 500 }
    )
  }
}

async function getVoteCounts(): Promise<{ data: FeedbackCounts | null; error: Error | null }> {
  const { data: loveWebsite, error: error1 } = await supabase
    .from('feedback_clicks')
    .select('count')
    .eq('button_type', 'love_website' as ButtonType)
    .single<FeedbackCount>()

  const { data: wantApp, error: error2 } = await supabase
    .from('feedback_clicks')
    .select('count')
    .eq('button_type', 'want_app' as ButtonType)
    .single<FeedbackCount>()

  if (error1 || error2) {
    return {
      data: null,
      error: new Error('Failed to fetch feedback counts')
    }
  }

  return {
    data: {
      loveWebsite: loveWebsite?.count || 0,
      wantApp: wantApp?.count || 0,
    },
    error: null
  }
}
