import { redis } from '@/libs/redis'

export async function rateLimit(
    identifier: string,
    limit = 10,
    windowSeconds = 60
): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:${identifier}`

    // Pipeline makes INCR + EXPIRE atomic — avoids a key stuck without TTL
    // if the process crashes between the two separate calls.
    const results = await redis.pipeline().incr(key).expire(key, windowSeconds).exec()
    const count = (results?.[0]?.[1] ?? 0) as number

    return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
    }
}
