import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookId } = await params;
    
    if (!bookId) {
      return NextResponse.json(
        { error: 'ID del libro es requerido' },
        { status: 400 }
      );
    }

    // Hacer la petición a la Google Books API (sin API key por ahora)
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Google Books API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Libro no encontrado' },
          { status: 404 }
        );
      }
      
      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Error en la petición a Google Books API', details: errorText },
          { status: 400 }
        );
      }
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'API key inválida o sin permisos' },
          { status: 403 }
        );
      }
      
      throw new Error(`Error de la API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Transformar los datos a nuestro formato
    const book = {
      id: data.id,
      title: data.volumeInfo?.title || 'Título desconocido',
      authors: data.volumeInfo?.authors || [],
      description: data.volumeInfo?.description,
      publishedDate: data.volumeInfo?.publishedDate,
      pageCount: data.volumeInfo?.pageCount,
      categories: data.volumeInfo?.categories || [],
      publisher: data.volumeInfo?.publisher,
      language: data.volumeInfo?.language,
      thumbnail: data.volumeInfo?.imageLinks?.thumbnail || data.volumeInfo?.imageLinks?.smallThumbnail,
      previewLink: data.volumeInfo?.previewLink,
      infoLink: data.volumeInfo?.infoLink,
      canonicalVolumeLink: data.volumeInfo?.canonicalVolumeLink
    };

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error en API route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
