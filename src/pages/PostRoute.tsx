
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRoutes } from "@/context/RouteContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TruckIcon, CalendarIcon } from "lucide-react";

const PostRoute = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { addRoute } = useRoutes();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    capacity: "",
    vehicleType: currentUser?.role === "driver" ? (currentUser as any).vehicleType || "" : ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      // Redirect to login page with redirect URL back to post route
      toast.info("Please log in as a driver to post a route");
      navigate("/login?redirectTo=/post-route");
      return;
    }
    
    // Check if user is a driver
    if (currentUser?.role !== "driver") {
      toast.error("Only drivers can post routes");
      return;
    }
    
    // Validate form
    if (!formData.origin || !formData.destination || !formData.date || !formData.capacity || !formData.vehicleType) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await addRoute({
        driverId: currentUser.id,
        ...formData
      });
      
      if (success) {
        toast.success("Route posted successfully!");
        navigate("/search");
      }
    } catch (error) {
      console.error("Error posting route:", error);
      toast.error("Failed to post route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is a driver but not verified
  const isUnverifiedDriver = currentUser?.role === "driver" && !(currentUser as any).verified;
  
  if (isUnverifiedDriver) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Account Verification Required</CardTitle>
            <CardDescription>
              Your driver account is pending verification. You'll be able to post routes once your account is verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We typically verify accounts within 24-48 hours. You'll receive an email notification once your account is verified.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Post a Return Trip</CardTitle>
          <CardDescription>
            Let customers know about your available route and truck capacity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin Location</Label>
                <Input
                  id="origin"
                  name="origin"
                  placeholder="e.g. Mumbai"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  placeholder="e.g. Pune"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Departure Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity Available</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  placeholder="e.g. 20 tons"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <div className="relative">
                  <TruckIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vehicleType"
                    name="vehicleType"
                    placeholder="e.g. Heavy Truck"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-loadloop-blue hover:bg-loadloop-darkBlue mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Route"}
            </Button>
            
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                You'll need to log in as a driver before posting a route
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostRoute;
