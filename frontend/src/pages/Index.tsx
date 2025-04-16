
import React, { useEffect, useState } from 'react';
import CreatePostForm from '../components/feed/CreatePostForm';
import FeedItem from '../components/feed/FeedItem';
import ProjectItem from '../components/projects/ProjectItem';
import { generateFeed } from '../data/dummyData';
import { Button } from '../components/ui/button';

const Index = () => {
  const [feed, setFeed] = useState(generateFeed());
  const [feedType, setFeedType] = useState<'all' | 'posts' | 'projects' | 'aggregators'>('all');
  const [displayCount, setDisplayCount] = useState(5);
  


  const handleFeedTypeChange = (type: 'all' | 'posts' | 'projects' | 'aggregators') => {
    setFeedType(type);
    setDisplayCount(5); // Reset display count when changing feed type
  };
  
  const filteredFeed = feed.filter(post => {
    if (feedType === 'all') return true;
    if (feedType === 'posts') return !post.isProject && !post.isAggregator;
    if (feedType === 'projects') return post.isProject;
    if (feedType === 'aggregators') return post.isAggregator;
    return true;
  });
  
  const displayedFeed = filteredFeed.slice(0, displayCount);
  const hasMore = displayedFeed.length < filteredFeed.length;
  
  const handlePostCreated = () => {
    setFeed(generateFeed());
  };
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  // Show create form only for posts and projects, not for aggregators
  const showCreateForm = feedType === 'all' || feedType === 'posts' || feedType === 'projects';

  return (
    <div>
      <div className="feed-container">
        {/* Feed type switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-border bg-background/50 p-1">
            <button
              onClick={() => handleFeedTypeChange('all')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === 'all' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFeedTypeChange('posts')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === 'posts' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => handleFeedTypeChange('projects')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === 'projects' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => handleFeedTypeChange('aggregators')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                feedType === 'aggregators' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              News
            </button>
          </div>
        </div>
        
        {/* Create post form - only show for non-aggregator feeds */}
        {showCreateForm && (
          <CreatePostForm 
            isProject={feedType === 'projects'} 
            onPostCreated={handlePostCreated} 
          />
        )}
        
        {/* Feed */}
        <div className="mt-6 space-y-4">
          {displayedFeed.map((post) => (
            post.isProject ? (
              <ProjectItem key={post.id} project={post} />
            ) : (
              <FeedItem key={post.id} post={post} onPostUpdated={handlePostCreated} />
            )
          ))}
          
          {filteredFeed.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No {feedType} to display</p>
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
      </div>
    </div>
  );
};

export default Index;
