
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    console.log('Fetching OMDB API key from environment variables')
    const OMDB_API_KEY = Deno.env.get('OMDB_API_KEY') || 'e48b38b2' // Fallback key
    
    if (!OMDB_API_KEY) {
      console.error('OMDB_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          errorDetails: 'The OMDB_API_KEY environment variable is not set',
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Successfully retrieved OMDB API key')
    return new Response(
      JSON.stringify({ 
        OMDB_API_KEY,
        source: 'edge-function',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get-omdb-key function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
