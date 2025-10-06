import { redis } from './redis';

const WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 5;
const DAILY_WINDOW_SECONDS = 60 * 60 * 24;
const MAX_REQUESTS_PER_DAY = 100;

type RateLimitResult =
  | { success: true }
  | { success: false; retryAfter: number };

const getIdentifiers = (identifier: string) => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const currentWindow = Math.floor(nowSeconds / WINDOW_SECONDS);
  const currentDay = new Date().toISOString().slice(0, 10);

  return {
    minuteKey: `chat:rl:minute:${identifier}:${currentWindow}`,
    dayKey: `chat:rl:day:${identifier}:${currentDay}`,
  } as const;
};

export const checkRateLimit = async (identifier: string): Promise<RateLimitResult> => {
  const { minuteKey, dayKey } = getIdentifiers(identifier);

  const minuteCount = await redis.incr(minuteKey);
  if (minuteCount === 1) {
    await redis.expire(minuteKey, WINDOW_SECONDS);
  }

  if (minuteCount > MAX_REQUESTS_PER_WINDOW) {
    return { success: false, retryAfter: WINDOW_SECONDS };
  }

  const dayCount = await redis.incr(dayKey);
  if (dayCount === 1) {
    await redis.expire(dayKey, DAILY_WINDOW_SECONDS);
  }

  if (minuteCount > MAX_REQUESTS_PER_WINDOW) {
    return { success: false, retryAfter: WINDOW_SECONDS };
  }

  if (dayCount > MAX_REQUESTS_PER_DAY) {
    return { success: false, retryAfter: DAILY_WINDOW_SECONDS };
  }

  return { success: true };
};
