import React, { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import ProjectMeta from "./ProjectMeta";
import PostEngagement from "./PostEngagement";
import CommentsSection from "./CommentsSection";
import CommentForm from "../comments/CommentForm";
import { currentUser } from "../../data/dummyData";
import { Post } from "@/types/responses/data/post/Post";
import { Comment } from "@/types/responses/data/comment/Comment";
import { CommentService } from "@/services/commentService";
import { set } from "date-fns";
import { findCommentAndPerformAction } from "@/lib/utils";

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

  const handleCommentToggle = async () => {
    if (postComments.length == 0) {
      const { data } = await CommentService.findByPostId(post.id);
      setPostComments(data.content);
    }
    setIsCommenting(!isCommenting);
  };

  const handleCommentSubmit = (comment: Comment) => {
    setPostComments([comment, ...postComments]);

    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  const handleReplySubmit = (reply: Comment) => {
    console.log(reply);

    const parentId = reply.parent;
    const replies = [reply];
    const updatedComments = findCommentAndPerformAction(
      postComments,
      parentId,
      replies
    );
    if (updatedComments != null) {
      setPostComments(updatedComments);
    }

    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  const handleLoadedReplies = (replies: Comment[]) => {
    const parentId = replies[0].parent;

    const updatedComments = findCommentAndPerformAction(
      postComments,
      parentId,
      replies
    );
    if (updatedComments != null) {
      setPostComments(updatedComments);
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
        amplifiedBy={[]}
        amplifiedCount={0}
        commentsCount={post.commentsCount}
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
        onLoadedReplies={handleLoadedReplies}
      />
    </div>
  );
};

export default FeedItem;
