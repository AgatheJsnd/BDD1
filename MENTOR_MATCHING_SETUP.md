# Configuration du Matching des Mentors

## 📋 Colonne `matched_mentor_id`

La colonne `matched_mentor_id` dans la table `candidats` doit être de type `bigint` pour stocker l'ID du mentor.

### Vérification dans Supabase :

1. **Allez dans votre projet Supabase** : https://supabase.com/dashboard
2. **Ouvrez le Table Editor** : Cliquez sur "Table Editor" dans le menu de gauche
3. **Sélectionnez la table `candidats`**
4. **Vérifiez la colonne `matched_mentor_id`** :
   - **Type** : `bigint` (entier)
   - **Nullable** : ✅ Oui (peut être NULL)
   - Si la colonne n'existe pas, créez-la avec ces paramètres

### Structure attendue :

```
Table: candidats
├── id (bigint)
├── Prénom (text)
├── NOM (text)
├── email (text)
├── persona_score (jsonb)
├── top_persona (text)
├── tech_apetite (text)
├── interest_sector (text)
├── proud_project (text)
├── hobbies (text)
├── english_level (text)
├── classe (text)
└── matched_mentor_id (bigint) ← ID du mentor (ou NULL)
```

## 🔍 Fonctionnement

Une fois la colonne configurée, le système fonctionnera automatiquement :

1. **Lors de la complétion du post-it bleu** : L'ID du mentor correspondant est automatiquement assigné
2. **Via le script** : Exécutez `npm run match-mentors` pour matcher tous les candidats

### Valeurs possibles dans `matched_mentor_id` :

- **ID du mentor** (ex: 1, 2, 3...) : Si un mentor avec un persona_score correspondant est trouvé
- **NULL** : Si le candidat n'a pas de persona_score ou si aucun mentor correspondant n'est trouvé

## 📊 Table `mentors` requise

Assurez-vous que la table `mentors` existe avec les colonnes suivantes :

- `id` (bigint)
- `prénom_nom` (text) - Le nom complet du mentor
- `persona_score` (jsonb) - Tableau des personas du mentor (même format que dans `candidats`)

## 🚀 Utilisation

### Matching automatique
Le matching se fait automatiquement quand un candidat complète le post-it bleu.

### Matching manuel (tous les candidats)
```bash
npm run match-mentors
```

Ce script va :
- Récupérer tous les candidats
- Récupérer tous les mentors
- Pour chaque candidat, trouver un mentor avec un persona_score correspondant
- Mettre à jour la colonne `matched_mentor_name`

## ✅ Vérification

Après avoir configuré la colonne et exécuté le script, vérifiez dans Supabase que :
- Les candidats avec un `persona_score` ont un ID de mentor (nombre entier) dans `matched_mentor_id`
- Les candidats sans `persona_score` ont `NULL` dans `matched_mentor_id`

## 🔗 Relation avec la table `mentors`

La colonne `matched_mentor_id` fait référence à l'ID dans la table `mentors`. Vous pouvez créer une relation (foreign key) dans Supabase :

```sql
ALTER TABLE candidats
ADD CONSTRAINT fk_matched_mentor
FOREIGN KEY (matched_mentor_id)
REFERENCES mentors(id);
```

Cela permettra de :
- Joindre facilement les candidats avec leurs mentors
- Valider que l'ID du mentor existe bien
- Faciliter les requêtes avec JOIN

