# 📚 Books & Reviews

Una plataforma moderna para descubrir libros y compartir reseñas, construida con Next.js 15, TypeScript y Tailwind CSS.

## 🚀 Características

- **Búsqueda de libros** usando la API de Google Books
- **Sistema de reseñas** con calificaciones y comentarios
- **Interfaz moderna** con diseño responsive
- **Toast notifications** para mejor UX
- **Tests completos** con Vitest y Testing Library
- **CI/CD pipeline** con GitHub Actions
- **Deploy automático** en Vercel
- **Containerización** con Docker

## 🌐 Demo en Vivo

**URL de la aplicación deployada:** [https://books-and-reviews-app.vercel.app](https://books-and-reviews-app.vercel.app)

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest, Testing Library
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions
- **Container:** Docker
- **API:** Google Books API

## 📦 Instalación y Desarrollo Local

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/books-and-reviews.git
   cd books-and-reviews
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia la aplicación en modo producción

# Testing
npm run test         # Ejecuta tests en modo watch
npm run test:run     # Ejecuta tests una vez
npm run test:ui      # Ejecuta tests con interfaz visual
npm run test:coverage # Ejecuta tests con reporte de cobertura

# Linting
npm run lint         # Ejecuta el linter
```

## 🐳 Ejecutar con Docker

### Construir la imagen localmente

```bash
# Construir la imagen
docker build -t books-and-reviews .

# Ejecutar el contenedor
docker run -p 3000:3000 books-and-reviews
```

### Usar la imagen desde GitHub Container Registry

```bash
# Pull de la imagen
docker pull ghcr.io/tu-usuario/books-and-reviews:latest

# Ejecutar
docker run -p 3000:3000 ghcr.io/tu-usuario/books-and-reviews:latest
```

## 🔧 Variables de Entorno

La aplicación no requiere variables de entorno para funcionar localmente, ya que usa la API pública de Google Books.

Para producción, puedes configurar:

```env
# Opcional: Configurar para personalizar
NEXT_PUBLIC_APP_NAME="Books & Reviews"
NEXT_PUBLIC_APP_DESCRIPTION="Plataforma de descubrimiento y reseñas de libros"
```

## 🚀 Deploy

### Deploy en Vercel (Recomendado)

1. **Conectar con GitHub**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el repositorio

2. **Configuración automática**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - El deploy se ejecutará automáticamente en cada push a `main`

3. **Variables de entorno (opcional)**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega las variables necesarias

### Deploy Manual

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start
```

## 🔄 GitHub Actions

El proyecto incluye tres workflows de GitHub Actions:

### 1. Build en Pull Requests
- **Archivo:** `.github/workflows/build.yml`
- **Trigger:** Pull Request a `main` o `master`
- **Acciones:**
  - Instala dependencias
  - Ejecuta linting
  - Construye la aplicación
  - Verifica que el build sea exitoso

### 2. Tests en Pull Requests
- **Archivo:** `.github/workflows/test.yml`
- **Trigger:** Pull Request a `main` o `master`
- **Acciones:**
  - Instala dependencias
  - Ejecuta tests unitarios
  - Genera reporte de cobertura
  - Sube reportes a Codecov

### 3. Docker Build y Publish
- **Archivo:** `.github/workflows/docker-publish.yml`
- **Trigger:** Push a `main` o `master`, o tags `v*`
- **Acciones:**
  - Construye imagen Docker
  - Publica en GitHub Container Registry
  - Aplica tags automáticos

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm run test:run

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test
```

### Estructura de Tests

```
src/__tests__/
├── books.test.ts           # Tests de Server Actions
├── reviews.test.ts         # Tests de utilidades de reseñas
├── utils.test.ts           # Tests de utilidades generales
├── BookCard.test.tsx       # Tests del componente BookCard
├── BookModal.simple.test.tsx # Tests del modal
├── MainMenu.test.tsx       # Tests del menú principal
├── page.test.tsx           # Tests de la página principal
└── ReviewsSection.test.tsx # Tests de la sección de reseñas
```

### Cobertura de Tests

- **115 tests** cubriendo toda la funcionalidad
- **Cobertura completa** de componentes principales
- **Tests de integración** para Server Actions
- **Tests de utilidades** para funciones auxiliares

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js 15
│   ├── actions/           # Server Actions
│   ├── api/              # API Routes
│   ├── components/       # Componentes React
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── src/
│   └── __tests__/        # Tests unitarios
├── .github/
│   └── workflows/        # GitHub Actions
├── Dockerfile            # Configuración Docker
├── next.config.ts        # Configuración Next.js
├── package.json          # Dependencias y scripts
├── tailwind.config.js    # Configuración Tailwind
└── vitest.config.ts      # Configuración Vitest
```

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Proceso de CI/CD

1. **Crear Pull Request** → Se ejecutan automáticamente:
   - Build verification
   - Tests unitarios
   - Linting

2. **Merge a main** → Se ejecuta automáticamente:
   - Deploy en Vercel
   - Build y push de Docker image

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Google Books API](https://developers.google.com/books) por proporcionar los datos de libros
- [Next.js](https://nextjs.org/) por el framework
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Vercel](https://vercel.com/) por el hosting
- [GitHub Actions](https://github.com/features/actions) por la automatización

---

**Desarrollado con ❤️ para el ejercicio de CI/CD**
