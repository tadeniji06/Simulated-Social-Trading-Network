import React, { useState } from 'react';
import { closePosition } from '../../functions/tradeFunctions';
import { toast } from 'react-hot-toast';

const ClosePositionButton = ({ coinId, coinSymbol, currentValue, profitLoss, profitLossPercentage, onSuccess }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showPartialOptions, setShowPartialOptions] = useState(false);
  const [percentage, setPercentage] = useState(100);

  const handleClose = async () => {
    try {
      setIsClosing(true);
      const result = await closePosition(coinId, percentage);
      
      toast.success(result.message);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to close position');
    } finally {
      setIsClosing(false);
      setShowPartialOptions(false);
    }
  };

  const isProfitable = profitLoss > 0;

  return (
    <div className="mt-2">
      {!showPartialOptions ? (
        <div className="flex space-x-2">
          <button
            onClick={() => handleClose()}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isProfitable ? 'bg-success hover:bg-success-dark' : 'bg-danger hover:bg-danger-dark'
            } transition-colors duration-150`}
            disabled={isClosing}
          >
            {isClosing ? 'Closing...' : `Close Position (${isProfitable ? '+' : ''}${profitLossPercentage.toFixed(2)}%)`}
          </button>
          <button
            onClick={() => setShowPartialOptions(true)}
            className="px-3 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-150"
          >
            ▼
          </button>
        </div>
      ) : (
        <div className="bg-dark-elevated p-4 rounded-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Close percentage: {percentage}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
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
          
          <div className="text-sm mb-4">
            <p>Closing {percentage}% of your {coinSymbol} position</p>
            <p>Estimated value: ${((currentValue * percentage) / 100).toFixed(2)}</p>
            <p className={isProfitable ? 'text-success' : 'text-danger'}>
              Estimated {isProfitable ? 'profit' : 'loss'}: ${((Math.abs(profitLoss) * percentage) / 100).toFixed(2)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isProfitable ? 'bg-success hover:bg-success-dark' : 'bg-danger hover:bg-danger-dark'
              } transition-colors duration-150 flex-1`}
              disabled={isClosing}
            >
              {isClosing ? 'Closing...' : `Close ${percentage}%`}
            </button>
            <button
              onClick={() => setShowPartialOptions(false)}
              className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosePositionButton;
