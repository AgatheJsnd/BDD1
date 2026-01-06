const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMentorsTable() {
  console.log('🔍 Vérification de la table mentors...\n');
  
  try {
    // Essayer de récupérer les mentors
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Erreur:', error);
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      
      if (error.code === 'PGRST205') {
        console.error('\n💡 La table "mentors" n\'existe pas dans Supabase.');
        console.error('💡 Vous devez créer la table avec les colonnes suivantes:');
        console.error('   - id (bigint, Primary Key)');
        console.error('   - prénom_nom (text)');
        console.error('   - persona_type (jsonb)');
        console.error('\n📝 Voir CREATE_MENTORS_TABLE.md pour les instructions SQL');
      }
      return;
    }

    console.log(`✅ Table mentors trouvée !`);
    console.log(`📊 ${data.length} mentor(s) récupéré(s)\n`);

    if (data.length === 0) {
      console.warn('⚠️ La table existe mais est vide.');
      console.warn('💡 Ajoutez des mentors avec leurs persona_type pour que le matching fonctionne.\n');
      return;
    }

    console.log('📋 Structure des mentors:');
    data.forEach((mentor, index) => {
      console.log(`\n${index + 1}. Mentor ID ${mentor.id}:`);
      console.log(`   Nom: ${mentor.prénom_nom || 'N/A'}`);
      console.log(`   persona_type: ${JSON.stringify(mentor.persona_type)}`);
      console.log(`   Type de persona_type: ${typeof mentor.persona_type}`);
      if (Array.isArray(mentor.persona_type)) {
        console.log(`   ✅ persona_type est un tableau (correct)`);
      } else {
        console.log(`   ⚠️ persona_type n'est pas un tableau (devrait être un JSON array)`);
      }
    });

    // Vérifier quelques candidats
    console.log('\n\n🔍 Vérification de quelques candidats...\n');
    const { data: candidats, error: candidatsError } = await supabase
      .from('candidats')
      .select('id, email, persona_score, matched_mentor_id')
      .not('persona_score', 'is', null)
      .limit(5);

    if (candidatsError) {
      console.error('❌ Erreur lors de la récupération des candidats:', candidatsError);
      return;
    }

    console.log(`📊 ${candidats.length} candidat(s) avec persona_score trouvé(s):\n`);
    candidats.forEach((candidat, index) => {
      console.log(`${index + 1}. Candidat ID ${candidat.id} (${candidat.email}):`);
      console.log(`   persona_score: ${JSON.stringify(candidat.persona_score)}`);
      console.log(`   matched_mentor_id: ${candidat.matched_mentor_id || 'NULL'}`);
      
      // Vérifier s'il y a un match possible
      if (Array.isArray(candidat.persona_score) && candidat.persona_score.length > 0) {
        const candidatPersonas = candidat.persona_score.map(p => String(p).trim());
        const matchingMentors = data.filter(mentor => {
          if (!Array.isArray(mentor.persona_type)) return false;
          const mentorPersonas = mentor.persona_type.map(p => String(p).trim());
          return candidatPersonas.some(cp => mentorPersonas.includes(cp));
        });
        
        if (matchingMentors.length > 0) {
          console.log(`   ✅ ${matchingMentors.length} mentor(s) correspondant(s) trouvé(s):`);
          matchingMentors.forEach(m => {
            console.log(`      - Mentor ID ${m.id} (${m.prénom_nom})`);
          });
        } else {
          console.log(`   ⚠️ Aucun mentor correspondant trouvé`);
        }
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur exception:', error);
  }
}

checkMentorsTable()
  .then(() => {
    console.log('\n✅ Vérification terminée');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });

