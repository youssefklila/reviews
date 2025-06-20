-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'superadmin', 'user');
CREATE TYPE voting_session_status AS ENUM ('draft', 'active', 'paused', 'completed', 'expired');

-- Users Table
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Should be hashed
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL, -- Can be UUID of another user or a system identifier
    last_login TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) NULL -- Can be UUID of another user or a system identifier
);

-- Reviews Table
CREATE TABLE Reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100) NULL,
    age INTEGER NULL,
    room_number VARCHAR(50) NULL,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 10),
    recommend BOOLEAN NULL,
    visit_again BOOLEAN NULL,
    services JSONB NULL, -- e.g., {"wifi": 5, "food": 4, "staff": 5}
    suggestions TEXT NULL,
    created_by UUID NULL, -- If submitted by a logged-in user

    CONSTRAINT fk_reviews_created_by
        FOREIGN KEY(created_by)
        REFERENCES Users(id)
        ON DELETE SET NULL
);

-- Voting_Sessions Table
CREATE TABLE Voting_Sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    duration_minutes INTEGER NULL,
    status voting_session_status NOT NULL DEFAULT 'draft',
    start_time TIMESTAMPTZ NULL,
    end_time TIMESTAMPTZ NULL,
    unique_link_slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,

    CONSTRAINT fk_voting_sessions_created_by
        FOREIGN KEY(created_by)
        REFERENCES Users(id)
        ON DELETE RESTRICT -- A user cannot be deleted if they have created voting sessions
);

-- Optional: Indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_username ON Users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON Users(role);
CREATE INDEX IF NOT EXISTS idx_reviews_room_number ON Reviews(room_number);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_status ON Voting_Sessions(status);
CREATE INDEX IF NOT EXISTS idx_voting_sessions_unique_link_slug ON Voting_Sessions(unique_link_slug);

-- Note on updated_at:
-- For PostgreSQL, to automatically update `updated_at` on row updates,
-- a trigger function is typically used. For example:
/*
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_reviews
BEFORE UPDATE ON Reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_voting_sessions
BEFORE UPDATE ON Voting_Sessions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
*/
-- The above trigger is commented out as per subtask instructions (triggers out of scope for this step).
-- The application layer will be responsible for updating `updated_at` on modifications.
