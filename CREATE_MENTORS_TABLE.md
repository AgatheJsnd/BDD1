# Création de la table `mentors` dans Supabase

## 📋 Structure de la table `mentors`

Pour que le matching des mentors fonctionne, vous devez créer la table `mentors` dans Supabase avec la structure suivante :

### Colonnes requises :

1. **`id`** (bigint, Primary Key, Auto-increment)
2. **`prénom_nom`** (text) - Le nom complet du mentor
3. **`persona_type`** (jsonb) - Tableau des personas du mentor (même format que `persona_score` dans `candidats`)

### SQL pour créer la table :

```sql
-- Créer la table mentors
CREATE TABLE IF NOT EXISTS public.mentors (
    id BIGSERIAL PRIMARY KEY,
    prénom_nom TEXT,
    persona_type JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre la lecture publique
CREATE POLICY "Permettre lecture publique mentors" ON public.mentors
    FOR SELECT
    USING (true);

-- Créer une politique pour permettre l'insertion (si nécessaire)
CREATE POLICY "Permettre insertion mentors" ON public.mentors
    FOR INSERT
    WITH CHECK (true);

-- Créer une politique pour permettre la mise à jour (si nécessaire)
CREATE POLICY "Permettre mise à jour mentors" ON public.mentors
    FOR UPDATE
    USING (true);
```

## 📝 Format des données dans `persona_type`

La colonne `persona_type` doit contenir un tableau JSON avec les mêmes valeurs que `persona_score` dans la table `candidats` :

Exemples de valeurs possibles :
- `"Finance shark"`
- `"Growth Hacker"`
- `"Data Detective"`
- `"Tech builder"`
- `"Visionnary Founder"`
- `"Creative Alchemist"`

### Exemple d'enregistrement :

```json
{
  "id": 1,
  "prénom_nom": "Jean Dupont",
  "persona_type": ["Finance shark", "Growth Hacker"]
}
```

## 🔍 Vérification

Après avoir créé la table, vous pouvez vérifier avec :

```sql
SELECT * FROM public.mentors;
```

## 🚀 Ajouter des mentors

Pour ajouter un mentor :

```sql
INSERT INTO public.mentors (prénom_nom, persona_type)
VALUES (
  'Jean Dupont',
  '["Finance shark", "Growth Hacker"]'::jsonb
);
```

Ou via l'interface Supabase :
1. Allez dans Table Editor > `mentors`
2. Cliquez sur "Insert" > "Insert row"
3. Remplissez :
   - `prénom_nom` : Le nom du mentor
   - `persona_type` : Un tableau JSON, ex: `["Finance shark"]`

## ✅ Test du matching

Une fois la table créée et des mentors ajoutés, exécutez :

```bash
npm run match-mentors
```

Le script devrait maintenant trouver les mentors correspondants et mettre à jour `matched_mentor_id` dans la table `candidats`.

