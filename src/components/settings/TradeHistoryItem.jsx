import React from 'react';

const TradeHistoryItem = ({ trade }) => {
  // Add a check for required properties
  if (!trade || !trade.openPrice) {
    return <div className="bg-dark-elevated rounded-lg p-4 text-gray-400">Invalid trade data</div>;
  }

  // Calculate profit/loss percentage safely
  const profitLossPercent = trade.closePrice 
    ? ((trade.closePrice - trade.openPrice) / trade.openPrice * 100).toFixed(2)
    : '0.00';
  const isProfitable = trade.closePrice > trade.openPrice;
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Safely get coin symbol for the icon
  const getCoinIcon = () => {
    if (!trade.symbol) return 'https://via.placeholder.com/30?text=?';
    try {
      const baseCoin = trade.symbol.toLowerCase().split('/')[0];
      return `https://cryptoicons.org/api/icon/${baseCoin}/30`;
    } catch (error) {
      return 'https://via.placeholder.com/30?text=?';
    }
  };

  return (
    <div className="bg-dark-elevated rounded-lg p-4 hover:bg-gray-800 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <img 
              src={getCoinIcon()}
              alt={trade.symbol || 'Unknown'}
              className="w-6 h-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/30?text=?';
              }}
            />
          </div>
          
          <div>
            <h3 className="font-medium text-white">{trade.symbol || 'Unknown Pair'}</h3>
            <p className="text-sm text-gray-400">
              {trade.type || 'Market'} • {trade.side === 'buy' ? 'Long' : 'Short'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={`text-lg font-semibold ${isProfitable ? 'text-success' : 'text-danger'}`}>
            {isProfitable ? '+' : ''}{profitLossPercent}%
          </div>
          <p className="text-sm text-gray-400">
            {formatDate(trade.closeDate || trade.openDate)}
          </p>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div>
          <p className="text-gray-400">Open</p>
          <p className="text-white">${trade.openPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Close</p>
          <p className="text-white">
            {trade.closePrice ? `$${trade.closePrice.toFixed(2)}` : 'Open'}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Size</p>
          <p className="text-white">
            ${trade.amount ? trade.amount.toFixed(2) : '0.00'}
          </p>
        </div>
        <div>
          <p className="text-gray-400">P/L</p>
          <p className={`${isProfitable ? 'text-success' : 'text-danger'}`}>
            ${trade.closePrice 
              ? Math.abs(
                  (trade.amount || 0) * (trade.closePrice - trade.openPrice) / trade.openPrice
                ).toFixed(2)
              : '0.00'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradeHistoryItem;
