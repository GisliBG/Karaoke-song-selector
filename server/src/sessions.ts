// @ts-ignore
import SqliteStore from "better-sqlite3-session-store";
import session from "express-session";
import repo from "./repository/db";

export function setupSessionMiddleware() {
  const store = SqliteStore(session);
  const sessionMiddleware = session({
    secret: process.env.session_secret,
    resave: true,
    saveUninitialized: true,
    store: new store({
      client: repo.db,
      expired: {
        clear: true,
        intervalMs: 1000 * 60 * 60 * 4, //ms = 4h
      },
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 4, // 4 hours
      secure: false, // Set to true for HTTPS
      httpOnly: true,
      sameSite: "lax", // Adjust for cross-origin compatibility
    },
  });
  return sessionMiddleware;
}
