
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/search/SearchForm";
import RouteCard from "@/components/routes/RouteCard";
import { useRoutes } from "@/context/RouteContext";
import { TruckIcon, Users, Search, Star } from "lucide-react";

const Index = () => {
  const { routes, searchRoutes } = useRoutes();
  const [searchResults, setSearchResults] = useState(routes.slice(0, 3)); // Show top 3 routes initially

  const handleSearch = (origin: string, destination: string) => {
    const results = searchRoutes(origin, destination);
    setSearchResults(results.slice(0, 3)); // Show top 3 results from search
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-loadloop-blue to-loadloop-darkBlue py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">
            Never Drive Empty Again
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Connect with customers looking for freight transport along your return route
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search">
              <Button size="lg" variant="secondary">
                <Search className="mr-2" size={20} />
                Find Routes
              </Button>
            </Link>
            <Link to="/post-route">
              <Button size="lg" variant="default" className="bg-white text-loadloop-blue hover:bg-gray-100">
                <TruckIcon className="mr-2" size={20} />
                Post a Return Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center font-poppins">
            Find the Perfect Match for Your Freight
          </h2>
          <div className="max-w-3xl mx-auto">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Sample Results */}
          <div className="mt-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Available Routes</h3>
            {searchResults.length > 0 ? (
              searchResults.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No routes found matching your criteria.</p>
                <Link to="/search" className="text-loadloop-blue hover:underline mt-2 inline-block">
                  Try a broader search
                </Link>
              </div>
            )}
            <div className="text-center mt-6">
              <Link to="/search">
                <Button variant="outline">View All Routes</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center font-poppins">
            Why Choose LOADLOOP
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
              <div className="bg-loadloop-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="text-loadloop-blue" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Maximize Efficiency</h3>
              <p className="text-muted-foreground">
                Turn empty return trips into profitable journeys by finding customers along your route
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
              <div className="bg-loadloop-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-loadloop-blue" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Drivers</h3>
              <p className="text-muted-foreground">
                All drivers are verified with proper documentation and performance history
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
              <div className="bg-loadloop-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-loadloop-blue" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rating System</h3>
              <p className="text-muted-foreground">
                Build your reputation through customer reviews and ratings after each delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-loadloop-blue">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-poppins">
            Ready to Join Our Network?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your profile, get verified, and start finding opportunities today.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="default" className="bg-white text-loadloop-blue hover:bg-gray-100">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
