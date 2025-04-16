
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Share2, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { currentUser } from '../../data/dummyData';

interface PostEngagementProps {
  postId?: string;
  agrees: number;
  disagrees: number;
  comments: number;
  amplifiedBy: string[];
  amplifiedCount?: number;
  commentsCount?: number;
  isProject?: boolean;
  hasCommented?: boolean;
  hasAgreed?: boolean;
  hasDisagreed?: boolean;
  hasAmplified?: boolean;
  onAgree?: () => void;
  onDisagree?: () => void;
  onCommentClick?: () => void;
  onAmplify?: (text?: string) => void;
  onReport?: () => void;
  collaborators?: string[];
  onCollaborateToggle?: (collaborating: boolean) => void;
}

const PostEngagement: React.FC<PostEngagementProps> = ({
  agrees = 0,
  disagrees = 0,
  comments = 0,
  amplifiedBy = [], // Default empty array
  amplifiedCount,
  commentsCount,
  isProject = false,
  hasCommented = false,
  hasAgreed = false,
  hasDisagreed = false,
  hasAmplified = false,
  onAgree,
  onDisagree,
  onCommentClick,
  onAmplify,
  onReport,
  collaborators = [], // Default empty array
  onCollaborateToggle
}) => {
  const [isAmplifyDialogOpen, setIsAmplifyDialogOpen] = useState(false);
  const [amplifyText, setAmplifyText] = useState('');
  
  const handleAmplify = () => {
    if (onAmplify) {
      if (isAmplifyDialogOpen) {
        onAmplify(amplifyText);
        setAmplifyText('');
        setIsAmplifyDialogOpen(false);
      } else {
        setIsAmplifyDialogOpen(true);
      }
    }
  };
  
  const handleSimpleAmplify = () => {
    if (onAmplify) {
      onAmplify();
      setIsAmplifyDialogOpen(false);
    }
  };
  
  const handleReport = () => {
    if (onReport) {
      onReport();
    } else {
      toast.info("Content reported to moderators");
    }
  };
  
  const handleCollaborate = () => {
    if (onCollaborateToggle) {
      // Safe check for collaborators array before using includes
      const isCurrentlyCollaborating = Array.isArray(collaborators) && collaborators.includes(currentUser.id);
      onCollaborateToggle(!isCurrentlyCollaborating);
    }
  };
  
  // Use the provided counts or fallback to the original values
  // Ensure we handle undefined values
  const displayCommentCount = commentsCount !== undefined ? commentsCount : comments;
  
  // Safely get the amplify count without relying on .length of potentially undefined values
  const displayAmplifyCount = amplifiedCount !== undefined 
    ? amplifiedCount 
    : (Array.isArray(amplifiedBy) ? amplifiedBy.length : 0);
  
  // Safely check if current user has amplified the post
  const userHasAmplified = hasAmplified || (Array.isArray(amplifiedBy) && amplifiedBy.includes(currentUser.id));
  
  // Safely check if current user is collaborating
  const isCollaborating = Array.isArray(collaborators) && collaborators.includes(currentUser.id);
  
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={onCommentClick}
            className={`flex items-center text-sm space-x-1.5 ${
              hasCommented ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-[18px] h-[18px]" />
            <span>{displayCommentCount}</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onAgree}
              className={`flex items-center text-sm space-x-1.5 ${
                hasAgreed ? 'text-green-500 fill-green-500' : 'text-muted-foreground hover:text-green-500'
              }`}
            >
              <ThumbsUp className={`w-[18px] h-[18px] ${hasAgreed ? 'fill-green-500' : ''}`} />
              <span>{agrees}</span>
            </button>
            
            <button
              onClick={onDisagree}
              className={`flex items-center text-sm space-x-1.5 ${
                hasDisagreed ? 'text-red-500 fill-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <ThumbsDown className={`w-[18px] h-[18px] ${hasDisagreed ? 'fill-red-500' : ''}`} />
              <span>{disagrees}</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Optional collaboration button for projects */}
          {isProject && onCollaborateToggle && (
            <button
              onClick={handleCollaborate}
              className={`text-sm px-2 py-1 mr-2 rounded-md ${
                isCollaborating 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {isCollaborating ? 'Collaborating' : 'Collaborate'}
            </button>
          )}
          
          <button
            onClick={handleAmplify}
            className={`flex items-center text-sm space-x-1.5 ${
              userHasAmplified ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Share2 className="w-[18px] h-[18px]" />
            <span>{displayAmplifyCount > 0 ? displayAmplifyCount : ''}</span>
          </button>
          
          <button
            onClick={handleReport}
            className="p-1.5 text-muted-foreground hover:text-foreground"
          >
            <Flag className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
      
      {/* Amplify dialog */}
      <Dialog open={isAmplifyDialogOpen} onOpenChange={setIsAmplifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Amplify this post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add your thoughts (optional)"
              value={amplifyText}
              onChange={(e) => setAmplifyText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handleSimpleAmplify}>
              Just Amplify
            </Button>
            <Button onClick={handleAmplify}>
              Amplify with Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostEngagement;
