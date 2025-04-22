import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../utils/toast';
import Spinner from '../components/Spinner';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const username = params.get('username');
      const error = params.get('error');

      if (error) {
        showToast.error('Google authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token && username) {
        // Store token and username in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);

        // Update Redux state
        dispatch({ 
          type: 'auth/googleLoginSuccess', 
          payload: { token, username } 
        });

        showToast.success('Successfully logged in with Google!');
        navigate('/');
      } else {
        showToast.error('Authentication failed. Missing token or username.');
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [location, navigate, dispatch]);

  return (
    <div className="google-auth-callback">
      <Spinner />
      <p>Completing authentication, please wait...</p>
    </div>
  );
};

export default GoogleAuthCallback;
