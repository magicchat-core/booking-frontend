// components/VideoPlayer.jsx
"use client";

import { YouTubePlayer } from "@kanketsu/youtube-embed/react";

export default function VideoPlayer() {
  return (
    <div className="video-wrapper" style={{ width: "100%", aspectRatio: "16/9" }}>
      <YouTubePlayer
        videoId="8PYsM8IX-3g"
        title="Sageion Demo Walkthrough"
        // Optional: use facade to load thumbnail first, then player on click
        // facade 
      />
    </div>
  );
}
