import sqlite from "better-sqlite3";
import path from "path";

const db = new sqlite(path.resolve("./karaoke.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    artist TEXT NOT NULL,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS karaokes (
    id INTEGER PRIMAR KEY,
    name TEXT NOT NULL,
    date TEXT,
    location TEXT
  );

  CREATE TABLE IF NOT EXISTS karaoke_songs (
    song_id INTEGER NOT NULL UNIQUE, 
    FOREIGN KEY (song_id) REFERENCES songs (id)
  );
`);

function query(sql: string, params?: any) {
  const query = db.prepare(sql);
  return params ? query.all(params) : query.all();
}

function run(sql: string, params: any) {
  return db.prepare(sql).run(params);
}

// Close database on exit
process.on("SIGINT", () => {
  console.log("Closing database connection...");
  db.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Closing database connection...");
  db.close();
  process.exit(0);
});

export default {
  db,
  query,
  run,
};
