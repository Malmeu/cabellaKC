-- =====================================================
-- SCHÉMA DE BASE DE DONNÉES POUR CABELLA KC
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer un admin par défaut (email: admin@cabella.com, mot de passe: admin123)
INSERT INTO admins (email, password, name) VALUES
  ('admin@cabella.com', 'admin123', 'Administrateur');

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready_for_pickup', 'completed')),
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Activer RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Politiques RLS - Lecture publique pour les produits
CREATE POLICY "Produits visibles par tous" ON products
  FOR SELECT USING (true);

-- Politiques RLS - Insertion/Modification/Suppression pour les produits (anon pour simplifier)
CREATE POLICY "Gestion des produits" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques RLS - Commandes accessibles par tous (pour simplifier)
CREATE POLICY "Gestion des commandes" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques RLS - Articles de commande
CREATE POLICY "Gestion des articles" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques RLS - Admins (lecture seule pour vérification login)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture admins" ON admins
  FOR SELECT USING (true);

-- =====================================================
-- DONNÉES DE DÉMONSTRATION (OPTIONNEL)
-- =====================================================

INSERT INTO products (name, category, price, description, image_url) VALUES
  ('Canapé Confort Plus', 'Canapé', 899.99, 'Canapé 3 places en tissu gris, confortable et moderne. Parfait pour votre salon.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'),
  ('Table Basse Scandinave', 'Table', 249.99, 'Table basse en bois de chêne massif, style scandinave épuré.', 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800'),
  ('Chaise Design Moderne', 'Chaise', 149.99, 'Chaise ergonomique avec assise rembourrée et pieds en métal noir.', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800'),
  ('Lit King Size Luxe', 'Lit', 1299.99, 'Lit king size avec tête de lit capitonnée en velours beige.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'),
  ('Armoire 3 Portes', 'Armoire', 699.99, 'Grande armoire avec 3 portes coulissantes et miroir intégré.', 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800'),
  ('Bureau Minimaliste', 'Bureau', 349.99, 'Bureau épuré en bois blanc avec tiroir de rangement.', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'),
  ('Étagère Murale', 'Étagère', 89.99, 'Étagère flottante en bois naturel, lot de 3 pièces.', 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'),
  ('Fauteuil Velours', 'Canapé', 449.99, 'Fauteuil confortable en velours rose poudré avec pieds dorés.', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800');
