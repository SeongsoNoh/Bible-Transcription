import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <BookOpen className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-xl font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                성경 필사
              </span>
            </Link>
            
            <div className="flex items-center space-x-8">
              <div className="flex space-x-1">
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span className="font-medium">Home</span>
                </Link>
                
                <Link
                  to="/progress"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/progress') 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">Progress</span>
                </Link>
                
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-600 px-3 py-2">
                      안녕하세요, {user.name}님!
                    </span>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive('/login') 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;