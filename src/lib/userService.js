import { supabase } from './supabase'

/**
 * Enregistrer un nouveau candidat dans Supabase
 * @param {Object} userData - Les données de l'utilisateur
 * @param {string} userData.firstName - Prénom
 * @param {string} userData.lastName - Nom
 * @param {string} userData.email - Email
 * @param {string} userData.classe - Classe
 * @returns {Promise} Résultat de l'insertion
 */
export async function saveUserData(userData) {
  try {
    if (!supabase) {
      console.error('❌ Supabase n\'est pas configuré')
      return { success: false, error: 'Supabase non configuré' }
    }

    // Vérifier si le candidat existe déjà
    const existingUser = await getUserByEmail(userData.email);
    
    const candidatData = {
      Prénom: userData.firstName,      // Mapping vers 'Prénom'
      NOM: userData.lastName,           // Mapping vers 'NOM'
      email: userData.email,
      classe: userData.classe || null,   // Enregistrer la classe
      created_at: existingUser.success && existingUser.data 
        ? existingUser.data.created_at 
        : new Date().toISOString(),
    };

    let data, error;

    if (existingUser.success && existingUser.data) {
      // Mettre à jour le candidat existant
      console.log('🔄 Candidat existant trouvé, mise à jour...');
      const { data: updateData, error: updateError } = await supabase
        .from('candidats')
        .update(candidatData)
        .eq('email', userData.email)
        .select();
      
      data = updateData;
      error = updateError;
    } else {
      // Créer un nouveau candidat
      console.log('➕ Création d\'un nouveau candidat...');
      const { data: insertData, error: insertError } = await supabase
        .from('candidats')
        .insert([candidatData])
        .select();
      
      data = insertData;
      error = insertError;
    }

    if (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error)
      return { success: false, error }
    }

    console.log('✅ Candidat enregistré avec succès:', data)
    if (data && data[0]) {
      console.log('✅ Classe enregistrée:', data[0].classe);
    }
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur:', error)
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
 * Calculer le persona le plus fréquent dans un tableau de personas
 * @param {Array<string>} personas - Tableau des personas
 * @returns {string|null} Le persona le plus fréquent, ou le premier si tous sont différents
 */
function calculateTopPersona(personas) {
  console.log('🔢 calculateTopPersona appelé avec:', personas);
  
  if (!personas || personas.length === 0) {
    console.warn('⚠️ calculateTopPersona: Tableau vide ou null');
    return null;
  }

  // Filtrer les personas valides (non null, non undefined, non vide)
  const validPersonas = personas.filter(p => p && String(p).trim() !== '');
  
  if (validPersonas.length === 0) {
    console.warn('⚠️ calculateTopPersona: Aucun persona valide trouvé');
    return null;
  }

  // Compter les occurrences de chaque persona
  const counts = {};
  validPersonas.forEach(persona => {
    const personaStr = String(persona).trim();
    counts[personaStr] = (counts[personaStr] || 0) + 1;
  });

  console.log('📊 Comptages des personas:', counts);

  // Trouver le persona avec le plus grand nombre d'occurrences
  let maxCount = 0;
  let topPersona = null;

  for (const [persona, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      topPersona = persona;
    }
  }

  console.log('🔝 Persona le plus fréquent:', topPersona, 'avec', maxCount, 'occurrence(s)');

  // Ne retourner un persona que s'il apparaît au moins 2 fois
  if (maxCount < 2) {
    console.log('📌 Aucun persona n\'apparaît au moins 2 fois, on retourne null');
    return null;
  }

  console.log('✅ calculateTopPersona retourne:', topPersona);
  return topPersona;
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

    // Calculer le persona le plus fréquent (top_persona)
    const topPersona = calculateTopPersona(updatedPersonas);
    console.log('🏆 Top persona calculé:', topPersona);
    console.log('🏆 Type de topPersona:', typeof topPersona);

    // Préparer les données à mettre à jour
    const updateData = { 
      persona_score: updatedPersonas
    };
    
    // Ajouter top_persona seulement s'il est valide (non null, non undefined, non vide)
    if (topPersona !== null && topPersona !== undefined && topPersona !== '') {
      updateData.top_persona = String(topPersona).trim(); // S'assurer que c'est une chaîne propre
      console.log('✅ top_persona sera enregistré:', updateData.top_persona);
    } else {
      console.warn('⚠️ topPersona est invalide:', topPersona, '- on ne l\'enregistre pas');
    }

    console.log('💾 Données à mettre à jour:', updateData);
    console.log('💾 Mise à jour Supabase - ID:', candidatId);
    
    // Mettre à jour dans Supabase (persona_score et top_persona)
    const { data, error } = await supabase
      .from('candidats')
      .update(updateData)
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      console.error('❌ Détails de l\'erreur:', JSON.stringify(error, null, 2));
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! Données retournées:', data);
    if (data && data[0]) {
      console.log('✅ persona_score après mise à jour:', data[0].persona_score);
      console.log('✅ top_persona après mise à jour:', data[0].top_persona);
    }

    // Mettre à jour automatiquement le mentor correspondant pour ce candidat
    console.log('🔍 Mise à jour du mentor correspondant...');
    try {
      const mentorsResult = await getAllMentors();
      if (!mentorsResult.success) {
        console.warn('⚠️ Impossible de récupérer les mentors:', mentorsResult.error);
        console.warn('💡 La table "mentors" n\'existe peut-être pas encore dans Supabase');
        console.warn('💡 Voir CREATE_MENTORS_TABLE.md pour créer la table');
        return { success: true, data }; // Continuer même si les mentors ne sont pas disponibles
      }
      
      if (mentorsResult.data && mentorsResult.data.length > 0) {
        const matchingMentorId = findMatchingMentor(updatedPersonas, mentorsResult.data);
        // matched_mentor_id est de type bigint, donc on met null si aucun mentor n'est trouvé
        const matchedMentorId = matchingMentorId || null;
        
        console.log(`🔍 Personas du candidat: [${updatedPersonas.join(', ')}]`);
        console.log(`🔍 Mentor trouvé: ${matchedMentorId ? `ID ${matchedMentorId}` : 'Aucun'}`);
        
        const { data: mentorUpdateData, error: mentorUpdateError } = await supabase
          .from('candidats')
          .update({ matched_mentor_id: matchedMentorId })
          .eq('id', candidatId)
          .select();

        if (mentorUpdateError) {
          console.error('❌ Erreur lors de la mise à jour du mentor:', mentorUpdateError);
          console.error('   Code:', mentorUpdateError.code);
          console.error('   Message:', mentorUpdateError.message);
        } else {
          console.log(`✅ Mentor mis à jour dans matched_mentor_id: ${matchedMentorId || 'NULL'}`);
          if (mentorUpdateData && mentorUpdateData[0]) {
            console.log(`✅ Vérification: matched_mentor_id = ${mentorUpdateData[0].matched_mentor_id}`);
          }
        }
      } else {
        console.warn('⚠️ Aucun mentor trouvé dans la base de données');
        console.warn('💡 Ajoutez des mentors avec leurs persona_type pour que le matching fonctionne');
      }
    } catch (mentorError) {
      console.error('❌ Erreur exception lors du matching du mentor:', mentorError);
      console.error('   Stack:', mentorError.stack);
      // Ne pas faire échouer la fonction principale si le matching échoue
    }

    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updatePersonaScore:', error)
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error }
  }
}

