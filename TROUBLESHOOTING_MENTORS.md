# 🔧 Résolution des problèmes - Matching des Mentors

## ❌ Problème : Aucun résultat dans `matched_mentor_id`

### Étape 1 : Vérifier que la table `mentors` existe

Exécutez le script de diagnostic :
```bash
npm run check-mentors
```

Si vous voyez l'erreur `Could not find the table 'public.mentors'`, la table n'existe pas.

### Étape 2 : Créer la table `mentors`

1. **Allez dans Supabase** : https://supabase.com/dashboard
2. **Ouvrez l'éditeur SQL** : SQL Editor dans le menu de gauche
3. **Copiez et exécutez le script** : `scripts/create-mentors-table.sql`

Ou créez la table manuellement :
- Table Editor > New Table
- Nom : `mentors`
- Colonnes :
  - `id` : bigint, Primary Key, Auto-increment
  - `prénom_nom` : text
  - `persona_type` : jsonb
  - `created_at` : timestamptz (optionnel)

### Étape 3 : Ajouter des mentors

Dans Supabase Table Editor > `mentors` > Insert row :

**Exemple 1** :
- `prénom_nom` : "Jean Dupont"
- `persona_type` : `["Finance shark", "Growth Hacker"]`

**Exemple 2** :
- `prénom_nom` : "Marie Martin"
- `persona_type` : `["Data Detective", "Tech builder"]`

⚠️ **Important** : `persona_type` doit être un tableau JSON avec les mêmes valeurs que dans `persona_score` des candidats :
- "Finance shark"
- "Growth Hacker"
- "Data Detective"
- "Tech builder"
- "Visionnary Founder"
- "Creative Alchemist"

### Étape 4 : Vérifier les candidats

Assurez-vous que les candidats ont un `persona_score` rempli :
```sql
SELECT id, email, persona_score, matched_mentor_id 
FROM candidats 
WHERE persona_score IS NOT NULL 
LIMIT 10;
```

### Étape 5 : Exécuter le matching

```bash
npm run match-mentors
```

Le script devrait maintenant :
1. Récupérer tous les candidats
2. Récupérer tous les mentors
3. Pour chaque candidat, trouver un mentor avec un persona en commun
4. Mettre à jour `matched_mentor_id` avec l'ID du mentor

### Étape 6 : Vérifier les résultats

```sql
SELECT 
  c.id, 
  c.email, 
  c.persona_score, 
  c.matched_mentor_id,
  m.prénom_nom as mentor_nom
FROM candidats c
LEFT JOIN mentors m ON c.matched_mentor_id = m.id
WHERE c.persona_score IS NOT NULL
LIMIT 20;
```

## 🔍 Vérifications supplémentaires

### Vérifier que les personas correspondent

Les personas dans `persona_type` (mentors) doivent correspondre exactement aux personas dans `persona_score` (candidats).

**Exemple de correspondance** :
- Candidat : `["Finance shark", "Data Detective"]`
- Mentor : `["Finance shark", "Growth Hacker"]`
- ✅ Match trouvé (au moins "Finance shark" en commun)

### Vérifier les permissions RLS

Assurez-vous que les politiques RLS permettent la lecture de la table `mentors` :
```sql
SELECT * FROM pg_policies WHERE tablename = 'mentors';
```

Si aucune politique n'existe, créez-en une :
```sql
CREATE POLICY "Permettre lecture publique mentors" ON public.mentors
    FOR SELECT
    USING (true);
```

## 🐛 Logs de débogage

Le code affiche maintenant des logs détaillés :
- Lors de la mise à jour de `persona_score` : vérifiez la console du navigateur
- Lors de l'exécution du script : vérifiez la sortie de `npm run match-mentors`

Si vous voyez `✅ Mentor mis à jour: ID X`, le matching fonctionne !

## 📞 Si le problème persiste

1. Vérifiez que la table `mentors` existe et contient des données
2. Vérifiez que les candidats ont un `persona_score` rempli
3. Vérifiez que les personas correspondent (même format, même casse)
4. Exécutez `npm run check-mentors` pour voir la structure exacte
5. Vérifiez les logs dans la console du navigateur lors de la complétion du post-it bleu

