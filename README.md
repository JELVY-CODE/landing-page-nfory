# landing-page-nfory

Landing page oficial de **NFory** ([nfory.com](https://nfory.com)), consultora de ingeniería de IA y automatización de procesos.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) · React 19 · TypeScript
- Tailwind CSS 4
- Three.js (diagrama 3D del pipeline) y Canvas 2D (red de nodos del fondo)
- react-day-picker (calendario de la agenda) · simple-icons (logos oficiales)
- [Resend](https://resend.com) para el envío del formulario de contacto

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
npm start        # servidor de producción
npm run lint
```

La raíz `/` redirige al idioma del navegador (`proxy.ts`). Idiomas disponibles: `es` (por defecto), `en`, `ko`, `ja`, `zh`, `de`, `ru`.

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

| Variable | Descripción |
| --- | --- |
| `RESEND_API_KEY` | API key de Resend. Sin ella el formulario muestra un aviso y no envía correos. |
| `CONTACT_TO_EMAIL` | Destinatario de las solicitudes (por defecto `jesuslizarraga@nfory.com`). |
| `CONTACT_FROM_EMAIL` | Remitente. Requiere un dominio verificado en Resend (p. ej. `NFory <web@nfory.com>`). |

## Estructura

```
app/
  [lang]/            Páginas por idioma: landing (/) y desarrolladores (/developers)
  actions/           Server Action del formulario de contacto
  globals.css
components/          Componentes de la interfaz
data/                Contenido estructurado de la landing (editar aquí)
  content/           Textos de la página en cada idioma (es.ts define la estructura)
  site.ts            Nombre, correo, navegación y redes sociales
  gallery.ts         Tarjetas de proyectos
  team.ts            Integrantes y modelos de IA
  contact.ts         Servicios y franjas horarias del formulario
  orchestration.ts   Nodos, conexiones y etapas del diagrama del pipeline
lib/                 Lógica: i18n, geometría y escena 3D, fase lunar, utilidades
public/images/       Assets de marca
proxy.ts             Redirección al idioma del visitante
```

### Editar contenido

Todo lo que muestra la página vive en `data/`:

- **Textos**: `data/content/<idioma>.ts`. Al añadir una clave en `es.ts`, TypeScript exige añadirla en el resto de idiomas.
- **Proyectos**: rellena los campos de `data/gallery.ts` (texto por idioma; si falta una traducción se usa el español) y coloca las imágenes en `public/images/`.
- **Desarrolladores**: completa nombre, cargo, foto y enlaces en `data/team.ts`.
- **Redes sociales**: URLs en `data/site.ts`.

## Despliegue en Vercel

Vercel detecta Next.js automáticamente; no requiere configuración adicional.

1. Importa el repositorio en Vercel.
2. Añade las variables de entorno anteriores en **Settings → Environment Variables**.
3. Despliega.
