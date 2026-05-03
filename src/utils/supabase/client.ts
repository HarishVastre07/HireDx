import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use generic types to support Supabase database schema if added later
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
