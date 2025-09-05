'use server'

import { getDatabase } from '@/lib/mongodb';
import { User, CreateUserData, UpdateUserData } from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Crear un nuevo usuario
export async function createUser(data: CreateUserData): Promise<User> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({
      $or: [
        { email: data.email },
        { username: data.username }
      ]
    });

    if (existingUser) {
      throw new Error('El usuario ya existe con ese email o nombre de usuario');
    }

    const newUser: Omit<User, '_id'> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      password: await hashPassword(data.password),
      avatar: data.avatar,
      bio: data.bio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      emailVerified: false
    };

    const result = await usersCollection.insertOne(newUser as User);
    
    if (!result.insertedId) {
      throw new Error('Error al crear el usuario');
    }

    return { ...newUser, _id: result.insertedId } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al crear el usuario');
  }
}

// Obtener usuario por ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const user = await usersCollection.findOne({ id: userId });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Error al obtener el usuario');
  }
}

// Obtener usuario por email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const user = await usersCollection.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Error al obtener el usuario');
  }
}

// Obtener usuario por username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const user = await usersCollection.findOne({ username });
    return user;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw new Error('Error al obtener el usuario');
  }
}

// Actualizar usuario
export async function updateUser(userId: string, data: UpdateUserData): Promise<User> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    // Actualizar solo los campos que se proporcionen
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.bio !== undefined) updateData.bio = data.bio;

    const result = await usersCollection.findOneAndUpdate(
      { id: userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Usuario no encontrado');
    }

    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Error al actualizar el usuario');
  }
}


// Eliminar usuario (soft delete)
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const result = await usersCollection.findOneAndUpdate(
      { id: userId },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date().toISOString()
        }
      }
    );

    return !!result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error al eliminar el usuario');
  }
}

// Obtener todos los usuarios (con paginación)
export async function getAllUsers(page: number = 1, limit: number = 20): Promise<{ users: User[], total: number }> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      usersCollection
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      usersCollection.countDocuments({ isActive: true })
    ]);
    
    return { users, total };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error al obtener los usuarios');
  }
}
