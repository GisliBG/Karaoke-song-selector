import os from "os";
import { v4 as v4uuid } from "uuid";

export function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interf = interfaces[interfaceName];
    if (interf) {
      for (const iface of interf) {
        // Check if the interface is an IPv4 address and is not internal (i.e., not localhost)
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  }

  return "127.0.0.1"; // Fallback to localhost if no network interface found
}

export function generateId() {
  return v4uuid();
}
