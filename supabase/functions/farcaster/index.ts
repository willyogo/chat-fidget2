import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/bulk-by-address';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { address } = await req.json();
    if (!address) {
      return new Response(
        JSON.stringify({ 
          result: { user: null },
          error: null 
        }),
        { 
          status: 200,
          headers: corsHeaders 
        }
      );
    }

    const normalizedAddress = address.toLowerCase();
    const apiKey = Deno.env.get('NEYNAR_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          result: { user: null },
          error: null 
        }),
        { 
          status: 200,
          headers: corsHeaders 
        }
      );
    }

    // Call Neynar V2 API
    const response = await fetch(
      `${NEYNAR_API_URL}?addresses=${normalizedAddress}&address_types=verified_address`,
      {
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
        },
      }
    );

    const data = await response.json();
    const users = data[normalizedAddress] || [];
    const user = users[0];

    // Always return 200 with a valid response shape
    return new Response(
      JSON.stringify({
        result: {
          user: user ? {
            username: user.username,
            pfp_url: user.pfp_url
          } : null
        },
        error: null
      }),
      { 
        status: 200,
        headers: corsHeaders 
      }
    );
  } catch (error) {
    // Return empty result with 200 status instead of error
    return new Response(
      JSON.stringify({ 
        result: { user: null },
        error: null 
      }),
      { 
        status: 200,
        headers: corsHeaders 
      }
    );
  }
});