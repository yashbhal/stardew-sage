import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { ButtonType } from '@/lib/supabase/types'

export async function GET() {
  try {
    const { data: loveWebsite, error: error1 } = await supabase
      .from('feedback_clicks')
      .select('count')
      .eq('button_type', 'love_website')
      .single()

    const { data: wantApp, error: error2 } = await supabase
      .from('feedback_clicks')
      .select('count')
      .eq('button_type', 'want_app')
      .single()

    if (error1 || error2) {
      throw new Error('Failed to fetch feedback counts')
    }

    return NextResponse.json({
      loveWebsite: loveWebsite?.count || 0,
      wantApp: wantApp?.count || 0,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch feedback counts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, fingerprint } = await request.json()
    
    if (!type || !fingerprint || 
        !['love_website', 'want_app'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Check if user has already voted for this button
    const { data: existing } = await supabase
      .from('feedback_clicks')
      .select('id')
      .eq('button_type', type)
      .eq('user_fingerprint', fingerprint)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Already voted' },
        { status: 409 }
      )
    }

    // Insert new vote
    const { error: insertError } = await supabase
      .from('feedback_clicks')
      .insert([
        {
          button_type: type as ButtonType,
          user_fingerprint: fingerprint,
        }
      ])

    if (insertError) {
      throw insertError
    }

    // Get updated counts
    const { data: counts } = await supabase
      .from('feedback_clicks')
      .select('button_type, count')
      .eq('button_type', type)
      .single()

    return NextResponse.json({ count: counts?.count || 1 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
