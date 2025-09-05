'use server'

import { getDatabase } from '@/lib/mongodb';
import { 
  BookList, 
  CreateBookListData, 
  UpdateBookListData, 
  AddBookToListData, 
  UpdateBookInListData,
  BookListFilters,
  ListType
} from '@/lib/models/BookList';
import { ObjectId } from 'mongodb';

// Crear una nueva lista de libros
export async function createBookList(data: CreateBookListData): Promise<BookList> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const newList: Omit<BookList, '_id'> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: data.userId,
      name: data.name,
      description: data.description,
      type: data.type,
      isPublic: data.isPublic || false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookCount: 0,
      books: []
    };

    const result = await bookListsCollection.insertOne(newList as BookList);
    
    if (!result.insertedId) {
      throw new Error('Error al crear la lista');
    }

    return { ...newList, _id: result.insertedId } as BookList;
  } catch (error) {
    console.error('Error creating book list:', error);
    throw new Error('Error al crear la lista');
  }
}

// Obtener listas de un usuario
export async function getUserBookLists(userId: string, type?: ListType): Promise<BookList[]> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const query: any = { userId };
    if (type) query.type = type;

    const lists = await bookListsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return lists;
  } catch (error) {
    console.error('Error fetching user book lists:', error);
    throw new Error('Error al obtener las listas del usuario');
  }
}

// Obtener lista por ID
export async function getBookListById(listId: string): Promise<BookList | null> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const list = await bookListsCollection.findOne({ id: listId });
    return list;
  } catch (error) {
    console.error('Error fetching book list:', error);
    throw new Error('Error al obtener la lista');
  }
}

// Actualizar lista
export async function updateBookList(listId: string, data: UpdateBookListData): Promise<BookList> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const updateData: Partial<BookList> = {
      updatedAt: new Date().toISOString(),
      ...data
    };

    const result = await bookListsCollection.findOneAndUpdate(
      { id: listId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Lista no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error updating book list:', error);
    throw new Error('Error al actualizar la lista');
  }
}

// Agregar libro a una lista
export async function addBookToList(listId: string, bookData: AddBookToListData): Promise<BookList> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const bookItem = {
      bookId: bookData.bookId,
      bookTitle: bookData.bookTitle,
      bookThumbnail: bookData.bookThumbnail,
      bookAuthors: bookData.bookAuthors,
      addedAt: new Date().toISOString(),
      notes: bookData.notes,
      rating: bookData.rating,
      readDate: bookData.readDate,
      progress: bookData.progress
    };

    const result = await bookListsCollection.findOneAndUpdate(
      { id: listId },
      { 
        $push: { books: bookItem },
        $inc: { bookCount: 1 },
        $set: { updatedAt: new Date().toISOString() }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Lista no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error adding book to list:', error);
    throw new Error('Error al agregar el libro a la lista');
  }
}

// Actualizar libro en una lista
export async function updateBookInList(listId: string, bookId: string, data: UpdateBookInListData): Promise<BookList> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const updateFields: any = {};
    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateBookInListData] !== undefined) {
        updateFields[`books.$.${key}`] = data[key as keyof UpdateBookInListData];
      }
    });

    const result = await bookListsCollection.findOneAndUpdate(
      { 
        id: listId,
        'books.bookId': bookId
      },
      { 
        $set: {
          ...updateFields,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Lista o libro no encontrado');
    }

    return result;
  } catch (error) {
    console.error('Error updating book in list:', error);
    throw new Error('Error al actualizar el libro en la lista');
  }
}

// Remover libro de una lista
export async function removeBookFromList(listId: string, bookId: string): Promise<BookList> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const result = await bookListsCollection.findOneAndUpdate(
      { id: listId },
      { 
        $pull: { books: { bookId } },
        $inc: { bookCount: -1 },
        $set: { updatedAt: new Date().toISOString() }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Lista no encontrada');
    }

    return result;
  } catch (error) {
    console.error('Error removing book from list:', error);
    throw new Error('Error al remover el libro de la lista');
  }
}

