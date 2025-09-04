# 📚 Books & Reviews

Una plataforma moderna para descubrir libros y compartir reseñas, construida con Next.js 15, TypeScript y Tailwind CSS.

## 🌐 Deployd

**[https://booksandreviews.vercel.app/](https://booksandreviews.vercel.app/)**

## 🚀 Características

- **Búsqueda de libros** usando la API de Google Books
- **Sistema de reseñas** con calificaciones y comentarios
- **Base de datos MongoDB** para persistencia de datos
- **Server Actions** para operaciones de base de datos
- **Interfaz moderna** con diseño responsive
- **Toast notifications** para mejor UX
- **Tests completos** con Vitest y Testing Library
- **CI/CD pipeline** con GitHub Actions
- **Deploy automático** en Vercel
- **Containerización** con Docker

## 🛠️ Tecnologías

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB Atlas
- **Testing:** Vitest, Testing Library
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions
- **Container:** Docker
- **API:** Google Books API

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+
- npm o yarn
- MongoDB Atlas (para persistencia de reseñas)

### Pasos
```bash
# Clonar y instalar
git clone https://github.com/tu-usuario/books-and-reviews.git
cd books-and-reviews
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu MONGODB_URI

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno
Crea un archivo `.env.local` con:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booksandreviews?retryWrites=true&w=majority
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run test:run     # Ejecutar tests
npm run test:coverage # Tests con cobertura
npm run lint         # Linting
```

## 🐳 Docker

```bash
# Construir y ejecutar localmente
docker build -t books-and-reviews .
docker run -p 3000:3000 books-and-reviews

# Usar imagen desde GitHub Container Registry
docker pull ghcr.io/tu-usuario/books-and-reviews:latest
docker run -p 3000:3000 ghcr.io/tu-usuario/books-and-reviews:latest
```

## 🔄 CI/CD Pipeline

El proyecto incluye tres workflows de GitHub Actions:

1. **Build en Pull Requests** - Verifica que el build sea exitoso
2. **Tests en Pull Requests** - Ejecuta tests unitarios y genera cobertura
3. **Docker Build y Publish** - Construye y publica imagen Docker en GHCR

## 🧪 Testing

- **115 tests** cubriendo toda la funcionalidad
- **Cobertura completa** de componentes principales
- **Tests de integración** para Server Actions

```bash
npm run test:run        # Ejecutar todos los tests
npm run test:coverage   # Tests con reporte de cobertura
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js 15
│   ├── actions/           # Server Actions (books, reviews)
│   ├── api/              # API Routes
│   ├── components/       # Componentes React
│   └── page.tsx          # Página principal
├── lib/                   # Utilidades y configuración
│   ├── mongodb.ts        # Configuración de MongoDB
│   ├── models/           # Modelos de datos
│   └── migrate-reviews.ts # Script de migración
├── src/__tests__/        # Tests unitarios
├── .github/workflows/    # GitHub Actions
├── Dockerfile            # Configuración Docker
└── package.json          # Dependencias y scripts
```

