-- =====================================================
-- MISE À JOUR : Ajout de la table admins
-- À exécuter si vous avez déjà exécuté le premier script
-- =====================================================

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Politiques RLS pour admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Supprimer la politique si elle existe déjà (pour éviter l'erreur)
DROP POLICY IF EXISTS "Lecture admins" ON admins;

-- Créer la politique
CREATE POLICY "Lecture admins" ON admins
  FOR SELECT USING (true);

-- Insérer un admin par défaut (seulement s'il n'existe pas)
INSERT INTO admins (email, password, name) 
VALUES ('admin@cabella.com', 'admin123', 'Administrateur')
ON CONFLICT (email) DO NOTHING;
