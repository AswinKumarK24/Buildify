import { neon } from '@neondatabase/serverless';

const PLACEHOLDER_URL = "postgres://placeholder:placeholder@ep-my-neon-db-placeholder.us-east-1.aws.neon.tech/neondb";

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_avmUYlS9k6ce@ep-jolly-dawn-a1sl2z1h-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const sql = neon(dbUrl);

export const isUsingPlaceholderDb = () => {
    return dbUrl === PLACEHOLDER_URL;
};
