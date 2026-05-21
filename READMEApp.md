# Koloqwa Dictionary — Frontend

Next.js 15 frontend for The Koloqwa Dictionary.

## Stack
- **Next.js 15** App Router
- **TypeScript**
- **Tailwind CSS** with custom African-inspired design tokens
- **Playfair Display** (display) + **DM Sans** (body) typography

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment

Copy `.env.example` to `.env.local` and update the API URL:

```env
NEXT_PUBLIC_API_URL=https://localhost:62971/api/v1
```

> The API runs self-signed certs in dev. See next.config.ts for rewrite proxy.

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, search, featured words & phrases |
| `/words/search` | Full-text word search with pagination |
| `/words/[slug]` | Word detail — definitions, examples, related |
| `/phrases/search` | Phrase & idiom search |
| `/phrases/[slug]` | Phrase detail — meanings, context, related |
| `/about` | About the project and languages |

## Design System

- Warm earth tones: `kola`, `earth`, `savanna` color palettes
- CSS variables for light/dark mode (`var(--bg-primary)`, `var(--accent)`, etc.)
- Playfair Display italic for headwords and display text
- Grain texture overlay for depth
- African-inspired geometric accents
