// src/components/feed/MediaItem.tsx
import React, { useState, useRef, useEffect, MouseEvent, SyntheticEvent, ChangeEvent } from 'react'; // Added ChangeEvent
import { Play, Pause, Volume2, VolumeX, Clock } from 'lucide-react';
import { Media } from '@/types/responses/data/post/Post';

interface MediaItemProps {
  item: Media;
  index: number; // Index in the original media array
  onClick: (index: number) => void;
  isOverlay?: boolean;
  overlayCount?: number;
  className?: string; // For specific grid cell styling (like row-span)
}

const MediaItem: React.FC<MediaItemProps> = ({
  item,
  index,
  onClick,
  isOverlay = false,
  overlayCount = 0,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null); // Ref for progress bar
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState<number>(0); // Store raw duration
  const [currentTime, setCurrentTime] = useState<number>(0); // Store raw current time
  const [formattedDuration, setFormattedDuration] = useState<string>("0:00");
  const [formattedCurrentTime, setFormattedCurrentTime] = useState<string>("0:00");

  // --- Helper to format time ---
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00"; 
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- Video Control Functions ---
  const togglePlayPause = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent modal opening
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(error => console.error("Video play failed:", error));
    } else {
      video.pause();
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent modal opening
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    // No need to setIsMuted here, the onVolumeChange listener will handle it
  };

  // --- Handle Metadata Load for Duration ---
  const handleLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration && isFinite(video.duration)) {
      setDuration(video.duration);
      setFormattedDuration(formatTime(video.duration));
      if (progressBarRef.current) {
         progressBarRef.current.max = video.duration.toString(); // Set max value for progress bar
      }
    }
  };

  // --- Handle Time Update ---
  const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setCurrentTime(video.currentTime);
    setFormattedCurrentTime(formatTime(video.currentTime));
    // Update progress bar visually if user isn't dragging it
    if (progressBarRef.current) {
       progressBarRef.current.value = video.currentTime.toString();
    }
  };

  // --- Handle Seek Bar Interaction ---
   const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
     const video = videoRef.current;
     if (!video) return;
     const seekTime = parseFloat(e.target.value);
     video.currentTime = seekTime;
     setCurrentTime(seekTime); // Update state immediately for smoother feel
     setFormattedCurrentTime(formatTime(seekTime));
   };

   // Prevent modal opening when clicking progress bar or time display
   const handleControlClick = (e: MouseEvent) => {
       e.stopPropagation();
   }

   // Calculate progress percentage for smooth track styling
   const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
   // Using Tailwind colors for consistency (adjust if needed) - e.g., blue-500 fill, gray-600 track
   const gradientStyle = {
     background: `linear-gradient(to right, #3b82f6 ${progressPercent}%, #4b5563 ${progressPercent}%)` 
   };


  // --- Sync State with Video Events ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false); // Treat ended as paused
    const handleVolumeChange = () => setIsMuted(video.muted); // Update mute state

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);

    // Initial sync
    setIsPlaying(!video.paused && !video.ended);
    setIsMuted(video.muted);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [item.url]); // Re-run if the video source changes

  // --- Modal Click Handler ---
  const handleOpenModal = () => {
    // Pause video when opening modal if it's playing
    if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
    }
    onClick(index);
  };

  const commonWrapperClasses =
    'relative w-full h-full overflow-hidden bg-secondary/30 group cursor-pointer';
  const commonMediaClasses = 'absolute inset-0 w-full h-full object-cover'; // Use absolute positioning

  if (isOverlay && overlayCount > 0) {
  // Render the overlay item (+N)
    return (
      <div
        onClick={handleOpenModal} // Use the updated handler
        className={`${commonWrapperClasses} ${className} flex items-center justify-center`}
      >
        {/* Render the underlying media dimly */}
        {/* Ensure image/video covers the area */}
        {item.type === 'IMAGE' && (
           <img
             src={item.url}
             alt={item.altText || `Post media ${index + 1}`}
             className={`${commonMediaClasses} filter brightness-50`} // Removed hover scale for overlay
             loading="lazy"
           />
         )}
         {item.type === 'VIDEO' && (
           // Use thumbnail for overlay consistency
           <img
              src={item.thumbnailUrl || ''}
              alt={item.altText || `Video thumbnail ${index + 1}`}
              className={`${commonMediaClasses} filter brightness-50`}
            />
         )}
         {/* Dark overlay layer */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">+{overlayCount}</span>
        </div>
      </div>
    );
  }

  // Render regular image or video
  return (
    <div onClick={handleOpenModal} className={`${commonWrapperClasses} ${className}`}>
      {item.type === 'IMAGE' && (
        <img
          src={item.url}
          // Apply common classes here too
          className={`${commonMediaClasses} transition-transform duration-300 group-hover:scale-105`}
          alt={item.altText || `Post media ${index + 1}`}
          loading="lazy"
        />
      )}
      {item.type === 'VIDEO' && (
        <>
          <video
            ref={videoRef}
            src={item.url}
            poster={item.thumbnailUrl}
            preload="metadata"
            muted={isMuted}
            // loop // Removed loop attribute
            playsInline
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105`} 
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate} // Add time update listener
          />
          {/* Custom Controls Overlay */}
          {/* Show controls on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 fill-white" />
              ) : (
                <Play className="w-10 h-10 fill-white" />
              )}
            </button>
          </div>
           {/* Mute/Unmute Button (bottom corner) */}
           <button
             onClick={toggleMute}
             className="absolute bottom-2 right-2 text-white p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10 opacity-0 group-hover:opacity-100"
             aria-label={isMuted ? 'Unmute video' : 'Mute video'}
           >
             {isMuted ? (
               <VolumeX className="w-4 h-4" />
             ) : (
               <Volume2 className="w-4 h-4" />
             )}
           </button>
           {/* Progress Bar */}
           <div 
             className="absolute bottom-8 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
             onClick={handleControlClick} // Prevent modal opening
           >
             <input
               ref={progressBarRef}
               type="range"
               min="0"
               max={duration}
               value={currentTime}
               onChange={handleSeek}
               style={gradientStyle} // Apply dynamic gradient background
               // Adjusted className: Ensure no conflicting background classes remain
               className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-transparent
                          [&::-webkit-slider-thumb]:appearance-none 
                          [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                          [&::-webkit-slider-thumb]:bg-white 
                          [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:ease-in-out 
                          [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
                          [&::-moz-range-thumb]:bg-white 
                          [&::-moz-range-thumb]:rounded-full 
                          [&::-moz-range-thumb]:border-none
                          [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:ease-in-out"
               aria-label="Video progress"
             />
           </div>

           {/* Time Display (Current / Total) */}
           <div 
             className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity"
             onClick={handleControlClick} // Prevent modal opening
           >
             <Clock size={12} />
             <span>{formattedCurrentTime} / {formattedDuration}</span>
           </div>
        </>
      )}
    </div>
  );
};

export default MediaItem;
