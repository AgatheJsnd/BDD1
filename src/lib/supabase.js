import { createClient } from '@supabase/supabase-js'

// Les variables d'environnement sont chargées depuis le fichier .env
// Vite expose automatiquement les variables commençant par VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérification que les clés sont bien configurées
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERREUR: Les clés Supabase ne sont pas configurées !')
  console.error('📝 Créez un fichier .env à la racine du projet avec :')
  console.error('   VITE_SUPABASE_URL=votre-url')
  console.error('   VITE_SUPABASE_ANON_KEY=votre-cle')
  throw new Error('Configuration Supabase manquante')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
