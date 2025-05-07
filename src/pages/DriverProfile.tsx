import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRoutes } from "@/context/RouteContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Phone, Mail, TruckIcon, MapPin, Star, Calendar, Image } from "lucide-react";
import { Driver } from "@/lib/types";
import RouteCard from "@/components/routes/RouteCard";

const DriverProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { getUsers, isAuthenticated } = useAuth();
  const { getRoutesByDriver } = useRoutes();
  const [tab, setTab] = useState<"routes" | "reviews">("routes");
  
  const users = getUsers();
  const driver = users.find(user => user.id === id) as Driver | undefined;
  
  const driverRoutes = id ? getRoutesByDriver(id) : [];
  
  if (!driver) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Driver Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The driver profile you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/drivers">
          <Button variant="outline">Browse All Drivers</Button>
        </Link>
      </div>
    );
  }
  
  const initials = driver.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Mock reviews for the driver
  const mockReviews = [
    {
      id: "1",
      name: "Jane Smith",
      rating: 5,
      date: "2025-03-15",
      comment: "Very reliable and professional driver. Delivered on time and kept me updated throughout the journey."
    },
    {
      id: "2",
      name: "Robert Johnson",
      rating: 4,
      date: "2025-02-28",
      comment: "Good service, arrived a bit later than expected but communicated well."
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Driver Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and basic info */}
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={driver.driverPhoto} alt={driver.name} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              {driver.verified && (
                <div className="flex items-center mt-3 text-sm text-loadloop-blue">
                  <BadgeCheck className="mr-1" size={16} />
                  <span>Verified Driver</span>
                </div>
              )}
            </div>
            
            {/* Driver info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{driver.name}</h1>
              
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-3">
                <div className="flex items-center justify-center md:justify-start">
                  <TruckIcon className="mr-2 text-muted-foreground" size={18} />
                  <span>{driver.vehicleType}</span>
                </div>
                <div className="text-muted-foreground">
                  {driver.plateNumber}
                </div>
              </div>
              
              {/* Experience metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="p-3 bg-muted/30 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-lg font-semibold">{driver.experienceYears} years</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Total Distance</p>
                  <p className="text-lg font-semibold">{driver.totalKilometers.toLocaleString()} km</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Languages</p>
                  <p className="text-lg font-semibold">{driver.languages.join(', ')}</p>
                </div>
              </div>
            </div>
            
            {/* Contact details */}
            <div className="w-full md:w-auto flex flex-col gap-3">
              <Button className="bg-loadloop-blue hover:bg-loadloop-darkBlue">
                Contact Driver
              </Button>
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-muted-foreground" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-muted-foreground" />
                    <span>{driver.email}</span>
                  </div>
                </>
              ) : (
                <Link to={`/login?redirectTo=/driver/${driver.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log in to view contact details
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Truck Image Section */}
          {driver.truckImage && (
            <div className="mt-6 border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-2 flex items-center">
                <TruckIcon className="mr-2" size={18} />
                <span className="font-medium">Driver's Vehicle</span>
              </div>
              <div className="aspect-video relative overflow-hidden bg-muted/20">
                <img 
                  src={driver.truckImage} 
                  alt={`${driver.name}'s truck`} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/600x400?text=No+Truck+Image';
                  }}
                />
              </div>
            </div>
          )}
          
          {!driver.truckImage && (
            <div className="mt-6 border border-dashed border-border rounded-lg p-8 text-center text-muted-foreground bg-muted/10">
              <Image className="mx-auto mb-3" size={32} />
              <p>No truck image available</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-3 px-6 text-center ${
            tab === "routes" 
              ? "border-b-2 border-loadloop-blue text-loadloop-blue" 
              : "text-muted-foreground"
          }`}
          onClick={() => setTab("routes")}
        >
          Available Routes
        </button>
        <button
          className={`py-3 px-6 text-center ${
            tab === "reviews" 
              ? "border-b-2 border-loadloop-blue text-loadloop-blue" 
              : "text-muted-foreground"
          }`}
          onClick={() => setTab("reviews")}
        >
          Reviews
        </button>
      </div>
      
      {/* Tab Content */}
      {tab === "routes" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
          {driverRoutes.length > 0 ? (
            driverRoutes.map(route => (
              <RouteCard key={route.id} route={route} />
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">This driver has no available routes at the moment.</p>
            </div>
          )}
        </div>
      )}
      
      {tab === "reviews" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Customer Reviews</h2>
            <div className="flex items-center">
              <Star className="text-yellow-400 mr-1" fill="currentColor" size={20} />
              <span className="font-semibold">4.5</span>
              <span className="text-muted-foreground ml-1">({mockReviews.length})</span>
            </div>
          </div>
          
          {mockReviews.map(review => (
            <Card key={review.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between mb-2">
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" fill="currentColor" size={16} />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  <Calendar className="inline mr-1" size={14} /> 
                  {new Date(review.date).toLocaleDateString()}
                </p>
                <p>{review.comment}</p>
              </CardContent>
            </Card>
          ))}
          
          {mockReviews.length === 0 && (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">This driver has no reviews yet.</p>
            </div>
          )}
          
          <div className="mt-6">
            <Link to={isAuthenticated ? `/review/${driver.id}` : `/login?redirectTo=/review/${driver.id}`}>
              <Button>Leave a Review</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;
