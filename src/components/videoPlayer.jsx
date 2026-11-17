// src/components/VideoPlayer.jsx
"use client";

import { YouTubePlayer } from "@kanketsu/youtube-embed/react";

export default function VideoPlayer({ url }) {
  if (!url) return null;

  const getVideoId = (link) => {
    const match = link.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    const shortMatch = link.match(/(?:embed\/|youtu\.be\/)([^?&]+)/);
    if (shortMatch) return shortMatch[1];
    return null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: '#1a1a1a', borderRadius: '8px' }}>
        <p>Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", aspectRatio: "16/9", background: "#000", borderRadius: "8px", overflow: "hidden" }}>
      <YouTubePlayer videoId={videoId} title="Sageion Demo Walkthrough" />
    </div>
  );
}