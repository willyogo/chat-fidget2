import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { apiKeyAuth, rateLimitMiddleware } from './middleware';
import { getRoom, upsertRoom } from './rooms';
import { getMessages, sendMessage } from './messages';
import type { CreateRoomRequest, UpdateRoomRequest, SendMessageRequest } from '../types/api';

const api = new Hono();

// Apply global middleware
api.use('*', rateLimitMiddleware);
api.use('*', apiKeyAuth);

// Room endpoints
api.post('/rooms', async (c) => {
  const body = await c.req.json<CreateRoomRequest>();
  
  try {
    const room = await upsertRoom(
      body.name,
      body.ownerAddress,
      body.tokenAddress,
      body.tokenNetwork
    );
    
    return c.json({ success: true, data: room });
  } catch (error) {
    throw new HTTPException(400, { message: error instanceof Error ? error.message : 'Failed to create room' });
  }
});

api.get('/rooms/:name', async (c) => {
  const name = c.param('name');
  
  try {
    const room = await getRoom(name);
    if (!room) {
      throw new HTTPException(404, { message: 'Room not found' });
    }
    return c.json({ success: true, data: room });
  } catch (error) {
    throw new HTTPException(400, { message: error instanceof Error ? error.message : 'Failed to get room' });
  }
});

api.patch('/rooms/:name', async (c) => {
  const name = c.param('name');
  const body = await c.req.json<UpdateRoomRequest>();
  
  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .update({
        token_address: body.tokenAddress,
        required_tokens: body.requiredTokens,
        token_network: body.tokenNetwork,
      })
      .eq('name', name.toLowerCase())
      .select()
      .single();

    if (error) throw error;
    return c.json({ success: true, data: room });
  } catch (error) {
    throw new HTTPException(400, { message: error instanceof Error ? error.message : 'Failed to update room' });
  }
});

// Message endpoints
api.get('/rooms/:name/messages', async (c) => {
  const name = c.param('name');
  const before = c.req.query('before');
  const limit = parseInt(c.req.query('limit') || '50');
  
  try {
    const messages = await getMessages(name, limit, before);
    return c.json({ 
      success: true, 
      data: {
        messages,
        hasMore: messages.length === limit
      }
    });
  } catch (error) {
    throw new HTTPException(400, { message: error instanceof Error ? error.message : 'Failed to get messages' });
  }
});

api.post('/rooms/:name/messages', async (c) => {
  const name = c.param('name');
  const body = await c.req.json<SendMessageRequest>();
  
  try {
    const message = await sendMessage(name, body.userAddress, body.content);
    return c.json({ success: true, data: message });
  } catch (error) {
    throw new HTTPException(400, { message: error instanceof Error ? error.message : 'Failed to send message' });
  }
});

export { api };