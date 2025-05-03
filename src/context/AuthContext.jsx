
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // On mount, check if user is in localStorage
  useEffect(() => {
    const user = localStorage.getItem('xyloUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Get all users from localStorage
    const allUsers = localStorage.getItem('xyloUsers');
    if (allUsers) {
      setUsers(JSON.parse(allUsers));
    } else {
      // Initialize users array if it doesn't exist
      localStorage.setItem('xyloUsers', JSON.stringify([]));
      setUsers([]);
    }
    
    setLoading(false);
  }, []);

  // Register a new user
  const register = (email, password, name) => {
    // Check if user with this email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return Promise.reject(new Error("User with this email already exists"));
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this would be hashed
      name,
      avatar: null,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array in localStorage
    const updatedUsers = [...users, newUser];
    localStorage.setItem('xyloUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    // Set as current user
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    localStorage.setItem('xyloUser', JSON.stringify(userWithoutPassword));
    setCurrentUser(userWithoutPassword);
    
    return Promise.resolve(userWithoutPassword);
  };

  // Log in an existing user
  const login = (email, password) => {
    // Find user with matching email and password
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      localStorage.setItem('xyloUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
      return Promise.resolve(userWithoutPassword);
    }
    
    return Promise.reject(new Error("Invalid credentials"));
  };

  // Log out the current user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('xyloUser');
    return Promise.resolve();
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
