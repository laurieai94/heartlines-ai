
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from '../_shared/cors.ts'

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  console.log(`Processing base64 string of length: ${base64String.length}`)
  
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  console.log(`Processed audio bytes: ${result.length}`)
  return result;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }
    const { audio } = await req.json()
    
    if (!audio) {
      console.error('No audio data provided in request')
      return new Response(
        JSON.stringify({ error: 'No audio data provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Handle both plain base64 and data URLs
    let cleanBase64 = audio
    if (audio.startsWith('data:')) {
      cleanBase64 = audio.split(',')[1]
      console.log('Stripped data URL prefix')
    }

    // Process audio in chunks to avoid memory issues
    const binaryAudio = processBase64Chunks(cleanBase64)
    
    // Validate audio size - minimum and maximum
    const MAX_AUDIO_SIZE = 5 * 1024 * 1024; // 5MB for voice messages (OpenAI limit is 25MB)
    
    if (binaryAudio.length < 100) {
      console.warn(`Audio too short: ${binaryAudio.length} bytes`)
      return new Response(
        JSON.stringify({ error: 'No audio or recording too short' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    if (binaryAudio.length > MAX_AUDIO_SIZE) {
      console.warn(`Audio too large: ${binaryAudio.length} bytes (max: ${MAX_AUDIO_SIZE})`)
      return new Response(
        JSON.stringify({ error: 'Recording too long. Maximum size is 5MB.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    // Prepare form data
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', blob, 'audio.webm')
    
    // Try newer model first, fallback to whisper-1
    let model = 'gpt-4o-transcribe'
    formData.append('model', model)

    console.log(`Sending to OpenAI with model: ${model}`)

    // Send to OpenAI
    let response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    // If newer model fails, try whisper-1
    if (!response.ok && (response.status === 400 || response.status === 404)) {
      console.log('Newer model failed, trying whisper-1')
      model = 'whisper-1'
      
      // Recreate form data with fallback model
      const fallbackFormData = new FormData()
      fallbackFormData.append('file', blob, 'audio.webm')
      fallbackFormData.append('model', model)
      
      response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        },
        body: fallbackFormData,
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenAI API error (${response.status}): ${errorText}`)
      
      return new Response(
        JSON.stringify({ 
          error: 'Unable to transcribe audio. Please try again.'
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const result = await response.json()
    console.log(`Transcription successful with model ${model}: "${result.text}"`)

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Voice-to-text function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
