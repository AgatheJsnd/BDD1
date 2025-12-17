import { supabase } from './supabase'

/**
 * Enregistrer un nouveau candidat dans Supabase
 * @param {Object} userData - Les données de l'utilisateur
 * @param {string} userData.firstName - Prénom
 * @param {string} userData.lastName - Nom
 * @param {string} userData.email - Email
 * @returns {Promise} Résultat de l'insertion
 */
export async function saveUserData(userData) {
  try {
    const { data, error } = await supabase
      .from('candidats') // Utilisation de la table 'candidats'
      .insert([
        {
          Prénom: userData.firstName,      // Mapping vers 'Prénom'
          NOM: userData.lastName,           // Mapping vers 'NOM'
          email: userData.email,
          created_at: new Date().toISOString(),
          // Les autres champs seront NULL ou auront leurs valeurs par défaut
        }
      ])
      .select()

    if (error) {
      console.error('Erreur lors de l\'enregistrement:', error)
      throw error
    }

    console.log('Candidat enregistré avec succès:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erreur:', error)
    return { success: false, error }
  }
}

/**
 * Récupérer tous les candidats
 * @returns {Promise} Liste des candidats
 */
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('candidats')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération:', error)
      throw error
    }

    console.log('Candidats récupérés:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erreur:', error)
    return { success: false, error }
  }
}

/**
 * Récupérer un candidat par email
 * @param {string} email - L'email du candidat
 * @returns {Promise} Le candidat trouvé
 */
export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('candidats')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération:', error)
      throw error
    }

    console.log('Candidat trouvé:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erreur:', error)
    return { success: false, error }
  }
}

/**
 * Mettre à jour les informations d'un candidat
 * @param {number} id - L'ID du candidat
 * @param {Object} updates - Les champs à mettre à jour
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updateCandidat(id, updates) {
  try {
    const { data, error } = await supabase
      .from('candidats')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }

    console.log('Candidat mis à jour:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erreur:', error)
    return { success: false, error }
  }
}
