import { Song } from "shared/dist/karaoke";
import db from "./db";
export function getKaraokePlaylist(): Song[] {
  try {
    const playlist = db.query(`
      SELECT * FROM songs
      WHERE id in (SELECT song_id from karaoke_songs)
    `);
    if (playlist == undefined) {
      return [] as Song[];
    }
    return playlist as Song[];
  } catch (error) {
    console.log("Error while selecting songs", error);
    return [];
  }
}
