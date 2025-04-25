import React, { useMemo } from 'react';
import MediaItem from './MediaItem';
import { Media } from '@/types/responses/data/post/Post'; // Adjust path

interface MediaGridProps {
  media: Media[];
  onMediaClick: (index: number) => void;
}

// --- Configuration ---
const MAX_PREVIEW_SLOTS = 4; // The number of visual grid cells we will render (max)

const MediaGrid: React.FC<MediaGridProps> = ({ media, onMediaClick }) => {
  const totalItems = media.length;

  // --- Calculate Items for Display ---
  // Determine how many actual <MediaItem> components to render in the grid slots.
  const itemsToDisplayCount = Math.min(totalItems, MAX_PREVIEW_SLOTS);

  // Get the actual media objects for these slots.
  // We only need up to MAX_PREVIEW_SLOTS objects to fill the visual grid.
  const itemsForDisplay = media.slice(0, itemsToDisplayCount);

  // --- Calculate Overflow ---
  // How many items are *not* shown in the initial preview slots.
  const overflowCount = Math.max(0, totalItems - MAX_PREVIEW_SLOTS);

  // --- Determine Grid Layout ---
  // The grid layout class depends on the number of items we intend to *show*
  // (1, 2, 3, or 4). For 5+ items, we still use the 4-slot layout.
  const effectiveLayoutItemCount = Math.min(totalItems, MAX_PREVIEW_SLOTS);

  const containerClasses = useMemo(() => {
    let base = 'grid gap-0.5 rounded-md overflow-hidden '; // Small gap
    switch (effectiveLayoutItemCount) {
      case 1: return base + 'grid-cols-1 grid-rows-1 max-h-[600px]'; // Max height for single item
      case 2: return base + 'grid-cols-2 grid-rows-1 aspect-[16/8]'; // Wider aspect for two
      case 3: return base + 'grid-cols-2 grid-rows-2 aspect-square'; // Square aspect for 3 (1 tall left, 2 right)
      case 4: return base + 'grid-cols-2 grid-rows-2 aspect-square'; // Square aspect for 4 (and 5+)
      default: return ''; // Should not happen if totalItems > 0
    }
  }, [effectiveLayoutItemCount]);

  // --- Determine Specific Item Styling (Spanning) ---
  const getGridItemClassName = (index: number): string => {
    // Only the 3-item layout needs specific item styling here
    if (effectiveLayoutItemCount === 3 && index === 0) {
      return 'row-span-2'; // First item takes full height on the left
    }
    // No special classes needed for 1, 2, or 4-slot layouts
    return '';
  };

  // --- Render ---
  if (totalItems === 0) {
    return null; // Don't render anything if no media
  }

  return (
    <div className={`mt-3 mb-3 ${containerClasses}`}>
      {itemsForDisplay.map((item, index) => {
        // Determine if this specific slot (index) should display the "+N" overlay.
        // This happens if:
        // 1. It's the *last* possible preview slot (index === MAX_PREVIEW_SLOTS - 1)
        // 2. AND there are actually items hidden (overflowCount > 0)
        const isOverlayItem = index === MAX_PREVIEW_SLOTS - 1 && overflowCount > 0;

        return (
          <MediaItem
            key={item.id} // Use a stable ID if available
            // Pass the media data for the current slot.
            // When it's an overlay, MediaItem uses this item's thumbnail/image dimly behind the "+N".
            item={item}
            // Pass the original index in the full 'media' array for the click handler
            index={index}
            onClick={onMediaClick}
            className={getGridItemClassName(index)}
            // --- Overlay Props ---
            isOverlay={isOverlayItem}
            overlayCount={isOverlayItem ? overflowCount : 0} // Pass the calculated overflow count
          />
        );
      })}
    </div>
  );
};

export default MediaGrid;