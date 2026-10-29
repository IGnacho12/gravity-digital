export const SERVICES = [
  { value: "asesoramiento", label: "Asesoramiento de compras" },
  { value: "capacitacion", label: "Capacitación" },
  { value: "automatizacion", label: "Automatización" },
] as const

export type ServiceValue = (typeof SERVICES)[number]["value"]

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "")
}

export function whatsappUrl(phone: string | undefined, text: string) {
  const digits = phone ? digitsOnly(phone) : ""
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function leadWhatsappMessage(input: {
  name: string
  email: string
  phone?: string
  service: string
  message: string
}) {
  const serviceLabel =
    SERVICES.find((item) => item.value === input.service)?.label ?? input.service

  return [
    "Hola, soy " + input.name + ".",
    "Quiero consultar por: " + serviceLabel + ".",
    input.email ? "Email: " + input.email : null,
    input.phone ? "Teléfono: " + input.phone : null,
    input.message ? "Detalle: " + input.message : null,
  ]
    .filter(Boolean)
    .join("\n")
}
