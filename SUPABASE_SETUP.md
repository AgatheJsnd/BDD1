# Configuration Supabase pour BDD1

## 📋 Étapes de configuration

### 1. Créer un compte Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet

### 2. Vérifier la table `candidats`

✅ **Votre table `candidats` existe déjà !**

Structure actuelle :
- `id` (int8) - Identifiant unique
- `Prénom` (text) - Prénom du candidat
- `NOM` (text) - Nom du candidat
- `email` (text) - Email du candidat
- `created_at` (timestamptz) - Date de création
- `persona_score` (jsonb) - Scores de personnalité
- `top_persona` (text) - Personnalité dominante
- `tech_apetite` (text) - Appétence tech
- `interest_sector` (text) - Secteur d'intérêt
- `proud_project` (text) - Projet dont on est fier
- `hobbies` (text) - Loisirs
- `matched_mentor_id` (int8) - ID du mentor associé

**Assurez-vous que les Row Level Security policies sont configurées** :

```sql
-- Vérifier si RLS est activé
ALTER TABLE candidats ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'insertion publique
CREATE POLICY "Permettre insertion publique" ON candidats
  FOR INSERT
  WITH CHECK (true);

-- Créer une politique pour permettre la lecture publique
CREATE POLICY "Permettre lecture publique" ON candidats
  FOR SELECT
  USING (true);
```

### 3. Récupérer vos clés API
1. Allez dans `Settings` > `API`
2. Copiez votre **Project URL** (ex: `https://xxxxx.supabase.co`)
3. Copiez votre **anon/public key**

### 4. Configurer l'application

**⚠️ IMPORTANT : Ne committez JAMAIS vos clés sur GitHub !**

1. **Copiez le fichier `.env.example` en `.env`** :
   ```bash
   cp .env.example .env
   ```

2. **Ouvrez le fichier `.env`** et remplacez les valeurs par vos vraies clés :
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Vérifiez que `.env` est dans `.gitignore`** (déjà fait ✅)

Le fichier `.env` est automatiquement ignoré par Git et ne sera jamais committé.

### 5. Tester l'application
1. Lancez l'application : `npm run dev`
2. Remplissez le formulaire de connexion
3. Vérifiez dans Supabase > Table Editor > users que les données sont bien enregistrées

## 🔍 Fonctions disponibles

### `saveUserData(userData)`
Enregistre un candidat dans Supabase.

```javascript
import { saveUserData } from './lib/userService'

const result = await saveUserData({
  firstName: 'John',  // Sera enregistré dans 'Prénom'
  lastName: 'Doe',    // Sera enregistré dans 'NOM'
  email: 'john@example.com'
})
```

### `getAllUsers()`
Récupère tous les candidats.

```javascript
import { getAllUsers } from './lib/userService'

const result = await getAllUsers()
console.log(result.data) // Liste des candidats
```

### `getUserByEmail(email)`
Récupère un candidat par son email.

```javascript
import { getUserByEmail } from './lib/userService'

const result = await getUserByEmail('john@example.com')
console.log(result.data) // Données du candidat
```

### `updateCandidat(id, updates)`
Met à jour les informations d'un candidat.

```javascript
import { updateCandidat } from './lib/userService'

const result = await updateCandidat(1, {
  tech_apetite: 'High',
  interest_sector: 'Tech',
  top_persona: 'Innovateur'
})
```

## 🔒 Sécurité
- Les clés API ne doivent JAMAIS être commitées dans Git
- Créez un fichier `.env` pour les variables sensibles (optionnel)
- Les Row Level Security policies protègent vos données

## ✅ Vérification
Pour tester si tout fonctionne, ouvrez la console du navigateur après connexion :
- Vous devriez voir "Candidat enregistré avec succès"
- Vérifiez dans Supabase Table Editor > `candidats` que le candidat est bien enregistré
- Les champs `Prénom`, `NOM` et `email` doivent être remplis
- Les autres champs (`persona_score`, `top_persona`, etc.) seront NULL jusqu'à ce qu'ils soient remplis

