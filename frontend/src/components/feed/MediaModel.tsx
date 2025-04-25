// src/components/feed/MediaModel.tsx
import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, ThumbsUp, Share2 } from 'lucide-react';
import { Media } from '@/types/responses/data/post/Post';

interface MediaModelProps {
  isOpen: boolean;
  onClose: () => void;
  media: Media[];
  startIndex?: number; // Which item to show first (0-based)
}

const MediaModel: React.FC<MediaModelProps> = ({
  isOpen,
  onClose,
  media = [],
  startIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset index when startIndex changes (e.g., opening modal on different item)
  // And ensure index is within bounds if media changes
  useEffect(() => {
    const safeStartIndex = Math.max(0, Math.min(startIndex, media.length - 1));
    setCurrentIndex(safeStartIndex);
  }, [startIndex, media.length]);

  // Reset loading state when current item changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  // --- Define navigation functions ---
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.min(media.length - 1, prevIndex + 1));
  }, [media.length]);

  // Touch event handlers for swipe gestures
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Threshold for swipe detection (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go to next
        if (currentIndex < media.length - 1) goToNext();
      } else {
        // Swipe right, go to previous
        if (currentIndex > 0) goToPrevious();
      }
    }
    
    setTouchStart(null);
  }, [touchStart, currentIndex, media.length, goToNext, goToPrevious]);

  // --- Keyboard event handler ---
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
    },
    [isOpen, onClose, goToPrevious, goToNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);

  // Handle media load events
  const handleMediaLoaded = () => {
    setIsLoading(false);
  };

  const handleMediaError = () => {
    setIsLoading(false);
    console.error("Error loading media");
  };

  // Disable navigation buttons at the start/end
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === media.length - 1;

  if (!isOpen || !media.length) {
    return null;
  }

  const currentItem = media[currentIndex];

  return (
    <div
      // Slightly less opaque background, closer to Facebook's style
      className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-900/90 dark:bg-black/90 animate-in fade-in duration-200" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      {/* Facebook-style layout with media on left and sidebar on right */}
      <div
        ref={modalRef}
        className="relative flex h-full w-full flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="document"
        tabIndex={-1}
      >
        {/* Close Button - Top right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
          aria-label="Close media viewer"
        >
          <X size={24} />
        </button>

        {/* Media Display Area - Takes up most of the screen on desktop */}
        {/* Ensure this container fills its parent */}
        <div className="relative flex h-full w-full md:w-[75%] items-center justify-center bg-black overflow-hidden">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Media Counter - Top center */}
          {media.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800/80 px-3 py-1 text-sm text-white rounded-full z-10">
              {currentIndex + 1} / {media.length}
            </div>
          )}
          
          {/* Image Display */}
          {currentItem.type === 'IMAGE' && (
            <img
              src={currentItem.url}
              alt={currentItem.altText || `Media ${currentIndex + 1}`}
              className={`max-h-full max-w-full object-contain select-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleMediaLoaded}
              onError={handleMediaError}
              loading="lazy"
            />
          )}
          
          {/* Video Display */}
          {currentItem.type === 'VIDEO' && (
            <video
              ref={videoRef}
              key={currentItem.url}
              src={currentItem.url}
              poster={currentItem.thumbnailUrl}
              controls
              autoPlay
              muted // Added muted for better autoplay compatibility
              playsInline
              // Ensure video tries to fill space, object-contain handles aspect ratio
              className={`h-full w-full object-contain outline-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoadedData={handleMediaLoaded}
              onError={handleMediaError}
              preload="auto"
            />
          )}

          {/* Navigation Buttons - Large and prominent */}
          {media.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={isFirst}
                className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-4 text-white transition-all hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Previous media"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={goToNext}
                disabled={isLast}
                className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-800 p-4 text-white transition-all hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Next media"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>

        {/* Right Sidebar - Facebook style info panel */}
        {/* Adjusted sidebar background for better contrast/theming */}
        <div className="hidden md:flex md:w-[25%] flex-col bg-white dark:bg-gray-800 h-full overflow-y-auto shadow-lg"> 
          {/* User info and post details would go here */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {/* Placeholder Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div> 
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">User Name</h3> 
                <p className="text-xs text-gray-500 dark:text-gray-400">Posted 2h ago</p> 
              </div>
            </div>
            
            {/* Caption/Description */}
            {currentItem.altText && (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{currentItem.altText}</p> 
            )}
          </div>
          
          {/* Engagement buttons - Adjusted styling */}
          <div className="flex justify-around p-2 border-b border-gray-200 dark:border-gray-700">
            <button className="flex flex-1 justify-center items-center space-x-1.5 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ThumbsUp size={18} />
              <span className="text-sm font-medium">Like</span>
            </button>
            <button className="flex flex-1 justify-center items-center space-x-1.5 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm font-medium">Comment</span>
            </button>
            <button className="flex flex-1 justify-center items-center space-x-1.5 py-2 px-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Share2 size={18} />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
          
          {/* Comments section - Adjusted styling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4"> 
              {/* Placeholder Comment 1 */}
              <div className="flex space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-1.5 flex-1">
                  <p className="font-semibold text-xs text-gray-900 dark:text-white">Commenter Name</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-0.5">This is a sample comment on the post.</p>
                </div>
              </div>
              
              {/* Placeholder Comment 2 */}
              <div className="flex space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-1.5 flex-1">
                  <p className="font-semibold text-xs text-gray-900 dark:text-white">Another User</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-0.5">Great photo! Where was this taken?</p>
                </div>
              </div>
          </div>
          
          {/* Comment input - Adjusted styling */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 mt-auto"> 
            <div className="flex items-center space-x-2">
              {/* Placeholder Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div> 
              <input 
                type="text" 
                placeholder="Write a comment..." 
                className="flex-1 bg-gray-100 dark:bg-gray-700 border border-transparent dark:border-gray-600 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              /> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModel;
