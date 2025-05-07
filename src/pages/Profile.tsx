
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoutes } from "@/context/RouteContext"; 
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, TruckIcon, UserIcon } from "lucide-react";
import RouteCard from "@/components/routes/RouteCard";
import { Driver } from "@/lib/types";

const Profile = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { getRoutesByDriver } = useRoutes();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"routes" | "profile">("profile");
  
  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    navigate("/login?redirectTo=/profile");
    return null;
  }
  
  const userRoutes = currentUser.role === "driver" 
    ? getRoutesByDriver(currentUser.id)
    : [];
    
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");
    
  const isDriver = currentUser.role === "driver";
  const driver = currentUser as Driver;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 font-poppins">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold">{currentUser.name}</h2>
              
              <div className="flex items-center mt-2">
                {isDriver ? (
                  <>
                    <TruckIcon className="mr-2 text-muted-foreground" size={16} />
                    <span>Driver</span>
                    {driver.verified && (
                      <BadgeCheck className="ml-2 text-loadloop-blue" size={16} />
                    )}
                  </>
                ) : (
                  <>
                    <UserIcon className="mr-2 text-muted-foreground" size={16} />
                    <span>Customer</span>
                  </>
                )}
              </div>
              
              <div className="w-full mt-6">
                <Button 
                  variant="outline" 
                  className="w-full mb-3"
                  onClick={() => setTab("profile")}
                >
                  Profile Details
                </Button>
                
                {isDriver && (
                  <Button 
                    variant="outline" 
                    className="w-full mb-3"
                    onClick={() => setTab("routes")}
                  >
                    My Routes
                  </Button>
                )}
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-4" 
                  onClick={logout}
                >
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          {tab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{currentUser.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{currentUser.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium capitalize">{currentUser.role}</p>
                  </div>
                  
                  {isDriver && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle Type</p>
                        <p className="font-medium">{driver.vehicleType}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">License Plate</p>
                        <p className="font-medium">{driver.plateNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-medium">{driver.experienceYears} years</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Total Distance</p>
                        <p className="font-medium">{driver.totalKilometers.toLocaleString()} km</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Languages</p>
                        <p className="font-medium">{driver.languages.join(", ")}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Verification Status</p>
                        <div className="flex items-center">
                          {driver.verified ? (
                            <>
                              <BadgeCheck className="mr-1 text-loadloop-blue" size={16} />
                              <span className="font-medium">Verified</span>
                            </>
                          ) : (
                            <span className="font-medium text-amber-500">Pending Verification</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <Button className="mt-6">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          )}
          
          {tab === "routes" && isDriver && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Routes</h2>
                <Button 
                  onClick={() => navigate("/post-route")} 
                  className="bg-loadloop-blue hover:bg-loadloop-darkBlue"
                >
                  Post New Route
                </Button>
              </div>
              
              {userRoutes.length > 0 ? (
                userRoutes.map(route => (
                  <RouteCard key={route.id} route={route} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">You haven't posted any routes yet</p>
                    <Button 
                      onClick={() => navigate("/post-route")} 
                      className="bg-loadloop-blue hover:bg-loadloop-darkBlue"
                    >
                      Post Your First Route
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
