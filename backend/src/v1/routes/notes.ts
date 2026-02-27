import { Elysia, t } from 'elysia'
import { db } from '../../db'
import { notes } from '../../db/schema'
import { eq, and } from 'drizzle-orm'

type JwtPayload = {
    sub: string
    email: string
}

export const notesRoutes = new Elysia({
    prefix: '/notes', 
    detail: { tags: ['Notes'] }
})

/**
 * CREATE NOTE
 */
notesRoutes.post(
    '/',
    async ({ body, jwt, set }) => {
        const payload = await jwt.verify() as JwtPayload
        if (!payload) {
            set.status = 401
            return { message: 'Unauthorized' }
        }
        const userId = payload.sub

        const [note] = await db
            .insert(notes)
            .values({
                user_id: userId,
                iso: body.iso,
                aperture: body.aperture,
                shutter_speed: body.shutter_speed,
            })
            .returning()

        return note
    },
    {
        body: t.Object({
            iso: t.String(),
            aperture: t.String(),
            shutter_speed: t.String(),
        }),
    }
)

/**
 * GET ALL NOTES FOR USER
 */
notesRoutes.get('/', async ({ jwt, set }) => {
    const payload = await jwt.verify() as JwtPayload
    if (!payload) {
        set.status = 401
        return { message: 'Unauthorized' }
    }
    const userId = payload.sub

    return db.query.notes.findMany({
        where: eq(notes.user_id, userId),
    })
})

/**
 * DELETE NOTE
 */
notesRoutes.delete('/:id', async ({ params, jwt, set }) => {
    const payload = await jwt.verify() as JwtPayload
    if (!payload) {
        set.status = 401
        return { message: 'Unauthorized' }
    }
    const userId = payload.sub

    const deleted = await db
        .delete(notes)
        .where(
            and(
                eq(notes.id, params.id),
                eq(notes.user_id, userId)
            )
        )
        .returning()

    if (!deleted.length) {
        set.status = 404
        return { message: 'Note not found' }
    }

    set.status = 204
})