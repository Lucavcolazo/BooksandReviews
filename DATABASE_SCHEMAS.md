# 📊 Esquemas de Base de Datos - Books & Reviews

Este documento describe los esquemas de base de datos implementados en MongoDB Atlas para la aplicación Books & Reviews.

## 🗂️ Colecciones

### 1. **Users** (Usuarios)
Almacena información de los usuarios de la aplicación.

```typescript
interface User {
  _id?: ObjectId;
  id: string;                    
  email: string;                 
  username: string;             
  displayName: string;           
  avatar?: string;              
  bio?: string;                  
  createdAt: string;             
  updatedAt: string;             
  isActive: boolean;             
  preferences: {                 
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      newReviews: boolean;
      likes: boolean;
    };
  };
  stats: {                       // Estadísticas del usuario
    totalReviews: number;
    totalLikes: number;
    totalDislikes: number;
    booksRead: number;
    booksFavorited: number;
  };
}
```

**Índices:**
- `email` (único)
- `username` (único)
- `id` (único)
- `createdAt` (descendente)

### 2. **Reviews** (Reseñas)
Almacena las reseñas de libros escritas por los usuarios.

```typescript
interface Review {
  _id?: ObjectId;
  id: string;                    // ID único para compatibilidad con frontend
  bookId: string;                // ID del libro (Google Books)
  bookTitle: string;             // Título del libro
  bookThumbnail?: string;        // URL de la portada
  rating: number;                // Calificación (1-5)
  content: string;               // Contenido de la reseña
  createdAt: string;             // Fecha de creación
  updatedAt: string;             // Fecha de última actualización
  userId: string;                // ID del usuario que escribió la reseña
  userDisplayName: string;       // Nombre del usuario (para evitar joins)
  userAvatar?: string;           // Avatar del usuario
  isEdited: boolean;             // Si la reseña fue editada
  isPublic: boolean;             // Si la reseña es pública
  stats: {                       // ísticas de la reseña
    likes: number;
    dislikes: number;
    helpful: number;             // Reseñas marcadas como útiles
    reports: number;             // Reportes de contenido inapropiado
  };
  tags?: string[];               // Tags para categorizar
  spoilerWarning?: boolean;      // Advertencia de spoilers
}
```

**Índices:**
- `id` (único)
- `bookId`
- `userId`
- `createdAt` (descendente)
- `rating`
- `isPublic`
- `stats.likes` (descendente)
- `bookId + userId` (único) - Un usuario solo puede reseñar un libro una vez

### 3. **Votes** (Votaciones)
Almacena los votos (likes, dislikes, útiles, reportes) de los usuarios.

```typescript
interface Vote {
  _id?: ObjectId;
  id: string;                    // ID único para compatibilidad con frontend
  userId: string;                // Usuario que vota
  targetType: 'review' | 'comment'; // Tipo de contenido votado
  targetId: string;              // ID del review o comentario
  voteType: 'like' | 'dislike' | 'helpful' | 'report'; // Tipo de voto
  createdAt: string;             // Fecha de creación
  updatedAt: string;             // Fecha de última actualización
  isActive: boolean;             // Si el voto está activo (para "desvotar")
}
```

**Índices:**
- `id` (único)
- `userId`
- `targetType + targetId`
- `voteType`
- `createdAt` (descendente)
- `userId + targetType + targetId` (único) - Un usuario solo puede votar una vez por contenido

### 4. **BookLists** (Listas de Libros)
Almacena las listas de libros de los usuarios (favoritos, por leer, leyendo, leídos, personalizadas).

