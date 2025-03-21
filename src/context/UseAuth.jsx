import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUser, isAuthenticated, getCurrentUser } from '../functions/authFunctions';
import { getCookie, setCookie } from '../utils/cookies';

const AuthContext = createContext();

export const UseAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthProvider - initAuth starting');
      console.log('Token cookie exists:', !!getCookie('token'));
      console.log('User cookie exists:', !!getCookie('user'));
      
      try {
        if (isAuthenticated()) {
          console.log('User is authenticated');
          
          // First try to get user from cookies for immediate UI update
          const localUser = getCurrentUser();
          if (localUser) {
            console.log('Setting user from cookie data');
            setUser(localUser);
          }
          
          // Then fetch fresh user data from API
          console.log('Fetching fresh user data from API');
          try {
            const userData = await getUser();
            console.log('API returned user data:', !!userData.user);
            
            if (userData && userData.user) {
              setUser(userData.user);
              // Update cookie with fresh data
              setCookie('user', JSON.stringify(userData.user));
            }
          } catch (apiError) {
            console.error('API error in initAuth:', apiError);
            // If API call fails but we have cookie data, keep using it
            if (!user && localUser) {
              console.log('Keeping user from cookie after API error');
            } else {
              // If no cookie data either, clear auth state
              setUser(null);
              setError(apiError.message);
            }
          }
        } else {
          console.log('User is not authenticated');
          setUser(null);
        }
      } catch (e) {
        console.error('Error in auth initialization:', e);
        setError(e.message);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    
    initAuth();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    authChecked,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
