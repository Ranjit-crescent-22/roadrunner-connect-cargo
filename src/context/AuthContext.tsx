
import { createContext, useContext, useEffect, useState } from "react";
import { User, Driver, Customer, UserType } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userDetails: Partial<User | Driver | Customer>, password: string) => Promise<boolean>;
  logout: () => void;
  getUsers: () => UserType[];
  getDrivers: () => Driver[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for users
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    role: "driver",
    verified: true,
    vehicleType: "Heavy Truck",
    plateNumber: "TN-01-AB-1234",
    experienceYears: 5,
    totalKilometers: 50000,
    languages: ["English", "Hindi", "Tamil"]
  } as Driver,
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543210",
    role: "customer",
    companyName: "Smith Logistics"
  } as Customer
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("loadloop-users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with mock data if no users exist
      localStorage.setItem("loadloop-users", JSON.stringify(mockUsers));
    }

    const storedUser = localStorage.getItem("loadloop-current-user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("loadloop-users", JSON.stringify(users));
    }
  }, [users]);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you'd validate password hash against stored hash
      // For this MVP, we'll just check if the user exists by email
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // Simulate password validation (in real app, would compare hashes)
        // In this mock, we're assuming all test accounts have "password123"
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("loadloop-current-user", JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (userDetails: Partial<User | Driver | Customer>, password: string) => {
    try {
      // Check if user with email already exists
      const existingUser = users.find(u => u.email.toLowerCase() === userDetails.email?.toLowerCase());
      
      if (existingUser) {
        toast.error("An account with this email already exists");
        return false;
      }
      
      // Create new user
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newUser: UserType = {
        id: newUserId,
        name: userDetails.name || "",
        email: userDetails.email || "",
        phone: userDetails.phone || "",
        role: userDetails.role || "customer",
        ...userDetails,
        // If driver, set verified to false by default
        ...(userDetails.role === "driver" ? { verified: false } : {})
      };
      
      // Add new user to users array
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      // Log in the new user
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("loadloop-current-user", JSON.stringify(newUser));
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("loadloop-current-user");
    toast.info("You have been logged out");
  };

  const getUsers = () => users;
  
  const getDrivers = () => users.filter(user => user.role === "driver") as Driver[];

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      getUsers,
      getDrivers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
