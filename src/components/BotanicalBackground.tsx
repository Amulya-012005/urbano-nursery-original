import React, { useEffect, useRef } from 'react';

export const BotanicalBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.9;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const handleFirstClick = () => {
            video.play().catch(() => {});
            window.removeEventListener('click', handleFirstClick);
            window.removeEventListener('touchstart', handleFirstClick);
          };
          window.addEventListener('click', handleFirstClick);
          window.addEventListener('touchstart', handleFirstClick);
        });
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none select-none">
      {/* User Uploaded Sunlit Botanical Video in Full 1080p HD Quality */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/assets/aistudio/canopy_poster.jpg"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
      >
        <source src="/assets/aistudio/green_1080p_hd.mp4" type="video/mp4" />
        <source src="/assets/aistudio/WhatsApp_Video_2026-10-26_at_8.20.49_PM_d11af9d1.mp4" type="video/mp4" />
        <source src="/assets/aistudio/green_1968c527.mp4" type="video/mp4" />
      </video>

      {/* Crystal-Clear Subtle Ambient Film to preserve Full HD Video Clarity while ensuring text readability */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
    </div>
  );
};
