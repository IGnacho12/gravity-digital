export const prerender = false

import type { APIRoute } from "astro"
import { ensureLeadsTable } from "@/lib/db"
import { SERVICES, type ServiceValue } from "@/lib/whatsapp"

const allowed = new Set(SERVICES.map((item) => item.value))

function isService(value: string): value is ServiceValue {
  return allowed.has(value as ServiceValue)
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return json({ error: "El cuerpo de la consulta no es válido." }, 400)
  }

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  const phone = String(body.phone ?? "").trim()
  const service = String(body.service ?? "").trim()
  const message = String(body.message ?? "").trim()

  if (!name || !email || !isService(service) || !message) {
    return json(
      { error: "Completá nombre, email, servicio y el detalle de lo que necesitás." },
      400
    )
  }

  const sql = await ensureLeadsTable()

  if (sql) {
    try {
      await sql`
        INSERT INTO leads (name, email, phone, service, message)
        VALUES (${name}, ${email}, ${phone || null}, ${service}, ${message})
      `
    } catch (error) {
      console.error("lead insert failed", error)
      return json({ error: "No pudimos guardar la consulta. Probá de nuevo." }, 500)
    }
  } else {
    console.warn("DATABASE_URL missing; lead was not persisted")
  }

  return json({ ok: true, stored: Boolean(sql) })
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
