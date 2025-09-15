-- Create articles table with all necessary fields
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'fr',
  image_url TEXT,
  image_alt TEXT,
  position TEXT DEFAULT 'sidebar', -- 'hero', 'sidebar', 'normal'
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_language ON public.articles(language);
CREATE INDEX IF NOT EXISTS idx_articles_position ON public.articles(position);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);

-- Create categories table for theme colors
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3b82f6', -- Default blue color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, color) VALUES
  ('STEM', '#10b981'), -- Green
  ('POLITIQUE', '#ef4444'), -- Red  
  ('SOCIOLOGIE', '#8b5cf6'), -- Purple
  ('DIVERS', '#f59e0b') -- Orange
ON CONFLICT (name) DO NOTHING;

-- Create settings table for theme customization
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default theme setting
INSERT INTO public.settings (key, value) VALUES
  ('theme_color', '#3b82f6'),
  ('site_language', 'fr')
ON CONFLICT (key) DO NOTHING;
