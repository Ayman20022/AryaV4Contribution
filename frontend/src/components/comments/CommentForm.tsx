import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useUserStore } from "@/store";
import { getCustomAvatar } from "@/lib/utils";
import { CommentService } from "@/services/commentService";
import { Comment } from "@/types/responses/data/comment/Comment";
import { Result } from "@/types/responses/system/Result";

interface CommentFormProps {
  postId: string;
  onCommentSubmit: (comment: Comment) => void;
  parentCommentId?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentSubmit,
  parentCommentId,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = useUserStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      let result: Result<Comment>;
      if (parentCommentId) {
        result = await CommentService.createReply(postId, parentCommentId, {
          content: comment,
        });
      } else {
        result = await CommentService.create(postId, {
          content: comment,
        });
      }

      onCommentSubmit(result.data);
      setComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      toast.success(error.response.data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 pt-3 border-t border-border/30"
    >
      <div className="flex items-start gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={
              currentUser.avatarUrl ||
              getCustomAvatar(currentUser.firstName, currentUser.lastName)
            }
            alt={currentUser.firstName + " " + currentUser.lastName}
          />
        </Avatar>
        <div className="flex-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              parentCommentId ? "Reply to this comment..." : "Add a comment..."
            }
            className="w-full p-2 text-sm bg-secondary/20 border border-border/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
            rows={1}
          />
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!comment.trim() || isSubmitting}
              className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
            >
              {isSubmitting
                ? "Posting..."
                : parentCommentId
                ? "Reply"
                : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
