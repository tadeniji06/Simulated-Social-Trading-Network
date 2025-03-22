import React, { useState, useEffect } from "react";
import {
  getPortfolio,
  getTradeHistory,
  closePosition
} from "../functions/tradeFunctions";
import { UseAuth } from "../context/UseAuth";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast"; // Make sure you have this installed

const Portfolio = () => {
  const { user } = UseAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("holdings");
  const [closingPosition, setClosingPosition] = useState(null);
  const [closePercentage, setClosePercentage] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const portfolioData = await getPortfolio();
      setPortfolio(portfolioData.data);

      const historyData = await getTradeHistory();
      setTradeHistory(historyData.data);

      setError(null);
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
      setError(err.message || "Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const handleClosePosition = async () => {
    if (!closingPosition) return;
    
    try {
      setIsProcessing(true);
      const result = await closePosition(closingPosition.coinId, closePercentage);
      toast.success(result.message);
      fetchPortfolioData(); // Refresh data
      setClosingPosition(null); // Reset closing position
    } catch (err) {
      toast.error(err.message || "Failed to close position");
    } finally {
      setIsProcessing(false);
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
      </div>
    );
  }

  if (!portfolio) {
    return <div>No portfolio data available</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8 mt-6'>
      <h1 className='text-2xl font-bold mb-6'>
        Your Portfolio
      </h1>

      {/* Portfolio Summary */}
      <div className='bg-dark-surface p-6 rounded-lg shadow-lg mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-dark-elevated p-4 rounded-lg'>
            <h3 className='text-gray-400 mb-1'>Available Balance</h3>
            <p className='text-2xl font-bold'>
              ${portfolio.balance.toFixed(2)}
            </p>
          </div>
          <div className='bg-dark-elevated p-4 rounded-lg'>
            <h3 className='text-gray-400 mb-1'>Total Holdings Value</h3>
            <p className='text-2xl font-bold'>
              ${(portfolio.totalValue - portfolio.balance).toFixed(2)}
            </p>
          </div>
          <div className='bg-dark-elevated p-4 rounded-lg'>
            <h3 className='text-gray-400 mb-1'>Total Portfolio Value</h3>
            <p className='text-2xl font-bold'>
              ${portfolio.totalValue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex border-b border-gray-700 mb-6'>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "holdings"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("holdings")}
        >
          Holdings
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "history"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Trade History
        </button>
      </div>

      {/* Holdings Tab */}
      {activeTab === "holdings" && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>Your Holdings</h2>
          {portfolio.holdings && portfolio.holdings.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-dark-surface rounded-lg'>
                <thead className='bg-dark-elevated'>
                  <tr>
                    <th className='py-3 px-4 text-left'>Coin</th>
                    <th className='py-3 px-4 text-left'>Quantity</th>
                    <th className='py-3 px-4 text-left'>Avg. Buy Price</th>
                    <th className='py-3 px-4 text-left'>Current Price</th>
                    <th className='py-3 px-4 text-left'>Current Value</th>
                    <th className='py-3 px-4 text-left'>Profit/Loss</th>
                    <th className='py-3 px-4 text-left'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((holding, index) => (
                    <tr key={index} className='border-t border-gray-700'>
                      <td className='py-3 px-4'>
                        <div className='flex items-center'>
                          <span className='font-medium'>
                            {holding.coinSymbol.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        {holding.quantity.toFixed(6)}
                      </td>
                      <td className='py-3 px-4'>
                        ${holding.averageBuyPrice.toFixed(2)}
                      </td>
                      <td className='py-3 px-4'>
                        ${holding.currentPrice.toFixed(2)}
                      </td>
                      <td className='py-3 px-4'>
                        ${holding.currentValue.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          holding.profitLoss >= 0
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        ${holding.profitLoss.toFixed(2)} (
                        {holding.profitLossPercentage.toFixed(2)}%)
                      </td>
                      <td className='py-3 px-4'>
                        <button
                          onClick={() => setClosingPosition(holding)}
                          className={`px-3 py-1 rounded-md text-white text-sm ${
                            holding.profitLoss >= 0
                              ? "bg-success hover:bg-success-dark"
                              : "bg-danger hover:bg-danger-dark"
                          }`}
                        >
                          Close Position
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='bg-dark-elevated p-8 rounded-lg text-center'>
              <p className='text-gray-400'>
                You don't have any holdings yet.
              </p>
              <button className='mt-4 bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg'>
                <Link to={"/dashboard/trade"}> Start Trading</Link>
              </button>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div>
          <h2 className='text-xl font-semibold mb-4'>Trade History</h2>
          {tradeHistory && tradeHistory.length > 0 ? (
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
                    {/* Add profit/loss column for sell trades */}
                    <th className='py-3 px-4 text-left'>Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((trade) => (
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
                      <td className={`py-3 px-4 ${
                        trade.type === "sell" 
                          ? (trade.profitLoss >= 0 ? "text-success" : "text-danger")
                          : ""
                      }`}>
                        {trade.type === "sell" && trade.profitLoss 
                          ? `${trade.profitLoss >= 0 ? "+" : ""}$${trade.profitLoss.toFixed(2)}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='bg-dark-elevated p-8 rounded-lg text-center'>
              <p className='text-gray-400'>
                You haven't made any trades yet.
              </p>
              <button className='mt-4 bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg'>
                <Link to={"/dashboard/trade"}> Start Trading</Link>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Close Position Modal */}
      {closingPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Close Position</h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Asset:</span>
                <span className="font-medium">{closingPosition.coinSymbol.toUpperCase()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Quantity:</span>
                <span>{closingPosition.quantity.toFixed(6)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Current Value:</span>
                <span>${closingPosition.currentValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Profit/Loss:</span>
                <span className={closingPosition.profitLoss >= 0 ? "text-success" : "text-danger"}>
                  ${closingPosition.profitLoss.toFixed(2)} ({closingPosition.profitLossPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Close percentage: {closePercentage}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={closePercentage}
                onChange={(e) => setClosePercentage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="p-4 bg-dark-elevated rounded-lg">
                <p className="mb-2">Summary:</p>
                <p>Closing {closePercentage}% of your {closingPosition.coinSymbol.toUpperCase()} position</p>
                <p>Estimated value: ${((closingPosition.currentValue * closePercentage) / 100).toFixed(2)}</p>
                <p className={closingPosition.profitLoss >= 0 ? "text-success" : "text-danger"}>
                  Estimated {closingPosition.profitLoss >= 0 ? "profit" : "loss"}: 
                  ${((Math.abs(closingPosition.profitLoss) * closePercentage) / 100).toFixed(2)}
                  </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClosePosition}
                disabled={isProcessing}
                className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                  closingPosition.profitLoss >= 0 
                    ? "bg-success hover:bg-success-dark" 
                    : "bg-danger hover:bg-danger-dark"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Close ${closePercentage}% of Position`
                )}
              </button>
              <button
                onClick={() => setClosingPosition(null)}
                disabled={isProcessing}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
