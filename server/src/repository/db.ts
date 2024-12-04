import sqlite from "better-sqlite3";
import path from "path";

const db = new sqlite(path.resolve("./karaoke.db"));

const createSongTable = `CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY,
  artist STRING NOT NULL,
  title STRING NOT NULL
)`;
db.exec(createSongTable);

function query(sql: string, params?: any) {
  const query = db.prepare(sql);
  return params ? query.all(params) : query.all();
}

function run(sql: string, params: any) {
  return db.prepare(sql).run(params);
}

process.on("SIGINT", function closeConnection() {
  db.close();
});

export default {
  query,
  run,
};
