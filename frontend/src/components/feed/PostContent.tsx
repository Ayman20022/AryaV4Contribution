
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface PostContentProps {
  text: string;
  images?: string[];
  video?: string;
  link?: string;
}

const PostContent: React.FC<PostContentProps> = ({ text, images, video, link }) => {
  const [showAllImages, setShowAllImages] = useState(false);
  
  const maxInitialImages = 1;
  const hasMultipleImages = images && images.length > 1;
  
  const displayImages = showAllImages || !hasMultipleImages
    ? images || []
    : images?.slice(0, maxInitialImages) || [];

  return (
    <div className="mb-4">
      <p className="mb-3 text-foreground whitespace-pre-line">{text}</p>
      
      {displayImages.length > 0 && (
        <div className="mt-3 mb-3 space-y-2">
          {displayImages.map((image, idx) => (
            <img 
              key={idx} 
              src={image} 
              alt={`Post image ${idx + 1}`} 
              className="rounded-lg w-full object-cover max-h-96 transition-all duration-300 hover:shadow-md"
            />
          ))}
          
          {hasMultipleImages && !showAllImages && (
            <button 
              onClick={() => setShowAllImages(true)}
              className="w-full py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Show {images!.length - maxInitialImages} more {images!.length - maxInitialImages === 1 ? 'image' : 'images'}
            </button>
          )}
        </div>
      )}
      
      {video && (
        <div className="mt-3 rounded-lg overflow-hidden bg-black/5 h-64 flex items-center justify-center">
          <div className="text-muted-foreground">
            <span className="block text-sm">Video Preview</span>
            <span className="text-xs">(Video functionality coming soon)</span>
          </div>
        </div>
      )}
      
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-3 block p-3 border border-border rounded-lg hover:bg-secondary/20 transition-colors"
        >
          <div className="flex items-center text-primary">
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className="text-sm truncate">{link}</span>
          </div>
        </a>
      )}
    </div>
  );
};

export default PostContent;
