
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This is just a redirect component
const Index = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  // Handle case when useAuth() returns undefined
  if (!auth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }
  
  const { currentUser, loading } = auth;

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
