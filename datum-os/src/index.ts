import { serve } from '@hono/node-server'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";
import {Registry} from "./registry/registry.js";
import "dotenv/config";


// Create and init DB connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const database = drizzle(pool);


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
