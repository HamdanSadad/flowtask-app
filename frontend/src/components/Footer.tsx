import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1 rounded-lg">
              <CheckSquare size={20} />
            </div>
            <span className="font-bold text-lg text-text">FlowTask</span>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>
          
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FlowTask. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