/**
 * Préparer le tech_apetite à partir des réponses (toujours les 3 résultats)
 * @param {Array<string>} techApetites - Tableau des tech_apetites (3 résultats)
 * @returns {string} Les 3 tech_apetites séparés par des virgules
 */
function prepareTechApetite(techApetites) {
  console.log('🔢 prepareTechApetite appelé avec:', techApetites);
  
  if (!techApetites || techApetites.length === 0) {
    console.warn('⚠️ prepareTechApetite: Tableau vide ou null');
    return null;
  }

  // Filtrer les valeurs valides
  const validTechApetites = techApetites.filter(t => t && String(t).trim() !== '');
  
  if (validTechApetites.length === 0) {
    console.warn('⚠️ prepareTechApetite: Aucun tech_apetite valide trouvé');
    return null;
  }

  // Toujours retourner les 3 résultats séparés par des virgules
  const result = validTechApetites.join(', ');
  console.log('📌 Tech_apetites préparés (les 3 résultats):', result);
  return result;
}

/**
 * Mettre à jour le tech_apetite d'un candidat par email
 * @param {string} email - L'email du candidat
 * @param {Array<string>} techApetites - Tableau des tech_apetites (max 3)
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updateTechApetite(email, techApetites) {
  console.log('🔧 updateTechApetite appelé avec:', { email, techApetites });
  
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
    let userResult = await getUserByEmail(email)
    console.log('📥 Résultat getUserByEmail:', userResult);
    
    // Si le candidat n'existe pas, essayer de le créer
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
    
    // Préparer le tech_apetite (toujours les 3 résultats)
    const finalTechApetite = prepareTechApetite(techApetites);
    console.log('🏆 Tech_apetite préparé (les 3 résultats):', finalTechApetite);

    // Préparer les données à mettre à jour
    const updateData = {};
    
    if (finalTechApetite !== null && finalTechApetite !== undefined) {
      updateData.tech_apetite = finalTechApetite;
      console.log('✅ tech_apetite sera enregistré:', updateData.tech_apetite);
    } else {
      console.warn('⚠️ finalTechApetite est invalide:', finalTechApetite);
    }

    console.log('💾 Données à mettre à jour:', updateData);
    
    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('candidats')
      .update(updateData)
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! Données retournées:', data);
    if (data && data[0]) {
      console.log('✅ tech_apetite après mise à jour:', data[0].tech_apetite);
    }
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updateTechApetite:', error)
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error }
  }
}

/**
 * Mettre à jour le interest_sector d'un candidat par email
 * @param {string} email - L'email du candidat
 * @param {string} interestSector - Le secteur d'intérêt sélectionné
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updateInterestSector(email, interestSector) {
  console.log('🔧 updateInterestSector appelé avec:', { email, interestSector });
  
  try {
    if (!supabase) {
      console.error('❌ Supabase n\'est pas configuré')
      return { success: false, error: 'Supabase non configuré' }
    }

    if (!email) {
      console.error('❌ Email manquant')
      return { success: false, error: 'Email manquant' }
    }

    if (!interestSector || interestSector.trim() === '') {
      console.warn('⚠️ Interest sector vide ou invalide')
      return { success: false, error: 'Interest sector manquant' }
    }

    console.log('🔍 Recherche du candidat avec email:', email);
    let userResult = await getUserByEmail(email)
    console.log('📥 Résultat getUserByEmail:', userResult);
    
    // Si le candidat n'existe pas, essayer de le créer
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
    
    const interestSectorValue = String(interestSector).trim();
    console.log('💼 Interest sector à enregistrer:', interestSectorValue);

    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('candidats')
      .update({ interest_sector: interestSectorValue })
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! Données retournées:', data);
    if (data && data[0]) {
      console.log('✅ interest_sector après mise à jour:', data[0].interest_sector);
    }
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updateInterestSector:', error)
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error }
  }
}

/**
 * Mettre à jour le proud_project d'un candidat par email
 * @param {string} email - L'email du candidat
 * @param {string} proudProject - Le texte du projet dont on est fier
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updateProudProject(email, proudProject) {
  console.log('🔧 updateProudProject appelé avec:', { email, proudProject });
  
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
    let userResult = await getUserByEmail(email)
    
    // Si le candidat n'existe pas, essayer de le créer
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

        userResult = { success: true, data: newData }
      } catch (createError) {
        console.error('❌ Erreur lors de la création:', createError)
        return { success: false, error: `Candidat non trouvé et erreur de création: ${createError.message}` }
      }
    }

    const candidatId = userResult.data.id
    
    // Enregistrer le texte tel quel, sans modification
    const proudProjectValue = proudProject || '';
    console.log('📝 Proud project à enregistrer (tel quel):', proudProjectValue);

    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('candidats')
      .update({ proud_project: proudProjectValue })
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! proud_project enregistré');
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updateProudProject:', error)
    return { success: false, error: error.message || error }
  }
}

/**
 * Mettre à jour le english_level d'un candidat par email
 * @param {string} email - L'email du candidat
 * @param {string} englishLevel - Le niveau d'anglais sélectionné
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updateEnglishLevel(email, englishLevel) {
  console.log('🔧 updateEnglishLevel appelé avec:', { email, englishLevel });
  
  try {
    if (!supabase) {
      console.error('❌ Supabase n\'est pas configuré')
      return { success: false, error: 'Supabase non configuré' }
    }

    if (!email) {
      console.error('❌ Email manquant')
      return { success: false, error: 'Email manquant' }
    }

    if (!englishLevel || englishLevel.trim() === '') {
      console.warn('⚠️ English level vide ou invalide')
      return { success: false, error: 'English level manquant' }
    }

    console.log('🔍 Recherche du candidat avec email:', email);
    let userResult = await getUserByEmail(email)
    console.log('📥 Résultat getUserByEmail:', userResult);
    
    // Si le candidat n'existe pas, essayer de le créer
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
    
    const englishLevelValue = String(englishLevel).trim();
    console.log('🌐 English level à enregistrer:', englishLevelValue);

    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('candidats')
      .update({ english_level: englishLevelValue })
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! Données retournées:', data);
    if (data && data[0]) {
      console.log('✅ english_level après mise à jour:', data[0].english_level);
    }
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updateEnglishLevel:', error)
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error }
  }
}

/**
 * Mettre à jour la classe d'un candidat par email
 * @param {string} email - L'email du candidat
 * @param {string} classe - La classe du candidat
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updateClasse(email, classe) {
  console.log('🔧 updateClasse appelé avec:', { email, classe });
  
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
    let userResult = await getUserByEmail(email)
    console.log('📥 Résultat getUserByEmail:', userResult);
    
    // Si le candidat n'existe pas, essayer de le créer
    if (!userResult.success || !userResult.data) {
      console.log('⚠️ Candidat non trouvé, création...');
      try {
        const { data: newData, error: insertError } = await supabase
          .from('candidats')
          .insert([{ email: email, classe: classe || null, created_at: new Date().toISOString() }])
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
    
    const classeValue = classe ? String(classe).trim() : null;
    console.log('🏫 Classe à enregistrer:', classeValue);

    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('candidats')
      .update({ classe: classeValue })
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! Données retournées:', data);
    if (data && data[0]) {
      console.log('✅ classe après mise à jour:', data[0].classe);
    }
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updateClasse:', error)
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error }
  }
}

/**
 * Récupérer tous les mentors
 * @returns {Promise} Liste des mentors
 */
