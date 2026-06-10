import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const { user } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  }, { scope: navRef });

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <CheckSquare size={24} />
            </div>
            <span className="font-bold text-xl text-text">FlowTask</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How it Works</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link to="/app/dashboard" className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-blue-200">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 font-medium hover:text-primary transition-colors">Log in</Link>
                <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-blue-200">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-primary font-medium py-2">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 hover:text-primary font-medium py-2">How it Works</a>
            <hr className="border-gray-100 my-2" />
            {user ? (
              <Link to="/app/dashboard" className="w-full text-center bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="w-full text-center text-gray-600 font-medium py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Log in</Link>
                <Link to="/register" className="w-full text-center bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-primary-hover">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
