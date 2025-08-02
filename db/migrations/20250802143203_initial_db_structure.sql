-- +goose Up
-- +goose StatementBegin
CREATE SCHEMA IF NOT EXISTS codecombat;

-- Create custom ENUM types
CREATE TYPE "team_role" AS ENUM (
  'member',
  'leader'
);

CREATE TYPE "submission_status" AS ENUM (
  'pending',
  'accepted',
  'wrong_answer',
  'time_limit_exceeded'
);

CREATE TYPE "difficulty_type" AS ENUM (
  'easy',
  'medium',
  'hard'
);

-- Create tables
CREATE TABLE "user" (
  "id" bigserial PRIMARY KEY,
  "username" text NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" text,
  "google_id" VARCHAR(255),
  "github" VARCHAR(255),
  "linkedin" VARCHAR(255),
  "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "created_by" INTEGER NOT NULL,
  "updated_by" INTEGER NOT NULL
);

CREATE TABLE "user_statistics" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint,
  "contests_participated" INTEGER DEFAULT 0,
  "problems_solved" INTEGER DEFAULT 0,
  "global_rank" INTEGER,
  "total_score" INTEGER DEFAULT 0,
  "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "contests" (
  "id" bigserial PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "start_time" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "end_time" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "created_by" bigint,
  "is_active" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "teams" (
  "id" bigserial PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "contest_id" bigint,
  "passkey" VARCHAR(255) NOT NULL,
  "max_members" INTEGER DEFAULT 2,
  "current_score" INTEGER DEFAULT 0,
  "created_by" bigint,
  "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "team_members" (
  "id" bigserial PRIMARY KEY,
  "team_id" bigint,
  "user_id" bigint,
  "role" team_role DEFAULT 'member',
  "joined_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "code_problems" (
  "id" bigserial PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "difficulty" difficulty_type DEFAULT 'easy',
  "test_cases" JSONB,
  "max_score" INTEGER DEFAULT 100,
  "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "contest_problems" (
  "id" bigserial PRIMARY KEY,
  "contest_id" bigint,
  "problem_id" bigint,
  "problem_order" INTEGER
);

CREATE TABLE "user_submissions" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint,
  "team_id" bigint,
  "contest_id" bigint,
  "problem_id" bigint,
  "code" TEXT NOT NULL,
  "language" VARCHAR(50) NOT NULL,
  "score" INTEGER DEFAULT 0,
  "status" submission_status,
  "execution_time" INTEGER,
  "memory_used" INTEGER,
  "submitted_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "active_sessions" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint,
  "team_id" bigint,
  "contest_id" bigint,
  "socket_id" VARCHAR(255),
  "last_active" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX ON "user" ("email");
CREATE INDEX ON "user" ("username");
CREATE INDEX ON "user" ("google_id");
CREATE INDEX ON "teams" ("contest_id");
CREATE UNIQUE INDEX ON "team_members" ("team_id", "user_id");
CREATE INDEX ON "team_members" ("team_id");
CREATE INDEX ON "team_members" ("user_id");
CREATE INDEX ON "contest_problems" ("contest_id");
CREATE INDEX ON "contest_problems" ("problem_id");
CREATE INDEX ON "user_submissions" ("user_id");
CREATE INDEX ON "user_submissions" ("team_id");
CREATE INDEX ON "user_submissions" ("contest_id");
CREATE INDEX ON "user_submissions" ("problem_id");

-- Add comments
COMMENT ON COLUMN "user"."password_hash" IS 'Can be null for OAuth users';
COMMENT ON COLUMN "user"."google_id" IS 'for Google OAuth users';
COMMENT ON COLUMN "user_statistics"."user_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "contests"."created_by" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "teams"."contest_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "teams"."created_by" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "team_members"."team_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "team_members"."user_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "team_members"."role" IS 'should be from one of the enum team_role';
COMMENT ON COLUMN "code_problems"."difficulty" IS 'should be from one of the enum difficulty_type';
COMMENT ON COLUMN "code_problems"."test_cases" IS 'store test cases as JSON';
COMMENT ON COLUMN "contest_problems"."contest_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "contest_problems"."problem_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "user_submissions"."user_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "user_submissions"."team_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "user_submissions"."contest_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "user_submissions"."problem_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "user_submissions"."execution_time" IS 'in milliseconds';
COMMENT ON COLUMN "user_submissions"."memory_used" IS 'in kb';
COMMENT ON COLUMN "active_sessions"."user_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "active_sessions"."team_id" IS 'ON DELETE CASCADE';
COMMENT ON COLUMN "active_sessions"."contest_id" IS 'ON DELETE CASCADE';

-- Add foreign key constraints
ALTER TABLE "user_statistics" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE;
ALTER TABLE "contests" ADD FOREIGN KEY ("created_by") REFERENCES "user" ("id") ON DELETE CASCADE;
ALTER TABLE "teams" ADD FOREIGN KEY ("contest_id") REFERENCES "contests" ("id") ON DELETE CASCADE;
ALTER TABLE "teams" ADD FOREIGN KEY ("created_by") REFERENCES "user" ("id") ON DELETE CASCADE;
ALTER TABLE "team_members" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE CASCADE;
ALTER TABLE "team_members" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE;
ALTER TABLE "contest_problems" ADD FOREIGN KEY ("contest_id") REFERENCES "contests" ("id") ON DELETE CASCADE;
ALTER TABLE "contest_problems" ADD FOREIGN KEY ("problem_id") REFERENCES "code_problems" ("id") ON DELETE CASCADE;
ALTER TABLE "user_submissions" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE;
ALTER TABLE "user_submissions" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE CASCADE;
ALTER TABLE "user_submissions" ADD FOREIGN KEY ("contest_id") REFERENCES "contests" ("id") ON DELETE CASCADE;
ALTER TABLE "user_submissions" ADD FOREIGN KEY ("problem_id") REFERENCES "code_problems" ("id") ON DELETE CASCADE;
ALTER TABLE "active_sessions" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE;
ALTER TABLE "active_sessions" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE CASCADE;
ALTER TABLE "active_sessions" ADD FOREIGN KEY ("contest_id") REFERENCES "contests" ("id") ON DELETE CASCADE;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Drop foreign key constraints (they will be dropped automatically when tables are dropped)
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS codecombat."active_sessions";
DROP TABLE IF EXISTS codecombat."user_submissions";
DROP TABLE IF EXISTS codecombat."contest_problems";
DROP TABLE IF EXISTS codecombat."code_problems";
DROP TABLE IF EXISTS codecombat."team_members";
DROP TABLE IF EXISTS codecombat."teams";
DROP TABLE IF EXISTS codecombat."contests";
DROP TABLE IF EXISTS codecombat."user_statistics";
DROP TABLE IF EXISTS codecombat."user";

-- Drop custom ENUM types
DROP TYPE IF EXISTS codecombat."difficulty_type";
DROP TYPE IF EXISTS codecombat."submission_status";
DROP TYPE IF EXISTS codecombat."team_role";

-- Drop schema (optional - only if you want to completely remove the schema)
DROP SCHEMA IF EXISTS codecombat CASCADE;
-- +goose StatementEnd
