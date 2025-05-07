
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu, X, LogIn, LogOut, User, Truck } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <Truck className="h-6 w-6 text-loadloop-blue mr-2" />
            <span className="text-xl font-bold font-poppins text-loadloop-blue">LOADLOOP</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-loadloop-blue transition-colors">Home</Link>
          <Link to="/search" className="hover:text-loadloop-blue transition-colors">Find Routes</Link>
          <Link to="/post-route" className="hover:text-loadloop-blue transition-colors">Post a Route</Link>
          <Link to="/drivers" className="hover:text-loadloop-blue transition-colors">Drivers</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 hover:text-loadloop-blue">
                <User size={18} />
                <span>{currentUser?.name.split(' ')[0]}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <LogIn size={18} />
                <span>Login</span>
              </Button>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="rounded-full">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b border-border shadow-md">
          <div className="flex flex-col space-y-3 px-4 py-4">
            <Link to="/" className="py-2 hover:text-loadloop-blue" onClick={closeMenu}>Home</Link>
            <Link to="/search" className="py-2 hover:text-loadloop-blue" onClick={closeMenu}>Find Routes</Link>
            <Link to="/post-route" className="py-2 hover:text-loadloop-blue" onClick={closeMenu}>Post a Route</Link>
            <Link to="/drivers" className="py-2 hover:text-loadloop-blue" onClick={closeMenu}>Drivers</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2 flex items-center gap-2 hover:text-loadloop-blue" onClick={closeMenu}>
                  <User size={18} />
                  <span>Profile ({currentUser?.name.split(' ')[0]})</span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="justify-start px-2 hover:text-loadloop-blue"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full flex justify-center items-center gap-2">
                  <LogIn size={18} />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
