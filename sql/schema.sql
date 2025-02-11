BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL CHECK("status" IN ('todo', 'doing', 'done')),
    "createdAt" TEXT NOT NULL,
    "completedAt" TEXT,
    "deadline" TEXT,
    PRIMARY KEY("id")
);
COMMIT;