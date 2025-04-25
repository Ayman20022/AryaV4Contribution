import React, { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import ProjectMeta from "./ProjectMeta";
import PostEngagement from "./PostEngagement";
import CommentsSection from "./CommentsSection";
import { findUserById, Comment } from "../../data/dummyData";
import CommentForm from "../comments/CommentForm";
import { currentUser } from "../../data/dummyData";
import { Post } from "@/types/responses/data/post/Post";
import { PostService } from "@/services/PostService";

interface FeedItemProps {
  post: Post;
  onPostUpdated?: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ post, onPostUpdated }) => {
  const [expanded, setExpanded] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const user = post.postedBy;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCommentToggle = () => {
    setIsCommenting(!isCommenting);
  };

  const handleCommentSubmit = (commentText: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      text: commentText,
      createdAt: new Date(),
      agrees: 0,
      user: currentUser,
    };

    setPostComments([newComment, ...postComments]);
    //post.comments = [newComment, ...postComments];
    setIsCommenting(false);

    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  const handleReplySubmit = (text: string, parentId: string) => {
    const newReply: Comment = {
      id: `c${Date.now()}-${parentId}`,
      userId: currentUser.id,
      text: text,
      createdAt: new Date(),
      agrees: 0,
      user: currentUser,
      parentId: parentId,
    };

    const updatedComments = [...postComments];

    const addReplyToComment = (
      comments: Comment[],
      parentId: string,
      newReply: Comment
    ) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === parentId) {
          if (!comments[i].replies) {
            comments[i].replies = [];
          }
          comments[i].replies = [newReply, ...comments[i].replies];
          return true;
        }

        if (comments[i].replies && comments[i].replies.length > 0) {
          const found = addReplyToComment(
            comments[i].replies,
            parentId,
            newReply
          );
          if (found) return true;
        }
      }
      return false;
    };

    addReplyToComment(updatedComments, parentId, newReply);
    setPostComments(updatedComments);
    //post.comments = updatedComments;

    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  const handleCollaborateToggle = (collaborating: boolean) => {
    if (collaborating) {
      if (!collaborators.includes(currentUser.id)) {
        const newCollaborators = [...collaborators, currentUser.id];
        setCollaborators(newCollaborators);
        //post.collaborators = newCollaborators;
      }
    } else {
      const newCollaborators = collaborators.filter(
        (id) => id !== currentUser.id
      );
      setCollaborators(newCollaborators);
      //post.collaborators = newCollaborators;
    }

    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  return (
    <div className="post-card glass-panel animate-slide-in">
      <PostHeader user={user} createdAt={new Date(post.createdAt)} />

      <PostContent text={post.content} media={post.media} link={post.link} />

      <ProjectMeta
        isProject={post.type == "PROJECT"}
        collaborators={collaborators || []}
      />

      <PostEngagement
        postId={post.id}
        agrees={post.agreeCount || 0}
        disagrees={post.disagreeCount || 0}
        comments={postComments.length}
        amplifiedBy={[]}
        amplifiedCount={0}
        commentsCount={postComments.length}
        isProject={post.type == "PROJECT"}
        onCommentClick={handleCommentToggle}
        collaborators={collaborators || []}
        onCollaborateToggle={handleCollaborateToggle}
        hasAmplified={false}
        hasAgreed={post.isAgreed}
        hasDisagreed={post.isDisagreed}
      />

      {isCommenting && (
        <CommentForm postId={post.id} onCommentSubmit={handleCommentSubmit} />
      )}

      <CommentsSection
        expanded={expanded}
        toggleExpand={toggleExpand}
        comments={postComments}
        postId={post.id}
        onReplySubmit={handleReplySubmit}
      />
    </div>
  );
};

export default FeedItem;