// Eliminar lista
export async function deleteBookList(listId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const result = await bookListsCollection.deleteOne({ id: listId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting book list:', error);
    throw new Error('Error al eliminar la lista');
  }
}

// Obtener listas públicas
export async function getPublicBookLists(filters?: BookListFilters, page: number = 1, limit: number = 20): Promise<{ lists: BookList[], total: number }> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const query: any = { isPublic: true };
    
    if (filters) {
      if (filters.userId) query.userId = filters.userId;
      if (filters.type) query.type = filters.type;
      if (filters.bookId) {
        query['books.bookId'] = filters.bookId;
      }
    }

    const skip = (page - 1) * limit;
    
    const [lists, total] = await Promise.all([
      bookListsCollection
        .find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      bookListsCollection.countDocuments(query)
    ]);
    
    return { lists, total };
  } catch (error) {
    console.error('Error fetching public book lists:', error);
    throw new Error('Error al obtener las listas públicas');
  }
}

// Verificar si un libro está en una lista
export async function isBookInList(userId: string, bookId: string, listType?: ListType): Promise<{ isInList: boolean, listId?: string }> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    const query: any = { 
      userId,
      'books.bookId': bookId
    };
    
    if (listType) {
      query.type = listType;
    }

    const list = await bookListsCollection.findOne(query);
    
    return {
      isInList: !!list,
      listId: list?.id
    };
  } catch (error) {
    console.error('Error checking if book is in list:', error);
    throw new Error('Error al verificar si el libro está en la lista');
  }
}

// Función helper para serializar BookList (remover _id de MongoDB)
function serializeBookList(bookList: any): BookList {
  return {
    id: bookList.id,
    userId: bookList.userId,
    name: bookList.name,
    description: bookList.description,
    type: bookList.type,
    isPublic: bookList.isPublic,
    isDefault: bookList.isDefault,
    createdAt: bookList.createdAt,
    updatedAt: bookList.updatedAt,
    bookCount: bookList.bookCount,
    books: bookList.books
  };
}

// Crear o obtener lista de favoritos del usuario
export async function getOrCreateFavoritesList(userId: string): Promise<BookList> {
  try {
    const db = await getDatabase();
    const bookListsCollection = db.collection<BookList>('booklists');
    
    // Buscar lista de favoritos existente
    let favoritesList = await bookListsCollection.findOne({ 
      userId, 
      type: 'favorites' 
    });
    
    // Si no existe, crear una nueva
    if (!favoritesList) {
      const newFavoritesList: Omit<BookList, '_id'> = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId,
        name: 'Favoritos',
        description: 'Mis libros favoritos',
        type: 'favorites',
        isPublic: false,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookCount: 0,
        books: []
      };

      const result = await bookListsCollection.insertOne(newFavoritesList as BookList);
      favoritesList = { ...newFavoritesList, _id: result.insertedId } as BookList;
    }
    
    return serializeBookList(favoritesList);
  } catch (error) {
    console.error('Error getting or creating favorites list:', error);
    throw new Error('Error al obtener o crear la lista de favoritos');
  }
}

// Agregar libro a favoritos
export async function addToFavorites(userId: string, bookData: AddBookToListData): Promise<{ success: boolean, message: string }> {
  try {
    const favoritesList = await getOrCreateFavoritesList(userId);
    
    // Verificar si el libro ya está en favoritos
    const isAlreadyInFavorites = favoritesList.books.some(book => book.bookId === bookData.bookId);
    
    if (isAlreadyInFavorites) {
      return { success: false, message: 'El libro ya está en tus favoritos' };
    }
    
    // Agregar el libro a la lista de favoritos
    await addBookToList(favoritesList.id, bookData);
    
    return { success: true, message: 'Libro agregado a favoritos' };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw new Error('Error al agregar el libro a favoritos');
  }
}

// Remover libro de favoritos
export async function removeFromFavorites(userId: string, bookId: string): Promise<{ success: boolean, message: string }> {
  try {
    const favoritesList = await getOrCreateFavoritesList(userId);
    
    // Verificar si el libro está en favoritos
    const isInFavorites = favoritesList.books.some(book => book.bookId === bookId);
    
    if (!isInFavorites) {
      return { success: false, message: 'El libro no está en tus favoritos' };
    }
    
    // Remover el libro de la lista de favoritos
    await removeBookFromList(favoritesList.id, bookId);
    
    return { success: true, message: 'Libro removido de favoritos' };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Error al remover el libro de favoritos');
  }
}

// Verificar si un libro está en favoritos
export async function isBookInFavorites(userId: string, bookId: string): Promise<boolean> {
  try {
    const result = await isBookInList(userId, bookId, 'favorites');
    return result.isInList;
  } catch (error) {
    console.error('Error checking if book is in favorites:', error);
    return false;
  }
}