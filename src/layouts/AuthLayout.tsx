import { Outlet, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

const AuthLayout = () => {
  // Redirect to home if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <h1 className="text-3xl font-extrabold text-blue-600">Campus Connect</h1>
          </Link>
          <h2 className="mt-2 text-lg font-medium text-gray-600">Welcome to Campus Connect Portal</h2>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 sm:rounded-lg sm:px-10 shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;