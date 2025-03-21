import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Icon } from '@iconify/react';

const Details = ({ userDetails, updateUserDetails, onNext, onPrevious }) => {
  const formRef = useRef(null);
  
  const experienceOptions = [
    { value: 'beginner', label: 'Beginner', icon: 'mdi:baby-face-outline' },
    { value: 'intermediate', label: 'Intermediate', icon: 'mdi:account' },
    { value: 'advanced', label: 'Advanced', icon: 'mdi:account-tie' }
  ];
  
  const interestOptions = [
    { value: 'bitcoin', label: 'Bitcoin', icon: 'cryptocurrency:btc' },
    { value: 'ethereum', label: 'Ethereum', icon: 'cryptocurrency:eth' },
    { value: 'defi', label: 'DeFi', icon: 'simple-icons:defi' },
    { value: 'nft', label: 'NFTs', icon: 'simple-icons:opensea' },
    { value: 'altcoins', label: 'Altcoins', icon: 'cryptocurrency:xrp' },
    { value: 'trading', label: 'Trading Strategies', icon: 'mdi:chart-timeline-variant' }
  ];
  
  useEffect(() => {
    // Animate form elements in sequence
    const formElements = formRef.current.children;
    
    gsap.fromTo(
      formElements,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: "power2.out" 
      }
    );
  }, []);
  
  const handleInterestToggle = (interest) => {
    if (userDetails.interests.includes(interest)) {
      updateUserDetails('interests', userDetails.interests.filter(i => i !== interest));
    } else {
      updateUserDetails('interests', [...userDetails.interests, interest]);
    }
  };
  
  return (
    <div ref={formRef} className="user-details">
      <h2 className="text-3xl font-stencil mb-6 text-center">
        Personalize Your Experience
      </h2>
      
      {/* Name input */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-gray-300 mb-2">
          What should we call you?
        </label>
        <input
          type="text"
          id="name"
          value={userDetails.name}
          onChange={(e) => updateUserDetails('name', e.target.value)}
          placeholder="Your name"
          className="input w-full"
        />
      </div>
      
      {/* Experience level */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Your trading experience
        </label>
        <div className="grid grid-cols-3 gap-3">
          {experienceOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateUserDetails('experience', option.value)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                userDetails.experience === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border-dark bg-bg-card text-gray-300 hover:bg-bg-elevated'
              }`}
            >
              <Icon icon={option.icon} width={32} height={32} className="mb-2" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Trading interests */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          What are you interested in? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInterestToggle(option.value)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                userDetails.interests.includes(option.value)
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border-dark bg-bg-card text-gray-300 hover:bg-bg-elevated'
              }`}
            >
              <Icon icon={option.icon} width={24} height={24} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Notification preferences */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <label htmlFor="notifications" className="text-gray-300">
            Enable trade notifications
          </label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              id="notifications"
              className="opacity-0 w-0 h-0"
              checked={userDetails.notifications}
              onChange={(e) => updateUserDetails('notifications', e.target.checked)}
            />
            <span 
              className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                userDetails.notifications ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span 
                className={`absolute h-4 w-4 bg-white rounded-full top-1 transition-all duration-300 ${
                  userDetails.notifications ? 'left-7' : 'left-1'
                }`}
              ></span>
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Receive alerts for price movements, trade executions, and market news
        </p>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onPrevious}
          className="btn-primary bg-gray-700 hover:bg-gray-600 flex items-center gap-2"
        >
          <Icon icon="material-symbols:arrow-back-rounded" width={20} />
          Back
        </button>
        <button 
          onClick={onNext}
          className="btn-primary flex items-center gap-2"
        >
          Continue
          <Icon icon="material-symbols:arrow-forward-rounded" width={20} />
        </button>
      </div>
    </div>
  );
};

export default Details;
