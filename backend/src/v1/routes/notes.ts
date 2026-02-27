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

const getJwtPayload = async (jwt: any, set: any, authHeader?: string) => {
    if (!authHeader) {
        set.status = 401
        return null
    }

    const token = authHeader.replace('Bearer ', '')
    try {
        const payload = await jwt.verify(token) as JwtPayload
        return payload
    } catch {
        set.status = 401
        return null
    }
}

// CREATE NOTE
notesRoutes.post(
    '/',
    async ({ body, jwt, set, headers }) => {
        const payload = await getJwtPayload(jwt, set, headers['authorization'])
        if (!payload) return { message: 'Unauthorized' }

        const userId = payload.sub

        const [note] = await db
            .insert(notes)
            .values({
                user_id: userId,
                iso: body.iso,
                aperture: body.aperture,
                shutter_speed: body.shutter_speed,
                date: body.date,
                place: body.place,
            })
            .returning()

        return note
    },
    {
        body: t.Object({
            iso: t.String(),
            aperture: t.String(),
            shutter_speed: t.String(),
            date: t.String({ format: 'date' }),
            place: t.String(),
        }),
    }
)

// GET ALL NOTES FOR USER
notesRoutes.get('/', async ({ jwt, set, headers }) => {
    const payload = await getJwtPayload(jwt, set, headers['authorization'])
    if (!payload) return { message: 'Unauthorized' }

    const userId = payload.sub

    return db.query.notes.findMany({
        where: eq(notes.user_id, userId),
    })
})

// DELETE NOTE
notesRoutes.delete('/:id', async ({ params, jwt, set, headers }) => {
    const payload = await getJwtPayload(jwt, set, headers['authorization'])
    if (!payload) return { message: 'Unauthorized' }

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