// src/components/posts/PostContent.tsx (Update this file)
import React, { useState } from 'react'; // Added useState back
import { ExternalLink } from 'lucide-react';
import { Media } from '@/types/responses/data/post/Post'; // Adjust path
import MediaGrid from './MediaGrid'; // Import the grid component

interface PostContentProps {
  text: string;
  media?: Media[];
  link?: string;
}

const PostContent: React.FC<PostContentProps> = ({ text, media = [], link }) => {

  // --- Event Handlers ---
  const handleMediaClick = (index: number) => {

  };

  return (
    <div className="mb-4">
      {/* Text Content */}
      {text && text.trim() && (
        <p className="mt-2 mb-3 text-foreground whitespace-pre-line">{text}</p>
      )}

      {/* Media Grid */}
      {media.length > 0 && (
        <MediaGrid media={media} onMediaClick={handleMediaClick} />
      )}

      {/* Link Preview */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors duration-200"
        >
          <div className="flex items-center text-sm text-primary">
            <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{link}</span>
          </div>
        </a>
      )}

    </div>
  );
};

export default PostContent;
