import React from "react";
import "./App.css";
import { QRCodeSVG } from "qrcode.react";

function App() {
  const [localIpAddress, setLocalIpAddress] = React.useState("");
  React.useEffect(() => {
    const fetchLocalIp = async () => {
      const res = await fetch("/api");
      const { localIp } = await res.json();
      setLocalIpAddress(localIp);
    };
    fetchLocalIp();
  }, []);

  return (
    <div className='flex flex-col w-full h-full justify-center items-center'>
      <h1>Scan QR code to start jamming!</h1>
      <QRCodeSVG
        value={`http://${localIpAddress}:5173/live`}
        title={"Scan to party!"}
        size={128}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        marginSize={0}
      />
    </div>
  );
}

export default App;
