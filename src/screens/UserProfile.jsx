import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import authAxios from "../functions/authFunctions";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  followUser,
  unfollowUser,
} from "../functions/socialFunctions";
import { UseAuth } from "../context/UseAuth";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = UseAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("trades");
  const [userTrades, setUserTrades] = useState([]);
  const [socialStatus, setSocialStatus] = useState({
    isFriend: false,
    isFollowing: false,
    friendRequestSent: false,
    friendRequestReceived: false,
  });

  // Fetch user profile data
  useEffect(() => {
  // In your UserProfile component
const fetchUserProfile = async () => {
  try {
    setLoading(true);
    
    // Make sure these endpoints match your backend routes
    const response = await authAxios.get(`/user/profile/${userId}`);
    setUser(response.data.data);

    const statusResponse = await authAxios.get(`/user/${userId}/social-status`);
    setSocialStatus(statusResponse.data.data);

    const tradesResponse = await authAxios.get(`/user/${userId}/trades`);
    setUserTrades(tradesResponse.data.data);

    setError(null);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    setError(err.response?.data?.error || "Failed to load user profile");
    toast.error("Failed to load user profile");
  } finally {
    setLoading(false);
  }
};


    if (userId && currentUser) {
      fetchUserProfile();
    }
  }, [userId, currentUser]);

  // Handle social actions
  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(userId);
      toast.success("Friend request sent!");
      setSocialStatus({ ...socialStatus, friendRequestSent: true });
    } catch (err) {
      toast.error(err.message || "Failed to send friend request");
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      await acceptFriendRequest(userId);
      toast.success("Friend request accepted!");
      setSocialStatus({
        ...socialStatus,
        friendRequestReceived: false,
        isFriend: true,
      });
    } catch (err) {
      toast.error(err.message || "Failed to accept friend request");
    }
  };

  const handleRejectFriendRequest = async () => {
    try {
      await rejectFriendRequest(userId);
      toast.success("Friend request rejected");
      setSocialStatus({ ...socialStatus, friendRequestReceived: false });
    } catch (err) {
      toast.error(err.message || "Failed to reject friend request");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await removeFriend(userId);
      toast.success("Friend removed");
      setSocialStatus({ ...socialStatus, isFriend: false });
    } catch (err) {
      toast.error(err.message || "Failed to remove friend");
    }
  };

  const handleFollowUser = async () => {
    try {
      await followUser(userId);
      toast.success(`You are now following ${user.name}`);
      setSocialStatus({ ...socialStatus, isFollowing: true });
    } catch (err) {
      toast.error(err.message || "Failed to follow user");
    }
  };

  const handleUnfollowUser = async () => {
    try {
      await unfollowUser(userId);
      toast.success(`You have unfollowed ${user.name}`);
      setSocialStatus({ ...socialStatus, isFollowing: false });
    } catch (err) {
      toast.error(err.message || "Failed to unfollow user");
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-danger-light text-danger-dark p-4 rounded-lg'>
        <h3 className='font-bold'>Error</h3>
        <p>{error}</p>
        <button
          onClick={() => navigate("/dashboard/social")}
          className='mt-4 px-4 py-2 bg-primary text-white rounded-lg'
        >
          Back to Social
        </button>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8 mt-6'>
      {/* User Profile Header */}
      <div className='bg-dark-surface p-6 rounded-lg shadow-lg mb-8'>
        <div className='flex flex-col md:flex-row items-center md:items-start'>
          <div className='w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold mb-4 md:mb-0 md:mr-6'>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className='w-24 h-24 rounded-full'
              />
            ) : (
              user.name.charAt(0)
            )}
          </div>

          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-2xl font-bold'>{user.name}</h1>
            <p className='text-gray-400 mb-4'>
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>

            <div className='flex flex-wrap justify-center md:justify-start gap-2 mb-4'>
              {user.badges &&
                user.badges.map((badge) => (
                  <span
                    key={badge}
                    className='px-3 py-1 bg-dark-elevated rounded-full text-xs'
                  >
                    {badge}
                  </span>
                ))}
            </div>

            <div className='flex flex-wrap justify-center md:justify-start gap-3'>
              {socialStatus.friendRequestReceived && (
                <>
                  <button
                    onClick={handleAcceptFriendRequest}
                    className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm'
                  >
                    Accept Friend Request
                  </button>
                  <button
                    onClick={handleRejectFriendRequest}
                    className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm'
                  >
                    Reject
                  </button>
                </>
              )}

              {!socialStatus.isFriend &&
                !socialStatus.friendRequestSent &&
                !socialStatus.friendRequestReceived && (
                  <button
                    onClick={handleSendFriendRequest}
                    className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm'
                  >
                    Add Friend
                  </button>
                )}

              {socialStatus.friendRequestSent && (
                <button className='px-4 py-2 bg-gray-700 text-gray-400 rounded-lg text-sm cursor-not-allowed'>
                  Friend Request Sent
                </button>
              )}

              {socialStatus.isFriend && (
                <button
                  onClick={handleRemoveFriend}
                  className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm'
                >
                  Remove Friend
                </button>
              )}

              {socialStatus.isFollowing ? (
                <button
                  onClick={handleUnfollowUser}
                  className='px-4 py-2 bg-gray-700 hover:bg-danger text-white rounded-lg text-sm'
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleFollowUser}
                  className='px-4 py-2 bg-success hover:bg-success-dark text-white rounded-lg text-sm'
                >
                  Follow
                </button>
              )}
            </div>
          </div>

          <div className='mt-6 md:mt-0 grid grid-cols-2 gap-4 text-center'>
            <div className='bg-dark-elevated p-3 rounded-lg'>
              <p className='text-2xl font-bold'>
                {user.stats?.followers || 0}
              </p>
              <p className='text-sm text-gray-400'>Followers</p>
            </div>
            <div className='bg-dark-elevated p-3 rounded-lg'>
              <p className='text-2xl font-bold'>
                {user.stats?.following || 0}
              </p>
              <p className='text-sm text-gray-400'>Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex border-b border-gray-700 mb-6'>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "trades"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("trades")}
        >
          Trading History
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "stats"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("stats")}
        >
          Performance
        </button>
      </div>

      {/* Trades Tab */}
      {activeTab === "trades" && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>Trading History</h2>

          {userTrades.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-dark-surface rounded-lg'>
                <thead className='bg-dark-elevated'>
                  <tr>
                    <th className='py-3 px-4 text-left'>Date</th>
                    <th className='py-3 px-4 text-left'>Coin</th>
                    <th className='py-3 px-4 text-left'>Type</th>
                    <th className='py-3 px-4 text-left'>Quantity</th>
                    <th className='py-3 px-4 text-left'>Price</th>
                    <th className='py-3 px-4 text-left'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {userTrades.map((trade) => (
                    <tr
                      key={trade._id}
                      className='border-t border-gray-700'
                    >
                      <td className='py-3 px-4'>
                        {new Date(trade.createdAt).toLocaleDateString()}
                      </td>
                      <td className='py-3 px-4'>
                        {trade.coinSymbol.toUpperCase()}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          trade.type === "buy"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {trade.type.charAt(0).toUpperCase() +
                          trade.type.slice(1)}
                      </td>
                      <td className='py-3 px-4'>
                        {trade.quantity.toFixed(6)}
                      </td>
                      <td className='py-3 px-4'>
                        ${trade.price.toFixed(2)}
                      </td>
                      <td className='py-3 px-4'>
                        ${trade.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='bg-dark-elevated p-8 rounded-lg text-center'>
              <p className='text-gray-400'>
                No public trading history available.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>
            Trading Performance
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-dark-surface p-4 rounded-lg shadow'>
              <h3 className='text-gray-400 mb-1'>Total Trades</h3>
              <p className='text-2xl font-bold'>
                {user.stats?.totalTrades || 0}
              </p>
            </div>
            <div className='bg-dark-surface p-4 rounded-lg shadow'>
              <h3 className='text-gray-400 mb-1'>Win Rate</h3>
              <p className='text-2xl font-bold'>
                {user.stats?.winRate || 0}%
              </p>
            </div>
            <div className='bg-dark-surface p-4 rounded-lg shadow'>
              <h3 className='text-gray-400 mb-1'>Avg. Profit</h3>
              <p className='text-2xl font-bold'>
                ${user.stats?.avgProfit?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          {user.stats?.topCoins?.length > 0 ? (
            <div className='bg-dark-surface p-4 rounded-lg shadow'>
              <h3 className='text-lg font-medium mb-3'>
                Top Traded Coins
              </h3>
              <div className='space-y-3'>
                {user.stats.topCoins.map((coin, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-dark-elevated rounded-lg'
                  >
                    <div className='flex items-center'>
                      <span className='font-medium'>
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className='text-sm'>{coin.trades} trades</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='bg-dark-elevated p-8 rounded-lg text-center'>
              <p className='text-gray-400'>
                No trading statistics available.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
