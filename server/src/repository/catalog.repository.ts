import db from "./db";
export function getKaraokePlaylist() {
  try {
    const playlist = db.query(`
      SELECT * FROM songs
      WHERE id in (SELECT song_id from karaoke_songs)
    `);

    return playlist;
  } catch (error) {
    console.log("Error while selecting songs", error);
  }
}
