import { useState, type FormEvent } from "react"
import { SERVICES } from "@/lib/whatsapp"

type SubmissionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; whatsappUrl: string | null }
  | { kind: "error"; message: string }

export default function LeadForm() {
  const [state, setState] = useState<SubmissionState>({ kind: "idle" })

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setState({ kind: "submitting" })

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const result = (await response.json()) as {
        error?: string
        whatsappUrl?: string | null
      }

      if (!response.ok) {
        setState({
          kind: "error",
          message: result.error ?? "No pudimos enviar tu consulta. Probá de nuevo.",
        })
        return
      }

      form.reset()
      setState({ kind: "success", whatsappUrl: result.whatsappUrl ?? null })
    } catch {
      setState({
        kind: "error",
        message: "No pudimos conectar con el servidor. Revisá tu conexión e intentá otra vez.",
      })
    }
  }

  if (state.kind === "success") {
    return (
      <div className="lead-success" role="status" aria-live="polite">
        <span className="success-mark" aria-hidden="true">✓</span>
        <h3>Consulta recibida.</h3>
        <p>Guardamos tu mensaje y nos pondremos en contacto con vos.</p>
        {state.whatsappUrl ? (
          <a className="button button-light" href={state.whatsappUrl} target="_blank" rel="noopener noreferrer">
            Continuar por WhatsApp
          </a>
        ) : (
          <p className="whatsapp-note">WhatsApp no está configurado todavía; tu consulta quedó guardada correctamente.</p>
        )}
        <button className="reset-form" type="button" onClick={() => setState({ kind: "idle" })}>
          Enviar otra consulta
        </button>
      </div>
    )
  }

  return (
    <form className="lead-form" onSubmit={submitLead}>
      <div className="form-heading">
        <span>Contanos un poco</span>
        <span>Respuesta personal, sin compromiso.</span>
      </div>
      <label>
        Nombre
        <input name="name" autoComplete="name" placeholder="Tu nombre" maxLength={120} required />
      </label>
      <div className="form-row">
        <label>
          Email
          <input name="email" type="email" autoComplete="email" placeholder="nombre@correo.com" maxLength={254} required />
        </label>
        <label>
          Teléfono <span className="optional-label">Opcional</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+54 370 ..." maxLength={40} />
        </label>
      </div>
      <label>
        ¿En qué te podemos ayudar?
        <select name="service" defaultValue="" required>
          <option value="" disabled>Elegí un servicio</option>
          {SERVICES.map((service) => <option key={service.value} value={service.value}>{service.label}</option>)}
        </select>
      </label>
      <label>
        Detalle
        <textarea name="message" rows={4} maxLength={3000} placeholder="Contanos qué querés resolver..." required />
      </label>
      {state.kind === "error" && <p className="form-error" role="alert">{state.message}</p>}
      <button className="button button-light form-submit" type="submit" disabled={state.kind === "submitting"}>
        {state.kind === "submitting" ? "Enviando consulta…" : "Enviar consulta"}
        {state.kind !== "submitting" && <span aria-hidden="true">↗</span>}
      </button>
      <p className="privacy-note">Usamos tus datos solo para responder esta consulta.</p>
    </form>
  )
}
