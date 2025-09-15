-- Migrate existing JSON articles to database
-- This will be populated by reading the existing JSON files

-- AI Breakthrough in Medicine
INSERT INTO public.articles (title, content, excerpt, author, category, language, image_url, image_alt, position) VALUES
(
  'AI Breakthrough in Medicine',
  'Artificial intelligence continues to revolutionize healthcare with groundbreaking discoveries in diagnostic medicine. Recent developments show AI systems can now detect diseases with unprecedented accuracy, potentially saving millions of lives worldwide. The technology represents a significant leap forward in medical science.',
  'AI systems achieve unprecedented accuracy in medical diagnostics, revolutionizing healthcare worldwide.',
  'Aymen Zlitni',
  'STEM',
  'fr',
  '/placeholder.svg?height=400&width=600',
  'AI medical technology illustration',
  'hero'
);

-- Climate Change Research  
INSERT INTO public.articles (title, content, excerpt, author, category, language, image_url, image_alt, position) VALUES
(
  'Climate Change Research Reveals Alarming Trends',
  'New climate research data shows accelerating changes in global weather patterns. Scientists warn of unprecedented environmental shifts that could reshape our planet within decades. The findings emphasize the urgent need for immediate climate action.',
  'Latest climate research reveals accelerating environmental changes requiring immediate global action.',
  'Baraa Lehnid',
  'STEM',
  'fr',
  '/placeholder.svg?height=400&width=600',
  'Climate change research visualization',
  'sidebar'
);

-- Community Garden Initiative
INSERT INTO public.articles (title, content, excerpt, author, category, language, image_url, image_alt, position) VALUES
(
  'Community Garden Initiative Transforms Neighborhoods',
  'Local communities are embracing urban gardening as a solution to food security and social connection. These green spaces not only provide fresh produce but also strengthen community bonds and improve mental health.',
  'Urban gardening initiatives strengthen communities while addressing food security challenges.',
  'Aymen Zlitni',
  'SOCIOLOGIE',
  'fr',
  '/placeholder.svg?height=400&width=600',
  'Community garden with people working together',
  'sidebar'
);

-- Local Election Results
INSERT INTO public.articles (title, content, excerpt, author, category, language, image_url, image_alt, position) VALUES
(
  'Local Election Results Shape Future Policies',
  'Recent local elections have brought significant changes to municipal leadership. The new representatives promise innovative approaches to urban development, education funding, and environmental protection.',
  'New local leadership emerges with promises of innovative policy approaches.',
  'Baraa Lehnid',
  'POLITIQUE',
  'fr',
  '/placeholder.svg?height=400&width=600',
  'Election voting and democracy illustration',
  'sidebar'
);
