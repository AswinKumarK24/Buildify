import { neon } from '@neondatabase/serverless';

async function test() {
  const cn = process.env.DATABASE_URL;
  const sql = neon(cn);
  
  try {
    console.log("Pinging new Jolly Dawn cluster...");
    const res = await sql`SELECT 1 as result`;
    console.log("DB Ping successful:", res);
  } catch(e) {
    console.error("\n--- DB ERROR TRIGGERED ---\n");
    console.error("e.message:", e.message);
    if (e.cause) {
      console.error("e.cause:", e.cause);
    }
  }
}

test();
