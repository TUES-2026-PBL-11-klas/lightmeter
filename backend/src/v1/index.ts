

import { Elysia } from 'elysia'
import { authRoutes } from './routes/auth'
import { cameraRoutes } from './routes/cameras'
import { rollRoutes } from './routes/rolls'
import { frameRoutes } from './routes/frames'

export const v1 = new Elysia({ prefix: '/v1' })
    .use(authRoutes)
    .use(cameraRoutes)
    .use(rollRoutes)
    .use(frameRoutes)