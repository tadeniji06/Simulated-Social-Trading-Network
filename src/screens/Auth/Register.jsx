import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { API_URL } from "../../utils/api";

const Register = () => {
  const [error, setError] = useState("");
  const pageRef = useRef(null);

  useEffect(() => {
    // Animation for page entry
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleGoogleSignup = () => {
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
            Create your account to start trading
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-6 flex items-center">
            <Icon icon="mdi:alert-circle" className="mr-2" width={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-bg-elevated rounded-2xl shadow-card p-6 md:p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Join TradeSim</h2>
            <p className="text-gray-400">
              Create your account with Google to start your trading journey
            </p>
          </div>

          <button
            className="w-full flex items-center justify-center gap-3 bg-bg-card hover:bg-gray-700 text-white py-3 px-4 rounded-lg border border-border-light transition-colors"
            onClick={handleGoogleSignup}
          >
            <Icon icon="flat-color-icons:google" width={24} />
            <span>Sign up with Google</span>
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
