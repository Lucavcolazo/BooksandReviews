'use server'

import { getDatabase } from '@/lib/mongodb';
import { Vote, CreateVoteData, VoteType, VoteStats, VoteFilters } from '@/lib/models/Vote';
import { ObjectId } from 'mongodb';

// Crear o actualizar un voto
export async function createOrUpdateVote(data: CreateVoteData): Promise<Vote> {
  try {
    const db = await getDatabase();
    const votesCollection = db.collection<Vote>('votes');
    
    // Buscar si ya existe un voto del usuario para este contenido
    const existingVote = await votesCollection.findOne({
      userId: data.userId,
      targetType: data.targetType,
      targetId: data.targetId
    });

    if (existingVote) {
      // Si ya existe, actualizar el tipo de voto
      const result = await votesCollection.findOneAndUpdate(
        { id: existingVote.id },
        { 
          $set: { 
            voteType: data.voteType,
            updatedAt: new Date().toISOString(),
            isActive: true
          }
        },
        { returnDocument: 'after' }
      );

      if (!result) {
        throw new Error('Error al actualizar el voto');
      }

      return result;
    } else {
      // Crear nuevo voto
      const newVote: Omit<Vote, '_id'> = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId: data.userId,
        targetType: data.targetType,
        targetId: data.targetId,
        voteType: data.voteType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      const result = await votesCollection.insertOne(newVote as Vote);
      
      if (!result.insertedId) {
        throw new Error('Error al crear el voto');
      }

      return { ...newVote, _id: result.insertedId } as Vote;
    }
  } catch (error) {
    console.error('Error creating/updating vote:', error);
    throw new Error('Error al procesar el voto');
  }
}

// Eliminar un voto (desvotar)
export async function removeVote(userId: string, targetType: string, targetId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const votesCollection = db.collection<Vote>('votes');
    
    const result = await votesCollection.findOneAndUpdate(
      { 
        userId,
        targetType: targetType as 'review' | 'comment',
        targetId
      },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date().toISOString()
        }
      }
    );

    return !!result;
  } catch (error) {
    console.error('Error removing vote:', error);
    throw new Error('Error al eliminar el voto');
  }
}

// Obtener estadísticas de votos para un contenido
export async function getVoteStats(targetType: string, targetId: string, userId?: string): Promise<VoteStats> {
  try {
    const db = await getDatabase();
    const votesCollection = db.collection<Vote>('votes');
    
    const pipeline = [
      {
        $match: {
          targetType: targetType as 'review' | 'comment',
          targetId,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$voteType',
          count: { $sum: 1 }
        }
      }
    ];

    const voteCounts = await votesCollection.aggregate(pipeline).toArray();
    
    const stats: VoteStats = {
      likes: 0,
      dislikes: 0,
      helpful: 0,
      reports: 0
    };

    voteCounts.forEach(vote => {
      switch (vote._id) {
        case 'like':
          stats.likes = vote.count;
          break;
        case 'dislike':
          stats.dislikes = vote.count;
          break;
        case 'helpful':
          stats.helpful = vote.count;
          break;
        case 'report':
          stats.reports = vote.count;
          break;
      }
    });

    // Si se proporciona userId, obtener el voto del usuario
    if (userId) {
      const userVote = await votesCollection.findOne({
        userId,
        targetType: targetType as 'review' | 'comment',
        targetId,
        isActive: true
      });

      if (userVote) {
        stats.userVote = userVote.voteType;
      }
    }

    return stats;
  } catch (error) {
    console.error('Error getting vote stats:', error);
    throw new Error('Error al obtener las estadísticas de votos');
  }
}

// Obtener votos de un usuario
export async function getUserVotes(userId: string, filters?: VoteFilters): Promise<Vote[]> {
  try {
    const db = await getDatabase();
    const votesCollection = db.collection<Vote>('votes');
    
    const query: any = { userId, isActive: true };
    
    if (filters) {
      if (filters.targetType) query.targetType = filters.targetType;
      if (filters.targetId) query.targetId = filters.targetId;
      if (filters.voteType) query.voteType = filters.voteType;
    }

    const votes = await votesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return votes;
  } catch (error) {
    console.error('Error fetching user votes:', error);
    throw new Error('Error al obtener los votos del usuario');
  }
}

// Obtener todos los votos (con filtros)
export async function getAllVotes(filters?: VoteFilters, page: number = 1, limit: number = 50): Promise<{ votes: Vote[], total: number }> {
  try {
    const db = await getDatabase();
    const votesCollection = db.collection<Vote>('votes');
    
    const query: any = { isActive: true };
    
    if (filters) {
      if (filters.userId) query.userId = filters.userId;
      if (filters.targetType) query.targetType = filters.targetType;
      if (filters.targetId) query.targetId = filters.targetId;
      if (filters.voteType) query.voteType = filters.voteType;
    }

    const skip = (page - 1) * limit;
    
    const [votes, total] = await Promise.all([
      votesCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      votesCollection.countDocuments(query)
    ]);
    
    return { votes, total };
  } catch (error) {
    console.error('Error fetching votes:', error);
    throw new Error('Error al obtener los votos');
  }
}
