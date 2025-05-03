
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { posts } = usePosts();
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const isCurrentUser = currentUser && userId === currentUser.id;

  useEffect(() => {
    // Filter posts by the user ID
    const filteredPosts = posts.filter((post) => post.userId === userId);
    setUserPosts(filteredPosts);

    // If viewing the current user's profile, we already have the data
    if (isCurrentUser) {
      setProfileUser(currentUser);
    } else {
      // In a real app, we would fetch the user data from an API
      // For this MVP, we'll try to get it from the post author information
      const firstPost = filteredPosts[0];
      if (firstPost) {
        setProfileUser({
          id: userId,
          name: firstPost.userName,
          // We don't have access to the email in this mock,
          // so we'll leave it undefined
        });
      } else {
        // User not found or has no posts
        setProfileUser({
          id: userId,
          name: 'Unknown User',
        });
      }
    }
  }, [userId, posts, currentUser, isCurrentUser]);

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="bg-primary/10 h-32"></div>
        <div className="p-6 -mt-16 flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl border-4 border-white shadow mb-3">
            {profileUser.name[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
          {profileUser.email && isCurrentUser && (
            <p className="text-gray-500">{profileUser.email}</p>
          )}
          
          {isCurrentUser && (
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {isCurrentUser ? 'Your Posts' : 'Posts'}
      </h2>

      {userPosts.length > 0 ? (
        <div className="space-y-4">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-gray-500">
            {isCurrentUser ? 'You haven\'t created any posts yet.' : 'This user hasn\'t created any posts yet.'}
          </p>
          {isCurrentUser && (
            <div className="mt-4">
              <a
                href="/create-post"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create Your First Post
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
