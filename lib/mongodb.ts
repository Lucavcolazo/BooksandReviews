import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor, agrega tu MONGODB_URI a las variables de entorno');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usar una variable global para evitar múltiples conexiones
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En producción, crear una nueva instancia del cliente
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Función helper para obtener la base de datos
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('booksandreviews');
}
