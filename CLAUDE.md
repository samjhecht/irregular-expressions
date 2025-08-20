# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (builds contentlayer first)
- `npm run build` - Build for production (includes contentlayer build)
- `npm run start` - Start production server
- `npm run contentlayer` - Build contentlayer files only

## Architecture Overview

This is a Next.js blog/poetry site using Contentlayer for MDX content management and Chakra UI for styling.

### Key Components

- **Content System**: Uses Contentlayer to generate TypeScript from MDX files in `content/` directory
  - Essays: `content/_essays/`
  - Poetry: `content/_poetry/`
  - Hidden pages: `content/_hidden-pages/`
- **Styling**: Chakra UI with custom theme in `src/theme.ts` using Vulf Sans font family
- **Database**: PostgreSQL connection via `lib/renderDb.ts` using environment variable `RENDER_DATABASE_URL`

### Content Structure

- Each content type has its own document definition in `contentlayer.config.ts`
- All content files are MDX with frontmatter fields (title, date, description, thumbnailImage, status)
- Computed fields include reading time, slug, and URL paths
- Rehype plugins for syntax highlighting (Prism, Pretty Code) and auto-linking

### Database Integration

- Uses pg Pool for PostgreSQL connections
- View counter functionality in `pages/api/views/`
- Subscribe functionality via `pages/api/subscribe.ts`

### Styling System

- Custom breakpoints and color scheme in theme
- Responsive text sizing with `useBreakpointValue`
- Custom fonts loaded from `public/fonts/`

### Build Process

- Contentlayer must build before Next.js (handled in scripts)
- Post-build scripts generate RSS feed and sitemap
- Static assets in `public/static/images/`
