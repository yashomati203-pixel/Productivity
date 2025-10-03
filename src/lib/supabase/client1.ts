// Location: src/lib/supabase/client.ts

import { createClient } from '@supabase/supabase-js'

// Ensure your environment variables are correctly named in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// The '!' tells TypeScript that you are certain these values will exist.
// Make sure they are defined in your .env.local file!

export const supabase = createClient(supabaseUrl, supabaseKey)