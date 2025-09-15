# News Site - NYT-Inspired CMS

A modern news website built with Next.js 14.2.5, featuring a file-based CMS using JSON storage and a comprehensive admin dashboard.

## Features

### Frontend
- **NYT-inspired design** with responsive 3-column layout
- **Server-side rendering** with Next.js App Router
- **Infinite scroll** and pagination support
- **Search functionality** with full-text search
- **Category and tag filtering**
- **Social sharing** integration
- **SEO optimized** with structured data and meta tags

### Content Management
- **File-based CMS** using JSON storage (no database required)
- **Markdown editor** with live preview
- **Image upload** and management system
- **Article scheduling** and draft management
- **Auto-generated** read time and word count
- **Tag and category** organization

### Admin Dashboard
- **Secure authentication** with password protection
- **Article CRUD operations** with rich editor
- **Image manager** with upload and organization
- **Publishing workflow** (draft → published → scheduled)
- **Search and filtering** for content management
- **Responsive admin interface**

### SEO & Performance
- **Automatic sitemap** generation
- **RSS and Atom feeds**
- **Structured data** (JSON-LD) for articles
- **Open Graph** and Twitter Card meta tags
- **Optimized images** with Next.js Image component
- **Caching headers** for static assets

## Tech Stack

- **Framework**: Next.js 14.2.5 (JavaScript)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Content**: Markdown with remark/rehype processing
- **Storage**: File-based JSON storage
- **Authentication**: Simple password-based auth
- **Testing**: Jest with React Testing Library
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd news-site
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file:
   \`\`\`env
   ADMIN_PASSWORD=your-secure-password
   BASE_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

### Sample Data

The project includes 8 sample articles across all categories (STEM, POLITIQUE, SOCIOLOGIE, DIVERS) to demonstrate the functionality.

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and editor
│   ├── articles/          # Article pages
│   ├── category/          # Category pages
│   ├── tag/               # Tag pages
│   ├── search/            # Search functionality
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
├── data/                  # JSON article storage
│   └── articles/          # Individual article files
├── public/                # Static assets
│   └── uploads/           # Uploaded images
└── __tests__/             # Test files
\`\`\`

## Usage

### Creating Articles

1. Access the admin dashboard at `/admin`
2. Click "New Article" to open the editor
3. Fill in article details:
   - Title, slug, and subheadline
   - Category and tags
   - Author information
   - Cover image
   - Markdown content
4. Use the preview tab to see formatted output
5. Save as draft or publish immediately

### Managing Images

1. Go to `/admin/images` from the admin dashboard
2. Upload images (JPEG, PNG, WebP, GIF up to 5MB)
3. Copy image URLs for use in articles
4. Delete unused images as needed

### Content Organization

- **Categories**: STEM, POLITIQUE, SOCIOLOGIE, DIVERS
- **Tags**: Flexible tagging system for cross-categorization
- **Status**: Draft, Published, or Scheduled
- **Scheduling**: Set future publication dates

## API Endpoints

### Public APIs
- `GET /api/articles` - List articles with filtering
- `GET /api/articles/[slug]` - Get single article

### Admin APIs (Authentication Required)
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET/POST/PUT/DELETE /api/admin/articles` - Article management
- `POST /api/admin/upload` - Image upload
- `GET/DELETE /api/admin/images` - Image management
- `POST /api/admin/preview` - Markdown preview

### SEO & Feeds
- `GET /sitemap.xml` - XML sitemap
- `GET /robots.txt` - Robots.txt
- `GET /rss.xml` - RSS feed
- `GET /feed.xml` - Atom feed

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_PASSWORD` | Admin dashboard password | Required |
| `BASE_URL` | Site base URL for SEO | `https://your-domain.com` |

### Content Schema

Each article is stored as a JSON file with this structure:

\`\`\`json
{
  "slug": "unique-article-slug",
  "title": "Article Title",
  "dek": "Subheadline",
  "content_markdown": "# Markdown content...",
  "excerpt": "Brief summary",
  "author": "Author Name",
  "author_id": "author-slug",
  "tags": ["tag1", "tag2"],
  "category": "STEM",
  "published_at": "2025-01-01T00:00:00.000Z",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z",
  "status": "published",
  "cover_image": "/uploads/image.jpg",
  "read_time": 5,
  "word_count": 1200,
  "meta_description": "SEO description"
}
\`\`\`

## Testing

Run the test suite:

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application is a standard Next.js app and can be deployed to any platform supporting Node.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Self-hosted with PM2

## Performance Considerations

- **File-based storage** is suitable for small to medium sites (< 1000 articles)
- **Image optimization** with Next.js Image component
- **Static generation** for category and tag pages
- **Caching headers** for uploaded assets
- **Lazy loading** for images and infinite scroll

## Security

- **Admin authentication** with HTTP-only cookies
- **File upload validation** (type, size, sanitization)
- **Path traversal protection** for file operations
- **XSS prevention** with content sanitization
- **CSRF protection** with SameSite cookies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the documentation
- Review existing GitHub issues
- Create a new issue with detailed information

---

Built with ❤️ using Next.js and modern web technologies.
\`\`\`

```json file="" isHidden
