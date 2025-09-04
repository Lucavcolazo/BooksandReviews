import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Interfaz para el payload del JWT
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  displayName: string;
}

// Interfaz para la respuesta de autenticación
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  token?: string;
}

// Función para hashear contraseñas
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Función para verificar contraseñas
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Función para generar JWT
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Función para verificar JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Función para obtener el token de las cookies
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value || null;
}

// Función para obtener el usuario actual desde las cookies
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  
  return verifyToken(token);
}

// Función para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar contraseña
export function isValidPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un número' };
  }
  
  return { valid: true, message: 'Contraseña válida' };
}

// Función para validar username
export function isValidUsername(username: string): { valid: boolean; message: string } {
  if (username.length < 3) {
    return { valid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  
  if (username.length > 20) {
    return { valid: false, message: 'El nombre de usuario no puede tener más de 20 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, message: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos' };
  }
  
  return { valid: true, message: 'Nombre de usuario válido' };
}

// Función para validar displayName
export function isValidDisplayName(displayName: string): { valid: boolean; message: string } {
  if (displayName.length < 2) {
    return { valid: false, message: 'El nombre para mostrar debe tener al menos 2 caracteres' };
  }
  
  if (displayName.length > 50) {
    return { valid: false, message: 'El nombre para mostrar no puede tener más de 50 caracteres' };
  }
  
  return { valid: true, message: 'Nombre para mostrar válido' };
}
