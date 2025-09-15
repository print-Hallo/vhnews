-- Added positioning and language fields to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS position VARCHAR(20) DEFAULT 'normal' CHECK (position IN ('hero', 'sidebar', 'normal')),
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'fr' CHECK (language IN ('fr', 'en'));

-- Create index for better performance on position queries
CREATE INDEX IF NOT EXISTS idx_articles_position ON articles(position);
CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);

-- Update existing articles to have default values
UPDATE articles 
SET position = 'normal', language = 'fr' 
WHERE position IS NULL OR language IS NULL;
