
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Menu, X, LogOut, User, PlusSquare, LayoutGrid, Home } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-art-purple font-bold text-xl">
                ArtGallery
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              <Link to="/gallery" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                <LayoutGrid className="mr-1 h-4 w-4" />
                Gallery
              </Link>
              
              {isLoggedIn && user?.role === 'artist' && (
                <Link to="/artist-portal" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <PlusSquare className="mr-1 h-4 w-4" />
                  Submit Art
                </Link>
              )}
              
              {isLoggedIn && user?.role === 'admin' && (
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <User className="mr-1 h-4 w-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hi, {user?.username} ({user?.role})
                </span>
                <Button variant="ghost" onClick={handleLogout} className="text-sm">
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-art-purple"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={toggleMenu}
            >
              Gallery
            </Link>
            
            {isLoggedIn && user?.role === 'artist' && (
              <Link
                to="/artist-portal"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={toggleMenu}
              >
                Submit Art
              </Link>
            )}
            
            {isLoggedIn && user?.role === 'admin' && (
              <Link
                to="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={toggleMenu}
              >
                Admin
              </Link>
            )}
            
            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); toggleMenu(); }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
