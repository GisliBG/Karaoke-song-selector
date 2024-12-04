import db from "./db";

export function getSongs() {
  try {
    const songs = db.query(`SELECT * from songs`);
    console.log(songs);
    return songs;
  } catch (error) {
    console.log("Error while selecting songs", error);
  }
}

export function insertSong(artist: string, title: string) {
  try {
    db.run(`INSERT INTO songs (artist, title) VALUES (@artist, @title)`, {
      artist,
      title,
    });
  } catch (error) {
    console.log("Error while inserting new song", error);
  }
}
