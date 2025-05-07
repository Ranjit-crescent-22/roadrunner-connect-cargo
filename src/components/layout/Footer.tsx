
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center justify-center md:justify-start">
              <Truck className="h-5 w-5 text-loadloop-blue mr-2" />
              <span className="text-lg font-bold font-poppins text-loadloop-blue">LOADLOOP</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Connecting drivers and loads efficiently
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link to="/about" className="text-sm hover:text-loadloop-blue">About</Link>
            <Link to="/help" className="text-sm hover:text-loadloop-blue">Help</Link>
            <Link to="/contact" className="text-sm hover:text-loadloop-blue">Contact</Link>
            <Link to="/privacy" className="text-sm hover:text-loadloop-blue">Privacy Policy</Link>
            <Link to="/terms" className="text-sm hover:text-loadloop-blue">Terms</Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LOADLOOP. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
