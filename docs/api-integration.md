# API Integration Guide

## Overview

The API layer lives in `src/app/api/chat/route.ts`. It accepts chat requests from the UI, applies rate limiting, prepares a Gemini prompt, and proxies the call to Google Gemini 2.0 Flash. This guide walks through the data flow, configuration, and extension points so you can adapt the API quickly.

## System Flow

```mermaid
flowchart TD
  A[User submits a message<br/>`ChatInterface.tsx`] --> B[POST `/api/chat`]
  B --> C[Rate limit check<br/>`src/lib/rate-limit.ts`]
  C -->|allowed| D[Prompt assembly<br/>`route.ts`]
  D --> E[Gemini request<br/>`fetchGeminiResponse()`]
  E --> F[JSON response -> client]
  C -->|blocked| G[HTTP 429 response]
```

## Request Lifecycle

- **Rate limiting**: `checkRateLimit()` increments Upstash counters keyed by client IP headers. Returns HTTP 429 with a `Retry-After` header when limits are exceeded.
- **Validation**: The handler parses `message` from the request body and rejects empty or non-string payloads.
- **Prompt assembly**: The Gemini prompt embeds safety instructions and the user question.
- **External call**: `fetchGeminiResponse()` posts the prompt to `gemini-2.0-flash` using the configured API key and generation settings.
- **Response**: The handler returns `{ response: string }` back to the chat UI.

```typescript
// src/app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIdentifier = forwardedFor?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';

  const rateLimit = await checkRateLimit(clientIdentifier);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': Math.ceil(rateLimit.retryAfter / 1000).toString() } },
    );
  }

  const { message } = await request.json();
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Invalid message format.' }, { status: 400 });
  }

  const prompt = buildPrompt(message);
  const reply = await fetchGeminiResponse(prompt, apiKey);
  return NextResponse.json({ response: reply });
}
```

## Configuration

Set the following environment variables locally in `.env.local` and in each Vercel environment:

```
GEMINI_API_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

- `GEMINI_API_KEY` powers Gemini 2.0 Flash.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` allow `src/lib/redis.ts` to reach the Upstash REST endpoint for rate limiting.

## Rate Limiting Details

`src/lib/rate-limit.ts` enforces a sliding window:

- Minute bucket: maximum five requests per IP per 60 seconds.
- Daily bucket: maximum one hundred requests per IP per day.
- Keys expire automatically; no Redis eviction tweak required.

```typescript
// src/lib/rate-limit.ts
const minuteCount = await redis.incr(minuteKey);
if (minuteCount === 1) await redis.expire(minuteKey, WINDOW_SECONDS);
if (minuteCount > MAX_REQUESTS_PER_WINDOW) return { success: false, retryAfter: WINDOW_SECONDS };

const dayCount = await redis.incr(dayKey);
if (dayCount === 1) await redis.expire(dayKey, DAILY_WINDOW_SECONDS);
if (dayCount > MAX_REQUESTS_PER_DAY) return { success: false, retryAfter: DAILY_WINDOW_SECONDS };
```

## Prompt Construction

`buildPrompt()` in `route.ts` (inline helper) guides the model:

- Describes tone, formatting, and safety rules.
- Injects the user message at the end of the template.
- Keeps responses concise and relevant to Stardew Valley.

Example excerpt:

```typescript
const prompt = `
# You are Stardew Sage
You are a friendly Stardew Valley expert.

# Response rules
- Answer with warm and direct language.
- Keep replies between 100 and 200 words.
- Use **bold** for key terms and bulleted lists when helpful.

# Question
${message}
`;
```

Adjust the template to change tone, length, or formatting.

## Generation Settings

`fetchGeminiResponse()` sends default generation parameters:

```typescript
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.5,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    },
  }),
});
```

Tune these values to trade off determinism, creativity, or response length.

## Extending the API

- **Streaming**: Switch the endpoint to use `streamGenerateContent` and return a `ReadableStream` from the handler.
- **Alternate providers**: Replace `fetchGeminiResponse()` with calls to OpenAI or Anthropic by swapping libraries and environment variables.
- **Conversation context**: Include recent `messages` from the client in the POST body and append them to the prompt.

## Troubleshooting Checklist

- **400 Bad Request**: Confirm the client sends `{ message: string }`.
- **401 Unauthorized**: Validate `GEMINI_API_KEY` in the runtime environment.
- **429 Too Many Requests**: Check Upstash counters; the limit is working as intended.
- **5xx from Gemini**: Log the JSON payload returned by Gemini for debugging.

Use `npm run lint` and `npm run build` to verify type safety and catch missing environment variables before deployment.

## Further Reading

- `src/app/api/chat/route.ts` for the complete handler.
- `src/lib/redis.ts` for the Upstash client wrapper.
- `src/lib/rate-limit.ts` for the window logic.
- [Gemini API reference](https://ai.google.dev/).