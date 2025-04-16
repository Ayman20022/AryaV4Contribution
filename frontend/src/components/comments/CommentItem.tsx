
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Comment, User, formatRelativeTime, findUserById } from '../../data/dummyData';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  commentUser: User;
  postId: string;
  onReplySubmit: (text: string, parentId: string) => void;
  replies?: Comment[];
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  commentUser, 
  postId, 
  onReplySubmit, 
  replies = [],
  level = 0 
}) => {
  const [agrees, setAgrees] = useState(comment.agrees);
  const [userAgreed, setUserAgreed] = useState(false);
  const [userDisagreed, setUserDisagreed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const maxNestingLevel = 3;
  const isNestingLimited = level >= maxNestingLevel;

  const handleAgree = () => {
    if (userAgreed) {
      setAgrees(agrees - 1);
      setUserAgreed(false);
      toast.info("Removed agree");
    } else {
      setAgrees(agrees + 1);
      setUserAgreed(true);
      
      if (userDisagreed) {
        setUserDisagreed(false);
      }
      
      toast.success("You agreed with this comment");
    }
  };
  
  const handleDisagree = () => {
    if (userDisagreed) {
      setUserDisagreed(false);
      toast.info("Removed disagree");
    } else {
      setUserDisagreed(true);
      
      if (userAgreed) {
        setAgrees(agrees - 1);
        setUserAgreed(false);
      }
      
      toast.success("You disagreed with this comment");
    }
  };

  const handleReplyToggle = () => {
    setIsReplying(!isReplying);
  };

  const handleReplySubmit = (text: string) => {
    onReplySubmit(text, comment.id);
    setIsReplying(false);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className={`${level > 0 ? `ml-${Math.min(level * 4, 12)}` : ''}`}>
      <div className="flex items-start pt-3 space-x-2">
        <Link to={`/profile/${commentUser.id}`}>
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <Avatar className="w-6 h-6">
              <AvatarImage src={commentUser.avatar} alt={commentUser.name} />
              <AvatarFallback>{commentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </Link>
        <div className="flex-1 bg-secondary/10 backdrop-blur-sm p-3 rounded-lg border border-border/30">
          <div className="flex justify-between items-center">
            <div>
              <Link to={`/profile/${commentUser.id}`} className="font-medium text-sm hover:underline text-foreground">
                {commentUser.name}
              </Link>
              <span className="mx-1 text-muted-foreground text-xs">·</span>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            {agrees > 0 && (
              <span className="text-xs text-muted-foreground">
                {agrees} {agrees === 1 ? 'agree' : 'agrees'}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground mt-1">{comment.text}</p>
          
          {/* Comment engagement buttons */}
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={handleAgree}
              className={`flex items-center text-xs p-1.5 rounded-md transition-colors ${
                userAgreed ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 mr-1" />
              <span>Agree</span>
            </button>
            
            <button 
              onClick={handleDisagree}
              className={`flex items-center text-xs p-1.5 rounded-md transition-colors ${
                userDisagreed ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5 mr-1" />
              <span>Disagree</span>
            </button>

            {!isNestingLimited && (
              <button 
                onClick={handleReplyToggle}
                className="flex items-center text-xs p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply form */}
      {isReplying && (
        <div className={`ml-${Math.min((level + 1) * 4, 12)}`}>
          <CommentForm 
            postId={postId}
            parentCommentId={comment.id}
            onCommentSubmit={handleReplySubmit}
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-8">
          {replies.length > 0 && !showReplies && (
            <button 
              onClick={toggleReplies}
              className="text-xs text-primary hover:text-primary/90 mt-1"
            >
              Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {showReplies && (
            <>
              {replies.length > 2 && (
                <button 
                  onClick={toggleReplies}
                  className="text-xs text-primary hover:text-primary/90 mt-1"
                >
                  Hide {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
              <div className="space-y-1">
                {replies.map((reply) => (
                  <CommentItem 
                    key={reply.id}
                    comment={reply}
                    commentUser={reply.user ? reply.user : findUserById(reply.userId)}
                    postId={postId}
                    onReplySubmit={onReplySubmit}
                    level={level + 1}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
