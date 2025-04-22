import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { isAuthenticated, getCurrentUser, clearAuth } from '../../lib/auth';
import Avatar from '../common/Avatar';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();
  
  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    setProfileMenuOpen(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Nav Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600 text-xl font-bold">Campus Connect</span>
            </Link>
            
            {/* Desktop Nav Links */}
            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/announcements" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Announcements
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Events
              </Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Resources
              </Link>
            </nav>
          </div>
          
          {/* User Profile and Actions */}
          <div className="flex items-center">
            {authenticated ? (
              <div className="flex items-center ml-3 relative">
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center">
                    <Avatar 
                      name={currentUser?.name || 'User'} 
                      size="sm" 
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                      {currentUser?.name || 'User'}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </div>
                </button>
                
                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                        Signed in as <span className="font-medium">{currentUser?.email}</span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center ml-4 md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/announcements" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Announcements
            </Link>
            <Link 
              to="/events" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/resources" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            {!authenticated && (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;