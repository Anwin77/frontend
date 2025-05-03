
import { useState, useEffect } from 'react';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';

const Feed = () => {
  const postsContext = usePosts();
  
  // Handle case when usePosts() returns undefined
  if (!postsContext) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts context...</p>
        </div>
      </div>
    );
  }
  
  const { posts, loading } = postsContext;
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 10;
  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    if (!loading) {
      const start = 0;
      const end = currentPage * postsPerPage;
      const paginatedPosts = posts.slice(start, end);
      
      setDisplayedPosts(paginatedPosts);
      setHasMore(paginatedPosts.length < posts.length);
    }
  }, [loading, posts, currentPage]);

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Latest Posts</h1>
      
      {displayedPosts.length > 0 ? (
        <div className="space-y-4">
          {displayedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {hasMore && (
            <div className="text-center py-4">
              <button
                onClick={loadMore}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-gray-500">Be the first to create a post!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
