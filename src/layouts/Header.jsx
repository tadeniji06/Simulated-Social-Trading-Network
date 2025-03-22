import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UseAuth } from "../context/UseAuth";
import { logout } from "../functions/authFunctions";

const Header = () => {
  const { user, isAuthenticated } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <header className='fixed top-0 left-0 right-0 bg-dark-surface border-b border-border-dark z-50 '>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className='flex items-center'
            >
              <svg
                className='h-8 w-8 text-primary'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M7.5 12H16.5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 7.5V16.5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='ml-2 text-xl font-bold bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end bg-clip-text text-transparent'>
                TradeSim
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className='hidden md:flex space-x-6'>
              <Link
                to='/dashboard'
                className={`py-2 px-1 font-medium ${
                  isActive("/dashboard") &&
                  !isActive("/dashboard/trade") &&
                  !isActive("/dashboard/portfolio")
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to='/dashboard/trade'
                className={`py-2 px-1 font-medium ${
                  isActive("/dashboard/trade")
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
              >
                Trade
              </Link>
              <Link
                to='/dashboard/portfolio'
                className={`py-2 px-1 font-medium ${
                  isActive("/dashboard/portfolio")
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
              >
                Portfolio
              </Link>
              <Link
                to='/dashboard/leaderboard'
                className={`py-2 px-1 font-medium ${
                  isActive("/dashboard/leaderboard")
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
              >
                Leaderboard
              </Link>
              <Link
                to='/dashboard/social'
                className={`py-2 px-1 font-medium ${
                  isActive("/dashboard/social")
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-300 hover:text-primary"
                }`}
              >
                Social
              </Link>
            </nav>
          )}

          {/* Right side - Auth buttons or User profile */}
          <div className='flex items-center'>
            {isAuthenticated ? (
              <div className='relative'>
                <button
                  onClick={toggleProfileDropdown}
                  className='flex items-center space-x-2 focus:outline-none'
                >
                  <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium'>
                    {/* {user?.name?.charAt(0) || 'U'} */}
                    <img
                      src={
                        user?.avatar || "https://via.placeholder.com/40"
                      }
                      alt='User Profile'
                      className='w-full h-full object-cover rounded-full'
                    />
                  </div>
                  <span className='hidden md:block text-gray-300'>
                    {user?.name || "User"}
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-dark-elevated rounded-lg shadow-lg py-1 z-10'>
                    <Link
                      to='/dashboard/profile'
                      className='block px-4 py-2 text-gray-300 hover:bg-dark-surface'
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-danger hover:bg-dark-surface'
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex space-x-4'>
                <Link
                  to='/'
                  className={`py-2 px-4 rounded-lg font-medium ${
                    isActive("/")
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:text-primary"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  className={`py-2 px-4 rounded-lg font-medium ${
                    isActive("/register")
                      ? "bg-primary text-white"
                      : "bg-primary-dark text-white hover:bg-primary"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className='ml-4 md:hidden focus:outline-none'
              onClick={toggleMobileMenu}
            >
              <svg
                className='h-6 w-6 text-gray-300'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && isAuthenticated && (
        <div className='md:hidden bg-dark-elevated border-t border-border-dark'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            <Link
              to='/dashboard'
              className={`block px-3 py-2 rounded-md ${
                isActive("/dashboard") &&
                !isActive("/dashboard/trade") &&
                !isActive("/dashboard/portfolio")
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-dark-surface"
              }`}
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <Link
              to='/dashboard/trade'
              className={`block px-3 py-2 rounded-md ${
                isActive("/dashboard/trade")
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-dark-surface"
              }`}
              onClick={closeMobileMenu}
            >
              Trade
            </Link>
            <Link
              to='/dashboard/portfolio'
              className={`block px-3 py-2 rounded-md ${
                isActive("/dashboard/portfolio")
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-dark-surface"
              }`}
              onClick={closeMobileMenu}
            >
              Portfolio
            </Link>
            <Link
              to='/dashboard/leaderboard'
              className={`block px-3 py-2 rounded-md ${
                isActive("/dashboard/leaderboard")
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-dark-surface"
              }`}
              onClick={closeMobileMenu}
            >
              Leaderboard
            </Link>
            <Link
              to='/dashboard/profile'
              className={`block px-3 py-2 rounded-md ${
                isActive("/dashboard/profile")
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-dark-surface"
              }`}
              onClick={closeMobileMenu}
            >
              Profile Settings
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className='block w-full text-left px-3 py-2 rounded-md text-danger hover:bg-dark-surface'
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
