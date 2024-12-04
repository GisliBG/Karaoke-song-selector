import { Express } from "express";
import { getLocalIPAddress } from "./utils";
import {
  insertSong,
  getSongs,
  removeSong,
} from "./repository/karaoke.repository";

export function setupEndpoints(app: Express) {
  app.get("/", function respondWithLocalIp(req, res) {
    const localIp = getLocalIPAddress();
    res.json({ localIp });
  });

  app.get("/catalog", function fetchSongsFromCatalog(req, res) {
    const songs = getSongs();
    res.json({ songs });
  });

  app.post("/catalog", function addSongToCatalog(req, res) {
    const { artist, title } = req.body;
    insertSong(artist, title);
    res.status(201).json({ message: "Song was successfully added" });
  });

  app.delete("/catalog/:id", function removeSongFromCatalog(req, res) {
    const { id } = req.params;
    removeSong(id);
    res.status(200).json({ message: "Song was successfully deleted", id });
  });
}
