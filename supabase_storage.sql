-- =====================================================
-- CONFIGURATION DU STORAGE POUR LES IMAGES
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Créer le bucket pour les images de produits
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre la lecture publique des images
CREATE POLICY "Images publiques" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'products');

-- Politique pour permettre l'upload (pour tous, simplifié)
CREATE POLICY "Upload images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'products');

-- Politique pour permettre la mise à jour
CREATE POLICY "Update images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'products');

-- Politique pour permettre la suppression
CREATE POLICY "Delete images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'products');
