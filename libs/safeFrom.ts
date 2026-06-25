export default function safeFrom(from: string | string[] | undefined, fallback = '/'): string {
    if (typeof from !== 'string') return fallback
    if (!from.startsWith('/') || from.startsWith('//')) return fallback
    if (from.includes('://')) return fallback
    return from
}