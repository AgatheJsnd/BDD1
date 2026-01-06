-- Script SQL pour créer la table mentors dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

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

-- Exemple d'insertion de mentors
-- Décommentez et modifiez selon vos besoins

/*
INSERT INTO public.mentors (prénom_nom, persona_type) VALUES
('Jean Dupont', '["Finance shark", "Growth Hacker"]'::jsonb),
('Marie Martin', '["Data Detective", "Tech builder"]'::jsonb),
('Pierre Durand', '["Visionnary Founder", "Creative Alchemist"]'::jsonb);
*/

