DROP TABLE IF EXISTS jokes;
CREATE TABLE jokes
(
  id        VARCHAR(26) PRIMARY KEY,
  setup     TEXT NOT NULL UNIQUE,
  punchline TEXT NULL UNIQUE,
  added_at  TIMESTAMP
);
