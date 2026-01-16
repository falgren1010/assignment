import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const app = new Hono()

const db = drizzle(process.env.DATABASE_URL!);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = Number(process.env.PORT) || 3001

const server = serve({
  fetch: app.fetch,
  port: port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

process.on('SIGINT', () => {
  console.log("Received SIGINT. Shutdown...")
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  console.log("Received SIGTERM. Shutdown...")
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
