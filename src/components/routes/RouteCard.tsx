
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TruckIcon, CalendarIcon } from "lucide-react";
import { Route } from "@/lib/types";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RouteCardProps {
  route: Route;
}

const RouteCard = ({ route }: RouteCardProps) => {
  const { getUsers } = useAuth();
  const users = getUsers();
  const driver = users.find(user => user.id === route.driverId);
  
  return (
    <Card className="card-hover border border-border bg-card mb-4">
      <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between">
        <div>
          <div className="flex items-center text-lg font-semibold mb-1">
            {route.origin} <ArrowRight className="mx-2 text-loadloop-blue" size={18} /> {route.destination}
          </div>
          <div className="text-sm text-muted-foreground">
            Driver: {driver?.name || "Unknown"}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-2 sm:mt-0">
          <CalendarIcon className="mr-1" size={16} />
          {new Date(route.date).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <TruckIcon className="mr-2 text-loadloop-blue" size={16} />
            <span>{route.vehicleType}</span>
          </div>
          <div>
            <span className="font-medium">Capacity:</span> {route.capacity}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link to={`/driver/${route.driverId}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">View Driver Profile</Button>
          </Link>
          <Link to={`/contact/${route.driverId}`} className="w-full sm:w-auto">
            <Button className="w-full bg-loadloop-blue hover:bg-loadloop-darkBlue">Contact</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteCard;
