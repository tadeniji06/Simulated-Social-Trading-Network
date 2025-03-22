import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getUserProfileById,
  getSocialStatus,
  getUserTrades,
  getUserProfile,
} from "../functions/profileFunctions";
import { getCurrentUser } from "../functions/authFunctions";
import TradeHistoryItem from "../components/settings/TradeHistoryItem";
import Spinner from "../components/Spinner";

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [socialStatus, setSocialStatus] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = getCurrentUser();
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch profile data
        let profileData;
        if (isOwnProfile) {
          profileData = await getUserProfile();
          setProfile(profileData.user);
        } else {
          profileData = await getUserProfileById(userId);
          setProfile(profileData.data);

          // Only fetch social status for other users
          const socialData = await getSocialStatus(userId);
          setSocialStatus(socialData.data);
        }

        // Fetch trades
        const tradesData = await getUserTrades(
          isOwnProfile ? currentUser.id : userId
        );
        setTrades(tradesData.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, isOwnProfile, currentUser?.id]);

  if (loading) return <Spinner />;
  if (error) return <div className='text-danger p-4'>{error}</div>;
  if (!profile)
    return <div className='text-center p-4'>Profile not found</div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-dark-surface rounded-lg shadow-lg p-6 mb-8'>
        {/* Profile Header */}
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          {/* Avatar */}
          <div className='w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-700'>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold'>
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
              {profile.name}
            </h1>
            {isOwnProfile && (
              <p className='text-gray-400 mb-4'>{profile.email}</p>
            )}
               {/* settings button */}
               {isOwnProfile && (
              <div className='mt-4'>
                <button className='bg-primary text-white px-4 py-2 rounded-lg'>
                <Link to={"/settings"}>  Settings</Link>
                </button>
              </div>
            )}
            {/* Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
              <div className='bg-dark-elevated p-3 rounded-lg text-center'>
                <p className='text-gray-400 text-sm'>Followers</p>
                <p className='text-xl font-bold text-white'>
                  {profile.stats?.followers || 0}
                </p>
              </div>
              <div className='bg-dark-elevated p-3 rounded-lg text-center'>
                <p className='text-gray-400 text-sm'>Following</p>
                <p className='text-xl font-bold text-white'>
                  {profile.stats?.following || 0}
                </p>
              </div>
              <div className='bg-dark-elevated p-3 rounded-lg text-center'>
                <p className='text-gray-400 text-sm'>Win Rate</p>
                <p className='text-xl font-bold text-white'>
                  {profile.stats?.winRate || 0}%
                </p>
              </div>
              <div className='bg-dark-elevated p-3 rounded-lg text-center'>
                <p className='text-gray-400 text-sm'>Total Trades</p>
                <p className='text-xl font-bold text-white'>
                  {profile.stats?.totalTrades || 0}
                </p>
              </div>
            </div>
         
          </div>

          {/* Action Buttons (for other users' profiles) */}
          {!isOwnProfile && socialStatus && (
            <div className='flex flex-col gap-2'>
              {socialStatus.isFriend ? (
                <button className='bg-primary-dark text-white px-4 py-2 rounded-lg'>
                  Friends
                </button>
              ) : socialStatus.friendRequestSent ? (
                <button className='bg-gray-600 text-white px-4 py-2 rounded-lg'>
                  Request Sent
                </button>
              ) : socialStatus.friendRequestReceived ? (
                <button className='bg-accent text-white px-4 py-2 rounded-lg'>
                  Accept Request
                </button>
              ) : (
                <button className='bg-primary text-white px-4 py-2 rounded-lg'>
                  Add Friend
                </button>
              )}

              {socialStatus.isFollowing ? (
                <button className='bg-gray-700 text-white px-4 py-2 rounded-lg'>
                  Following
                </button>
              ) : (
                <button className='bg-gray-600 text-white px-4 py-2 rounded-lg'>
                  Follow
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trade History */}
      <div className='bg-dark-surface rounded-lg shadow-lg p-6'>
        <h2 className='text-xl font-bold text-white mb-4'>
          Trade History
        </h2>
        {trades.length > 0 ? (
          <div className='space-y-4'>
            {trades.map((trade) => (
              <TradeHistoryItem key={trade._id} trade={trade} />
            ))}
          </div>
        ) : (
          <p className='text-gray-400 text-center py-8'>No trades found</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
