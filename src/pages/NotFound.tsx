
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-fitness-secondary bg-opacity-30 px-4">
      <div className="glass-panel p-8 text-center max-w-md">
        <h1 className="text-6xl font-bold text-fitness-primary mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! We couldn't find that page.</p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" leftIcon={<ArrowLeft className="h-5 w-5" />}>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
