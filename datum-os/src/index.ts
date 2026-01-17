import { serve } from '@hono/node-server'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import {Registry} from "./registry/registry.js";

// Create and init DB connection
const database = drizzle(process.env.DATABASE_URL!);

// Create Registry and init API Routes
const registry = new Registry(database)
registry.initRoutes()

// Load Port from .env
const port = Number(process.env.PORT) || 3001

// Get Router from Registry and start Server
const router = registry.getRouter()

const server = serve({
  fetch: router.fetch,
  port: port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

// Graceful Shutdown handling
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