export async function getAllMentors() {
  try {
    if (!supabase) {
      console.error('❌ Supabase n\'est pas configuré')
      return { success: false, error: 'Supabase non configuré' }
    }

    const { data, error } = await supabase
      .from('mentors')
      .select('*')

    if (error) {
      console.error('❌ Erreur lors de la récupération des mentors:', error)
      return { success: false, error }
    }

    console.log('✅ Mentors récupérés:', data?.length || 0)
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('❌ Erreur:', error)
    return { success: false, error }
  }
}

/**
 * Trouver un mentor correspondant au persona_score d'un candidat
 * @param {Array<string>} candidatPersonas - Tableau des personas du candidat
 * @param {Array} mentors - Liste de tous les mentors
 * @returns {number|null} L'ID du mentor correspondant, ou null si aucun
 */
function findMatchingMentor(candidatPersonas, mentors) {
  if (!candidatPersonas || candidatPersonas.length === 0) {
    return null;
  }

  // Normaliser les personas du candidat (enlever espaces, convertir en string)
  const normalizedCandidatPersonas = candidatPersonas
    .filter(p => p && String(p).trim() !== '')
    .map(p => String(p).trim());

  if (normalizedCandidatPersonas.length === 0) {
    return null;
  }

  // Chercher un mentor qui a au moins un persona en commun
  // La table mentors utilise persona_type au lieu de persona_score
  for (const mentor of mentors) {
    // Essayer persona_type d'abord, puis persona_score en fallback
    const mentorPersonas = mentor.persona_type || mentor.persona_score;
    
    if (!mentorPersonas || !Array.isArray(mentorPersonas)) {
      continue;
    }

    // Normaliser les personas du mentor
    const normalizedMentorPersonas = mentorPersonas
      .filter(p => p && String(p).trim() !== '')
      .map(p => String(p).trim());

    // Vérifier s'il y a au moins un persona en commun
    const hasCommonPersona = normalizedCandidatPersonas.some(cp => 
      normalizedMentorPersonas.includes(cp)
    );

    if (hasCommonPersona && mentor.id) {
      console.log(`✅ Mentor trouvé: ID ${mentor.id} (${mentor.prénom_nom || 'sans nom'}) - personas communs`);
      console.log(`   Candidat: [${normalizedCandidatPersonas.join(', ')}] ↔ Mentor: [${normalizedMentorPersonas.join(', ')}]`);
      return mentor.id; // Retourner l'ID du mentor au lieu du nom
    }
  }

  return null;
}

