import { Elysia, t } from 'elysia'
import { authPlugin } from '../../plugins/auth.plugin'
import { db } from '../../db'
import { users, refreshTokens } from '../../db/schema'
import { eq } from 'drizzle-orm'

const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS ?? '30', 10)

function hashToken(token: string): string {
    return new Bun.CryptoHasher('sha256').update(token).digest('hex')
}

function generateRefreshToken(): string {
    return crypto.randomUUID() + '-' + crypto.randomUUID()
}

async function createRefreshToken(userId: string) {
    const raw = generateRefreshToken()
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    await db.insert(refreshTokens).values({
        userId,
        tokenHash: hashToken(raw),
        expiresAt,
    })
    return raw
}

async function issueTokens(userId: string, email: string, jwt: { sign: (payload: Record<string, unknown>) => Promise<string> }) {
    const accessToken = await jwt.sign({ sub: userId, email })
    const refreshToken = await createRefreshToken(userId)
    return { accessToken, refreshToken }
}

export const authRoutes = new Elysia({ prefix: '/auth', detail: { tags: ['Auth'] } })
    .post('/register', ({ body }) => body)
