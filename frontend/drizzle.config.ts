import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables.');
}

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/lib/db/schema.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});


// npx drizzle-kit push