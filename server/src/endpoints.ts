import { Express, Request, Response } from "express";
import { getLocalIPAddress } from "./utils";
import {
  insertSong,
  getSongs,
  removeSong,
  insertSongToKaraoke,
  deleteSongFromKaraoke,
} from "./repository/karaoke.repository";
import { getKaraokePlaylist } from "./repository/catalog.repository";
require("dotenv").config();

export function setupEndpoints(app: Express) {
  app.get("/", function respondWithLocalIp(req, res) {
    const localIp = getLocalIPAddress();
    res.json({ localIp });
  });

  setupAuth(app);
  setupCatalog(app);
  setupKaraoke(app);
}

function setupAuth(app: Express) {
  app.post("/login", function login(req: Request, res: Response): any {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      if (req.session.user && password === process.env.ADMIN_PASSWORD) {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: "Login failed" });
          }

          // Return user data (exclude sensitive information)
          return res.status(200).json({
            user: {
              ...req.session.user,
              admin: true,
            },
          });
        });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  });

  app.post("/logout", function logout(req: Request, res: Response): any {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }

      return res.status(200).json({ message: "Successfully logged out" });
    });
  });
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
