import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bg-elevated py-8 px-4 md:px-8 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-stencil bg-gradient-primary text-transparent bg-clip-text">
                TradeSim
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Experience the thrill of crypto trading without the financial risk.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/tade_niji06" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Icon icon="mdi:twitter" width={24} />
              </a>
              {/* <a href="https://discord.com/princez3ro" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Icon icon="mdi:discord" width={24} />
              </a> */}
              <a href="https://github.com/tadeniji06" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Icon icon="mdi:github" width={24} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/market" className="text-gray-400 hover:text-primary transition-colors">Market</Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-400 hover:text-primary transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/learn" className="text-gray-400 hover:text-primary transition-colors">Learn</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-primary transition-colors">Support</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-bg-dark text-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
              />
              <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-r-md transition-colors">
                <Icon icon="mdi:send" width={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} TradeSim. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="bg-bg-dark text-gray-400 px-3 py-1 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
