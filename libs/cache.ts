import { redis } from '@/libs/redis'

export async function cachedFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = 300
): Promise<T> {
    const cached = await redis.get(key)
    if (cached) return JSON.parse(cached)

    const fresh = await fetcher()
    await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds)
    return fresh
}