import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../functions/profileFunctions';
import { getCurrentUser } from '../../functions/authFunctions';
import Spinner from '../Spinner';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    experience: '',
    interests: [],
    notifications: {
      email: true,
      push: true,
      trades: true
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { user } = await getUserProfile();
        
        setFormData({
          name: user.name || '',
          email: user.email || '',
          avatar: user.avatar || '',
          experience: user.experience || '',
          interests: user.interests || [],
          notifications: user.notifications || {
            email: true,
            push: true,
            trades: true
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      
      if (interests.includes(interest)) {
        return {
          ...prev,
          interests: interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await updateUserProfile(formData);
      
      setSuccess('Profile updated successfully!');
      setSaving(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const experienceOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const interestOptions = ['Bitcoin', 'Ethereum', 'Altcoins', 'DeFi', 'NFTs', 'Trading', 'Investing', 'Technology'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-dark-surface rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>
        
        {error && (
          <div className="bg-danger bg-opacity-20 border border-danger text-danger px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-success bg-opacity-20 border border-success text-success px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Profile Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-dark-elevated border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-dark-elevated border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2" htmlFor="avatar">
                  Avatar URL
                </label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full bg-dark-elevated border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2" htmlFor="experience">
                  Trading Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-dark-elevated border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Experience</option>
                  {experienceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Interests Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Interests</h2>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestChange(interest)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    formData.interests.includes(interest)
                      ? 'bg-primary text-white'
                      : 'bg-dark-elevated text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
          
          {/* Notifications Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notifications"
                  name="email"
                  checked={formData.notifications.email}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 rounded border-gray-700 bg-dark-elevated text-primary focus:ring-primary"
                />
                <label htmlFor="email-notifications" className="ml-3 text-white">
                  Email Notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="push-notifications"
                  name="push"
                  checked={formData.notifications.push}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 rounded border-gray-700 bg-dark-elevated text-primary focus:ring-primary"
                />
                <label htmlFor="push-notifications" className="ml-3 text-white">
                  Push Notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="trade-notifications"
                  name="trades"
                  checked={formData.notifications.trades}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 rounded border-gray-700 bg-dark-elevated text-primary focus:ring-primary"
                />
                <label htmlFor="trade-notifications" className="ml-3 text-white">
                  Trade Alerts
                </label>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-dark-surface rounded-lg shadow-lg p-6 mt-8 border border-danger border-opacity-30">
        <h2 className="text-xl font-semibold text-white mb-4">Danger Zone</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-medium text-white">Delete Account</h3>
            <p className="text-gray-400">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          
          <button
            type="button"
            className="bg-danger hover:bg-danger-dark text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