/**
 * Associer automatiquement les mentors aux candidats selon leur persona_score
 * @returns {Promise} Résultat de l'association
 */
export async function matchMentorsToCandidats() {
  console.log('🔍 ===== DÉBUT MATCHING MENTORS =====');
  
  try {
    if (!supabase) {
      console.error('❌ Supabase n\'est pas configuré')
      return { success: false, error: 'Supabase non configuré' }
    }

    // Récupérer tous les candidats
    console.log('📋 Récupération de tous les candidats...');
    const candidatsResult = await getAllUsers();
    if (!candidatsResult.success || !candidatsResult.data) {
      console.error('❌ Impossible de récupérer les candidats');
      return { success: false, error: 'Impossible de récupérer les candidats' };
    }

    const candidats = candidatsResult.data;
    console.log(`📊 ${candidats.length} candidat(s) trouvé(s)`);

    // Récupérer tous les mentors
    console.log('👥 Récupération de tous les mentors...');
    const mentorsResult = await getAllMentors();
    if (!mentorsResult.success) {
      console.error('❌ Impossible de récupérer les mentors');
      return { success: false, error: 'Impossible de récupérer les mentors' };
    }

    const mentors = mentorsResult.data || [];
    console.log(`👥 ${mentors.length} mentor(s) trouvé(s)`);

    if (mentors.length === 0) {
      console.warn('⚠️ Aucun mentor trouvé dans la base de données');
    }

    // Pour chaque candidat, trouver un mentor correspondant
    let matchedCount = 0;
    let undeterminedCount = 0;
    let updatedCount = 0;

    for (const candidat of candidats) {
      const candidatId = candidat.id;
      const candidatEmail = candidat.email;
      const candidatPersonas = candidat.persona_score;

      console.log(`\n🔍 Traitement du candidat ${candidatId} (${candidatEmail})`);

      let matchedMentorId = null;

      // Si le candidat n'a pas de persona_score, mettre null
      if (!candidatPersonas || !Array.isArray(candidatPersonas) || candidatPersonas.length === 0) {
        console.log('  ⚠️ Aucun persona_score → null');
        matchedMentorId = null;
        undeterminedCount++;
      } else {
        // Chercher un mentor correspondant (retourne l'ID du mentor)
        const matchingMentorId = findMatchingMentor(candidatPersonas, mentors);
        if (matchingMentorId) {
          matchedMentorId = matchingMentorId;
          matchedCount++;
          console.log(`  ✅ Mentor trouvé: ID ${matchingMentorId}`);
        } else {
          matchedMentorId = null;
          undeterminedCount++;
          console.log('  ⚠️ Aucun mentor correspondant → null');
        }
      }

      // Mettre à jour le candidat avec l'ID du mentor dans matched_mentor_id
      const { data, error } = await supabase
        .from('candidats')
        .update({ matched_mentor_id: matchedMentorId })
        .eq('id', candidatId)
        .select();

      if (error) {
        console.error(`  ❌ Erreur lors de la mise à jour du candidat ${candidatId}:`, error);
      } else {
        updatedCount++;
        console.log(`  ✅ Candidat ${candidatId} mis à jour avec: ${matchedMentorId}`);
      }
    }

    console.log('\n📊 ===== RÉSUMÉ DU MATCHING =====');
    console.log(`✅ Candidats avec mentor trouvé: ${matchedCount}`);
    console.log(`⚠️ Candidats "à déterminer": ${undeterminedCount}`);
    console.log(`💾 Candidats mis à jour: ${updatedCount}/${candidats.length}`);
    console.log('🔍 ===== FIN MATCHING MENTORS =====\n');

    return {
      success: true,
      data: {
        total: candidats.length,
        matched: matchedCount,
        undetermined: undeterminedCount,
        updated: updatedCount
      }
    };
  } catch (error) {
    console.error('❌ Erreur exception dans matchMentorsToCandidats:', error);
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error };
  }
}

