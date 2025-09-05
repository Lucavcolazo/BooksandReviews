import { MongoClient, Db } from 'mongodb';

// Verificar MONGODB_URI solo cuando se necesite, no durante el build
function getMongoUri(): string {
  if (!process.env.MONGODB_URI) {
    throw new Error('Por favor, agrega tu MONGODB_URI a las variables de entorno');
  }
  return process.env.MONGODB_URI;
}
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usar una variable global para evitar múltiples conexiones
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(getMongoUri(), options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En producción, crear una nueva instancia del cliente
  client = new MongoClient(getMongoUri(), options);
  clientPromise = client.connect();
}

export default clientPromise;

// Función helper para obtener la base de datos
export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db('booksandreviews');
  } catch (error) {
    console.warn('⚠️ Error conectando a MongoDB Atlas, usando modo desarrollo:', error);
    
    // Importar y usar la versión de desarrollo
    const { getDatabase: getDevDatabase } = await import('./mongodb-dev');
    return getDevDatabase();
  }
}
