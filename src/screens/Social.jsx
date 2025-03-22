import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getFriends, 
  getFriendRequests, 
  getFollowers, 
  getFollowing, 
  getActivityFeed,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  followUser,
  unfollowUser,
  searchUsers
} from '../functions/socialFunctions';
import { UseAuth } from '../context/UseAuth';

const Social = () => {
  const { user } = UseAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activityFeed, setActivityFeed] = useState({ trades: [] });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load initial data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        switch (activeTab) {
          case 'feed':
            const feedData = await getActivityFeed();
            setActivityFeed(feedData.data);
            break;
          case 'friends':
            const friendsData = await getFriends();
            setFriends(friendsData.data);
            
            const requestsData = await getFriendRequests();
            setFriendRequests(requestsData.data);
            break;
          case 'followers':
            const followersData = await getFollowers();
            setFollowers(followersData.data);
            
            const followingData = await getFollowing();
            setFollowing(followingData.data);
            break;
        }
      } catch (err) {
        console.error('Error fetching social data:', err);
        setError(err.message || 'Failed to load data');
        toast.error(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchUsers(searchQuery);
          setSearchResults(results.data);
        } catch (err) {
          console.error('Search error:', err);
          toast.error('Search failed. Please try again.');
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Action handlers
  const handleSendFriendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      toast.success('Friend request sent!');
      
      // Update UI
      const updatedResults = searchResults.map(user => 
        user._id === userId ? { ...user, requestSent: true } : user
      );
      setSearchResults(updatedResults);
    } catch (err) {
      toast.error(err.message || 'Failed to send friend request');
    }
  };

  const handleAcceptFriendRequest = async (userId) => {
    try {
      await acceptFriendRequest(userId);
      toast.success('Friend request accepted!');
      
      // Refresh friend requests and friends lists
      const requestsData = await getFriendRequests();
      setFriendRequests(requestsData.data);
      
      const friendsData = await getFriends();
      setFriends(friendsData.data);
    } catch (err) {
      toast.error(err.message || 'Failed to accept friend request');
    }
  };

  const handleRejectFriendRequest = async (userId) => {
    try {
      await rejectFriendRequest(userId);
      toast.success('Friend request rejected');
      
      // Refresh friend requests list
      const requestsData = await getFriendRequests();
      setFriendRequests(requestsData.data);
    } catch (err) {
      toast.error(err.message || 'Failed to reject friend request');
    }
  };

  const handleRemoveFriend = async (userId) => {
    try {
      await removeFriend(userId);
      toast.success('Friend removed');
      
      // Refresh friends list
      const friendsData = await getFriends();
      setFriends(friendsData.data);
    } catch (err) {
      toast.error(err.message || 'Failed to remove friend');
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      await followUser(userId);
      toast.success('User followed!');
      
      // Update UI
      if (activeTab === 'followers') {
        const followingData = await getFollowing();
        setFollowing(followingData.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to follow user');
    }
  };

  const handleUnfollowUser = async (userId) => {
    try {
      await unfollowUser(userId);
      toast.success('User unfollowed');
      
      // Refresh following list
      const followingData = await getFollowing();
      setFollowing(followingData.data);
    } catch (err) {
      toast.error(err.message || 'Failed to unfollow user');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <h1 className="text-2xl font-bold mb-6">Social Network</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for traders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 bg-dark-elevated rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 bg-dark-surface rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Search Results</h3>
            <div className="space-y-4">
              {searchResults.map(result => (
                <div key={result._id} className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                      {result.avatar ? (
                        <img src={result.avatar} alt={result.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        result.name.charAt(0)
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-400">Trader</p>
                    </div>
                  </div>
                  <div>
                    {result.isFriend ? (
                      <button 
                        onClick={() => handleRemoveFriend(result._id)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                      >
                        Friends
                      </button>
                    ) : result.requestSent ? (
                      <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-lg text-sm">
                        Request Sent
                      </span>
                    ) : result.requestReceived ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAcceptFriendRequest(result._id)}
                          className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRejectFriendRequest(result._id)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSendFriendRequest(result._id)}
                        className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "feed"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("feed")}
        >
          Your Feed
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "friends"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400"
             }`}
             onClick={() => setActiveTab("friends")}
           >
             Friends
           </button>
           <button
             className={`py-2 px-4 mr-2 ${
               activeTab === "followers"
                 ? "border-b-2 border-primary text-primary"
                 : "text-gray-400"
             }`}
             onClick={() => setActiveTab("followers")}
           >
             Followers & Following
           </button>
         </div>
         
         {/* Activity Feed Tab */}
         {activeTab === "feed" && (
           <div>
             <h2 className="text-xl font-semibold mb-4">Your Feed</h2>
             
             {activityFeed.trades && activityFeed.trades.length > 0 ? (
               <div className="space-y-4">
                 {activityFeed.trades.map(trade => (
                   <div key={trade._id} className="bg-dark-surface p-4 rounded-lg shadow">
                     <div className="flex items-center mb-3">
                       <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                         {trade.user.avatar ? (
                           <img src={trade.user.avatar} alt={trade.user.name} className="w-10 h-10 rounded-full" />
                         ) : (
                           trade.user.name.charAt(0)
                         )}
                       </div>
                       <div className="ml-3">
                         <p className="font-medium">{trade.user.name}</p>
                         <p className="text-xs text-gray-400">
                           {new Date(trade.createdAt).toLocaleString()}
                         </p>
                       </div>
                     </div>
                     
                     <div className="bg-dark-elevated p-3 rounded-lg">
                       <div className="flex justify-between mb-2">
                         <span className="text-gray-400">Trade Type:</span>
                         <span className={trade.type === 'buy' ? 'text-success' : 'text-danger'}>
                           {trade.type.toUpperCase()}
                         </span>
                       </div>
                       <div className="flex justify-between mb-2">
                         <span className="text-gray-400">Coin:</span>
                         <span>{trade.coinSymbol.toUpperCase()}</span>
                       </div>
                       <div className="flex justify-between mb-2">
                         <span className="text-gray-400">Quantity:</span>
                         <span>{trade.quantity.toFixed(6)}</span>
                       </div>
                       <div className="flex justify-between mb-2">
                         <span className="text-gray-400">Price:</span>
                         <span>${trade.price.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400">Total:</span>
                         <span>${trade.total.toFixed(2)}</span>
                       </div>
                       
                       {trade.type === 'sell' && trade.profitLoss && (
                         <div className="mt-2 pt-2 border-t border-gray-700">
                           <div className="flex justify-between">
                             <span className="text-gray-400">Profit/Loss:</span>
                             <span className={trade.profitLoss >= 0 ? 'text-success' : 'text-danger'}>
                               {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toFixed(2)} USD
                             </span>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="bg-dark-elevated p-8 rounded-lg text-center">
                 <p className="text-gray-400">No activity in your feed yet.</p>
                 <p className="mt-2 text-sm text-gray-500">
                   Follow other traders or add friends to see their trading activity here.
                 </p>
               </div>
             )}
           </div>
         )}
         
         {/* Friends Tab */}
         {activeTab === "friends" && (
           <div>
             {/* Friend Requests Section */}
             {friendRequests.received.length > 0 && (
               <div className="mb-8">
                 <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {friendRequests.received.map(request => (
                     <div key={request._id} className="bg-dark-surface p-4 rounded-lg shadow">
                       <div className="flex items-center mb-3">
                         <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                           {request.avatar ? (
                             <img src={request.avatar} alt={request.name} className="w-12 h-12 rounded-full" />
                           ) : (
                             request.name.charAt(0)
                           )}
                         </div>
                         <div className="ml-3">
                           <p className="font-medium">{request.name}</p>
                         </div>
                       </div>
                       <div className="flex space-x-2 mt-3">
                         <button 
                           onClick={() => handleAcceptFriendRequest(request._id)}
                           className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm"
                         >
                           Accept
                         </button>
                         <button 
                           onClick={() => handleRejectFriendRequest(request._id)}
                           className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                         >
                           Reject
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             
             {/* Sent Requests Section */}
             {friendRequests.sent.length > 0 && (
               <div className="mb-8">
                 <h2 className="text-xl font-semibold mb-4">Sent Requests</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {friendRequests.sent.map(request => (
                     <div key={request._id} className="bg-dark-surface p-4 rounded-lg shadow">
                       <div className="flex items-center">
                         <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                           {request.avatar ? (
                             <img src={request.avatar} alt={request.name} className="w-12 h-12 rounded-full" />
                           ) : (
                             request.name.charAt(0)
                           )}
                         </div>
                         <div className="ml-3">
                           <p className="font-medium">{request.name}</p>
                           <p className="text-sm text-gray-400">Request pending</p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             
             {/* Friends List */}
             <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
             {friends.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {friends.map(friend => (
                   <div key={friend._id} className="bg-dark-surface p-4 rounded-lg shadow">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center">
                         <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                           {friend.avatar ? (
                             <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full" />
                           ) : (
                             friend.name.charAt(0)
                           )}
                         </div>
                         <div className="ml-3">
                           <p className="font-medium">{friend.name}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => handleRemoveFriend(friend._id)}
                         className="p-2 text-gray-400 hover:text-danger rounded-full hover:bg-dark-elevated"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                     <div className="mt-3 pt-3 border-t border-gray-700">
                       <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm">
                         View Profile
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="bg-dark-elevated p-8 rounded-lg text-center">
                 <p className="text-gray-400">You don't have any friends yet.</p>
                 <p className="mt-2 text-sm text-gray-500">
                   Use the search bar above to find and add friends.
                 </p>
               </div>
             )}
           </div>
         )}
         
         {/* Followers & Following Tab */}
         {activeTab === "followers" && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Followers Section */}
             <div>
               <h2 className="text-xl font-semibold mb-4">Your Followers</h2>
               {followers.length > 0 ? (
                 <div className="space-y-3">
                   {followers.map(follower => (
                     <div key={follower._id} className="bg-dark-surface p-3 rounded-lg shadow flex items-center justify-between">
                       <div className="flex items-center">
                         <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                           {follower.avatar ? (
                             <img src={follower.avatar} alt={follower.name} className="w-10 h-10 rounded-full" />
                           ) : (
                             follower.name.charAt(0)
                           )}
                         </div>
                         <div className="ml-3">
                           <p className="font-medium">{follower.name}</p>
                         </div>
                       </div>
                       <div>
                         {/* Check if you're following them back */}
                         {following.some(user => user._id === follower._id) ? (
                           <button 
                             onClick={() => handleUnfollowUser(follower._id)}
                             className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                           >
                             Following
                           </button>
                         ) : (
                           <button 
                             onClick={() => handleFollowUser(follower._id)}
                             className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm"
                           >
                             Follow Back
                           </button>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="bg-dark-elevated p-6 rounded-lg text-center">
                   <p className="text-gray-400">You don't have any followers yet.</p>
                 </div>
               )}
             </div>
             
             {/* Following Section */}
             <div>
               <h2 className="text-xl font-semibold mb-4">People You Follow</h2>
               {following.length > 0 ? (
                 <div className="space-y-3">
                   {following.map(user => (
                     <div key={user._id} className="bg-dark-surface p-3 rounded-lg shadow flex items-center justify-between">
                       <div className="flex items-center">
                         <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                           {user.avatar ? (
                             <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                           ) : (
                             user.name.charAt(0)
                           )}
                         </div>
                         <div className="ml-3">
                           <p className="font-medium">{user.name}</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => handleUnfollowUser(user._id)}
                         className="px-3 py-1 bg-gray-700 hover:bg-danger text-white rounded-lg text-sm"
                       >
                         Unfollow
                       </button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="bg-dark-elevated p-6 rounded-lg text-center">
                   <p className="text-gray-400">You're not following anyone yet.</p>
                   <p className="mt-2 text-sm text-gray-500">
                     Follow other traders to see their activity in your feed.
                   </p>
                 </div>
               )}
             </div>
           </div>
         )}
         
         {/* Error State */}
         {error && (
           <div className="bg-danger-light text-danger-dark p-4 rounded-lg mt-4">
             <h3 className="font-bold">Error</h3>
             <p>{error}</p>
           </div>
         )}
       </div>
     );
   };
   
   export default Social;
   
