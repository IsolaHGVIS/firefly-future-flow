
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, User, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/calculator', name: 'Calculator', icon: Calculator },
    { path: '/profile', name: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-fire-purple rounded-full flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="font-bold text-lg text-fire-dark-blue">FIRE Track</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "text-fire-purple font-medium" 
                    : "text-gray-600 hover:text-fire-purple"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2",
                location.pathname === item.path
                  ? "text-fire-purple"
                  : "text-gray-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
