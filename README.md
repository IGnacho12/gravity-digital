# Gravity Digital

Sitio institucional en español para servicios de asesoramiento tecnológico, capacitación y
automatización para hogares y empresas. Está construido con Astro, React, Tailwind CSS y el
adaptador de Vercel; las consultas se guardan en Neon.

## Desarrollo local

Requisitos: Node.js `>=22.23.4` y npm.

```sh
npm install
Copy-Item .env.example .env
npm run dev
```

Completa las variables de `.env` antes de probar el envío del formulario:

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión de Neon. Obligatoria para guardar consultas. |
| `PUBLIC_WHATSAPP` | Número de WhatsApp con código de país, solo dígitos (por ejemplo, `5493704000000`). Opcional. |

Si `PUBLIC_WHATSAPP` no está definido, los leads se siguen guardando en Neon y la interfaz
confirma que WhatsApp no está disponible todavía. Sin `DATABASE_URL`, el endpoint responde
con un error y no muestra el envío como exitoso.

## Persistencia

`POST /api/leads` valida el nombre, email, servicio y mensaje, crea la tabla si aún no existe y
guarda la consulta. La tabla `leads` tiene las columnas `id` (UUID), `name`, `email`, `phone`,
`service`, `message` y `created_at`. Los valores de `service` admitidos son `asesoramiento`,
`capacitacion` y `automatizacion`.

El servidor crea la tabla con `CREATE TABLE IF NOT EXISTS` al recibir la primera consulta;
no hace falta ejecutar una migración manual. Si preferís prepararla de antemano, el esquema
equivalente es:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel. El adaptador de Astro ya está configurado en
   `astro.config.mjs`.
2. Crea una base Neon y agrega `DATABASE_URL` en las variables de entorno del proyecto
   Vercel para los entornos que vayas a publicar.
3. Agrega `PUBLIC_WHATSAPP` cuando tengas definido el número de atención. Al ser pública,
   esta variable se incorpora a la salida del sitio.
4. Despliega y prueba el formulario. La página puede publicarse sin WhatsApp, pero no podrá
   aceptar consultas hasta que `DATABASE_URL` esté configurada correctamente.

No incluyas credenciales reales en el repositorio. `.env` está ignorado por Git; usa
`.env.example` como referencia para la configuración local.

## Comandos

```sh
npm run dev
npm run build
npm run preview
```
