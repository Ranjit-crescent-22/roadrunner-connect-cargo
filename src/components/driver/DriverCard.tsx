import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Phone, Mail, TruckIcon } from "lucide-react";
import { Driver } from "@/lib/types";
import { Link } from "react-router-dom";
import { getDriverImage, getTruckImage } from "@/lib/imageUtils";

interface DriverCardProps {
  driver: Driver;
}

const DriverCard = ({ driver }: DriverCardProps) => {
  const initials = driver.name
    .split(" ")
    .map((n) => n[0])
    .join("");
    
  // Get driver and truck images based on driver ID for consistency
  const driverPhotoUrl = driver.driverPhoto || getDriverImage(driver.id);
  const truckImageUrl = driver.truckImage || getTruckImage(driver.id);

  return (
    <Card className="card-hover border border-border bg-card mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={driverPhotoUrl} alt={driver.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{driver.name}</h3>
              {driver.verified && (
                <BadgeCheck className="ml-2 text-loadloop-blue" size={18} />
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TruckIcon className="mr-1" size={16} />
              {driver.vehicleType} • {driver.plateNumber}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-md overflow-hidden h-32">
          <img 
            src={truckImageUrl}
            alt={`${driver.name}'s truck`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/600x300?text=No+Truck+Image';
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-sm font-medium">Experience</p>
            <p className="text-sm">{driver.experienceYears} years</p>
          </div>
          <div>
            <p className="text-sm font-medium">Total Distance</p>
            <p className="text-sm">{driver.totalKilometers.toLocaleString()} km</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link to={`/driver/${driver.id}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">View Profile</Button>
          </Link>
          <Link to={`/contact/${driver.id}`} className="w-full sm:w-auto">
            <Button className="w-full bg-loadloop-blue hover:bg-loadloop-darkBlue">Contact</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverCard;
