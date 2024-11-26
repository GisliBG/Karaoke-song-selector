"use client";

import useSocket from "@/hooks/useSocket";
import React from "react";

const KaraokeStatus = () => {
  const { karaokeIsLive } = useSocket();

  return karaokeIsLive ? (
    <div>The Karaoke Is Live!</div>
  ) : (
    <div>The Karaoke will start any minute now, stay tuned!</div>
  );
};

export default KaraokeStatus;
