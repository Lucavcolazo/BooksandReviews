import { getDatabase } from './mongodb';
import { DatabaseCollection } from './models';

// Función para crear índices en las colecciones
export async function createDatabaseIndexes() {
  try {
    const db = await getDatabase();
    
    // Índices para usuarios
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
      { key: { id: 1 }, unique: true },
      { key: { createdAt: -1 } }
    ]);

    // Índices para reseñas
    await db.collection('reviews').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { bookId: 1 } },
      { key: { userId: 1 } },
      { key: { createdAt: -1 } },
      { key: { rating: 1 } },
      { key: { isPublic: 1 } },
      { key: { 'stats.likes': -1 } },
      { key: { bookId: 1, userId: 1 }, unique: true } // Un usuario solo puede reseñar un libro una vez
    ]);

    // Índices para votos
    await db.collection('votes').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { userId: 1 } },
      { key: { targetType: 1, targetId: 1 } },
      { key: { voteType: 1 } },
      { key: { createdAt: -1 } },
      { key: { userId: 1, targetType: 1, targetId: 1 }, unique: true } // Un usuario solo puede votar una vez por contenido
    ]);

    // Índices para listas de libros
    await db.collection('booklists').createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { userId: 1 } },
      { key: { type: 1 } },
      { key: { isPublic: 1 } },
      { key: { createdAt: -1 } },
      { key: { updatedAt: -1 } },
      { key: { 'books.bookId': 1 } }
    ]);

    console.log('Índices de base de datos creados exitosamente');
  } catch (error) {
    console.error('Error creando índices de base de datos:', error);
    throw error;
  }
}

// Función para limpiar datos de prueba
export async function clearTestData() {
  try {
    const db = await getDatabase();
    
    // Solo ejecutar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Esta función solo se puede ejecutar en desarrollo');
    }

    await Promise.all([
      db.collection('users').deleteMany({}),
      db.collection('reviews').deleteMany({}),
      db.collection('votes').deleteMany({}),
      db.collection('booklists').deleteMany({})
    ]);

    console.log('Datos de prueba eliminados');
  } catch (error) {
    console.error('Error limpiando datos de prueba:', error);
    throw error;
  }
}

// Función para obtener estadísticas de la base de datos
export async function getDatabaseStats() {
  try {
    const db = await getDatabase();
    
    const [usersCount, reviewsCount, votesCount, bookListsCount] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('reviews').countDocuments(),
      db.collection('votes').countDocuments(),
      db.collection('booklists').countDocuments()
    ]);

    return {
      users: usersCount,
      reviews: reviewsCount,
      votes: votesCount,
      bookLists: bookListsCount,
      total: usersCount + reviewsCount + votesCount + bookListsCount
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de la base de datos:', error);
    throw error;
  }
}

// Función para migrar datos de localStorage a MongoDB
export async function migrateLocalStorageData(localStorageData: any) {
  try {
    const db = await getDatabase();
    
    if (!localStorageData || !localStorageData.reviews) {
      console.log('No hay datos de localStorage para migrar');
      return;
    }

    const reviews = localStorageData.reviews;
    const migratedReviews = [];

    for (const review of reviews) {
      try {
        // Crear un usuario temporal si no existe
        let userId = review.userId || 'anonymous-user';
        let userDisplayName = review.userDisplayName || 'Usuario Anónimo';

        // Verificar si el usuario existe
        const existingUser = await db.collection('users').findOne({ id: userId });
        
        if (!existingUser) {
          // Crear usuario temporal
          const tempUser = {
            id: userId,
            email: `temp-${userId}@example.com`,
            username: `user-${userId}`,
            displayName: userDisplayName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            preferences: {
              theme: 'light' as const,
              language: 'es',
              notifications: {
                email: true,
                push: true,
                newReviews: true,
                likes: true
              }
            },
            stats: {
              totalReviews: 0,
              totalLikes: 0,
              totalDislikes: 0,
              booksRead: 0,
              booksFavorited: 0
            }
          };

          await db.collection('users').insertOne(tempUser);
        }

        // Migrar reseña
        const migratedReview = {
          ...review,
          id: review.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId,
          userDisplayName,
          createdAt: review.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isEdited: false,
          isPublic: true,
          stats: {
            likes: review.likes || 0,
            dislikes: review.dislikes || 0,
            helpful: 0,
            reports: 0
          },
          tags: review.tags || [],
          spoilerWarning: review.spoilerWarning || false
        };

        await db.collection('reviews').insertOne(migratedReview);
        migratedReviews.push(migratedReview);
      } catch (error) {
        console.error(`Error migrando reseña ${review.id}:`, error);
      }
    }

    console.log(`Migradas ${migratedReviews.length} reseñas de localStorage`);
    return migratedReviews;
  } catch (error) {
    console.error('Error migrando datos de localStorage:', error);
    throw error;
  }
}
