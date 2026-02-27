import { pgTable, uuid, varchar, text, timestamp, date } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: text('name').notNull(),
    birthdate: date('birthdate').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const notes = pgTable('notes', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
        .references(() => users.id)
        .notNull(),
    iso: text('iso'),
    aperture: text('aperture'),
    shutter_speed: text('shutter_speed'),
    date: date('date'),
    place: text('place'),
})

export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})
