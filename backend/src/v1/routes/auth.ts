import { Elysia, t } from 'elysia'
import { authPlugin } from '../../plugins/auth.plugin'
import { db } from '../../db'
import { users, refreshTokens } from '../../db/schema'
import { eq } from 'drizzle-orm'

const REFRESH_TOKEN_EXPIRY_DAYS = 30

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

export const authRoutes = new Elysia({ prefix: '/auth', detail: { tags: ['Auth'] } })
    .use(authPlugin)
    .post('/register',
        async ({ body, jwt, set }) => {
            const existing = await db.query.users.findFirst({
                where: eq(users.email, body.email),
            })
            if (existing) {
                set.status = 409
                return { message: 'Email already in use' }
            }

            const hashed = await Bun.password.hash(body.password)
            const [user] = await db.insert(users).values({
                email: body.email,
                password: hashed,
            }).returning({ id: users.id, email: users.email })

            const accessToken = await jwt.sign({ sub: user.id, email: user.email })
            const refreshToken = await createRefreshToken(user.id)

            return { accessToken, refreshToken }
        },
        {
            body: t.Object({
                email: t.String({ format: 'email' }),
                password: t.String({ minLength: 8 }),
            }),
        }
    )
    .post('/login',
        async ({ body, jwt, set }) => {
            const user = await db.query.users.findFirst({
                where: eq(users.email, body.email),
            })
            if (!user) {
                set.status = 401
                return { message: 'Invalid credentials' }
            }

            const valid = await Bun.password.verify(body.password, user.password)
            if (!valid) {
                set.status = 401
                return { message: 'Invalid credentials' }
            }

            const accessToken = await jwt.sign({ sub: user.id, email: user.email })
            const refreshToken = await createRefreshToken(user.id)

            return { accessToken, refreshToken }
        },
        {
            body: t.Object({
                email: t.String(),
                password: t.String(),
            }),
        }
    )
    .post('/refresh',
        async ({ body, jwt, set }) => {
            const tokenHash = hashToken(body.refreshToken)
            const row = await db.query.refreshTokens.findFirst({
                where: eq(refreshTokens.tokenHash, tokenHash),
            })

            if (!row) {
                set.status = 401
                return { message: 'Invalid refresh token' }
            }
            if (row.expiresAt < new Date()) {
                await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash))
                set.status = 401
                return { message: 'Refresh token expired' }
            }

            const user = await db.query.users.findFirst({
                where: eq(users.id, row.userId),
            })
            if (!user) {
                set.status = 401
                return { message: 'Invalid refresh token' }
            }

            const accessToken = await jwt.sign({ sub: user.id, email: user.email })
            return { accessToken }
        },
        {
            body: t.Object({
                refreshToken: t.String(),
            }),
        }
    )
    .post('/logout',
        async ({ body, set }) => {
            const tokenHash = hashToken(body.refreshToken)
            await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash))
            set.status = 204
        },
        {
            body: t.Object({
                refreshToken: t.String(),
            }),
        }
    )
