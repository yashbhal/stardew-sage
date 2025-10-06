# Stardew Sage Architecture

## High-Level View

```mermaid
digraph architecture {
  rankdir=LR
  subgraph Client {
    ChatInterface["ChatInterface.tsx"]
    ChatHeader["ChatHeader.tsx"]
    ChatMessage["ChatMessage.tsx"]
    SavedTipsPanel["SavedTipsPanel.tsx"]
    PromptCarousel["PromptCarousel.tsx"]
  }
  subgraph Server {
    API["/api/chat/route.ts"]
  }
  subgraph Infrastructure {
    Gemini["Google Gemini 2.0 Flash"]
    Upstash["Upstash Redis"]
  }
  ChatInterface -> API [label="POST /api/chat"]
  PromptCarousel -> ChatInterface
  SavedTipsPanel -> ChatInterface
  API -> Upstash [label="Rate limit"]
  API -> Gemini [label="Prompt request"]
  Gemini -> API [label="Response"]
  API -> ChatInterface [label="JSON reply"]
}
```

The client lives under `src/components/` and renders the chat UI. The server logic lives in `src/app/api/chat/route.ts` and talks to Gemini. Rate limiting uses Upstash Redis through helpers in `src/lib/`.

## Client Layers

- **`src/components/ChatInterface.tsx`** wires together chat state, prompt suggestions, saved tips, and form handling.
- **`src/components/chat/`** houses UI atoms:
  - `ChatHeader.tsx` shows branding and transcript actions.
  - `ChatMessage.tsx` renders user and assistant messages with markdown support.
  - `PromptCarousel.tsx` displays quick prompts from `src/constants/prompts.ts`.
  - `SavedTipsPanel.tsx` lists bookmarked answers.
  - `LoadingIndicator.tsx` and `ErrorBanner.tsx` present transient status.
- **`src/hooks/`** provides behavior shared between components:
  - `useSavedTips.ts` persists bookmarks to `localStorage`.
  - `usePrefersReducedMotion.ts` reads user motion preferences.
- **`src/lib/`** contains utilities used on both client and server:
  - `clipboard.ts` abstracts `navigator.clipboard` with graceful fallbacks.
  - `umami.ts` wraps analytics tracking so blocked trackers do not crash the UI.

## Server Route

`src/app/api/chat/route.ts` handles all chat requests:

1. Pulls request metadata such as `x-forwarded-for`.
2. Calls `checkRateLimit()` from `src/lib/rate-limit.ts` to guard against abuse.
3. Validates the incoming JSON payload.
4. Builds a Gemini prompt using the helper inline in the file.
5. Calls `fetchGeminiResponse()` which posts to `https://generativelanguage.googleapis.com` with the configured model and generation settings.
6. Returns `{ response: string }` to the client or a descriptive error JSON object.

## Rate Limiting Infrastructure

- `src/lib/redis.ts` instantiates an Upstash Redis client using `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- `src/lib/rate-limit.ts` increments minute and daily buckets per identifier. Each key expires after its window, so Redis does not accumulate stale entries.
- The API responds with status `429` and a `Retry-After` header when the quota is exceeded.

## Environment Variables

Set these variables locally in `.env.local` and in Vercel project settings:

```text
GEMINI_API_KEY=your-google-key
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Add optional analytics settings (Umami) if you enable tracking.

## Styling Pipeline

Tailwind drives styling. The palette and utilities are declared in `tailwind.config.js`. Global resets and helper classes live in `src/app/globals.css`. Assets under `public/` supply icons and fonts.

## Build and Deploy

- Run `npm run lint` to check formatting and type-driven lint rules.
- Run `npm run build` to trigger Next.js production compilation and type checks.
- Deploy through Vercel. Ensure all environment variables are set before promoting a build to production.

Use this map when onboarding new contributors or planning feature work—it highlights where to plug in new interactions, backend logic, or styling changes.
