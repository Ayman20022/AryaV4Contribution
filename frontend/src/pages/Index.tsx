import React, { useEffect, useState } from "react";
import CreatePostForm from "../components/feed/CreatePostForm";
import FeedItem from "../components/feed/FeedItem";
import ProjectItem from "../components/projects/ProjectItem";
import { Button } from "../components/ui/button";
import { PostService } from "../services/PostService";
import { Post } from "@/types/responses/data/post/Post";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [feedType, setFeedType] = useState<
    "all" | "posts" | "projects" | "aggregators"
  >("all");

  const filter = (post: Post) => {
    if (feedType === "all") return true;
    if (feedType === "posts") return post.type == "POST";
    if (feedType === "projects") return post.type == "PROJECT";
    if (feedType === "aggregators") return null;
    return true;
  };

  const {
    data: page,
    isLoading: isFeedLoading,
    isError,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const response = await PostService.findAll();
      return response.data;
    },
  });

  const getFiltiredList = () => {
    return page?.content.filter(filter);
  };

  const handleFeedTypeChange = (
    type: "all" | "posts" | "projects" | "aggregators"
  ) => {
    setFeedType(type);
  };

  const handlePostCreated = () => {};

  const handleLoadMore = () => {};

  const showCreateForm =
    feedType === "all" || feedType === "posts" || feedType === "projects";

  if (isFeedLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (page == null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Server is down</p>
      </div>
    );
  }
  return (
    <div>
      <div className="feed-container">
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-border bg-background/50 p-1">
            <button
              onClick={() => handleFeedTypeChange("all")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFeedTypeChange("posts")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === "posts"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => handleFeedTypeChange("projects")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === "projects"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => handleFeedTypeChange("aggregators")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === "aggregators"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              News
            </button>
          </div>
        </div>

        {showCreateForm && (
          <CreatePostForm
            isProject={feedType === "projects"}
            onPostCreated={handlePostCreated}
          />
        )}

        <div className="mt-6 space-y-4">
          {getFiltiredList().map((post) =>
            post.type == "PROJECT" ? (
              <ProjectItem key={post.id} project={post} />
            ) : (
              <FeedItem
                key={post.id}
                post={post}
                onPostUpdated={handlePostCreated}
              />
            )
          )}

          {!isFeedLoading && getFiltiredList().length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No {feedType} to display</p>
            </div>
          )}

          {page.last && (
            <div className="flex justify-center my-6">
              <Button
                onClick={handleLoadMore}
                variant="secondary"
                className="w-full max-w-xs"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
