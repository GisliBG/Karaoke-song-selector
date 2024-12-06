import db from "./db";

export function getSongs() {
  try {
    const songs = db.query(`
      SELECT songs.id, songs.artist, songs.title,
      CASE 
        WHEN karaoke_songs.song_id IS NOT NULL THEN 1
        ELSE 0
      END AS selctedForKaraoke
      FROM songs
      LEFT JOIN karaoke_songs ON songs.id = karaoke_songs.song_id
    `);

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

export function insertSongToKaraoke(id: string) {
  try {
    db.run(`INSERT INTO karaoke_songs (song_id) VALUES (@song_id)`, {
      song_id: id,
    });
  } catch (error) {
    console.log("Error while inserting a song to karaoke", error);
  }
}

export function deleteSongFromKaraoke(id: string) {
  try {
    db.run(`DELETE FROM karaoke_songs WHERE song_id = (@id)`, {
      id,
    });
  } catch (error) {
    console.log("Error while removing a song from karaoke");
  }
}

export function removeSong(id: string) {
  try {
    db.run(`DELETE FROM songs where id = (@id)`, {
      id,
    });
  } catch (error) {
    console.log("Error while inserting new song", error);
  }
}
