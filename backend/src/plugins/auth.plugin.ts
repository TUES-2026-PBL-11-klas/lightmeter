import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { bearer } from '@elysiajs/bearer'

export const authPlugin = new Elysia({ name: 'auth-plugin' })
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: '15m',
    }))
    .use(bearer())

type AuthUser = { id: string; email: string } | null

export const requireAuth = new Elysia({ name: 'require-auth' })
    .use(authPlugin)
    .derive({ as: 'scoped' }, async ({ jwt, bearer }): Promise<{ user: AuthUser }> => {
        if (!bearer) return { user: null }
        const payload = await jwt.verify(bearer)
        if (!payload) return { user: null }
        return {
            user: {
                id: payload.sub as string,
                email: payload.email as string,
            },
        }
    })
    .onBeforeHandle({ as: 'scoped' }, ({ user, set }) => {
        if (!user) {
            set.status = 401
            return { message: 'Unauthorized' }
        }
    })
