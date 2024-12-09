import { Express } from "express";
import { getLocalIPAddress } from "./utils";
import {
  insertSong,
  getSongs,
  removeSong,
  insertSongToKaraoke,
  deleteSongFromKaraoke,
} from "./repository/karaoke.repository";
import { getKaraokePlaylist } from "./repository/catalog.repository";
export function setupEndpoints(app: Express) {
  app.get("/", function respondWithLocalIp(req, res) {
    const localIp = getLocalIPAddress();
    res.json({ localIp });
  });

  setupCatalog(app);
  setupKaraoke(app);
}

function setupKaraoke(app: Express) {
  app.get("/playlist", function fetchKaraokePlaylist(req, res) {
    const playlist = getKaraokePlaylist();
    res.json({ playlist });
  });
}

function setupCatalog(app: Express) {
  app.get("/catalog", function fetchSongsFromCatalog(req, res) {
    const songs = getSongs();
    res.json({ songs });
  });

  app.post("/catalog", function addSongToCatalog(req, res) {
    const { artist, title } = req.body;
    insertSong(artist, title);
    res.status(201).json({ message: "Song was successfully added" });
  });

  app.put("/catalog/:id", function setSongForNextKaraoke(req, res) {
    const { checked } = req.body;
    const { id } = req.params;
    console.log(checked);
    if (checked) {
      insertSongToKaraoke(id);
      res.status(200).json({ message: "Song was successfully selected", id });
    } else {
      deleteSongFromKaraoke(id);
      res
        .status(200)
        .json({ message: "Song was successfully removed from karaoke", id });
    }
  });

  app.delete("/catalog/:id", function removeSongFromCatalog(req, res) {
    const { id } = req.params;
    removeSong(id);
    res.status(200).json({ message: "Song was successfully deleted", id });
  });
}
