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
        JSON.stringify({ error: 'Address is required' }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }

    const normalizedAddress = address.toLowerCase();
    const apiKey = Deno.env.get('NEYNAR_API_KEY');
    
    if (!apiKey) {
      throw new Error('NEYNAR_API_KEY environment variable is not set');
    }

    // Call Neynar V2 API
    const response = await fetch(
      `${NEYNAR_API_URL}?addresses=${normalizedAddress}&address_types=verified_address`,
      {
        headers: {
          'accept': 'application/json',
          'x-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Neynar API error: ${error}`);
    }

    const data = await response.json();
    const users = data[normalizedAddress] || [];
    const user = users[0];

    // Transform the response to match the expected format
    const result = {
      result: {
        user: user ? {
          username: user.username,
          pfp_url: user.pfp_url
        } : null
      }
    };

    return new Response(
      JSON.stringify(result),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});