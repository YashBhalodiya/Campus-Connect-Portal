import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="flex items-center">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;