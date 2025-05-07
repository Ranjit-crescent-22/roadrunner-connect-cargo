
import { createContext, useContext, useEffect, useState } from "react";
import { Route } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface RouteContextType {
  routes: Route[];
  addRoute: (route: Omit<Route, 'id'>) => Promise<boolean>;
  getRoutesByDriver: (driverId: string) => Route[];
  searchRoutes: (origin: string, destination: string) => Route[];
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

// Mock routes data
const mockRoutes: Route[] = [
  {
    id: "1",
    driverId: "1",
    origin: "Chennai",
    destination: "Bangalore",
    date: "2025-05-15",
    capacity: "20 tons",
    vehicleType: "Heavy Truck"
  },
  {
    id: "2",
    driverId: "1",
    origin: "Mumbai",
    destination: "Pune",
    date: "2025-05-18",
    capacity: "15 tons",
    vehicleType: "Heavy Truck"
  }
];

export const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const { currentUser } = useAuth();

  // Load routes data from localStorage on mount
  useEffect(() => {
    const storedRoutes = localStorage.getItem("loadloop-routes");
    if (storedRoutes) {
      setRoutes(JSON.parse(storedRoutes));
    } else {
      // Initialize with mock data if no routes exist
      localStorage.setItem("loadloop-routes", JSON.stringify(mockRoutes));
    }
  }, []);

  // Save routes to localStorage whenever they change
  useEffect(() => {
    if (routes.length > 0) {
      localStorage.setItem("loadloop-routes", JSON.stringify(routes));
    }
  }, [routes]);

  const addRoute = async (routeData: Omit<Route, 'id'>) => {
    try {
      if (!currentUser || currentUser.role !== "driver") {
        toast.error("Only verified drivers can post routes");
        return false;
      }

      // Check if driver is verified 
      if (currentUser.role === "driver" && !currentUser.verified) {
        toast.error("Your account needs to be verified before posting routes");
        return false;
      }

      // Create new route
      const newRouteId = `route_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newRoute: Route = {
        id: newRouteId,
        ...routeData
      };

      // Add new route to routes array
      setRoutes(prevRoutes => [...prevRoutes, newRoute]);
      
      toast.success("Route posted successfully!");
      return true;
    } catch (error) {
      console.error("Route posting error:", error);
      toast.error("Failed to post route. Please try again.");
      return false;
    }
  };

  const getRoutesByDriver = (driverId: string) => {
    return routes.filter(route => route.driverId === driverId);
  };

  const searchRoutes = (origin: string, destination: string) => {
    if (!origin && !destination) return routes;

    return routes.filter(route => {
      const originMatch = !origin || route.origin.toLowerCase().includes(origin.toLowerCase());
      const destMatch = !destination || route.destination.toLowerCase().includes(destination.toLowerCase());
      return originMatch && destMatch;
    });
  };

  return (
    <RouteContext.Provider value={{ 
      routes, 
      addRoute, 
      getRoutesByDriver,
      searchRoutes
    }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoutes = () => {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error("useRoutes must be used within a RouteProvider");
  }
  return context;
};
