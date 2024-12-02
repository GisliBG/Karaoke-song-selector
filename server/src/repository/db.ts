import sqlite from "better-sqlite3";
import path from "path";

const db = new sqlite(path.resolve("./karaoke.db"));

const createSongTable = `CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY,
  artist STRING NOT NULL,
  title STRING NOT NULL
)`;
db.exec(createSongTable);

function query(sql: string, params: any) {
  return db.prepare(sql).all(params);
}

function run(sql: string, params: any) {
  return db.prepare(sql).run(params);
}

export default {
  query,
  run,
};
