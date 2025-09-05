'use server'

import { getDatabase } from '@/lib/mongodb';
import { User, CreateUserData } from '@/lib/models/User';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken,
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidDisplayName,
  AuthResponse,
  JWTPayload
} from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Registrar un nuevo usuario
export async function registerUser(data: CreateUserData): Promise<AuthResponse> {
  try {
    // Validar datos de entrada
    if (!isValidEmail(data.email)) {
      return { success: false, message: 'Email inválido' };
    }

    const passwordValidation = isValidPassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message };
    }

    const usernameValidation = isValidUsername(data.username);
    if (!usernameValidation.valid) {
      return { success: false, message: usernameValidation.message };
    }

    const displayNameValidation = isValidDisplayName(data.displayName);
    if (!displayNameValidation.valid) {
      return { success: false, message: displayNameValidation.message };
    }

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
      return { success: false, message: 'El email o nombre de usuario ya está en uso' };
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(data.password);

    const newUser: Omit<User, '_id'> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      password: hashedPassword,
      avatar: data.avatar,
      bio: data.bio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      emailVerified: false
    };

    const result = await usersCollection.insertOne(newUser as User);
    
    if (!result.insertedId) {
      return { success: false, message: 'Error al crear el usuario' };
    }

    // Generar token JWT
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      displayName: newUser.displayName
    });

    // Establecer cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
        avatar: newUser.avatar
      },
      token
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
}

// Iniciar sesión
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    if (!email || !password) {
      return { success: false, message: 'Email y contraseña son requeridos' };
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    // Buscar usuario por email
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return { success: false, message: 'Credenciales inválidas' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Cuenta desactivada' };
    }

    // Verificar contraseña
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Credenciales inválidas' };
    }

    // Actualizar último inicio de sesión
    await usersCollection.updateOne(
      { id: user.id },
      { 
        $set: { 
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    );

    // Generar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName
    });

    // Establecer cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      },
      token
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
}

// Cerrar sesión
export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    
    return { success: true, message: 'Sesión cerrada exitosamente' };
  } catch (error) {
    console.error('Error logging out user:', error);
    return { success: false, message: 'Error al cerrar sesión' };
  }
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return { success: false, message: 'No hay sesión activa' };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { success: false, message: 'Token inválido' };
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const user = await usersCollection.findOne({ id: payload.userId });
    
    if (!user || !user.isActive) {
      return { success: false, message: 'Usuario no encontrado o inactivo' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, message: 'Error al obtener usuario actual' };
  }
}

// Verificar si el usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  try {
    const result = await getCurrentUser();
    return result.success;
  } catch (error) {
    return false;
  }
}

// Middleware para proteger rutas
export async function requireAuth(): Promise<User> {
  const result = await getCurrentUser();
  
  if (!result.success || !result.user) {
    redirect('/auth/login');
  }
  
  return result.user as User;
}
