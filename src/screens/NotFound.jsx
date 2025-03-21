import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl font-stencil font-bold text-gray-700 opacity-20">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Icon icon="mdi:alert-circle-outline" className="text-primary" width={80} height={80} />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-stencil mb-4 bg-gradient-primary text-transparent bg-clip-text">
          Page Not Found
        </h1>
        
        <p className="text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:arrow-left" width={20} />
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:home" width={20} />
            Go to Dashboard
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default NotFound;
