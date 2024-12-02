import { Express } from "express";
import { getLocalIPAddress } from "./utils";
import { insertSong } from "./repository/karaoke.repository";

export function setupEndpoints(app: Express) {
  app.get("/", function respondWithLocalIp(req, res) {
    const localIp = getLocalIPAddress();
    res.json({ localIp });
  });

  app.post("/catalog", function addSongToCatalog(req, res) {
    const { artist, title } = req.body;
    insertSong(artist, title);
    res.status(200);
  });
}
