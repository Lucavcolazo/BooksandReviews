import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar OpenAI solo cuando sea necesario
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key-for-build',
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3001', // Optional, for analytics
      'X-Title': 'Books and Reviews Chat', // Optional, for analytics
    },
  });
}

export async function POST(request: NextRequest) {
  let messages, userPreferences;
  
  // Verificar que la API key esté disponible
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'dummy-key-for-build') {
    return NextResponse.json({
      message: 'Servicio de chat no disponible temporalmente. Por favor, inténtalo más tarde.'
    }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    messages = body.messages;
    userPreferences = body.userPreferences;

    // Crear el contexto del sistema para el asistente de recomendaciones de libros
    const systemMessage = {
      role: 'system' as const,
      content: `Eres un asistente experto en libros y literatura. Tu trabajo es ayudar a los usuarios a encontrar libros que les gusten.

INSTRUCCIONES:
- Responde siempre en español
- Mantén un tono amigable y conversacional
- Cuando el usuario mencione un género, da recomendaciones específicas de libros
- Incluye título, autor y una breve descripción para cada recomendación
- Responde preguntas sobre literatura de manera informativa
- Sé natural y adapta tus respuestas a lo que el usuario te diga

FORMATO PARA RECOMENDACIONES:
• **Título del libro** - Autor
Descripción breve del libro y por qué lo recomiendo.

Sé útil, amigable y da respuestas completas.`
    };

    // Lista de modelos gratuitos en orden de preferencia
    const freeModels = [
      'meta-llama/llama-3.1-8b-instruct',
      'microsoft/phi-3-mini-128k-instruct',
      'google/gemini-flash-1.5',
      'meta-llama/llama-3.1-70b-instruct'
    ];

    const selectedModel = process.env.OPENROUTER_MODEL || freeModels[0];

    console.log('Enviando request a OpenRouter con:', {
      model: selectedModel,
      messageCount: messages.length + 1,
      maxTokens: 2000
    });

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [systemMessage, ...messages],
      max_tokens: 1500,
      temperature: 0.7,
    });

    console.log('Respuesta de OpenRouter:', {
      hasResponse: !!response,
      hasChoices: !!response.choices,
      choiceCount: response.choices?.length,
      firstChoice: response.choices?.[0],
      content: response.choices?.[0]?.message?.content
    });

    const message = response.choices[0]?.message?.content;
    
    if (!message || message.trim() === '') {
      console.error('No se recibió contenido de la respuesta, intentando con modelo alternativo');
      
      // Intentar con un modelo alternativo
      const alternativeModel = freeModels[1] || 'microsoft/phi-3-mini-128k-instruct';
      
      try {
        const fallbackResponse = await openai.chat.completions.create({
          model: alternativeModel,
          messages: [systemMessage, ...messages],
          max_tokens: 1000,
          temperature: 0.7,
        });
        
        const fallbackMessage = fallbackResponse.choices[0]?.message?.content;
        
        if (fallbackMessage && fallbackMessage.trim() !== '') {
          console.log('Fallback exitoso con modelo:', alternativeModel);
          return NextResponse.json({
            message: fallbackMessage,
          });
        }
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
      }
      
      // Si el fallback también falla, dar una respuesta genérica
      return NextResponse.json({
        message: '¡Hola! Soy tu asistente de libros. ¿En qué puedo ayudarte? ¿Buscas recomendaciones de algún género específico?',
      });
    }

    return NextResponse.json({
      message: message,
    });

  } catch (error) {
    console.error('Error en la API de chat:', error);
    console.error('Mensajes recibidos:', messages);
    console.error('User preferences:', userPreferences);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}