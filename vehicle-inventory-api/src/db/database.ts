import { DatabaseSync } from "node:sqlite";

export const db = new DatabaseSync("vehicles.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    partner_id INTEGER NOT NULL,
    FOREIGN KEY (partner_id) REFERENCES partners(id)
  );
`);
