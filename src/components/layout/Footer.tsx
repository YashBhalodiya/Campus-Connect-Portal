import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <h3 className="text-xl font-bold">Campus Connect</h3>
            <p className="mt-2 text-gray-300 text-sm">
              Connecting students and faculty with the resources and information they need to succeed.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Announcements
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <address className="not-italic text-gray-300 text-sm">
              <p>Charotar University of Science and Technology (CHARUSAT)</p>
              <p>139, Highway, off Nadiad - Petlad Road, Changa, Gujarat</p>
              <p className="mt-2">d24it155@charusat.edu.in</p>
              <p>+91 0987654321</p>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-sm">
            © {currentYear} Campus Connect Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;