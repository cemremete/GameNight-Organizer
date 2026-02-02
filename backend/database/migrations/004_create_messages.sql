-- Event chat messages
CREATE TABLE IF NOT EXISTS event_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fetching messages by event
CREATE INDEX IF NOT EXISTS idx_messages_event ON event_messages(event_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON event_messages(created_at);
