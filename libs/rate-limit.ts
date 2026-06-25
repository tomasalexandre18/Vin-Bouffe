import { redis } from '@/libs/redis'

export async function rateLimit(
    identifier: string, // ip, user id, api key...
    limit = 10,
    windowSeconds = 60
): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:${identifier}`
    const count = await redis.incr(key)

    if (count === 1) {
        await redis.expire(key, windowSeconds)
    }

    return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
    }
}