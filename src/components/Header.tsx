
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Training", path: "/training" },
    { name: "Progress", path: "/progress" },
    { name: "AI Chat", path: "/ai-chat" },
    { name: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // Блокуємо прокручування
    } else {
      document.body.style.overflow = "auto"; // Відновлюємо прокручування
    }

    return () => {
      // Повертаємо нормальне прокручування, коли компонент буде демонтований
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);
  return (
    <header
      className={cn("fixed top-0 left-0 right-0 z-50 py-4", {
        "bg-white bg-opacity-80 ": !transparent,
        "bg-transparent": transparent,
      })}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient">FitRun</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 relative group",
                  {
                    "text-fitness-primary": isActive(item.path),
                    "text-gray-600 hover:text-fitness-primary": !isActive(
                      item.path
                    ),
                  }
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-fitness-primary transform origin-left transition-transform duration-300",
                    {
                      "scale-x-100": isActive(item.path),
                      "scale-x-0 group-hover:scale-x-100": !isActive(item.path),
                    }
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Full Screen Overlay (background) */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black transition-all duration-300 ease-in-out",
          {
            "opacity-75 pointer-events-auto": isMenuOpen,
            "opacity-0 pointer-events-none": !isMenuOpen,
          }
        )}
        onClick={toggleMenu} // Close menu if background is clicked
      />

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300 ease-in-out transform",
          {
            "translate-x-0 opacity-100": isMenuOpen,
            "translate-x-full opacity-0 pointer-events-none": !isMenuOpen,
          }
        )}
      >
        <div className="flex flex-col h-full p-8 pt-20">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-lg font-medium py-2 px-4 rounded-lg transition-colors duration-200",
                  {
                    "bg-fitness-secondary text-fitness-primary": isActive(
                      item.path
                    ),
                    "text-gray-700 hover:bg-gray-100": !isActive(item.path),
                  }
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Close Menu Button */}
          <button
            className="absolute top-4 right-4 text-gray-700"
            onClick={toggleMenu}
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
