import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if real credentials are configured
export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseUrl !== 'https://SEU_PROJETO.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'sua_anon_key_aqui'

// Always create a client (even with placeholder values for demo mode)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
