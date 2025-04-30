import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { formatRelativeTime, findUserById } from "../../data/dummyData";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import { Comment } from "@/types/responses/data/comment/Comment";
import { UserEssentials } from "@/types/responses/data/user/UserEssentials";
import { getCustomAvatar } from "@/lib/utils";
import { CommentService } from "@/services/commentService";

interface CommentItemProps {
  comment: Comment;
  commentUser: UserEssentials;
  postId: string;
  onReplySubmit: (reply: Comment) => void;
  onLoadedReplies: (replies: Comment[]) => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  commentUser,
  postId,
  onReplySubmit,
  onLoadedReplies,
  level = 0,
}) => {
  const [agrees, setAgrees] = useState(comment.agreeCount);
  const [userAgreed, setUserAgreed] = useState(comment.isAgreed);
  const [userDisagreed, setUserDisagreed] = useState(comment.isDisagreed);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const maxNestingLevel = 3;
  const isNestingLimited = level >= maxNestingLevel;

  const handleAgree = async () => {
    try {
      if (userDisagreed) {
        await CommentService.cancelDisagree(postId, comment.id);
        setAgrees(agrees + 1);
        setUserDisagreed(false);
      }
      if (userAgreed) {
        await CommentService.cancelAgree(postId, comment.id);
        setAgrees(agrees - 1);
        setUserAgreed(false);
      } else {
        await CommentService.agree(postId, comment.id);
        setAgrees(agrees + 1);
        setUserAgreed(true);
        if (userDisagreed) {
          setUserDisagreed(false);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDisagree = async () => {
    try {
      if (userAgreed) {
        await CommentService.cancelAgree(postId, comment.id);
        setAgrees(agrees - 1);
        setUserAgreed(false);
      }
      if (userDisagreed) {
        await CommentService.cancelDisagree(postId, comment.id);
        setAgrees(agrees + 1);
        setUserDisagreed(false);
      } else {
        await CommentService.disagree(postId, comment.id);
        setAgrees(agrees - 1);
        setUserDisagreed(true);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleReplyToggle = () => {
    setIsReplying(!isReplying);
  };

  const handleReplySubmit = (reply: Comment) => {
    onReplySubmit(reply);
    setIsReplying(false);
  };

  const toggleReplies = async () => {
    try {
      if (!comment.replies || comment.replies.length === 0) {
        const result = await CommentService.findCommentReplies(
          postId,
          comment.id
        );
        onLoadedReplies(result.data.content);
      }
      setShowReplies(!showReplies);
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  return (
    <div className={`${level > 0 ? `ml-${Math.min(level * 4, 12)}` : ""}`}>
      <div className="flex items-start pt-3 space-x-2">
        <Link to={`/profile/${commentUser.id}`}>
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={
                  commentUser.avatarUrl ||
                  getCustomAvatar(commentUser.firstName, commentUser.lastName)
                }
                alt={commentUser.firstName + " " + commentUser.lastName}
              />
            </Avatar>
          </div>
        </Link>
        <div className="flex-1 bg-secondary/10 backdrop-blur-sm p-3 rounded-lg border border-border/30">
          <div className="flex justify-between items-center">
            <div>
              <Link
                to={`/profile/${commentUser.username}`}
                className="font-medium text-sm hover:underline text-foreground"
              >
                {commentUser.firstName + " " + commentUser.lastName}
              </Link>
              <span className="mx-1 text-muted-foreground text-xs">·</span>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(new Date(comment.createdAt))}
              </span>
            </div>
            {agrees > 0 && (
              <span className="text-xs text-muted-foreground">
                {agrees} {agrees === 1 ? "agree" : "agrees"}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground mt-1">{comment.content}</p>

          {/* Comment engagement buttons */}
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleAgree}
              className={`flex items-center text-xs p-1.5 rounded-md transition-colors ${
                userAgreed
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 mr-1" />
              <span>Agree</span>
            </button>

            <button
              onClick={handleDisagree}
              className={`flex items-center text-xs p-1.5 rounded-md transition-colors ${
                userDisagreed
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-foreground"
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
      {comment.repliesCount > 0 && (
        <div className="ml-8">
          {comment.repliesCount > 0 && !showReplies && (
            <button
              onClick={toggleReplies}
              className="text-xs text-primary hover:text-primary/90 mt-1"
            >
              Show {comment.repliesCount}{" "}
              {comment.repliesCount === 1 ? "reply" : "replies"}
            </button>
          )}

          {showReplies && (
            <>
              {comment.replies.length > 2 && (
                <button
                  onClick={toggleReplies}
                  className="text-xs text-primary hover:text-primary/90 mt-1"
                >
                  Hide {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "reply" : "replies"}
                </button>
              )}
              <div className="space-y-1">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    commentUser={reply.createdBy}
                    postId={postId}
                    onReplySubmit={onReplySubmit}
                    onLoadedReplies={onLoadedReplies}
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
