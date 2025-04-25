import { Post } from "@/types/responses/data/post/Post";
import ProjectItem from "../projects/ProjectItem";
import FeedItem from "../feed/FeedItem";
import { Button } from "../ui/button";

const ProfileContentFeed = ({ tab, posts, hasMore, user }) => {
  const renderMarketplaceItems = () => {
    return; /*(
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userPrompts.map((prompt) => (
          <div key={prompt.id} className="relative">
            <PromptCard prompt={prompt} />
            {isCurrentUser && (
              <div className="absolute top-3 right-3 flex space-x-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEditPrompt(prompt)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDeletePrompt(prompt)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    )*/
  };

  const renderPostItems = () => {
    return posts.map((post: Post) =>
      post.type == "PROJECT" ? (
        <ProjectItem key={post.id} project={post} />
      ) : (
        <FeedItem key={post.id} post={post} />
      )
    );
  };

  function handleLoadMore(): void {}

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        tab === "Marketplace" ? (
          renderMarketplaceItems()
        ) : (
          renderPostItems()
        )
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {tab === "Marketplace"
              ? `${user.firstName} ${user.lastName} hasn't created any prompts yet`
              : `No ${tab} to display`}
          </p>
        </div>
      )}

      {hasMore && (
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
  );
};

export default ProfileContentFeed;
