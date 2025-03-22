import React, { useState, useEffect } from "react";
import {
  getMarketData,
  searchCoins,
  getCoinDetails,
  executeMarketTrade,
  placeOrder,
  getPortfolio,
} from "../../functions/tradeFunctions";
import { UseAuth } from "../../context/UseAuth";

const Trade = () => {
  const { user } = UseAuth();
  const [marketData, setMarketData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tradeType, setTradeType] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch initial market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await getMarketData(1, 20);
        setMarketData(response.data);

        // Also fetch portfolio data for balance info
        const portfolioData = await getPortfolio();
        setPortfolio(portfolioData.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching market data:", err);
        setError(err.message || "Failed to load market data");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const response = await searchCoins(searchQuery);
          setSearchResults(response.data);
          setError(null);
        } catch (err) {
          console.error("Error searching coins:", err);
          setError(err.message || "Failed to search coins");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch coin details when a coin is selected
  useEffect(() => {
    const fetchCoinDetails = async () => {
      if (selectedCoin) {
        try {
          setLoading(true);
          const response = await getCoinDetails(selectedCoin.id);
          setCoinDetails(response.data);
          // Set default limit/stop price to current price
          setLimitPrice(
            response.data.market_data.current_price.usd.toString()
          );
          setStopPrice(
            response.data.market_data.current_price.usd.toString()
          );
          setError(null);
        } catch (err) {
          console.error("Error fetching coin details:", err);
          setError(err.message || "Failed to load coin details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCoinDetails();
  }, [selectedCoin]);

  // Calculate total cost when quantity or price changes
  useEffect(() => {
    if (selectedCoin && quantity) {
      let price;
      if (orderType === "market") {
        price = selectedCoin.current_price;
      } else if (orderType === "limit") {
        price = parseFloat(limitPrice) || 0;
      } else if (orderType === "stop") {
        price = parseFloat(stopPrice) || 0;
      }

      const total = price * parseFloat(quantity);
      setTotalCost(total);
    } else {
      setTotalCost(0);
    }
  }, [selectedCoin, quantity, orderType, limitPrice, stopPrice]);

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleTradeSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCoin || !quantity || parseFloat(quantity) <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (orderType === "market") {
        response = await executeMarketTrade(
          selectedCoin.id,
          selectedCoin.symbol,
          tradeType,
          parseFloat(quantity)
        );
      } else {
        response = await placeOrder(
          selectedCoin.id,
          selectedCoin.symbol,
          tradeType,
          parseFloat(quantity),
          orderType,
          orderType === "limit" ? parseFloat(limitPrice) : undefined,
          orderType === "stop" ? parseFloat(stopPrice) : undefined
        );
      }

      // Refresh portfolio data
      const portfolioData = await getPortfolio();
      setPortfolio(portfolioData.data);

      // Reset form
      setQuantity("");
      setLimitPrice("");
      setStopPrice("");

      setSuccess(
        `${
          orderType.charAt(0).toUpperCase() + orderType.slice(1)
        } ${tradeType} order executed successfully!`
      );
      setTimeout(() => setSuccess(null), 5000);

      setError(null);
    } catch (err) {
      console.error("Error executing trade:", err);
      setError(err.message || "Failed to execute trade");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxQuantity = () => {
    if (!selectedCoin || !portfolio) return;

    if (tradeType === "buy") {
      // For buy, max is based on available balance
      const maxQuantity = portfolio.balance / selectedCoin.current_price;
      setQuantity(maxQuantity.toFixed(6));
    } else if (tradeType === "sell") {
      // For sell, max is based on holdings
      const holding = portfolio.holdings.find(
        (h) => h.coinId === selectedCoin.id
      );
      if (holding) {
        setQuantity(holding.quantity.toString());
      }
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 mt-6'>
      <h1 className='text-2xl font-bold mb-6'>Trade Cryptocurrencies</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Market Data Section */}
        <div className='lg:col-span-2'>
          <div className='bg-dark-surface p-6 rounded-lg shadow-lg mb-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Overview</h2>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search coins...'
                  className='bg-dark-elevated text-white px-4 py-2 rounded-lg w-64'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <div className='absolute right-3 top-2'>
                    <div className='animate-spin h-5 w-5 border-t-2 border-primary rounded-full'></div>
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className='absolute z-10 mt-1 w-64 bg-dark-elevated rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                    {searchResults.map((coin) => (
                      <div
                        key={coin.id}
                        className='px-4 py-2 hover:bg-dark-surface cursor-pointer flex items-center'
                        onClick={() => handleCoinSelect(coin)}
                      >
                        {coin.image && (
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className='w-6 h-6 mr-2'
                          />
                        )}
                        <span>
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='bg-dark-elevated'>
                  <tr>
                    <th className='py-3 px-4 text-left'>Coin</th>
                    <th className='py-3 px-4 text-left'>Price</th>
                    <th className='py-3 px-4 text-left'>24h Change</th>
                    <th className='py-3 px-4 text-left'>Market Cap</th>
                    <th className='py-3 px-4 text-left'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.map((coin) => (
                    <tr key={coin.id} className='border-t border-gray-700'>
                      <td className='py-3 px-4'>
                        <div className='flex items-center'>
                          {coin.image && (
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className='w-6 h-6 mr-2'
                            />
                          )}
                          <div>
                            <div className='font-medium'>{coin.name}</div>
                            <div className='text-gray-400 text-sm'>
                              {coin.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        ${coin.current_price.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          coin.price_change_percentage_24h >= 0
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td className='py-3 px-4'>
                        ${(coin.market_cap / 1000000).toFixed(2)}M
                      </td>
                      <td className='py-3 px-4'>
                        <button
                          className='bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded'
                          onClick={() => handleCoinSelect(coin)}
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trade Form Section */}
        <div className='lg:col-span-1'>
          <div className='bg-dark-surface p-6 rounded-lg shadow-lg sticky top-4'>
            <h2 className='text-xl font-semibold mb-4'>
              {selectedCoin
                ? `Trade ${selectedCoin.name}`
                : "Select a coin to trade"}
            </h2>

            {error && (
              <div className='bg-danger bg-opacity-20 text-danger p-3 rounded-lg mb-4'>
                {error}
              </div>
            )}

            {success && (
              <div className='bg-success bg-opacity-20 text-success p-3 rounded-lg mb-4'>
                {success}
              </div>
            )}

            {portfolio && (
              <div className='mb-4 p-3 bg-dark-elevated rounded-lg'>
                <p className='text-gray-400'>Available Balance</p>
                <p className='text-xl font-bold'>
                  ${portfolio.balance.toFixed(2)}
                </p>
              </div>
            )}

            {selectedCoin && (
              <form onSubmit={handleTradeSubmit}>
                {/* Coin Info */}
                <div className='mb-4 flex items-center'>
                  {selectedCoin.image && (
                    <img
                      src={selectedCoin.image}
                      alt={selectedCoin.name}
                      className='w-8 h-8 mr-2'
                    />
                  )}
                  <div>
                    <div className='font-medium'>{selectedCoin.name}</div>
                    <div className='text-gray-400 text-sm'>
                      {selectedCoin.symbol.toUpperCase()}
                    </div>
                  </div>
                  <div className='ml-auto'>
                    <div className='font-medium'>
                      ${selectedCoin.current_price.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm ${
                        selectedCoin.price_change_percentage_24h >= 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {selectedCoin.price_change_percentage_24h.toFixed(2)}
                      %
                    </div>
                  </div>
                </div>

                {/* Trade Type Toggle */}
                <div className='mb-4'>
                  <div className='flex rounded-lg overflow-hidden'>
                    <button
                      type='button'
                      className={`flex-1 py-2 px-4 ${
                        tradeType === "buy"
                          ? "bg-success text-white"
                          : "bg-dark-elevated text-gray-400"
                      }`}
                      onClick={() => setTradeType("buy")}
                    >
                      Buy
                    </button>
                    <button
                      type='button'
                      className={`flex-1 py-2 px-4 ${
                        tradeType === "sell"
                          ? "bg-danger text-white"
                          : "bg-dark-elevated text-gray-400"
                      }`}
                      onClick={() => setTradeType("sell")}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                {/* Order Type Selection */}
                <div className='mb-4'>
                  <label className='block text-gray-400 mb-2'>
                    Order Type
                  </label>
                  <div className='grid grid-cols-3 gap-2'>
                    <button
                      type='button'
                      className={`py-2 px-3 rounded ${
                        orderType === "market"
                          ? "bg-primary text-white"
                          : "bg-dark-elevated text-gray-400"
                      }`}
                      onClick={() => setOrderType("market")}
                    >
                      Market
                    </button>
                    <button
                      type='button'
                      className={`py-2 px-3 rounded ${
                        orderType === "limit"
                          ? "bg-primary text-white"
                          : "bg-dark-elevated text-gray-400"
                      }`}
                      onClick={() => setOrderType("limit")}
                    >
                      Limit
                    </button>
                    <button
                      type='button'
                      className={`py-2 px-3 rounded ${
                        orderType === "stop"
                          ? "bg-primary text-white"
                          : "bg-dark-elevated text-gray-400"
                      }`}
                      onClick={() => setOrderType("stop")}
                    >
                      Stop
                    </button>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className='mb-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <label className='block text-gray-400'>Quantity</label>
                    <button
                      type='button'
                      className='text-primary text-sm'
                      onClick={handleMaxQuantity}
                    >
                      Max
                    </button>
                  </div>
                  <div className='relative'>
                    <input
                      type='number'
                      className='w-full bg-dark-elevated text-white px-4 py-2 rounded-lg'
                      placeholder='0.00'
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      step='0.000001'
                      min='0'
                      required
                    />
                    <div className='absolute right-3 top-2 text-gray-400'>
                      {selectedCoin.symbol.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Limit Price Input (for limit orders) */}
                {orderType === "limit" && (
                  <div className='mb-4'>
                    <label className='block text-gray-400 mb-2'>
                      Limit Price
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        className='w-full bg-dark-elevated text-white px-4 py-2 rounded-lg'
                        placeholder='0.00'
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        step='0.01'
                        min='0'
                        required
                      />
                      <div className='absolute right-3 top-2 text-gray-400'>
                        USD
                      </div>
                    </div>
                  </div>
                )}

                {/* Stop Price Input (for stop orders) */}
                {orderType === "stop" && (
                  <div className='mb-4'>
                    <label className='block text-gray-400 mb-2'>
                      Stop Price
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        className='w-full bg-dark-elevated text-white px-4 py-2 rounded-lg'
                        placeholder='0.00'
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                        step='0.01'
                        min='0'
                        required
                      />
                      <div className='absolute right-3 top-2 text-gray-400'>
                        USD
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Cost */}
                <div className='mb-6 p-3 bg-dark-elevated rounded-lg'>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>
                      Total {tradeType === "buy" ? "Cost" : "Received"}
                    </span>
                    <span className='font-bold'>
                      ${totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    tradeType === "buy"
                      ? "bg-success hover:bg-success-dark text-white"
                      : "bg-danger hover:bg-danger-dark text-white"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className='flex justify-center items-center'>
                      <div className='animate-spin h-5 w-5 border-t-2 border-white rounded-full mr-2'></div>
                      Processing...
                    </div>
                  ) : (
                    `${
                      tradeType === "buy" ? "Buy" : "Sell"
                    } ${selectedCoin.symbol.toUpperCase()}`
                  )}
                </button>

                {/* Order Type Explanation */}
                <div className='mt-4 text-sm text-gray-400'>
                  {orderType === "market" && (
                    <p>
                      Market orders are executed immediately at the current
                      market price.
                    </p>
                  )}
                  {orderType === "limit" && (
                    <p>
                      {tradeType === "buy"
                        ? "Limit buy orders will execute when the price falls to or below your limit price."
                        : "Limit sell orders will execute when the price rises to or above your limit price."}
                    </p>
                  )}
                  {orderType === "stop" && (
                    <p>
                      {tradeType === "buy"
                        ? "Stop buy orders will execute when the price rises to or above your stop price."
                        : "Stop sell orders will execute when the price falls to or below your stop price."}
                    </p>
                  )}
                </div>
              </form>
            )}

            {!selectedCoin && (
              <div className='text-center py-8'>
                <p className='text-gray-400 mb-4'>
                  Select a cryptocurrency from the market table to start
                  trading
                </p>
                <svg
                  className='mx-auto h-16 w-16 text-gray-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coin Details Section (shown when a coin is selected) */}
      {selectedCoin && coinDetails && (
        <div className='mt-8 bg-dark-surface p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>
            {coinDetails.name} Details
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
            <div className='bg-dark-elevated p-4 rounded-lg'>
              <h3 className='text-gray-400 mb-1'>Market Cap Rank</h3>
              <p className='text-xl font-bold'>
                #{coinDetails.market_cap_rank}
              </p>
            </div>
            <div className='bg-dark-elevated p-4 rounded-lg'>
              <h3 className='text-gray-400 mb-1'>Market Cap</h3>
              <p className='text-xl font-bold'>
                $
                {(
                  coinDetails.market_data.market_cap.usd / 1000000000
                ).toFixed(2)}
                B
              </p>
            </div>
            <div className='bg-dark-elevated p-4 rounded-lg'>
              <h3 className='text-gray-400 mb-1'>24h Trading Volume</h3>
              <p className='text-xl font-bold'>
                $
                {(
                  coinDetails.market_data.total_volume.usd / 1000000
                ).toFixed(2)}
                M
              </p>
            </div>
            <div className='bg-dark-elevated p-4 rounded-lg'>
              <h3 className='text-gray-400 mb-1'>Circulating Supply</h3>
              <p className='text-xl font-bold'>
                {coinDetails.market_data.circulating_supply.toLocaleString()}{" "}
                {coinDetails.symbol.toUpperCase()}
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-3'>
                Price Statistics
              </h3>
              <div className='space-y-2'>
                <div className='flex justify-between py-2 border-b border-gray-700'>
                  <span className='text-gray-400'>Current Price</span>
                  <span>
                    ${coinDetails.market_data.current_price.usd.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-700'>
                  <span className='text-gray-400'>24h Low / High</span>
                  <span>
                    ${coinDetails.market_data.low_24h.usd.toFixed(2)} / $
                    {coinDetails.market_data.high_24h.usd.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-700'>
                  <span className='text-gray-400'>7d Change</span>
                  <span
                    className={
                      coinDetails.market_data.price_change_percentage_7d >=
                      0
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {coinDetails.market_data.price_change_percentage_7d.toFixed(
                      2
                    )}
                    %
                  </span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-700'>
                  <span className='text-gray-400'>30d Change</span>
                  <span
                    className={
                      coinDetails.market_data
                        .price_change_percentage_30d >= 0
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {coinDetails.market_data.price_change_percentage_30d.toFixed(
                      2
                    )}
                    %
                  </span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-700'>
                  <span className='text-gray-400'>All-Time High</span>
                  <div className='text-right'>
                    <div>
                      ${coinDetails.market_data.ath.usd.toFixed(2)}
                    </div>
                    <div className='text-sm text-gray-400'>
                      {new Date(
                        coinDetails.market_data.ath_date.usd
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-3'>
                About {coinDetails.name}
              </h3>
              <div className='bg-dark-elevated p-4 rounded-lg max-h-60 overflow-y-auto'>
                <div
                  className='text-gray-300 text-sm'
                  dangerouslySetInnerHTML={{
                    __html: coinDetails.description.en,
                  }}
                />
              </div>

              {coinDetails.links && (
                <div className='mt-4'>
                  <h4 className='font-medium mb-2'>Links</h4>
                  <div className='flex flex-wrap gap-2'>
                    {coinDetails.links.homepage[0] && (
                      <a
                        href={coinDetails.links.homepage[0]}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-dark-elevated hover:bg-gray-700 text-sm py-1 px-3 rounded-full'
                      >
                        Website
                      </a>
                    )}
                    {coinDetails.links.blockchain_site[0] && (
                      <a
                        href={coinDetails.links.blockchain_site[0]}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-dark-elevated hover:bg-gray-700 text-sm py-1 px-3 rounded-full'
                      >
                        Explorer
                      </a>
                    )}
                    {coinDetails.links.subreddit_url && (
                      <a
                        href={coinDetails.links.subreddit_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-dark-elevated hover:bg-gray-700 text-sm py-1 px-3 rounded-full'
                      >
                        Reddit
                      </a>
                    )}
                    {coinDetails.links.repos_url.github[0] && (
                      <a
                        href={coinDetails.links.repos_url.github[0]}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-dark-elevated hover:bg-gray-700 text-sm py-1 px-3 rounded-full'
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trade;
