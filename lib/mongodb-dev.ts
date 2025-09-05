// Versión de desarrollo que simula MongoDB sin conexión real
import { Db } from 'mongodb';

// Simulamos una base de datos en memoria para desarrollo
const mockDb = {
  collection: (name: string) => ({
    insertOne: async (doc: any) => {
      console.log(`[DEV] Insertando en ${name}:`, doc);
      return { insertedId: 'mock-id-' + Date.now() };
    },
    findOne: async (query: any) => {
      console.log(`[DEV] Buscando en ${name}:`, query);
      return null; // Simulamos que no encuentra nada
    },
    find: (query: any) => ({
      toArray: async () => {
        console.log(`[DEV] Buscando múltiples en ${name}:`, query);
        return []; // Simulamos que no encuentra nada
      }
    }),
    findOneAndUpdate: async (query: any, update: any, options: any) => {
      console.log(`[DEV] Actualizando en ${name}:`, { query, update, options });
      return null; // Simulamos que no encuentra nada
    },
    deleteOne: async (query: any) => {
      console.log(`[DEV] Eliminando en ${name}:`, query);
      return { deletedCount: 0 };
    }
  })
};

export async function getDatabase(): Promise<Db> {
  console.log('[DEV] Usando base de datos simulada');
  return mockDb as any;
}
