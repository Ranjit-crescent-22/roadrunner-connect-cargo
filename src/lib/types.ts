
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver' | 'customer';
  verified?: boolean;
}

export interface Driver extends User {
  role: 'driver';
  vehicleType: string;
  plateNumber: string;
  experienceYears: number;
  totalKilometers: number;
  languages: string[];
  truckImage?: string;
  driverPhoto?: string;
}

export interface Customer extends User {
  role: 'customer';
  companyName?: string;
}

export interface Route {
  id: string;
  driverId: string;
  origin: string;
  destination: string;
  date: string;
  capacity: string;
  vehicleType: string;
}

export interface Review {
  id: string;
  driverId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  date: string;
}

export type UserType = User | Driver | Customer;
