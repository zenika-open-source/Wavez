# Wavez Frontend

The Wavez frontend is a single-page Next.js application for choosing an AI
assistant, skills, and optional technology stacks, then downloading the setup
archive.

## Run locally

Install dependencies with pnpm, then start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend uses
`http://localhost:8000` as its API base by default. Set
`NEXT_PUBLIC_API_BASE_URL` to override it.

Available checks and commands:

```bash
pnpm lint
pnpm build
pnpm start
```

## Application structure

- `src/app/page.tsx` owns the home page state and composes the assistant picker,
  skill categories, summary panel, responsive action bar, and generate dialog.
- `src/components/` contains the page UI. Stack choices are rendered inline
  with their skill rows; the summary includes a reduced-motion-aware wave.
- `src/data/` defines assistants and skill categories.
- `src/lib/` contains stack-catalog helpers and wave geometry.
- `src/api/` contains the stack-catalog and archive-download clients.
- `src/types/` contains the skill and API contract types.

The only application route is `/`. The stack catalog is loaded from
`GET /stacks`; archive generation uses `POST /init/archive`.

## Fonts and assets

The design uses Bricolage Grotesque for display text, DM Sans for body text,
and IBM Plex Mono for monospaced labels. They are configured with
`next/font/google` in `src/app/layout.tsx`.

Local SVG assets are served from `public/brand/` and `public/assistants/`.
Brand assets include the Wavez and Zenika logos and the decorative wave mark;
assistant assets provide the picker logos.
