
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { toast } from 'sonner';
import { Upload, X, Image } from 'lucide-react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createPost } = usePosts();

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes for video
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes for image
  const MAX_TEXT_LENGTH = 500;

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`Video file size exceeds the 50MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }

    if (file.type !== 'video/mp4') {
      setError('Only MP4 video format is supported.');
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }

    setError('');
    setVideoFile(file);
    setImageFile(null);
    setImagePreview(null);

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError(`Image file size exceeds the 5MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Only JPEG, JPG and PNG image formats are supported.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setError('');
    setImageFile(file);
    setVideoFile(null);
    setVideoPreview(null);

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim() && !videoFile && !imageFile) {
      setError('Please enter text, upload a video, or upload an image.');
      return;
    }

    if (content.length > MAX_TEXT_LENGTH) {
      setError(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, we would upload the files to a server and get URLs
      // For this MVP, we'll use local data URLs
      
      let videoUrl = null;
      if (videoFile) {
        // In a real implementation, we would upload the file to a storage service
        // and use the returned URL. For this mock, we'll keep the preview URL.
        videoUrl = videoPreview;
      }

      let imageUrl = null;
      if (imageFile) {
        // Create a data URL for the image
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      await createPost(
        currentUser.id,
        currentUser.name,
        content.trim(),
        videoUrl,
        imageUrl
      );
      
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            What's on your mind?
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Share your thoughts with the campus community..."
              maxLength={MAX_TEXT_LENGTH}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 flex justify-between">
            <span>Max 500 characters</span>
            <span>{content.length}/{MAX_TEXT_LENGTH}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload an Image (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Image
                  className="mx-auto h-12 w-12 text-gray-400"
                />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload an image</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleImageChange}
                      disabled={!!videoFile}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="video" className="block text-sm font-medium text-gray-700">
              Upload a Video (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload
                  className="mx-auto h-12 w-12 text-gray-400"
                />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="video-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a video</span>
                    <input
                      id="video-upload"
                      name="video-upload"
                      type="file"
                      className="sr-only"
                      accept="video/mp4"
                      onChange={handleVideoChange}
                      disabled={!!imageFile}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">MP4 up to 50MB</p>
              </div>
            </div>
          </div>
        </div>

        {imagePreview && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Image Preview:</h3>
            <div className="mt-1 relative">
              <img 
                className="w-full rounded-md object-cover max-h-96" 
                src={imagePreview}
                alt="Preview"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {videoPreview && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Video Preview:</h3>
            <div className="mt-1 relative">
              <video 
                className="w-full rounded-md" 
                controls
                src={videoPreview}
              />
              <button
                type="button"
                onClick={() => {
                  setVideoFile(null);
                  setVideoPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Posting...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
