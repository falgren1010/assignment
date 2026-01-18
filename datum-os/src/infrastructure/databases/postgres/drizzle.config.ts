import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/infrastructure/databases/postgres/schemas.ts",
    out: "./src/infrastructure/databases/postgres/migrations",
    dbCredentials: {
        host: process.env.POSTGRES_HOST!,
        port: Number(process.env.POSTGRES_PORT!),
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!,
        ssl: false,
    },
});
