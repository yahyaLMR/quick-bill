import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Checks if user is authenticated (has a token in localStorage)
 * If authenticated, renders the child components
 * If not authenticated, redirects to login page
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
