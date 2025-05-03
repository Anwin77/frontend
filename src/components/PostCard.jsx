
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner';

const PostCard = ({ post }) => {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { toggleLikePost, addComment, isPostLiked } = usePosts();
  const { currentUser } = useAuth();
  
  // Format the timestamp for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLikeClick = () => {
    if (!currentUser) {
      toast.error("Please log in to like posts");
      return;
    }
    toggleLikePost(post.id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please log in to comment");
      return;
    }
    
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
      toast.success("Comment added successfully!");
    }
  };

  // We need to check if the current user has liked the post
  const liked = currentUser ? isPostLiked(post.id) : false;

  return (
    <Card className="animate-fade-in my-4 border border-gray-100">
      <div className="p-4">
        <div className="flex items-center mb-3">
          {post.avatar ? (
            <img 
              src={post.avatar} 
              alt={`${post.userName}'s avatar`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              {post.userName[0].toUpperCase()}
            </div>
          )}
          <div className="ml-3">
            <Link to={`/profile/${post.userId}`} className="text-lg font-semibold text-gray-900 hover:text-primary">
              {post.userName}
            </Link>
            <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
        </div>

        {post.imageUrl && !imageError && (
          <div className="mt-4">
            <img 
              src={post.imageUrl}
              alt="Post image"
              className="w-full rounded-md object-cover max-h-96"
              onError={(e) => {
                e.target.style.display = 'none';
                setImageError(true);
              }}
            />
          </div>
        )}

        {imageError && post.imageUrl && (
          <div className="mt-4 bg-yellow-50 p-3 rounded-md">
            <p className="text-yellow-700">Unable to load image.</p>
          </div>
        )}

        {post.videoUrl && !videoError && (
          <div className="mt-4">
            <video 
              className="w-full rounded-md" 
              controls
              onError={() => setVideoError(true)}
            >
              <source src={post.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {videoError && post.videoUrl && (
          <div className="mt-4 bg-red-50 p-3 rounded-md">
            <p className="text-red-700">Error loading video. The format may not be supported.</p>
          </div>
        )}
      </div>

      <CardFooter className="flex flex-col px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleLikeClick}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{post.likes ? post.likes.length : 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-500"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments ? post.comments.length : 0}</span>
            </Button>
          </div>
        </div>
        
        <Collapsible
          open={showComments}
          onOpenChange={setShowComments}
          className="w-full"
        >
          <CollapsibleContent className="w-full space-y-4">
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-3 mt-2">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2 p-3 bg-gray-50 rounded-md">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {comment.userName[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link to={`/profile/${comment.userId}`} className="font-medium text-sm text-gray-900 hover:text-primary">
                          {comment.userName}
                        </Link>
                        <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm p-2">No comments yet</div>
            )}
            
            <form onSubmit={handleCommentSubmit} className="mt-3 space-y-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={currentUser ? "Write a comment..." : "Log in to comment"}
                className="w-full resize-none focus:ring-primary"
                rows={2}
                disabled={!currentUser}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!currentUser || !commentText.trim()}
                >
                  Post
                </Button>
              </div>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
