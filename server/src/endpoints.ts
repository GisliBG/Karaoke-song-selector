import { Express } from "express";
import { getLocalIPAddress } from "./utils";

export function setupEndpoints(app: Express) {
  app.get("/", (req, res) => {
    const localIp = getLocalIPAddress();
    console.log(localIp);
    res.json({ localIp });
  });
}
