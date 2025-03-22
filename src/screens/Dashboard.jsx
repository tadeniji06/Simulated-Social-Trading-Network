import React, { useEffect, useRef, useState } from "react";
import { UseAuth } from "../context/UseAuth";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import {
  getPortfolio,
  getTradeHistory,
} from "../functions/tradeFunctions";

const Dashboard = () => {
  const { user } = UseAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const cardsRef = useRef(null);
  const cardRefs = useRef([]);
  const chartRef = useRef(null);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    // Fetch data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get portfolio data
        const portfolioData = await getPortfolio();
        setPortfolio(portfolioData.data);

        // Get trade history
        const historyData = await getTradeHistory();
        setTradeHistory(historyData.data.slice(0, 5)); // Get last 5 trades

        // Simulate market trends data (replace with actual API call)
        setMarketTrends([
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            price: 37500,
            change: 2.4,
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            price: 2150,
            change: -1.2,
          },
          {
            id: "solana",
            name: "Solana",
            symbol: "SOL",
            price: 98,
            change: 5.7,
          },
          {
            id: "cardano",
            name: "Cardano",
            symbol: "ADA",
            price: 0.45,
            change: -0.8,
          },
          {
            id: "polkadot",
            name: "Polkadot",
            symbol: "DOT",
            price: 6.2,
            change: 3.1,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (loading) return;

    // Create a timeline for staggered animations
    const tl = gsap.timeline();

    // Header animation
    tl.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // Stats animation
    tl.from(
      statsRef.current,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // Cards container animation
    tl.from(
      cardsRef.current,
      {
        opacity: 0,
        duration: 0.4,
      },
      "-=0.2"
    );

    // Individual cards staggered animation
    tl.from(
      cardRefs.current,
      {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=0.2"
    );

    // Chart animation
    tl.from(
      chartRef.current,
      {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "bottom",
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.4"
    );

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [loading]);

  // Add card element to refs array
  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Calculate portfolio metrics
  const portfolioValue = portfolio?.totalValue || 100000;
  const initialValue = 100000; // Starting value
  const profitLoss = portfolioValue - initialValue;
  const profitLossPercentage = (profitLoss / initialValue) * 100;

  return (
    <div className='container mx-auto px-4 py-6 mt-8'>
      {/* Header Section */}
      <div ref={headerRef} className='mb-8'>
        <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end bg-clip-text text-transparent'>
          {getGreeting()}, {user.name}!
        </h1>
        <p className='text-gray-400'>
          Here's an overview of your trading performance and market trends.
        </p>
      </div>

      {/* Stats Overview */}
      <div
        ref={statsRef}
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        <div className='bg-dark-surface p-6 rounded-lg shadow-lg border border-border-dark overflow-hidden relative group'>
          <div className='absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-mid opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
          <h3 className='text-gray-400 mb-1'>Portfolio Value</h3>
          <p className='text-3xl font-bold'>
            ${portfolioValue.toFixed(2)}
          </p>
          <div
            className={`mt-2 text-sm ${
              profitLoss >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {profitLoss >= 0 ? "↑" : "↓"} $
            {Math.abs(profitLoss).toFixed(2)} (
            {profitLossPercentage.toFixed(2)}%)
          </div>
        </div>

        <div className='bg-dark-surface p-6 rounded-lg shadow-lg border border-border-dark overflow-hidden relative group'>
          <div className='absolute inset-0 bg-gradient-to-r from-gradient-mid to-gradient-end opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
          <h3 className='text-gray-400 mb-1'>Available Balance</h3>
          <p className='text-3xl font-bold'>
            ${portfolio?.balance.toFixed(2) || "0.00"}
          </p>
          <div className='mt-2 text-sm text-gray-400'>Ready to trade</div>
        </div>

        <div className='bg-dark-surface p-6 rounded-lg shadow-lg border border-border-dark overflow-hidden relative group'>
          <div className='absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
          <h3 className='text-gray-400 mb-1'>Total Trades</h3>
          <p className='text-3xl font-bold'>{tradeHistory?.length || 0}</p>
          <div className='mt-2 text-sm text-gray-400'>Lifetime trades</div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div
        ref={cardsRef}
        className='grid grid-cols-1 lg:grid-cols-3 gap-6'
      >
        {/* Market Trends */}
        <div
          ref={addToRefs}
          className='lg:col-span-2 bg-dark-surface p-6 rounded-lg shadow-lg border border-border-dark'
        >
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>Market Trends</h2>
            <Link
              to='/dashboard/trade'
              className='text-primary hover:text-primary-light text-sm'
            >
              Trade Now →
            </Link>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-b border-gray-700'>
                  <th className='py-3 px-4 text-left'>Asset</th>
                  <th className='py-3 px-4 text-right'>Price</th>
                  <th className='py-3 px-4 text-right'>24h Change</th>
                  <th className='py-3 px-4 text-right'>Action</th>
                </tr>
              </thead>
              <tbody>
                {marketTrends.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className='border-b border-gray-700 hover:bg-dark-elevated transition-colors duration-150'
                  >
                    <td className='py-3 px-4'>
                      <div className='flex items-center'>
                        <div className='w-8 h-8 rounded-full bg-dark-elevated flex items-center justify-center mr-3'>
                          {coin.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className='font-medium'>{coin.name}</div>
                          <div className='text-xs text-gray-400'>
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-right font-medium'>
                      $
                      {coin.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`py-3 px-4 text-right ${
                        coin.change >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {coin.change >= 0 ? "+" : ""}
                      {coin.change}%
                    </td>
                    <td className='py-3 px-4 text-right'>
                      <Link
                        to={`/dashboard/trade?coin=${coin.id}`}
                        className='inline-block px-3 py-1 bg-primary bg-opacity-20 hover:bg-opacity-30 text-primary rounded-md text-sm transition-colors duration-150'
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Distribution Chart */}
        <div
          ref={addToRefs}
          className='bg-dark-surface p-6 rounded-lg shadow-lg border border-border-dark'
        >
          <h2 className='text-xl font-semibold mb-6'>
            Portfolio Distribution
          </h2>

          {portfolio?.holdings && portfolio.holdings.length > 0 ? (
            <div ref={chartRef} className='h-64 flex items-end space-x-2'>
              {portfolio.holdings.map((holding, index) => {
                const percentage =
                  (holding.currentValue / portfolioValue) * 100;
                const colors = [
                  "bg-chart-1",
                  "bg-chart-2",
                  "bg-chart-3",
                  "bg-chart-4",
                  "bg-chart-5",
                ];
                const color = colors[index % colors.length];

                return (
                  <div
                    key={holding.coinSymbol}
                    className='flex flex-col items-center flex-1'
                  >
                    <div
                      className={`w-full ${color} rounded-t-md`}
                      style={{ height: `${Math.max(percentage, 5)}%` }}
                    ></div>
                    <div className='text-xs font-medium mt-2'>
                      {holding.coinSymbol.toUpperCase()}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}

              {/* Cash balance */}
              {portfolio?.balance > 0 && (
                <div className='flex flex-col items-center flex-1'>
                  <div
                    className='w-full bg-gray-500 rounded-t-md'
                    style={{
                      height: `${Math.max(
                        (portfolio.balance / portfolioValue) * 100,
                        5
                      )}%`,
                    }}
                  ></div>
                  <div className='text-xs font-medium mt-2'>CASH</div>
                  <div className='text-xs text-gray-400'>
                    {((portfolio.balance / portfolioValue) * 100).toFixed(
                      1
                    )}
                    %
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='h-64 flex flex-col items-center justify-center text-center'>
              <div className='text-gray-400 mb-4'>No holdings yet</div>
              <Link
                to='/dashboard/trade'
                className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-150'
              >
                Start Trading
              </Link>
            </div>
          )}

          <div className='mt-4 text-center'>
            <Link
              to='/dashboard/portfolio'
              className='text-primary hover:text-primary-light text-sm'
            >
              View Full Portfolio →
            </Link>
          </div>
        </div>

        {/* Recent Trades */}
        <div
          ref={addToRefs}
          className='lg:col-span-2 bg-dark-surface p-6 rounded-lg shadow-lg border border-border-dark'
        >
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>Recent Trades</h2>
            <Link
              to='/dashboard/portfolio'
              className='text-primary hover:text-primary-light text-sm'
            >
              View All →
            </Link>
          </div>

          {tradeHistory && tradeHistory.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead>
                  <tr className='border-b border-gray-700'>
                    <th className='py-3 px-4 text-left'>Date</th>
                    <th className='py-3 px-4 text-left'>Asset</th>
                    <th className='py-3 px-4 text-left'>Type</th>
                    <th className='py-3 px-4 text-right'>Amount</th>
                    <th className='py-3 px-4 text-right'>Price</th>
                    <th className='py-3 px-4 text-right'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((trade) => (
                    <tr
                      key={trade._id}
                      className='border-b border-gray-700 hover:bg-dark-elevated transition-colors duration-150'
                    >
                      <td className='py-3 px-4 text-sm'>
                        {new Date(trade.createdAt).toLocaleDateString()}
                      </td>
                      <td className='py-3 px-4'>
                        <div className='font-medium'>
                          {trade.coinSymbol.toUpperCase()}
                        </div>
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
                      <td className='py-3 px-4 text-right'>
                        {trade.quantity.toFixed(6)}
                      </td>
                      <td className='py-3 px-4 text-right'>
                        ${trade.price.toFixed(2)}
                      </td>
                      <td className='py-3 px-4 text-right font-medium'>
                        ${trade.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-400 mb-4'>
                You haven't made any trades yet.
              </p>
              <Link
                to='/dashboard/trade'
                className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-150'
              >
                Start Trading
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          ref={addToRefs}
          className='bg-dark-surface p-6 rounded-lg shadow-lg border border-border-dark'
        >
          <h2 className='text-xl font-semibold mb-6'>Quick Actions</h2>

          <div className='space-y-4'>
            <Link
              to='/dashboard/trade'
              className='flex items-center p-4 bg-dark-elevated rounded-lg hover:bg-opacity-80 transition-colors duration-150 group'
            >
              <div className='w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-4 group-hover:bg-opacity-30 transition-colors duration-150'>
                <svg
                  className='w-5 h-5 text-primary'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
              </div>
              <div>
                <div className='font-medium'>New Trade</div>
                <div className='text-xs text-gray-400'>
                  Buy or sell crypto
                </div>
              </div>
            </Link>

            <Link
              to='/dashboard/portfolio'
              className='flex items-center p-4 bg-dark-elevated rounded-lg hover:bg-opacity-80 transition-colors duration-150 group'
            >
              <div className='w-10 h-10 rounded-full bg-accent bg-opacity-20 flex items-center justify-center mr-4 group-hover:bg-opacity-30 transition-colors duration-150'>
                <svg
                  className='w-5 h-5 text-accent'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                  />
                </svg>
              </div>
              <div>
                <div className='font-medium'>Portfolio</div>
                <div className='text-xs text-gray-400'>
                  View your holdings
                </div>
              </div>
            </Link>

            <Link
              to='/dashboard/leaderboard'
              className='flex items-center p-4 bg-dark-elevated rounded-lg hover:bg-opacity-80 transition-colors duration-150 group'
            >
              <div className='w-10 h-10 rounded-full bg-warning bg-opacity-20 flex items-center justify-center mr-4 group-hover:bg-opacity-30 transition-colors duration-150'>
                <svg
                  className='w-5 h-5 text-warning'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                  />
                </svg>
              </div>
              <div>
                <div className='font-medium'>Leaderboard</div>
                <div className='text-xs text-gray-400'>
                  See top traders
                </div>
              </div>
            </Link>

            <Link
              to='/dashboard/profile'
              className='flex items-center p-4 bg-dark-elevated rounded-lg hover:bg-opacity-80 transition-colors duration-150 group'
            >
              <div className='w-10 h-10 rounded-full bg-success bg-opacity-20 flex items-center justify-center mr-4 group-hover:bg-opacity-30 transition-colors duration-150'>
                <svg
                  className='w-5 h-5 text-success'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <div>
                <div className='font-medium'>Profile</div>
                <div className='text-xs text-gray-400'>
                  Update settings
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Tip Card */}
      <div
        ref={addToRefs}
        className='mt-8 bg-gradient-to-r from-gradient-start to-gradient-end bg-opacity-10 p-6 rounded-lg shadow-lg relative overflow-hidden'
      >
        <div className='absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-white bg-opacity-10 rounded-full'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 bg-white bg-opacity-5 rounded-full'></div>

        <h3 className='text-xl font-semibold mb-2 relative z-10'>
          Trading Tip of the Day
        </h3>
        <p className='text-gray-200 relative z-10 mb-4'>
          Diversification is key to managing risk. Consider spreading your
          investments across different cryptocurrencies rather than putting
          all your funds into a single asset.
        </p>
        <div className='text-sm text-gray-300 relative z-10'>
          Remember: This is a simulated environment - perfect for learning
          without financial risk!
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
