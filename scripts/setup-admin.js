// Run with: node scripts/setup-admin.js <database-password>
// Or set DATABASE_URL env var

const { Client } = require("pg");

const dbPassword = process.argv[2];

if (!dbPassword) {
  console.log("Usage: node scripts/setup-admin.js <database-password>");
  console.log("");
  console.log("You can find your database password in Supabase Dashboard:");
  console.log("Project Settings > Database > Connection string > Password");
  process.exit(1);
}

const connectionString = `postgresql://postgres.czdimlhsxvysfgwjfkdc:${dbPassword}@aws-1-eu-central-1.pooler.supabase.com:5432/postgres`;

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log("Connected to database");

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.admin_users (
        email text PRIMARY KEY,
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    console.log("admin_users table created");

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.admin_sessions (
        token text PRIMARY KEY,
        email text NOT NULL,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    console.log("admin_sessions table created");

    await client.query(`
      INSERT INTO public.admin_users (email, password_hash)
      VALUES ('dalibor.legen@gmail.com', 'fa8b3dbd1a8af4d73f01936b2872d99ad2784f4e05d84dd35124efeabbffcddf')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `);
    console.log("Admin user dalibor.legen@gmail.com created (password: 1233)");

    console.log("\nDone! You can now login at /admin");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
