
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (origin: string, destination: string) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // Mock city suggestions
  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad", "Surat", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
    "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad"
  ];

  useEffect(() => {
    // Filter cities based on input for origin
    const filtered = origin
      ? cities.filter(city => city.toLowerCase().includes(origin.toLowerCase()))
      : [];
    setOriginSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
  }, [origin]);

  useEffect(() => {
    // Filter cities based on input for destination
    const filtered = destination
      ? cities.filter(city => city.toLowerCase().includes(destination.toLowerCase()))
      : [];
    setDestinationSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
  }, [destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(origin, destination);
  };

  const handleOriginSelection = (city: string) => {
    setOrigin(city);
    setShowOriginSuggestions(false);
  };

  const handleDestinationSelection = (city: string) => {
    setDestination(city);
    setShowDestinationSuggestions(false);
  };

  return (
    <Card className="shadow-md bg-card">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <Label htmlFor="origin" className="text-sm font-medium">
                Pickup Location
              </Label>
              <Input
                id="origin"
                placeholder="From where?"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onFocus={() => setShowOriginSuggestions(true)}
                onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                className="bg-background"
              />
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-popover shadow-lg rounded-md border">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {originSuggestions.map((city, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                        onMouseDown={() => handleOriginSelection(city)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="destination" className="text-sm font-medium">
                Drop-off Location
              </Label>
              <Input
                id="destination"
                placeholder="To where?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                className="bg-background"
              />
              {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-popover shadow-lg rounded-md border">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {destinationSuggestions.map((city, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                        onMouseDown={() => handleDestinationSelection(city)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto bg-loadloop-blue hover:bg-loadloop-darkBlue">
            <Search size={18} className="mr-2" />
            Search Routes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
