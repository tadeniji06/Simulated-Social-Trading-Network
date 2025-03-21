import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCookie } from '../../utils/cookies';
import { UseAuth } from '../../context/UseAuth';
import axios from 'axios';
import { API_URL } from '../../utils/api';

const GoogleAuthCallback = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = UseAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token and user data from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userParam = params.get('user');
        const isNewUser = params.get('isNewUser') === 'true';
        
        if (!token) {
          throw new Error('No authentication token received');
        }

        // Store token in cookie
        setCookie('token', token);
        
        let userData;
        
        // First try to parse user data from URL parameter
        if (userParam) {
          try {
            userData = JSON.parse(decodeURIComponent(userParam));
          } catch (e) {
            console.log('Error parsing user data from URL, will fetch from API');
          }
        }
        
        // If user data wasn't in URL or couldn't be parsed, fetch from API
        if (!userData) {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (!response.data || !response.data.data) {
            throw new Error('Failed to fetch user data');
          }
          
          userData = response.data.data;
        }
        
        // Store user data in cookie and context
        setCookie('user', JSON.stringify(userData));
        setUser(userData);
        
        // Redirect based on user status
        if (isNewUser || !userData.onboardingComplete) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed');
        // Redirect to login after a short delay
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [location, navigate, setUser]);

  if (loading) {
    return (
      <div className='min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4'>
        <div className='inline-flex items-center justify-center mb-4'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary'></div>
        </div>
        <h2 className='text-2xl font-semibold mb-4'>Authenticating</h2>
        <p className='text-gray-300'>Please wait while we complete your sign-in...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4'>
        <div className='bg-danger/10 border border-danger text-danger px-6 py-4 rounded-lg mb-6 max-w-md'>
          <h2 className='text-xl font-semibold mb-2'>Authentication Error</h2>
          <p>{error}</p>
          <p className='mt-4'>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthCallback;
