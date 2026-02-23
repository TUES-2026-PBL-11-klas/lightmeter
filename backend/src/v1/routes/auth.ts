import { Elysia, t } from 'elysia'

export const authRoutes = new Elysia({ prefix: '/auth', detail: { tags: ['Auth'] } })
    .post('/register', ({ body }) => body)
    