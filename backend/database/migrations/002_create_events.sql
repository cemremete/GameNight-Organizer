-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    game_type VARCHAR(50),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_time TIMESTAMP NOT NULL,
    max_participants INTEGER DEFAULT 12,
    is_public BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_creator ON events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(event_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_public ON events(is_public) WHERE is_public = true;
