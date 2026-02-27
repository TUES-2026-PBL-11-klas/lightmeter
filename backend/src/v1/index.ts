import { Elysia } from 'elysia'
import { authRoutes } from './routes/auth'
import { cameraRoutes } from './routes/cameras'
import { rollRoutes } from './routes/rolls'
import { frameRoutes } from './routes/frames'
import { requireAuth } from '../plugins/auth.plugin'
import { notesRoutes } from './routes/notes'

export const v1 = new Elysia({ prefix: '/v1' })
    .use(authRoutes)
    .use(requireAuth)
    .use(cameraRoutes)
    .use(rollRoutes)
    .use(frameRoutes)
    .use(notesRoutes)
