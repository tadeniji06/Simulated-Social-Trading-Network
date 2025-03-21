import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Onboarding/Carousel";
import Details from "../components/Onboarding/Details";
import gsap from "gsap";
import { Icon } from "@iconify/react";
import { setCookie } from "../utils/cookies";
import { UseAuth } from "../context/UseAuth";
import authAxios from "../functions/authFunctions"; // Assuming you have this export

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: "",
    experience: "beginner",
    interests: [],
    notifications: true,
  });

  const { user, setUser } = UseAuth();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    // Initialize animation on component mount
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    
    // Pre-fill name if available from user object
    if (user && user.name) {
      setUserDetails(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < 3) {
      // Animate current step out
      gsap.to(stepsRef.current.children[currentStep], {
        opacity: 0,
        x: -50,
        duration: 0.5,
        onComplete: () => {
          setCurrentStep((prev) => prev + 1);
          // Animate next step in
          gsap.fromTo(
            stepsRef.current.children[currentStep + 1],
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.5 }
          );
        },
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Animate current step out
      gsap.to(stepsRef.current.children[currentStep], {
        opacity: 0,
        x: 50,
        duration: 0.5,
        onComplete: () => {
          setCurrentStep((prev) => prev - 1);
          // Animate previous step in
          gsap.fromTo(
            stepsRef.current.children[currentStep - 1],
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.5 }
          );
        },
      });
    }
  };

  const handleComplete = async () => {
    try {
      // Save user preferences to backend
      const response = await authAxios.post('/user/onboarding', {
        ...userDetails,
        onboardingComplete: true
      });
      
      // Update user in context and cookies
      if (response.data && response.data.user) {
        // Update the user object with onboardingComplete flag
        const updatedUser = {
          ...user,
          ...userDetails,
          onboardingComplete: true
        };
        
        // Update user in context
        setUser(updatedUser);
        
        // Update user in cookies
        setCookie('user', JSON.stringify(updatedUser));
      }
      
      // Animate completion
      gsap.to(mainRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        onComplete: () => {
          navigate('/dashboard');
        },
      });
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      // Still redirect to dashboard even if API call fails
      navigate('/dashboard');
    }
  };

  const updateUserDetails = (key, value) => {
    setUserDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='welcome-step'>
            <h1 className='text-4xl md:text-6xl font-stencil mb-6 bg-gradient-primary text-transparent bg-clip-text'>
              Welcome to <span className='font-bold'>TradeSim</span>
            </h1>
            <p className='text-xl text-gray-300 mb-8'>
              Experience the thrill of crypto trading without the financial
              risk
            </p>
            <div className='flex justify-center'>
              <img
                src='/welcome.svg'
                alt='Trading Illustration'
                className='w-full max-w-md h-auto'
              />
            </div>
            <div className='mt-8'>
              <button
                onClick={handleNext}
                className='btn-primary flex items-center justify-center gap-2 mx-auto'
              >
                Get Started
                <Icon
                  icon='material-symbols:arrow-forward-rounded'
                  width={24}
                />
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <Carousel onNext={handleNext} onPrevious={handlePrevious} />
        );
      case 2:
        return (
          <Details
            userDetails={userDetails}
            updateUserDetails={updateUserDetails}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <div className='final-step'>
            <div className='text-center mb-8'>
              <Icon
                icon='mdi:check-circle'
                className='text-success mx-auto mb-4'
                width={80}
                height={80}
              />
              <h2 className='text-3xl font-stencil mb-4'>
                You're All Set!
              </h2>
              <p className='text-xl text-gray-300'>
                Your virtual portfolio of $100,000 is ready for trading
              </p>
            </div>

            <div className='bg-bg-card p-6 rounded-xl mb-8'>
              <h3 className='text-xl font-semibold mb-4'>
                Your Trading Profile
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-gray-400'>Experience Level</p>
                  <p className='font-medium'>
                    {userDetails.experience.charAt(0).toUpperCase() +
                      userDetails.experience.slice(1)}
                  </p>
                </div>
                <div>
                  <p className='text-gray-400'>Interests</p>
                  <div className='flex flex-wrap gap-2 mt-1'>
                    {userDetails.interests.map((interest) => (
                      <span
                        key={interest}
                        className='bg-primary/20 text-primary px-2 py-1 rounded text-sm'
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='flex justify-between'>
              <button
                onClick={handlePrevious}
                className='btn-primary bg-gray-700 hover:bg-gray-600'
              >
                Back
              </button>
              <button onClick={handleComplete} className='btn-success'>
                Start Trading
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={mainRef}
      className='min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4 md:p-8'
    >
      {/* Progress indicator */}
      <div className='w-full max-w-md mb-8'>
        <div className='flex justify-between items-center'>
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step < currentStep
                  ? "bg-primary text-white"
                  : step === currentStep
                  ? "bg-gradient-primary text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {step < currentStep ? (
                <Icon icon='mdi:check' width={20} />
              ) : (
                step + 1
              )}
            </div>
          ))}
        </div>
        <div className='relative h-1 bg-gray-700 mt-4'>
          <div
            className='absolute top-0 left-0 h-full bg-gradient-primary transition-all duration-300'
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step content */}
      <div
        ref={stepsRef}
        className='w-full max-w-3xl bg-bg-elevated rounded-2xl shadow-card p-6 md:p-8'
      >
        {getStepContent()}
      </div>
    </div>
  );
};

export default Onboarding;
