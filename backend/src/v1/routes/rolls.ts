import { Elysia, t } from 'elysia'

export const rollRoutes = new Elysia({ prefix: '/rolls', detail: { tags: ['Rolls'] } })
    .get(':id', ({ body }) => {})
    .post('/', ({ body }) => {})
    .patch('/:id/finish', ({ params }) => `Roll ${params.id} completed`)