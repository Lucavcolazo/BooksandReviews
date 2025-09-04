import { ObjectId } from 'mongodb';

export type VoteType = 'like' | 'dislike' | 'helpful' | 'report';

export interface Vote {
  _id?: ObjectId;
  id: string; // ID único para compatibilidad con el frontend
  userId: string; // Usuario que vota
  targetType: 'review' | 'comment'; // Tipo de contenido votado
  targetId: string; // ID del review o comentario
  voteType: VoteType;
  createdAt: string;
  updatedAt: string;
  isActive: boolean; // Para poder "desvotar"
}

export interface CreateVoteData {
  userId: string;
  targetType: 'review' | 'comment';
  targetId: string;
  voteType: VoteType;
}

export interface VoteStats {
  likes: number;
  dislikes: number;
  helpful: number;
  reports: number;
  userVote?: VoteType; // El voto del usuario actual
}

export interface VoteFilters {
  userId?: string;
  targetType?: 'review' | 'comment';
  targetId?: string;
  voteType?: VoteType;
  isActive?: boolean;
}
