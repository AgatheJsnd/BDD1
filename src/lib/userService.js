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
    if (!supabase) {
      console.error('Supabase n\'est pas configuré')
      return { success: false, error: 'Supabase non configuré' }
    }

    const { data, error } = await supabase
      .from('candidats')
      .select('*')
      .eq('email', email)
      .maybeSingle() // Utiliser maybeSingle() au lieu de single() pour éviter les erreurs si aucun résultat

    if (error) {
      console.error('Erreur lors de la récupération:', error)
      return { success: false, error }
    }

    if (!data) {
      return { success: false, error: 'Candidat non trouvé', data: null }
    }

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

/**
 * Mettre à jour les persona_score d'un candidat par email
 * @param {string} email - L'email du candidat
 * @param {Array<string>} personas - Tableau des personas (max 3)
 * @param {boolean} replace - Si true, remplace complètement les personas. Si false, les ajoute aux existants
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updatePersonaScore(email, personas, replace = false) {
  console.log('🔧 updatePersonaScore appelé avec:', { email, personas, replace });
  
  try {
    if (!supabase) {
      console.error('❌ Supabase n\'est pas configuré')
      return { success: false, error: 'Supabase non configuré' }
    }

    if (!email) {
      console.error('❌ Email manquant')
      return { success: false, error: 'Email manquant' }
    }

    console.log('🔍 Recherche du candidat avec email:', email);
    // Récupérer d'abord le candidat pour obtenir son ID
    let userResult = await getUserByEmail(email)
    console.log('📥 Résultat getUserByEmail:', userResult);
    
    // Si le candidat n'existe pas, essayer de le créer avec juste l'email
    if (!userResult.success || !userResult.data) {
      console.log('⚠️ Candidat non trouvé, création...');
      try {
        const { data: newData, error: insertError } = await supabase
          .from('candidats')
          .insert([{ email: email, created_at: new Date().toISOString() }])
          .select()
          .single()

        if (insertError) {
          console.error('❌ Erreur lors de la création du candidat:', insertError)
          return { success: false, error: `Candidat non trouvé et impossible de le créer: ${insertError.message}` }
        }

        console.log('✅ Candidat créé:', newData);
        userResult = { success: true, data: newData }
      } catch (createError) {
        console.error('❌ Erreur lors de la création:', createError)
        return { success: false, error: `Candidat non trouvé et erreur de création: ${createError.message}` }
      }
    }

    const candidatId = userResult.data.id
    console.log('✅ Candidat trouvé/créé avec ID:', candidatId);
    console.log('📊 Persona_score actuel:', userResult.data.persona_score);
    
    let updatedPersonas;
    
    if (replace) {
      // Remplacer complètement les personas (limité à 3)
      updatedPersonas = personas.slice(0, 3)
      console.log('🔄 Mode REMPLACEMENT - Nouveaux personas:', updatedPersonas);
    } else {
      // Fusionner les nouveaux personas avec les existants (max 3 au total)
      const existingPersonas = userResult.data.persona_score || []
      updatedPersonas = [...existingPersonas, ...personas].slice(0, 3)
      console.log('➕ Mode FUSION - Personas finaux:', updatedPersonas);
    }

    console.log('💾 Mise à jour Supabase - ID:', candidatId, 'persona_score:', updatedPersonas);
    
    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('candidats')
      .update({ persona_score: updatedPersonas })
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      console.error('❌ Détails de l\'erreur:', JSON.stringify(error, null, 2));
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! Données retournées:', data);
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updatePersonaScore:', error)
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error }
  }
}
