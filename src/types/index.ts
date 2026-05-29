export type UserRole = 'general' | 'donor' | 'ngo';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  city?: string;
  organizationName?: string;
  verified?: boolean;
  createdAt: number;
  photoURL?: string;
}

export type BhandaraType = 'festival' | 'temple' | 'wedding' | 'private' | 'other';
export type FoodStatus = 'available' | 'booked' | 'collected' | 'expired';

export interface FoodItem {
  name: string;
  quantity: string;
  isVeg: boolean;
}

export interface Bhandara {
  id: string;
  title: string;
  description: string;
  type: BhandaraType;
  donorId: string;
  donorName: string;
  donorPhone?: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  foodItems: FoodItem[];
  servings: number;
  availableFrom: number;
  availableTill: number;
  status: FoodStatus;
  isPublic: boolean;
  bookedBy?: string;
  bookedByName?: string;
  bookedAt?: number;
  festivalName?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'collected' | 'cancelled';

export interface Booking {
  id: string;
  bhandaraId: string;
  ngoId: string;
  ngoName: string;
  status: BookingStatus;
  createdAt: number;
  collectedAt?: number;
  notes?: string;
}

export const MAHARASHTRA_CITIES = [
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad',
  'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Ratnagiri',
  'Thane', 'Navi Mumbai', 'Vasai-Virar', 'Ahmednagar', 'Jalgaon',
  'Akola', 'Latur', 'Dhule', 'Amravati', 'Chandrapur',
  'Yavatmal', 'Osmanabad', 'Nanded', 'Buldhana', 'Wardha',
  'Shirdi', 'Pandharpur', 'Trimbakeshwar', 'Alandi', 'Jejuri'
] as const;

export type MaharashtraCity = typeof MAHARASHTRA_CITIES[number];

export const FESTIVAL_NAMES = [
  'Ganesh Chaturthi', 'Navratri', 'Diwali', 'Holi', 'Ram Navami',
  'Hanuman Jayanti', 'Durga Puja', 'Dussehra', 'Makar Sankranti',
  'Gudi Padwa', 'Akshay Tritiya', 'Krishna Janmashtami',
  'Mahashivratri', 'Buddha Purnima', 'Ambedkar Jayanti',
  'Temple Prasadam', 'Weekly Bhandara', 'Monthly Bhandara', 'Other'
] as const;
