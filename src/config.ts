import { ConnectionConfig } from 'pg'

export const dbConfig: ConnectionConfig = {
  user: process.env.DB_USER ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '12345',
  port: Number(process.env.DB_PORT) ?? 5432,
  host: process.env.DB_HOST ?? 'localhost'
} 