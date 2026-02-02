-- Sample data for development/testing
-- Password is 'password123' hashed with bcrypt
INSERT INTO users (id, email, username, password_hash, timezone) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alex@example.com', 'alex_chen', '$2b$10$rQZ5QzVqYxQzVqYxQzVqYOeKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'Europe/London'),
  ('22222222-2222-2222-2222-222222222222', 'yuki@example.com', 'yuki_tanaka', '$2b$10$rQZ5QzVqYxQzVqYxQzVqYOeKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'Asia/Tokyo'),
  ('33333333-3333-3333-3333-333333333333', 'hans@example.com', 'hans_mueller', '$2b$10$rQZ5QzVqYxQzVqYxQzVqYOeKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'Europe/Berlin'),
  ('44444444-4444-4444-4444-444444444444', 'maria@example.com', 'maria_santos', '$2b$10$rQZ5QzVqYxQzVqYxQzVqYOeKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'America/Sao_Paulo')
ON CONFLICT (id) DO NOTHING;

-- Sample events
INSERT INTO events (id, name, description, game_type, creator_id, event_time, max_participants, is_public, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Friday Night Board Games', 'Lets play some Catan and maybe Ticket to Ride!', 'Board Game', '11111111-1111-1111-1111-111111111111', '2026-02-07 20:00:00', 6, false, 'confirmed'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DnD Campaign Session 12', 'Continuing our adventure in the Forgotten Realms', 'RPG', '11111111-1111-1111-1111-111111111111', '2026-02-14 19:00:00', 5, false, 'pending'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mario Kart Tournament', 'Rainbow Road championship!', 'Video Game', '22222222-2222-2222-2222-222222222222', '2026-02-21 21:00:00', 8, true, 'confirmed')
ON CONFLICT (id) DO NOTHING;

-- Sample participants
INSERT INTO participants (event_id, user_id, status, user_timezone, rsvp_time) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'confirmed', 'Europe/London', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'confirmed', 'Asia/Tokyo', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'pending', 'Europe/Berlin', NULL),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'confirmed', 'Europe/London', NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'confirmed', 'America/Sao_Paulo', NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'confirmed', 'Asia/Tokyo', NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'confirmed', 'Europe/Berlin', NOW())
ON CONFLICT DO NOTHING;

-- Sample messages
INSERT INTO event_messages (event_id, user_id, message) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Cant wait! Ill bring the expansion pack'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'What time is that for me again?'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Its 1PM Saturday for you Hans!');
