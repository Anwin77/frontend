import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const PostContext = createContext();

export function usePosts() {
  return useContext(PostContext);
}

// Expanded dummy posts data with images, likes and comments
const dummyPosts = [
  {
    id: '1',
    userId: 'dummy1',
    userName: 'Alex Johnson',
    content: 'Just finished my final project for Computer Science! So relieved to be done with this semester. Who else is celebrating the end of finals?',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    likes: ['dummy2', 'dummy5', 'dummy7'],
    comments: [
      {
        id: 'c1',
        userId: 'dummy2',
        userName: 'Sophia Lee',
        content: 'Congrats! What was your project about?',
        timestamp: new Date(Date.now() - 3000000).toISOString() // 50 minutes ago
      },
      {
        id: 'c2',
        userId: 'dummy5',
        userName: 'Jamal Washington',
        content: 'Great job! The relief after submitting that final project is unmatched.',
        timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      }
    ]
  },
  {
    id: '2',
    userId: 'dummy2',
    userName: 'Sophia Lee',
    content: 'The campus cherry blossoms are in full bloom today! Perfect spot for studying or just taking a break between classes.',
    imageUrl: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    likes: ['dummy1', 'dummy3', 'dummy4', 'dummy8'],
    comments: [
      {
        id: 'c3',
        userId: 'dummy8',
        userName: 'Zoe Chen',
        content: 'These are beautiful! Where on campus is this?',
        timestamp: new Date(Date.now() - 6000000).toISOString() // 1 hour 40 minutes ago
      }
    ]
  },
  {
    id: '3',
    userId: 'dummy3',
    userName: 'Miguel Rodriguez',
    content: 'Looking for study partners for the upcoming physics exam. Anyone interested in forming a study group? We could meet at the library this weekend.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likes: ['dummy2', 'dummy6'],
    comments: [
      {
        id: 'c4',
        userId: 'dummy6',
        userName: 'Taylor Swift',
        content: 'I\'m in! Physics isn\'t my strong suit, so a study group would be great.',
        timestamp: new Date(Date.now() - 80000000).toISOString() // 22 hours ago
      },
      {
        id: 'c5',
        userId: 'dummy2',
        userName: 'Sophia Lee',
        content: 'I can join too. I\'ve been reviewing the material all week.',
        timestamp: new Date(Date.now() - 70000000).toISOString() // 19 hours ago
      }
    ]
  },
  {
    id: '4',
    userId: 'dummy4',
    userName: 'Emma Wilson',
    content: 'Just got tickets to the campus music festival next month! So excited to see all the performances. Who else is going?',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    likes: ['dummy1', 'dummy7', 'dummy5', 'dummy8'],
    comments: [
      {
        id: 'c6',
        userId: 'dummy1',
        userName: 'Alex Johnson',
        content: 'I\'ll be there! Let\'s meet up.',
        timestamp: new Date(Date.now() - 160000000).toISOString() // 44 hours ago
      }
    ]
  },
  {
    id: '5',
    userId: 'dummy5',
    userName: 'Jamal Washington',
    content: 'The new study spaces in the student center are amazing! I finally found a quiet spot with good lighting and plenty of outlets. Definitely recommend checking it out if you haven\'t already.',
    imageUrl: 'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    likes: ['dummy3', 'dummy6'],
    comments: []
  },
  {
    id: '6',
    userId: 'dummy6',
    userName: 'Taylor Swift',
    content: 'Just aced my presentation in Business Communications! All that practice paid off. If anyone needs tips on public speaking, I\'m happy to help!',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    likes: ['dummy2', 'dummy4', 'dummy7'],
    comments: [
      {
        id: 'c7',
        userId: 'dummy7',
        userName: 'Raj Patel',
        content: 'That\'s awesome! I have a presentation next week, any tips?',
        timestamp: new Date(Date.now() - 340000000).toISOString() // 3 days 22 hours ago
      },
      {
        id: 'c8',
        userId: 'dummy6',
        userName: 'Taylor Swift',
        content: 'Practice in front of a mirror, record yourself, and focus on speaking clearly and slowly!',
        timestamp: new Date(Date.now() - 330000000).toISOString() // 3 days 20 hours ago
      }
    ]
  },
  {
    id: '7',
    userId: 'dummy7',
    userName: 'Raj Patel',
    content: 'Our robotics team just qualified for nationals! Months of late nights in the engineering lab finally paid off. So proud of everyone!',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    likes: ['dummy1', 'dummy3', 'dummy4', 'dummy5', 'dummy8'],
    comments: [
      {
        id: 'c9',
        userId: 'dummy1',
        userName: 'Alex Johnson',
        content: 'That\'s incredible! Congratulations to the whole team!',
        timestamp: new Date(Date.now() - 425000000).toISOString() // 4 days 22 hours ago
      }
    ]
  },
  {
    id: '8',
    userId: 'dummy8',
    userName: 'Zoe Chen',
    content: 'The sunset from the campus observatory tonight was absolutely breathtaking. Sometimes you need to take a moment to appreciate the beauty around you, especially during exam season.',
    imageUrl: 'https://images.unsplash.com/photo-1502790671504-542ad42d5189?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    videoUrl: null,
    timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    likes: ['dummy2', 'dummy3'],
    comments: [
      {
        id: 'c10',
        userId: 'dummy3',
        userName: 'Miguel Rodriguez',
        content: 'Wow! This is stunning. I need to check out the observatory sometime.',
        timestamp: new Date(Date.now() - 515000000).toISOString() // 5 days 23 hours ago
      }
    ]
  }
];

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load posts from localStorage on mount
  useEffect(() => {
    const storedPosts = localStorage.getItem('xyloPosts');
    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error parsing posts from localStorage:', error);
        // If there's an error parsing, use dummy posts
        localStorage.setItem('xyloPosts', JSON.stringify(dummyPosts));
        setPosts(dummyPosts);
      }
    } else {
      // If no posts exist, add dummy posts
      localStorage.setItem('xyloPosts', JSON.stringify(dummyPosts));
      setPosts(dummyPosts);
    }
    setLoading(false);
  }, []);

  // Create a new post
  const createPost = (userId, userName, content, videoUrl = null, imageUrl = null) => {
    if (!userId || !userName) {
      toast.error("User information is missing");
      return Promise.reject(new Error("User information is missing"));
    }
    
    const newPost = {
      id: Date.now().toString(),
      userId,
      userName,
      content,
      videoUrl,
      imageUrl,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: []
    };

    setPosts(prevPosts => {
      const updatedPosts = [newPost, ...prevPosts];
      localStorage.setItem('xyloPosts', JSON.stringify(updatedPosts));
      return updatedPosts;
    });

    return Promise.resolve(newPost);
  };

  // Like/unlike a post
  const toggleLikePost = (postId) => {
    if (!currentUser) {
      toast.error("Please log in to like posts");
      return;
    }

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          // Make sure likes array exists
          const likesArray = post.likes || [];
          const userLikedIndex = likesArray.indexOf(currentUser.id);
          let updatedLikes;
          
          if (userLikedIndex === -1) {
            // User hasn't liked the post, so add their ID
            updatedLikes = [...likesArray, currentUser.id];
            // Could add toast here if wanted
            // toast.success("Post liked!");
          } else {
            // User already liked the post, so remove their ID
            updatedLikes = likesArray.filter(id => id !== currentUser.id);
            // Could add toast here if wanted
            // toast.success("Like removed");
          }
          
          return { ...post, likes: updatedLikes };
        }
        return post;
      });
      
      localStorage.setItem('xyloPosts', JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  // Add a comment to a post
  const addComment = (postId, content) => {
    if (!currentUser) {
      toast.error("Please log in to comment");
      return null;
    }

    if (!content || !content.trim()) {
      toast.error("Comment cannot be empty");
      return null;
    }

    const newComment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          // Make sure comments array exists
          const commentsArray = post.comments || [];
          return { 
            ...post, 
            comments: [...commentsArray, newComment] 
          };
        }
        return post;
      });
      
      localStorage.setItem('xyloPosts', JSON.stringify(updatedPosts));
      return updatedPosts;
    });

    return newComment;
  };

  // Get posts by user ID
  const getUserPosts = (userId) => {
    return posts.filter(post => post.userId === userId);
  };

  // Get paginated posts
  const getPaginatedPosts = (page = 1, limit = 10) => {
    const start = (page - 1) * limit;
    const end = page * limit;
    return posts.slice(start, end);
  };

  // Check if the current user has liked a post
  const isPostLiked = (postId) => {
    if (!currentUser) return false;
    
    const post = posts.find(p => p.id === postId);
    if (!post || !post.likes) return false;
    
    return post.likes.includes(currentUser.id);
  };

  const value = {
    posts,
    loading,
    createPost,
    getUserPosts,
    getPaginatedPosts,
    toggleLikePost,
    addComment,
    isPostLiked
  };

  return (
    <PostContext.Provider value={value}>
      {!loading && children}
    </PostContext.Provider>
  );
}
