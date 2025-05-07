
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DriverCard from "@/components/driver/DriverCard";
import { Input } from "@/components/ui/input";
import { Driver } from "@/lib/types";
import { Search } from "lucide-react";

const Drivers = () => {
  const { getDrivers } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  const allDrivers = getDrivers();
  
  // Filter drivers based on search term
  const filteredDrivers = searchTerm 
    ? allDrivers.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allDrivers;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 font-poppins">Browse Verified Drivers</h1>
      
      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search by name, vehicle type or plate number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? 's' : ''}
        {searchTerm && ` for "${searchTerm}"`}
      </p>
      
      {/* Drivers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map(driver => (
            <DriverCard key={driver.id} driver={driver} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No drivers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
