
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface SignupFormProps {
  redirectUrl?: string;
  preselectedRole?: "driver" | "customer";
}

const SignupForm = ({ redirectUrl, preselectedRole }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: preselectedRole || "customer",
    vehicleType: "",
    plateNumber: "",
    companyName: "",
  });
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: "driver" | "customer") => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate additional fields for driver
    if (formData.role === "driver" && (!formData.vehicleType || !formData.plateNumber)) {
      toast.error("Please provide vehicle information");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        ...formData,
        // Add driver specific fields only if role is driver
        ...(formData.role === "driver" ? {
          experienceYears: 0,
          totalKilometers: 0,
          languages: ["English"],
        } : {})
      };
      
      const success = await signup(userData, password);
      
      if (success) {
        // Navigate to the redirect URL or home page
        navigate(redirectUrl || "/");
        
        // If driver, show notification about verification
        if (formData.role === "driver") {
          toast.info("Your driver account is pending verification. You'll be notified when verified.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join LOADLOOP to connect with drivers and businesses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>I am a</Label>
            <RadioGroup 
              defaultValue={formData.role} 
              className="flex gap-4"
              onValueChange={(value) => handleRoleChange(value as "driver" | "customer")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer">Customer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="driver" id="driver" />
                <Label htmlFor="driver">Driver</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.role === "customer" && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
          )}
          
          {formData.role === "driver" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input
                  id="vehicleType"
                  name="vehicleType"
                  placeholder="E.g., Heavy Truck, Light Truck"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plateNumber">License Plate Number</Label>
                <Input
                  id="plateNumber"
                  name="plateNumber"
                  placeholder="E.g., TN-01-AB-1234"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-loadloop-blue hover:underline">
            Log in
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
