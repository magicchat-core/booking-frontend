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

  if (!videoId) return <div>Invalid YouTube URL</div>;

  return (
    <div 
      style={{ 
        width: "100%", 
        aspectRatio: "16/9", 
        background: "#000", 
        borderRadius: "8px", 
        overflow: "hidden",
        position: "relative" 
      }}
    >
      {/* We add a style block to ensure the inner iframe and wrapper fill the space */}
      <style>{`
        .video-container iframe,
        .video-container > div {
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
      `}</style>
      
      <div className="video-container" style={{ width: "100%", height: "100%" }}>
        <YouTubePlayer videoId={videoId} title="Sageion Demo Walkthrough" />
      </div>
    </div>
  );
}