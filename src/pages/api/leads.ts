export const prerender = false

import type { APIRoute } from "astro"
import { ensureLeadsTable } from "@/lib/db"
import { SERVICES, leadWhatsappMessage, whatsappUrl, type ServiceValue } from "@/lib/whatsapp"

const allowed = new Set(SERVICES.map((item) => item.value))

function isService(value: unknown): value is ServiceValue {
  return typeof value === "string" && allowed.has(value as ServiceValue)
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return json({ error: "El cuerpo de la consulta no es válido." }, 400)
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "El cuerpo de la consulta no es válido." }, 400)
  }

  const input = body as Record<string, unknown>
  const name = typeof input.name === "string" ? input.name.trim() : ""
  const email = typeof input.email === "string" ? input.email.trim() : ""
  const phone = typeof input.phone === "string" ? input.phone.trim() : ""
  const message = typeof input.message === "string" ? input.message.trim() : ""
  const service = input.service

  if (!name || !email || !isService(service) || !message) {
    return json(
      { error: "Completá nombre, email, servicio y el detalle de lo que necesitás." },
      400
    )
  }

  if (name.length > 120 || email.length > 254 || phone.length > 40 || message.length > 3000) {
    return json({ error: "Revisá la extensión de los datos ingresados." }, 400)
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Ingresá un email válido para poder responderte." }, 400)
  }

  if (!import.meta.env.DATABASE_URL) {
    return json(
      { error: "El formulario no está disponible todavía. Probá más tarde o contactanos por otro medio." },
      503
    )
  }

  try {
    const sql = await ensureLeadsTable()
    await sql`
      INSERT INTO leads (name, email, phone, service, message)
      VALUES (${name}, ${email}, ${phone || null}, ${service}, ${message})
    `
  } catch (error) {
    console.error("lead persistence failed", error)
    return json({ error: "No pudimos guardar la consulta. Probá de nuevo más tarde." }, 500)
  }

  const messageText = leadWhatsappMessage({ name, email, phone, service, message })
  return json({
    ok: true,
    stored: true,
    whatsappUrl: whatsappUrl(import.meta.env.PUBLIC_WHATSAPP, messageText),
  })
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
