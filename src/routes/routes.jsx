import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, UseAuth } from "../context/UseAuth";
import Layout from "../layouts/Layout";

// screens
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import Onboarding from "../screens/Onboarding";
import NotFound from "../screens/NotFound";
import GoogleAuthCallback from "../components/Auth/GoogleAuthCallback";
import Trade from "../components/Dashboard/Trade";
import Portfolio from "../screens/PortFolio";
import Leaderboard from "../screens/Leaderboard";
import Profile from "../screens/Profile";
import Social from "../screens/Social";
import UserProfile from "../screens/UserProfile";
import Settings from "../components/settings/Settings";

// Define the routes configuration
const AppRoutes = () => {
  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = UseAuth();

    // Show loading state while authentication is being checked
    if (loading) {
      return (
        <div className='min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4'>
          <div className='inline-flex items-center justify-center mb-4'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary'></div>
          </div>
          <h2 className='text-2xl font-semibold mb-4'>Loading</h2>
          <p className='text-gray-300'>Please wait...</p>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return <Navigate to='/login' replace />;
    }

    return children;
  };

  // Onboarding Route - Checks if user has completed onboarding
  const OnboardingRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = UseAuth();

    // Show loading state while authentication is being checked
    if (loading) {
      return (
        <div className='min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4'>
          <div className='inline-flex items-center justify-center mb-4'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary'></div>
          </div>
          <h2 className='text-2xl font-semibold mb-4'>Loading</h2>
          <p className='text-gray-300'>Please wait...</p>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return <Navigate to='/login' replace />;
    }

    // If user has completed onboarding, redirect to dashboard
    if (user && user.onboardingComplete) {
      return <Navigate to='/dashboard' replace />;
    }

    return children;
  };

  // Public Route wrapper component
  const PublicRoute = ({
    children,
    redirectAuthenticated = true,
    redirectPath = "/dashboard",
  }) => {
    const { isAuthenticated, loading, user } = UseAuth();

    // Show loading state while authentication is being checked
    if (loading) {
      return (
        <div className='min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4'>
          <div className='inline-flex items-center justify-center mb-4'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary'></div>
          </div>
          <h2 className='text-2xl font-semibold mb-4'>Loading</h2>
          <p className='text-gray-300'>Please wait...</p>
        </div>
      );
    }

    // Redirect authenticated users based on onboarding status
    if (redirectAuthenticated && isAuthenticated) {
      // If user hasn't completed onboarding, redirect to onboarding
      if (user && !user.onboardingComplete) {
        return <Navigate to='/onboarding' replace />;
      }
      // Otherwise redirect to dashboard
      return <Navigate to={redirectPath} replace />;
    }

    return children;
  };

  const router = createBrowserRouter([
    // Public routes outside the main layout
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: "/auth/callback",
      element: <GoogleAuthCallback />,
    },

    // Main layout with nested routes
    {
      element: <Layout />,
      children: [
        // Root path
        {
          path: "/",
          element: (
            <PublicRoute>
              <Register />
            </PublicRoute>
          ),
        },

        // Onboarding
        {
          path: "/onboarding",
          element: (
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          ),
        },

        // Dashboard and its nested routes
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Outlet /> {/* This allows nested routes to render */}
            </ProtectedRoute>
          ),
          children: [
            // Dashboard index route
            {
              index: true,
              element: <Dashboard />,
            },
            // Trade route
            {
              path: "trade",
              element: <Trade />,
            },
            // Portfolio route
            {
              path: "portfolio",
              element: <Portfolio />,
            },
            // Leaderboard route
            {
              path: "leaderboard",
              element: <Leaderboard />,
            },
            {
              path: "user/:userId",
              element: <UserProfile />,
            },
            // Profile settings route
            {
              path: "profile",
              element: <Profile />,
            },
            {
              path: "social",
              element: <Social />,
            },
          ],
        },

        // Catch-all route for 404
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "/settings",
          element: <Settings />,
        }
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRoutes;
