# 🔒 Sécurité - Guide des bonnes pratiques

## ⚠️ NE JAMAIS COMMITTER CES FICHIERS

Les fichiers suivants contiennent des informations sensibles et ne doivent **JAMAIS** être committés sur GitHub :

- ✅ `.env` → **Ignoré par Git** (dans `.gitignore`)
- ✅ `.env.local` → **Ignoré par Git**
- ✅ `.env.production` → **Ignoré par Git**

## ✅ Fichiers sûrs à committer

- ✅ `.env.example` → Modèle sans vraies clés
- ✅ `src/lib/supabase.js` → Utilise les variables d'environnement
- ✅ `src/lib/userService.js` → Pas de clés hardcodées

## 🚨 Si vous avez accidentellement committé vos clés

1. **REGÉNÉREZ IMMÉDIATEMENT vos clés** dans Supabase
2. Supprimez le commit avec les clés exposées
3. Mettez à jour votre fichier `.env` local

## 📝 Comment partager le projet

1. **Committez** `.env.example` (le modèle)
2. **Ne committez PAS** `.env` (vos vraies clés)
3. **Partagez** les instructions dans `SUPABASE_SETUP.md`

Les autres développeurs devront :
1. Cloner le projet
2. Copier `.env.example` en `.env`
3. Remplir leurs propres clés Supabase

## 🔐 Vérification rapide

Avant de committer, vérifiez :

```bash
# Vérifier que .env est ignoré
git status

# .env ne doit PAS apparaître dans la liste
# Si .env apparaît en rouge, c'est un problème !
```

## 📚 En savoir plus

- [Sécurité Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Variables d'environnement Vite](https://vitejs.dev/guide/env-and-mode.html)

