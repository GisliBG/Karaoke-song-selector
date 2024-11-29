import { Express } from "express";
import { getLocalIPAddress } from "./utils";

export function setupEndpoints(app: Express) {
  app.get("/", function respondWithLocalIp(req, res) {
    const localIp = getLocalIPAddress();
    res.json({ localIp });
  });

  app.post("/catalog", function addSongToCatalog(req, res) {
    console.log(req.body);
  });
}
