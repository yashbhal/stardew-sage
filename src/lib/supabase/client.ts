import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Validate environment variables at startup
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
}

// Check all required environment variables
Object.entries(requiredEnvVars).forEach(([name, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
})

// Create client with strict SSL/TLS
export const supabase = createClient<Database>(
  requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL,
  requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false // Don't persist auth state in localStorage
    },
    db: {
      schema: 'public'
    }
  }
)
