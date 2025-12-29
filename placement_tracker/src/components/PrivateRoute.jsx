import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // The main loading state is now handled in App.js.
  // This component will be rendered only after the initial user check is complete.

  // If user is null, it means they are not logged in, so we navigate to our local login page.
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
