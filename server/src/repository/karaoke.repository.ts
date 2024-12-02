import db from "./db";

export function insertSong(artist: string, title: string) {
  db.run(`INSERT INTO songs (artist, title) VALUES (@artist, @title)`, {
    artist,
    title,
  });
}
