import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { API_URL } from "../../utils/api";

const Login = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    // Animation for page entry
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4 md:p-8"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-stencil mb-2 bg-gradient-primary text-transparent bg-clip-text">
            TradeSim
          </h1>
          <p className="text-gray-300">
            Sign in to continue to your portfolio
          </p>
        </div>

        <div className="bg-bg-elevated rounded-2xl shadow-card p-6 md:p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome Back</h2>
            <p className="text-gray-400">
              Sign in with your Google account to access your trading portfolio
            </p>
          </div>

          <button
            className="w-full flex items-center justify-center gap-3 bg-bg-card hover:bg-gray-700 text-white py-3 px-4 rounded-lg border border-border-light transition-colors"
            onClick={handleGoogleLogin}
          >
            <Icon icon="flat-color-icons:google" width={24} />
            <span>Sign in with Google</span>
          </button>
        </div>

        <p className="text-center text-gray-400">
          New to TradeSim?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
