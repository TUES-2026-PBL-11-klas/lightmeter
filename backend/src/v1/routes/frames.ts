import { Elysia } from 'elysia'

export const frameRoutes = new Elysia({ prefix: '/frames', detail: { tags: ['Frames'] } })
    .get("/:id", ()  => {})
    .post('/:rollId', ({ params, body }) => {
        return { status: 'logged' }
    })