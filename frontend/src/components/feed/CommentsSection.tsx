import React from "react";
import { MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import CommentItem from "../comments/CommentItem";
import { Comment } from "@/types/responses/data/comment/Comment";

interface CommentsSectionProps {
  expanded: boolean;
  toggleExpand: () => void;
  comments: Comment[];
  postId: string;
  onReplySubmit: (reply: Comment) => void;
  onLoadedReplies: (replies: Comment[]) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  expanded,
  toggleExpand,
  comments,
  postId,
  onReplySubmit,
  onLoadedReplies,
}) => {
  if (comments.length === 0) return null;

  const topLevelComments = comments.filter((comment) => !comment.parent);

  return (
    <>
      <div className="mt-4 flex items-center text-muted-foreground">
        <MessageSquare className="w-4 h-4 mr-2" />
        <span className="text-sm">{comments.length} comments</span>

        {topLevelComments.length > 1 && (
          <button
            onClick={toggleExpand}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="mt-3 space-y-3">
        {(expanded ? topLevelComments : topLevelComments.slice(0, 1)).map(
          (comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              commentUser={comment.createdBy}
              postId={postId}
              onReplySubmit={onReplySubmit}
              onLoadedReplies={onLoadedReplies}
            />
          )
        )}

        {!expanded && topLevelComments.length > 1 && (
          <button
            onClick={toggleExpand}
            className="text-sm text-primary hover:text-primary/80 mt-2"
          >
            Show {topLevelComments.length - 1} more{" "}
            {topLevelComments.length - 1 === 1 ? "comment" : "comments"}
          </button>
        )}
      </div>
    </>
  );
};

export default CommentsSection;
