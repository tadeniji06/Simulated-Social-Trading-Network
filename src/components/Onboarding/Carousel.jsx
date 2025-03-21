import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Carousel = ({ onNext, onPrevious }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const slidesRef = useRef([]);
  
  const features = [
    {
      title: "Simulated Trading",
      description: "Trade crypto pairs using market, limit, and stop orders with your virtual $100K portfolio.",
      icon: "cryptocurrency:btc",
      color: "primary"
    },
    {
      title: "Live Market Data",
      description: "Access real-time crypto prices and market data powered by CoinGecko API.",
      icon: "mdi:chart-line",
      color: "success"
    },
    {
      title: "Social Trading",
      description: "Add friends, compare portfolios, and share your best trades with the community.",
      icon: "mdi:account-group",
      color: "accent"
    },
    {
      title: "Leaderboard",
      description: "Compete with others and see your ranking on weekly & all-time leaderboards.",
      icon: "mdi:trophy",
      color: "warning"
    }
  ];
  
  useEffect(() => {
    // Animate the initial slide
    gsap.fromTo(
      slidesRef.current[0],
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);
  
  const handleSlideChange = (index) => {
    // Animate current slide out
    gsap.to(slidesRef.current[currentSlide], {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      onComplete: () => {
        setCurrentSlide(index);
        // Animate new slide in
        gsap.fromTo(
          slidesRef.current[index],
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5 }
        );
      }
    });
  };
  
  return (
    <div className="feature-carousel" ref={carouselRef}>
      <h2 className="text-3xl font-stencil mb-6 text-center">
        Platform Features
      </h2>
      
      <div className="relative h-80 mb-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            ref={el => slidesRef.current[index] = el}
            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6 ${
              currentSlide === index ? 'block' : 'hidden'
            }`}
          >
            <div className={`text-${feature.color} mb-6`}>
              <Icon icon={feature.icon} width={80} height={80} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-300 max-w-md">{feature.description}</p>
          </div>
        ))}
      </div>
      
      {/* Slide indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? `bg-${features[currentSlide].color} w-6` 
                : 'bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
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

export default Carousel;
