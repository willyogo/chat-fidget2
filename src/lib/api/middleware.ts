import { createMiddleware } from '@hono/node-server';
import { rateLimit } from '@hono/node-server/rate-limit';
import { HTTPException } from 'hono/http-exception';
import { supabase } from '../auth/supabase';

// Rate limiting middleware
export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs
});

// API key authentication middleware
export const apiKeyAuth = createMiddleware(async (c, next) => {
  const apiKey = c.req.header('X-API-Key');
  
  if (!apiKey) {
    throw new HTTPException(401, { message: 'API key required' });
  }

  // Verify API key against database
  const { data, error } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key', apiKey)
    .single();

  if (error || !data) {
    throw new HTTPException(401, { message: 'Invalid API key' });
  }

  // Update last used timestamp
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return next();
});