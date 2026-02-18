# web-cursos-api

Backend API para la plataforma de cursos IATIBET ZUREON.

## Stack
- Node.js + Vercel Serverless Functions
- MongoDB (Mongoose)

## Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| GET    | `/api/courses` | Listar todos los cursos |
| GET    | `/api/courses/:id` | Obtener un curso |
| POST   | `/api/courses` | Crear curso |
| PUT    | `/api/courses/:id` | Actualizar curso |
| DELETE | `/api/courses/:id` | Eliminar curso |
| POST   | `/api/courses/:id/chapters` | Agregar capítulo |
| PUT    | `/api/courses/:id/chapters/:chapterId` | Editar capítulo |
| DELETE | `/api/courses/:id/chapters/:chapterId` | Eliminar capítulo |
| POST   | `/api/courses/:id/chapters/:chapterId/episodes` | Agregar episodio |
| PUT    | `/api/courses/:id/chapters/:chapterId/episodes/:episodeId` | Editar episodio |
| DELETE | `/api/courses/:id/chapters/:chapterId/episodes/:episodeId` | Eliminar episodio |

## Deploy en Vercel

1. Sube este proyecto a un repo de GitHub (ej: `web-cursos-api`)
2. Importa el repo en [vercel.com](https://vercel.com)
3. En **Settings → Environment Variables** añade:
   - `MONGODB_URI` = tu URI de MongoDB

## Variables de entorno

```
MONGODB_URI=mongodb://admin:ADMIN_sifrah@ec2-18-220-240-71.us-east-2.compute.amazonaws.com:27017/cursos_db?authSource=admin
```

## Uso desde el frontend

Una vez desplegado, actualiza `config.js` en el frontend:

```js
const API_BASE = 'https://tu-proyecto.vercel.app';
```
