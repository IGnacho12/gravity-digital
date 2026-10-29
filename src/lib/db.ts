import { neon } from "@neondatabase/serverless"

export function getSql() {
  const url = import.meta.env.DATABASE_URL
  if (!url) return null
  return neon(url)
}

export async function ensureLeadsTable() {
  const sql = getSql()
  if (!sql) return null

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