/**
 * Mettre à jour le hobbies d'un candidat par email
 * @param {string} email - L'email du candidat
 * @param {string} hobbies - Le texte des hobbies/passions
 * @returns {Promise} Résultat de la mise à jour
 */
export async function updateHobbies(email, hobbies) {
  console.log('🔧 updateHobbies appelé avec:', { email, hobbies });
  
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
    let userResult = await getUserByEmail(email)
    
    // Si le candidat n'existe pas, essayer de le créer
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

        userResult = { success: true, data: newData }
      } catch (createError) {
        console.error('❌ Erreur lors de la création:', createError)
        return { success: false, error: `Candidat non trouvé et erreur de création: ${createError.message}` }
      }
    }

    const candidatId = userResult.data.id
    
    // Enregistrer le texte tel quel, sans modification
    const hobbiesValue = hobbies || '';
    console.log('🎨 Hobbies à enregistrer (tel quel):', hobbiesValue);

    // Mettre à jour dans Supabase
    const { data, error } = await supabase
      .from('candidats')
      .update({ hobbies: hobbiesValue })
      .eq('id', candidatId)
      .select()

    if (error) {
      console.error('❌ Erreur Supabase lors de la mise à jour:', error);
      return { success: false, error }
    }
    
    console.log('✅ Mise à jour réussie! hobbies enregistré');
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur exception dans updateHobbies:', error)
    return { success: false, error: error.message || error }
  }
}
