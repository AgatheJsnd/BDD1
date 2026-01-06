const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement depuis .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('💡 Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Récupérer tous les candidats
 */
async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('candidats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la récupération des candidats:', error);
      throw error;
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('❌ Erreur:', error);
    return { success: false, error };
  }
}

/**
 * Récupérer tous les mentors
 */
async function getAllMentors() {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*');

    if (error) {
      console.error('❌ Erreur lors de la récupération des mentors:', error);
      return { success: false, error };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('❌ Erreur:', error);
    return { success: false, error };
  }
}

/**
 * Trouver un mentor correspondant au persona_score d'un candidat
 * Retourne l'ID du mentor (bigint) au lieu du nom
 */
function findMatchingMentor(candidatPersonas, mentors) {
  if (!candidatPersonas || candidatPersonas.length === 0) {
    return null;
  }

  // Normaliser les personas du candidat
  const normalizedCandidatPersonas = candidatPersonas
    .filter(p => p && String(p).trim() !== '')
    .map(p => String(p).trim());

  if (normalizedCandidatPersonas.length === 0) {
    return null;
  }

  // Chercher un mentor qui a au moins un persona en commun
  // La table mentors utilise probablement persona_type au lieu de persona_score
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
      console.log(`  ✅ Match trouvé: Candidat [${normalizedCandidatPersonas.join(', ')}] ↔ Mentor ID ${mentor.id} [${normalizedMentorPersonas.join(', ')}]`);
      return mentor.id; // Retourner l'ID du mentor au lieu du nom
    }
  }

  return null;
}

/**
 * Associer automatiquement les mentors aux candidats
 */
async function matchMentorsToCandidats() {
  console.log('🔍 ===== DÉBUT MATCHING MENTORS =====\n');
  
  try {
    // Récupérer tous les candidats
    console.log('📋 Récupération de tous les candidats...');
    const candidatsResult = await getAllUsers();
    if (!candidatsResult.success || !candidatsResult.data) {
      console.error('❌ Impossible de récupérer les candidats');
      return { success: false, error: 'Impossible de récupérer les candidats' };
    }

    const candidats = candidatsResult.data;
    console.log(`📊 ${candidats.length} candidat(s) trouvé(s)\n`);

    // Récupérer tous les mentors
    console.log('👥 Récupération de tous les mentors...');
    const mentorsResult = await getAllMentors();
    
    let mentors = [];
    if (!mentorsResult.success) {
      console.error('❌ Erreur lors de la récupération des mentors:', mentorsResult.error);
      console.error('💡 Vérifiez que la table "mentors" existe dans Supabase');
      console.error('💡 Vérifiez que la table a les colonnes: id, persona_type (ou persona_score)\n');
      return { success: false, error: 'Impossible de récupérer les mentors' };
    } else {
      mentors = mentorsResult.data || [];
      console.log(`👥 ${mentors.length} mentor(s) trouvé(s)\n`);

      if (mentors.length === 0) {
        console.warn('⚠️ Aucun mentor trouvé dans la base de données\n');
      } else {
        // Afficher la structure du premier mentor pour déboguer
        console.log('📋 Structure du premier mentor (exemple):');
        console.log(JSON.stringify(mentors[0], null, 2));
        console.log('');
      }
    }

    // Pour chaque candidat, trouver un mentor correspondant
    let matchedCount = 0;
    let undeterminedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const candidat of candidats) {
      const candidatId = candidat.id;
      const candidatEmail = candidat.email;
      const candidatPersonas = candidat.persona_score;

      let matchedMentorId = null;

      // Si le candidat n'a pas de persona_score, mettre null
      if (!candidatPersonas || !Array.isArray(candidatPersonas) || candidatPersonas.length === 0) {
        matchedMentorId = null;
        undeterminedCount++;
        if (candidats.indexOf(candidat) < 5) { // Afficher seulement les 5 premiers pour le debug
          console.log(`  ⚠️ Candidat ${candidatId} (${candidatEmail}) → null (pas de persona_score)`);
        }
      } else {
        // Chercher un mentor correspondant (retourne l'ID du mentor)
        const matchingMentorId = findMatchingMentor(candidatPersonas, mentors);
        if (matchingMentorId) {
          matchedMentorId = matchingMentorId;
          matchedCount++;
          if (candidats.indexOf(candidat) < 5) { // Afficher seulement les 5 premiers pour le debug
            console.log(`  ✅ Candidat ${candidatId} (${candidatEmail}) → Mentor ID ${matchingMentorId}`);
          }
        } else {
          matchedMentorId = null;
          undeterminedCount++;
          if (candidats.indexOf(candidat) < 5) { // Afficher seulement les 5 premiers pour le debug
            console.log(`  ⚠️ Candidat ${candidatId} (${candidatEmail}) → null (aucun mentor correspondant)`);
            console.log(`     Personas du candidat: [${candidatPersonas.join(', ')}]`);
          }
        }
      }

      // Mettre à jour le candidat avec l'ID du mentor dans matched_mentor_id
      const { data, error } = await supabase
        .from('candidats')
        .update({ matched_mentor_id: matchedMentorId })
        .eq('id', candidatId)
        .select();

      if (error) {
        console.error(`  ❌ Erreur pour candidat ${candidatId} (${candidatEmail}):`, error.message);
        errorCount++;
      } else {
        updatedCount++;
        const status = matchedMentorId === 'à déterminer' ? '⚠️' : '✅';
        console.log(`  ${status} Candidat ${candidatId} (${candidatEmail}) → ${matchedMentorId}`);
      }
    }

    console.log('\n📊 ===== RÉSUMÉ DU MATCHING =====');
    console.log(`✅ Candidats avec mentor trouvé: ${matchedCount}`);
    console.log(`⚠️ Candidats "à déterminer": ${undeterminedCount}`);
    console.log(`💾 Candidats mis à jour avec succès: ${updatedCount}/${candidats.length}`);
    if (errorCount > 0) {
      console.log(`❌ Erreurs: ${errorCount}`);
    }
    console.log('🔍 ===== FIN MATCHING MENTORS =====\n');

    return {
      success: true,
      data: {
        total: candidats.length,
        matched: matchedCount,
        undetermined: undeterminedCount,
        updated: updatedCount,
        errors: errorCount
      }
    };
  } catch (error) {
    console.error('❌ Erreur exception dans matchMentorsToCandidats:', error);
    console.error('❌ Stack:', error.stack);
    return { success: false, error: error.message || error };
  }
}

// Exécuter le matching
matchMentorsToCandidats()
  .then((result) => {
    if (result.success) {
      console.log('✅ Matching terminé avec succès !');
      process.exit(0);
    } else {
      console.error('❌ Erreur lors du matching:', result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });

