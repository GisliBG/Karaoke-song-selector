import { useEffect, useState } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import io from "socket.io-client";

const socket = io("localhost:3000");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isKaraokeLive, setIsKaraokeLive] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    socket.on("karaoke:state", (state) => {
      console.log(state.isKaraokeLive);
      setIsKaraokeLive(state.isKaraokeLive);
    });

    return () => {
      socket.off("karaoke:state");
    };
  });
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {isConnected && (
          <button
            onClick={() =>
              isKaraokeLive
                ? socket.emit("karaoke:stop")
                : socket.emit("karaoke:start")
            }
          >
            {isKaraokeLive ? "stop" : "start"} karaoke
          </button>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
