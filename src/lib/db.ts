import { neon } from "@neondatabase/serverless"

export function getSql() {
  const url = import.meta.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not configured")
  return neon(url)
}

export async function ensureLeadsTable() {
  const sql = getSql()

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      service text NOT NULL,
      message text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `

  return sql
}
