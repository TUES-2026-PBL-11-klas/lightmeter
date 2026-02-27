import { describe, it, expect, beforeEach, afterAll } from 'bun:test'
import { Elysia } from 'elysia'
import { eq } from 'drizzle-orm'
import { authRoutes } from '../v1/routes/auth'
import { requireAuth } from '../plugins/auth.plugin'
import { db } from '../db'
import { users } from '../db/schema'

const TEST_EMAIL = 'authtest@example.com'
const TEST_PASSWORD = 'password123'

const app = new Elysia()
    .group('/api/v1', (app) =>
        app
            .use(authRoutes)
            .use(requireAuth)
            .get('/cameras', () => [])
    )

const post = (path: string, body: unknown) =>
    app.handle(
        new Request(`http://localhost${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
    )

async function register() {
    return post('/api/v1/auth/register', { email: TEST_EMAIL, password: TEST_PASSWORD })
}

async function cleanup() {
    await db.delete(users).where(eq(users.email, TEST_EMAIL))
}

beforeEach(cleanup)
afterAll(cleanup)

describe('POST /auth/register', () => {
    it('returns 200 with accessToken and refreshToken', async () => {
        const res = await register()
        expect(res.status).toBe(200)
        const body = await res.json()
        expect(typeof body.accessToken).toBe('string')
        expect(typeof body.refreshToken).toBe('string')
    })

    it('returns 409 when email is already registered', async () => {
        await register()
        const res = await register()
        expect(res.status).toBe(409)
        expect((await res.json()).message).toBe('Email already in use')
    })

    it('returns 422 when email is invalid', async () => {
        const res = await post('/api/v1/auth/register', { email: 'notanemail', password: TEST_PASSWORD })
        expect(res.status).toBe(422)
    })

    it('returns 422 when password is shorter than 8 characters', async () => {
        const res = await post('/api/v1/auth/register', { email: TEST_EMAIL, password: 'short' })
        expect(res.status).toBe(422)
    })
})

describe('POST /auth/login', () => {
    it('returns 200 with accessToken and refreshToken on valid credentials', async () => {
        await register()
        const res = await post('/api/v1/auth/login', { email: TEST_EMAIL, password: TEST_PASSWORD })
        expect(res.status).toBe(200)
        const body = await res.json()
        expect(typeof body.accessToken).toBe('string')
        expect(typeof body.refreshToken).toBe('string')
    })

    it('returns 401 on wrong password', async () => {
        await register()
        const res = await post('/api/v1/auth/login', { email: TEST_EMAIL, password: 'wrongpassword' })
        expect(res.status).toBe(401)
        expect((await res.json()).message).toBe('Invalid credentials')
    })

    it('returns 401 on unknown email', async () => {
        const res = await post('/api/v1/auth/login', { email: 'nobody@example.com', password: TEST_PASSWORD })
        expect(res.status).toBe(401)
        expect((await res.json()).message).toBe('Invalid credentials')
    })
})

describe('Protected routes', () => {
    it('returns 401 without a token', async () => {
        const res = await app.handle(new Request('http://localhost/api/v1/cameras'))
        expect(res.status).toBe(401)
    })

    it('returns 401 with an invalid token', async () => {
        const res = await app.handle(
            new Request('http://localhost/api/v1/cameras', {
                headers: { Authorization: 'Bearer invalidtoken' },
            })
        )
        expect(res.status).toBe(401)
    })

    it('returns 200 with a valid access token', async () => {
        const { accessToken } = await register().then((r) => r.json())
        const res = await app.handle(
            new Request('http://localhost/api/v1/cameras', {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        )
        expect(res.status).toBe(200)
    })
})

describe('POST /auth/refresh', () => {
    it('returns 200 with a new accessToken', async () => {
        const { refreshToken } = await register().then((r) => r.json())
        const res = await post('/api/v1/auth/refresh', { refreshToken })
        expect(res.status).toBe(200)
        expect(typeof (await res.json()).accessToken).toBe('string')
    })

    it('returns 401 on an invalid refresh token', async () => {
        const res = await post('/api/v1/auth/refresh', { refreshToken: 'invalid-token' })
        expect(res.status).toBe(401)
    })
})

describe('POST /auth/logout', () => {
    it('returns 204', async () => {
        const { refreshToken } = await register().then((r) => r.json())
        const res = await post('/api/v1/auth/logout', { refreshToken })
        expect(res.status).toBe(204)
    })

    it('invalidates the refresh token so subsequent refresh returns 401', async () => {
        const { refreshToken } = await register().then((r) => r.json())
        await post('/api/v1/auth/logout', { refreshToken })
        const res = await post('/api/v1/auth/refresh', { refreshToken })
        expect(res.status).toBe(401)
    })
})
