/*
  # Enable realtime for messages table

  1. Changes
    - Enable realtime for messages table to allow real-time updates
*/

alter publication supabase_realtime add table messages;