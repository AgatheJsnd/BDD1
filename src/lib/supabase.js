import { createClient } from '@supabase/supabase-js'

// Les variables d'environnement sont chargées depuis le fichier .env
// Vite expose automatiquement les variables commençant par VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Mode DEV : Si les clés ne sont pas configurées, on continue sans Supabase
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn('⚠️ MODE DEV : Supabase non configuré')
  console.warn('📝 Les données ne seront PAS sauvegardées')
  console.warn('💡 Pour activer Supabase : créez un fichier .env avec vos clés')
}

// Créer le client seulement si configuré, sinon null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
