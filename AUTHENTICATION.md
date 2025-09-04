# 🔐 Sistema de Autenticación - Books & Reviews

Este documento describe el sistema completo de autenticación implementado en la aplicación Books & Reviews.

## 🏗️ Arquitectura del Sistema

### **Componentes Principales:**

1. **Utilidades de Autenticación** (`lib/auth.ts`)
2. **Server Actions** (`app/actions/auth.ts`)
3. **Contexto de Autenticación** (`lib/auth-context.tsx`)
4. **Componentes de UI** (Login, Registro, Modal)
5. **Integración con Base de Datos**

## 🔧 Funcionalidades Implementadas

### **✅ Registro de Usuarios**
- Validación completa de formularios
- Verificación de unicidad de email y username
- Hash seguro de contraseñas con bcrypt
- Creación automática de perfil de usuario
- Generación de JWT token

### **✅ Inicio de Sesión**
- Autenticación con email y contraseña
- Verificación de credenciales
- Actualización de último acceso
- Generación de JWT token
- Manejo de errores

### **✅ Gestión de Sesiones**
- JWT tokens con expiración de 7 días
- Cookies HTTP-only seguras
- Contexto global de autenticación
- Persistencia de sesión

### **✅ Cierre de Sesión**
- Eliminación de cookies
- Limpieza del contexto
- Redirección automática

## 🎨 Componentes de UI

### **AuthButton**
- Botón inteligente que cambia según el estado de autenticación
- Menú desplegable para usuarios autenticados
- Botones de login/registro para usuarios no autenticados

### **AuthModal**
- Modal reutilizable para autenticación
- Cambio dinámico entre login y registro
- Diseño consistente con la temática de la app

### **LoginForm**
- Formulario de inicio de sesión
- Validación en tiempo real
- Mostrar/ocultar contraseña
- Manejo de errores

### **RegisterForm**
- Formulario de registro completo
- Validación de todos los campos
- Confirmación de contraseña
- Validación de fortaleza de contraseña

## 🔒 Seguridad Implementada

### **Validaciones de Contraseña:**
- Mínimo 8 caracteres
- Al menos una letra minúscula
- Al menos una letra mayúscula
- Al menos un número

### **Validaciones de Username:**
- Mínimo 3 caracteres, máximo 20
- Solo letras, números, guiones y guiones bajos
- Único en la base de datos

### **Validaciones de Email:**
- Formato de email válido
- Único en la base de datos

### **Seguridad de Tokens:**
- JWT con firma segura
- Expiración de 7 días
- Cookies HTTP-only
- Configuración segura para producción

## 📊 Base de Datos

### **Campos de Usuario Actualizados:**
```typescript
interface User {
  // ... campos existentes
  password: string;           // Contraseña hasheada
  emailVerified: boolean;     // Para futuras funcionalidades
  lastLogin?: string;         // Último inicio de sesión
}
```

### **Índices de Seguridad:**
- Email único
- Username único
- ID único

## 🚀 Server Actions

### **registerUser(data: CreateUserData)**
- Valida todos los campos
- Verifica unicidad
- Hashea contraseña
- Crea usuario en BD
- Genera JWT
- Establece cookie

### **loginUser(email: string, password: string)**
- Busca usuario por email
- Verifica contraseña
- Actualiza último login
- Genera JWT
- Establece cookie

### **logoutUser()**
- Elimina cookie de autenticación
- Limpia sesión

### **getCurrentUser()**
- Obtiene usuario desde JWT
- Verifica validez del token
- Retorna datos del usuario

## 🎯 Integración con Componentes

### **BookModal**
- Verifica autenticación antes de permitir reseñas
- Muestra mensaje para usuarios no autenticados
- Usa datos del usuario autenticado para reseñas

### **ReviewsSection**
- Carga reseñas del usuario autenticado
- Maneja estado de autenticación

### **Header**
- Muestra botón de autenticación
- Cambia según estado del usuario

## 🔄 Flujo de Autenticación

### **Registro:**
1. Usuario llena formulario
2. Validación en cliente
3. Envío a Server Action
4. Validación en servidor
5. Creación de usuario
6. Generación de JWT
7. Establecimiento de cookie
8. Actualización del contexto
9. Redirección/cierre de modal

### **Login:**
1. Usuario ingresa credenciales
2. Validación en cliente
3. Envío a Server Action
4. Verificación en BD
5. Generación de JWT
6. Establecimiento de cookie
7. Actualización del contexto
8. Redirección/cierre de modal

### **Logout:**
1. Usuario hace clic en cerrar sesión
2. Llamada a Server Action
3. Eliminación de cookie
4. Limpieza del contexto
5. Actualización de UI

## 🛠️ Configuración

### **Variables de Entorno Requeridas:**
```env
JWT_SECRET=tu-secreto-jwt-super-seguro
MONGODB_URI=tu-string-de-conexion-mongodb
```

### **Dependencias Instaladas:**
- `bcryptjs` - Hash de contraseñas
- `jsonwebtoken` - JWT tokens
- `js-cookie` - Manejo de cookies

## 🎨 Temática Visual

### **Colores Consistentes:**
- Fondo: `bg-amber-50`
- Header: `bg-amber-900`
- Botones: `bg-amber-900` / `hover:bg-amber-800`
- Formularios: `border-amber-300`
- Texto: `text-amber-900`

### **Iconos Temáticos:**
- Libros para autenticación
- Usuarios para perfiles
- Candados para seguridad

## 🔮 Funcionalidades Futuras

### **Preparado para:**
- Verificación de email
- Recuperación de contraseña
- Autenticación con redes sociales
- Perfiles de usuario avanzados
- Roles y permisos
- Autenticación de dos factores

## 📝 Notas de Implementación

1. **Compatibilidad**: Mantiene compatibilidad con usuarios anónimos
2. **UX**: Transiciones suaves y feedback visual
3. **Accesibilidad**: Labels y ARIA apropiados
4. **Responsive**: Funciona en todos los dispositivos
5. **Performance**: Contexto optimizado con React
6. **Seguridad**: Mejores prácticas implementadas

## 🧪 Testing

El sistema está preparado para testing con:
- Mocks de Server Actions
- Contexto de autenticación mockeable
- Validaciones testables
- Componentes aislados