```typescript
interface BookList {
  _id?: ObjectId;
  id: string;                    // ID único para compatibilidad con frontend
  userId: string;                // Propietario de la lista
  name: string;                  // Nombre de la lista
  description?: string;          // Descripción de la lista
  type: 'favorites' | 'want-to-read' | 'currently-reading' | 'read' | 'custom';
  isPublic: boolean;             // Si la lista es pública
  isDefault: boolean;            // Si es una lista por defecto del sistema
  createdAt: string;             // Fecha de creación
  updatedAt: string;             // Fecha de última actualización
  bookCount: number;             // Número de libros en la lista
  books: BookListItem[];         // Libros en la lista
}

interface BookListItem {
  bookId: string;                // ID del libro
  bookTitle: string;             // Título del libro
  bookThumbnail?: string;        // URL de la portada
  bookAuthors: string[];         // Autores del libro
  addedAt: string;               // Cuándo se agregó a la lista
  notes?: string;                // Notas personales del usuario
  rating?: number;               // Calificación personal
  readDate?: string;             // Fecha de lectura
  progress?: number;             // Progreso de lectura (0-100)
}
```

**Índices:**
- `id` (único)
- `userId`
- `type`
- `isPublic`
- `createdAt` (descendente)
- `updatedAt` (descendente)
- `books.bookId`

## 🔗 Relaciones

### Relaciones Principales:
1. **User → Reviews**: Un usuario puede tener múltiples reseñas
2. **User → Votes**: Un usuario puede votar múltiples contenidos
3. **User → BookLists**: Un usuario puede tener múltiples listas
4. **Review → Votes**: Una reseña puede tener múltiples votos
5. **BookList → BookListItem**: Una lista contiene múltiples libros

### Restricciones:
- Un usuario solo puede reseñar un libro una vez
- Un usuario solo puede votar una vez por contenido
- Los emails y usernames deben ser únicos

## 🛠️ Server Actions Disponibles

### Users
- `createUser()` - Crear usuario
- `getUserById()` - Obtener usuario por ID
- `getUserByEmail()` - Obtener usuario por email
- `getUserByUsername()` - Obtener usuario por username
- `updateUser()` - Actualizar usuario
- `updateUserStats()` - Actualizar estadísticas
- `deleteUser()` - Eliminar usuario (soft delete)
- `getAllUsers()` - Obtener todos los usuarios

### Reviews
- `createReview()` - Crear reseña
- `getAllReviews()` - Obtener todas las reseñas
- `getReviewByBookId()` - Obtener reseña por libro
- `updateReview()` - Actualizar reseña
- `deleteReview()` - Eliminar reseña
- `incrementLikes()` - Incrementar likes
- `incrementDislikes()` - Incrementar dislikes

### Votes
- `createOrUpdateVote()` - Crear o actualizar voto
- `removeVote()` - Eliminar voto
- `getVoteStats()` - Obtener estadísticas de votos
- `getUserVotes()` - Obtener votos de usuario
- `getAllVotes()` - Obtener todos los votos

### BookLists
- `createBookList()` - Crear lista
- `getUserBookLists()` - Obtener listas del usuario
- `getBookListById()` - Obtener lista por ID
- `updateBookList()` - Actualizar lista
- `addBookToList()` - Agregar libro a lista
- `updateBookInList()` - Actualizar libro en lista
- `removeBookFromList()` - Remover libro de lista
- `deleteBookList()` - Eliminar lista
- `getPublicBookLists()` - Obtener listas públicas
- `isBookInList()` - Verificar si libro está en lista

## 🚀 Utilidades de Base de Datos

### `createDatabaseIndexes()`
Crea todos los índices necesarios para optimizar las consultas.

### `clearTestData()`
Limpia todos los datos de prueba (solo en desarrollo).

### `getDatabaseStats()`
Obtiene estadísticas generales de la base de datos.

### `migrateLocalStorageData()`
Migra datos existentes de localStorage a MongoDB.

## 📝 Notas de Implementación

1. **Compatibilidad**: Todos los esquemas incluyen un campo `id` para compatibilidad con el frontend existente.

2. **Soft Delete**: Los usuarios se eliminan con `isActive: false` en lugar de eliminación física.

3. **Estadísticas**: Las estadísticas se almacenan denormalizadas para mejorar el rendimiento.

4. **Índices Únicos**: Se implementan restricciones de unicidad para evitar duplicados.

5. **Timestamps**: Todos los documentos incluyen `createdAt` y `updatedAt` para auditoría.

6. **Escalabilidad**: Los esquemas están diseñados para soportar funcionalidades futuras como comentarios, notificaciones, etc.
