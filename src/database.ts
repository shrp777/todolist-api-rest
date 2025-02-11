import { Database } from "bun:sqlite";
const db = new Database("todolist.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('todo', 'doing', 'done')),
    createdAt TEXT NOT NULL,
    completedAt TEXT,
    deadline TEXT
  )
`);

export default db;
