-- Phone System Schema
-- Contacts, Conversations, Messages, and Calls

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'failed', 'received');
CREATE TYPE call_status AS ENUM ('ringing', 'in-progress', 'completed', 'failed', 'no-answer', 'busy');
CREATE TYPE call_direction AS ENUM ('inbound', 'outbound');

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  company TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  ai_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_contact TIMESTAMPTZ,
  message_count INTEGER NOT NULL DEFAULT 0,
  call_count INTEGER NOT NULL DEFAULT 0,
  favorited BOOLEAN NOT NULL DEFAULT false
);

-- Index for phone number lookups
CREATE INDEX idx_contacts_phone_number ON contacts (phone_number);
CREATE INDEX idx_contacts_name ON contacts (name);
CREATE INDEX idx_contacts_tags ON contacts USING GIN (tags);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'twilio-sms', 'whatsapp', 'voice'
  ai_enabled BOOLEAN NOT NULL DEFAULT true,
  muted BOOLEAN NOT NULL DEFAULT false,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER NOT NULL DEFAULT 0,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for conversation queries
CREATE INDEX idx_conversations_contact ON conversations (contact_id);
CREATE INDEX idx_conversations_phone ON conversations (phone_number);
CREATE INDEX idx_conversations_channel ON conversations (channel);
CREATE INDEX idx_conversations_last_message ON conversations (last_message_at DESC);
CREATE UNIQUE INDEX idx_conversations_unique_contact_channel ON conversations (contact_id, channel);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  external_id TEXT, -- Twilio MessageSid, WhatsApp message id
  
  -- Message content
  body TEXT,
  direction message_direction NOT NULL,
  status message_status NOT NULL DEFAULT 'sent',
  
  -- Media attachments
  media_urls TEXT[] DEFAULT '{}',
  media_types TEXT[] DEFAULT '{}',
  
  -- Metadata
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for message queries
CREATE INDEX idx_messages_conversation ON messages (conversation_id);
CREATE INDEX idx_messages_contact ON messages (contact_id);
CREATE INDEX idx_messages_external_id ON messages (external_id);
CREATE INDEX idx_messages_created_at ON messages (created_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages (conversation_id, created_at DESC);

-- ============================================
-- CALLS TABLE
-- ============================================
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  external_id TEXT, -- Twilio CallSid
  
  -- Call details
  direction call_direction NOT NULL,
  status call_status NOT NULL DEFAULT 'ringing',
  duration_seconds INTEGER CHECK (duration_seconds >= 0),
  
  -- Recording
  recording_url TEXT,
  recording_duration_seconds INTEGER CHECK (recording_duration_seconds >= 0),
  
  -- AI transcript
  transcript_text TEXT,
  transcript_json JSONB,
  
  -- AI summary
  summary TEXT,
  
  -- Timestamps
  started_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for call queries
CREATE INDEX idx_calls_contact ON calls (contact_id);
CREATE INDEX idx_calls_phone_number ON calls (phone_number);
CREATE INDEX idx_calls_external_id ON calls (external_id);
CREATE INDEX idx_calls_started_at ON calls (started_at DESC);
CREATE INDEX idx_calls_status ON calls (status);

-- ============================================
-- RLS (Row Level Security) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Allow read/write access for authenticated users
CREATE POLICY "Allow read access on contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow write access on contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access on contacts" ON contacts FOR UPDATE USING (true);

CREATE POLICY "Allow read access on conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow write access on conversations" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access on conversations" ON conversations FOR UPDATE USING (true);

CREATE POLICY "Allow read access on messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow write access on messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access on messages" ON messages FOR UPDATE USING (true);

CREATE POLICY "Allow read access on calls" ON calls FOR SELECT USING (true);
CREATE POLICY "Allow write access on calls" ON calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access on calls" ON calls FOR UPDATE USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update contacts when new message arrives
CREATE OR REPLACE FUNCTION update_contact_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contacts
  SET 
    last_contact = NEW.created_at,
    message_count = message_count + 1,
    updated_at = NOW()
  WHERE id = NEW.contact_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contact_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_on_message();

-- Update conversation when new message arrives
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message = NEW.body,
    last_message_at = NEW.created_at,
    message_count = message_count + 1,
    unread_count = CASE WHEN NEW.direction = 'inbound' THEN unread_count + 1 ELSE unread_count END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Update contact when call is created
CREATE OR REPLACE FUNCTION update_contact_on_call()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contacts
  SET 
    last_contact = NEW.started_at,
    call_count = call_count + 1,
    updated_at = NOW()
  WHERE id = NEW.contact_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contact_on_call
  AFTER INSERT ON calls
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_on_call();

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Ensure contact exists when creating conversation
CREATE OR REPLACE FUNCTION ensure_contact_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Create contact if it doesn't exist
  INSERT INTO contacts (phone_number)
  VALUES (NEW.phone_number)
  ON CONFLICT (phone_number) DO NOTHING;
  
  -- Set contact_id
  NEW.contact_id = (SELECT id FROM contacts WHERE phone_number = NEW.phone_number);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_contact_exists
  BEFORE INSERT ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION ensure_contact_exists();
