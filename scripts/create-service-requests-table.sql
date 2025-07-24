CREATE TABLE IF NOT EXISTS service_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    service_type VARCHAR(255),
    project_goal TEXT,
    has_identity VARCHAR(50),
    budget VARCHAR(50),
    deadline DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Enable Row Level Security (RLS) if you plan to manage access
-- ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Optional: Create a policy to allow inserts from authenticated users (if not using service_role_key)
-- CREATE POLICY "Allow authenticated inserts" ON service_requests
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');
