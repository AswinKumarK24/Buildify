import { neon } from '@neondatabase/serverless';

async function migrate() {
    const dbUrl = "postgresql://neondb_owner:npg_tx8eOnWFm7Hi@ep-young-frost-a1wchow4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    const sql = neon(dbUrl);
    console.log("Dropping old table to recreate with username...");
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    console.log("Migration script complete.");
}

migrate().catch(console.error);
