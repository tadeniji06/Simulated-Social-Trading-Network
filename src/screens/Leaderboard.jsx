import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import authAxios from '../functions/authFunctions';
import { UseAuth } from '../context/UseAuth';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const { user } = UseAuth();
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData(activeTab);
  }, [activeTab]);

  const fetchLeaderboardData = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAxios.get(`/leaderboard/${type}`);
      setLeaderboardData(response.data.data);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError(err.response?.data?.error || 'Failed to load leaderboard data');
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format currency with commas and 2 decimal places
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Render user avatar or initials
  const renderAvatar = (user) => {
    if (user.avatar) {
      return <Link to={`/dashboard/user/${user._id}`}><img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" /></Link>;
    } else {
      return (
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      
      {/* Leaderboard Tabs */}
      <div className="flex flex-wrap mb-6 border-b border-gray-700">
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "global"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("global")}
        >
          Global
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "friends"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "daily"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          Daily Gainers
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "weekly"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("weekly")}
        >
          Weekly Gainers
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "monthly"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly Gainers
        </button>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-danger-light text-danger-dark p-4 rounded-lg">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && leaderboardData.length === 0 && (
        <div className="bg-dark-elevated p-8 rounded-lg text-center">
          <p className="text-gray-400">No data available for this leaderboard.</p>
          {activeTab === 'friends' && (
            <p className="mt-2 text-sm text-gray-500">
              Add friends to see how you rank against them.
            </p>
          )}
        </div>
      )}
      
      {/* Leaderboard Table */}
      {!loading && !error && leaderboardData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-dark-surface rounded-lg overflow-hidden">
            <thead className="bg-dark-elevated">
              <tr>
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Trader</th>
                {(activeTab === 'global' || activeTab === 'friends') && (
                  <th className="py-3 px-4 text-right">Portfolio Value</th>
                )}
                {(activeTab === 'daily' || activeTab === 'weekly' || activeTab === 'monthly') && (
                  <>
                    <th className="py-3 px-4 text-right">Profit</th>
                    <th className="py-3 px-4 text-right">Trades</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item, index) => (
                <tr 
                  key={item._id} 
                  className={`border-t border-gray-700 ${
                    item.isCurrentUser ? 'bg-dark-elevated' : ''
                  } hover:bg-dark-elevated transition-colors`}
                >
                  <td className="py-4 px-4">
                    {index === 0 && (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-warning text-dark-base rounded-full font-bold">
                        1
                      </span>
                    )}
                    {index === 1 && (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-400 text-dark-base rounded-full font-bold">
                        2
                      </span>
                    )}
                    {index === 2 && (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-accent-dark text-white rounded-full font-bold">
                        3
                      </span>
                    )}
                    {index > 2 && (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-dark-elevated text-gray-400 rounded-full">
                        {index + 1}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {renderAvatar(item)}
                      <div className="ml-3">
                        <p className="font-medium">
                          {item.name}
                          {item.isCurrentUser && (
                            <span className="ml-2 text-xs bg-primary px-2 py-1 rounded-full">You</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  {(activeTab === 'global' || activeTab === 'friends') && (
                    <td className="py-4 px-4 text-right font-medium">
                      {formatCurrency(item.portfolioValue)}
                    </td>
                  )}
                  {(activeTab === 'daily' || activeTab === 'weekly' || activeTab === 'monthly') && (
                    <>
                      <td className={`py-4 px-4 text-right font-medium ${
                        item.profit >= 0 ? 'text-success' : 'text-danger'
                      }`}>
                        {item.profit >= 0 ? '+' : ''}{formatCurrency(item.profit)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {item.tradeCount} {item.tradeCount === 1 ? 'trade' : 'trades'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Leaderboard Info */}
      <div className="mt-8 bg-dark-surface p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About the Leaderboard</h2>
        
        {activeTab === 'global' && (
          <p className="text-gray-400">
            The Global Leaderboard ranks all traders by their total portfolio value, including cash balance and current value of all holdings.
          </p>
        )}
        
        {activeTab === 'friends' && (
          <p className="text-gray-400">
            The Friends Leaderboard shows how you rank against your friends based on total portfolio value.
          </p>
        )}
        
        {activeTab === 'daily' && (
          <p className="text-gray-400">
            The Daily Gainers leaderboard shows traders with the highest profit from completed trades in the last 24 hours.
          </p>
        )}
        
        {activeTab === 'weekly' && (
          <p className="text-gray-400">
            The Weekly Gainers leaderboard shows traders with the highest profit from completed trades in the last 7 days.
          </p>
        )}
        
        {activeTab === 'monthly' && (
          <p className="text-gray-400">
            The Monthly Gainers leaderboard shows traders with the highest profit from completed trades in the last 30 days.
          </p>
        )}
        
        <div className="mt-4 p-4 bg-dark-elevated rounded-lg">
          <h3 className="font-medium mb-2">Leaderboard Updates</h3>
          <p className="text-sm text-gray-400">
            Global and Friends leaderboards update in real-time as portfolio values change.
            Daily, Weekly, and Monthly leaderboards are calculated based on completed trades during their respective time periods.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
