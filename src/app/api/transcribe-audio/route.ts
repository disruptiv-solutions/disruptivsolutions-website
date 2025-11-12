import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: 'No audio file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local and restart the server.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert File to Buffer for proper handling in Node.js
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create FormData for OpenAI - use Blob directly
    const openaiFormData = new FormData();
    const blob = new Blob([buffer], { type: audioFile.type || 'audio/webm' });
    openaiFormData.append('file', blob, audioFile.name || 'recording.webm');
    openaiFormData.append('model', 'gpt-4o-transcribe');
    openaiFormData.append('response_format', 'json');
    openaiFormData.append('stream', 'true');

    // Call OpenAI API for transcription
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        // Don't set Content-Type header - let fetch set it with boundary
      },
      body: openaiFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return new Response(
        JSON.stringify({ error: `Failed to transcribe audio: ${errorData.substring(0, 200)}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('OpenAI transcription request successful, streaming response...');

    // Return the streaming response directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
