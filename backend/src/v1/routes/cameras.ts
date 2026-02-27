import { Elysia } from 'elysia'

export const cameraRoutes = new Elysia({ prefix: '/cameras', detail: { tags: ['Cameras'] } })
    .get('/', () => [])
    .post('/', ({ body }) => body)