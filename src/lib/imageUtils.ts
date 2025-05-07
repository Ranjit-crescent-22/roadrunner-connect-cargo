
// Array of Indian driver profile images
const driverImages = [
  "https://images.unsplash.com/photo-1621353269062-6aa0132c11c7?w=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1589411454940-67a017535ecf?w=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1619533394727-57d522857f89?w=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&fit=crop&q=80",
];

// Array of Indian truck images
const truckImages = [
  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563210205-479cc126b4bd?w=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1485575301924-6891ef935dcd?w=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602726428221-9af5b227ed5d?w=600&fit=crop&q=80",
];

/**
 * Get a random image from an array
 */
export const getRandomImage = (images: string[]): string => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

/**
 * Get a random driver profile image
 */
export const getRandomDriverImage = (): string => {
  return getRandomImage(driverImages);
};

/**
 * Get a random truck image
 */
export const getRandomTruckImage = (): string => {
  return getRandomImage(truckImages);
};

/**
 * Get a consistent driver image based on driver ID
 * This ensures the same driver always gets the same image
 */
export const getDriverImage = (driverId: string): string => {
  const index = parseInt(driverId.replace(/[^\d]/g, '')) % driverImages.length;
  return driverImages[index] || driverImages[0];
};

/**
 * Get a consistent truck image based on driver ID
 * This ensures the same driver always gets the same truck image
 */
export const getTruckImage = (driverId: string): string => {
  const index = parseInt(driverId.replace(/[^\d]/g, '')) % truckImages.length;
  return truckImages[index] || truckImages[0];
};
