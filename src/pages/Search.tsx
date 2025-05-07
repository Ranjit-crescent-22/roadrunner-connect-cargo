
import { useState, useEffect } from "react";
import SearchForm from "@/components/search/SearchForm";
import RouteCard from "@/components/routes/RouteCard";
import { useRoutes } from "@/context/RouteContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Route } from "@/lib/types";

const Search = () => {
  const { routes, searchRoutes } = useRoutes();
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [filteredResults, setFilteredResults] = useState<Route[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    heavyTrucks: false,
    lightTrucks: false
  });

  // Initialize with all routes
  useEffect(() => {
    setSearchResults(routes);
    setFilteredResults(routes);
  }, [routes]);

  const handleSearch = (origin: string, destination: string) => {
    setOrigin(origin);
    setDestination(destination);
    const results = searchRoutes(origin, destination);
    setSearchResults(results);
  };

  // Apply filters and sorting
  useEffect(() => {
    let results = [...searchResults];
    
    // Apply filters
    if (filters.verifiedOnly) {
      // This would need a join with the drivers data in a real app
      // For now, we'll assume all are verified
    }
    
    if (filters.heavyTrucks) {
      results = results.filter(route => 
        route.vehicleType.toLowerCase().includes("heavy") || 
        route.vehicleType.toLowerCase().includes("large")
      );
    }
    
    if (filters.lightTrucks) {
      results = results.filter(route => 
        route.vehicleType.toLowerCase().includes("light") || 
        route.vehicleType.toLowerCase().includes("small")
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "date":
        results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "capacityHigh":
        results.sort((a, b) => {
          // Extract numeric capacity values (simple implementation)
          const capacityA = parseInt(a.capacity) || 0;
          const capacityB = parseInt(b.capacity) || 0;
          return capacityB - capacityA;
        });
        break;
      case "capacityLow":
        results.sort((a, b) => {
          const capacityA = parseInt(a.capacity) || 0;
          const capacityB = parseInt(b.capacity) || 0;
          return capacityA - capacityB;
        });
        break;
      default:
        break;
    }
    
    setFilteredResults(results);
  }, [searchResults, filters, sortBy]);
  
  const handleFilterChange = (name: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 font-poppins">Find Available Routes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your search results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Departure Date (earliest)</SelectItem>
                      <SelectItem value="capacityHigh">Capacity (highest first)</SelectItem>
                      <SelectItem value="capacityLow">Capacity (lowest first)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Driver Verification</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="verifiedOnly" 
                      checked={filters.verifiedOnly}
                      onCheckedChange={() => handleFilterChange("verifiedOnly")}
                    />
                    <label htmlFor="verifiedOnly" className="text-sm">Verified drivers only</label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Vehicle Type</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="heavyTrucks" 
                      checked={filters.heavyTrucks}
                      onCheckedChange={() => handleFilterChange("heavyTrucks")}
                    />
                    <label htmlFor="heavyTrucks" className="text-sm">Heavy trucks</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="lightTrucks" 
                      checked={filters.lightTrucks}
                      onCheckedChange={() => handleFilterChange("lightTrucks")}
                    />
                    <label htmlFor="lightTrucks" className="text-sm">Light trucks</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Results */}
        <div className="lg:col-span-3">
          <SearchForm onSearch={handleSearch} />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {origin || destination 
                  ? `Routes ${origin ? `from ${origin}` : ''} ${destination ? `to ${destination}` : ''}`
                  : 'All Available Routes'
                }
              </h2>
              <p className="text-sm text-muted-foreground">{filteredResults.length} routes found</p>
            </div>
            
            {filteredResults.length > 0 ? (
              filteredResults.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))
            ) : (
              <div className="text-center py-12 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-2">No routes found matching your criteria</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
