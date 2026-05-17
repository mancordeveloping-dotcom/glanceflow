import { NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Module-level store — persists per serverless function instance
const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries periodically to avoid memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 60_000)

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
}

export const PRESETS = {
  /** Auth / login routes: 5 req per 15 min */
  auth:    { limit: 5,  windowMs: 15 * 60 * 1000 },
  /** Heavy AI processing: 5 req per 60 sec */
  ai:      { limit: 5,  windowMs: 60 * 1000 },
  /** Stripe / expensive ops: 10 req per 15 min */
  strict:  { limit: 10, windowMs: 15 * 60 * 1000 },
  /** General API routes: 60 req per 60 sec */
  default: { limit: 60, windowMs: 60 * 1000 },
} satisfies Record<string, RateLimitConfig>

/**
 * Check rate limit for a given key (typically IP + route).
 * Returns a 429 NextResponse if the limit is exceeded, otherwise null.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig = PRESETS.default
): NextResponse | null {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return null
  }

  if (entry.count >= config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: `Too many requests. Try again in ${retryAfter} seconds.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    )
  }

  entry.count++
  return null
}

/** Helper: extract client IP from request headers */
export function getIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
