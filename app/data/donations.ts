export type DonationStatus = 'created' | 'accepted' | 'pickup_started' | 'in_transit' | 'delivered' | 'completed' | 'pending' | 'picked_up';
export type FoodType = 'veg' | 'non-veg' | 'both' | 'animal-feed';
export type RouteStopType = 'pickup' | 'hub' | 'transit' | 'delivery';
export type RouteStopStatus = 'reached' | 'current' | 'upcoming';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteStop {
  name: string;
  address: string;
  coordinates: Coordinates;
  type: RouteStopType;
  status: RouteStopStatus;
  arrivedAt?: string;
}

export interface Donation {
  id: string;
  donorName: string;
  contactPhone: string;
  address: string;
  coordinates: Coordinates;
  foodType: FoodType;
  quantity: string;
  preparedAt: string;
  description: string;
  status: DonationStatus;
  distance: string;
  claimedBy?: string;
  volunteer?: string;
  submittedAt: string;
  acceptedAt?: string;
  pickupStartedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  route?: RouteStop[];
}

export interface Recipient {
  id: string;
  name: string;
  type: 'old-age-home' | 'orphanage' | 'shelter' | 'animal-shelter';
  address: string;
  coordinates: Coordinates;
  capacity: number;
  contactPerson: string;
  phone: string;
  claimedDonations: string[];
  verified?: boolean;
}

export interface OldAgeHome {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  city: string;
  contactPerson?: string;
  phone?: string;
  capacity?: number;
  verified?: boolean;
}

export const donations: Donation[] = [
  {
    id: 'D001',
    donorName: 'Priya Sharma',
    contactPhone: '+91 98765 43210',
    address: '14, Rose Garden Colony, Koramangala, Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    foodType: 'veg',
    quantity: '25 kg (approx. 80 servings)',
    preparedAt: '2024-07-04T08:00:00',
    description: 'Freshly cooked biryani and dal from a wedding ceremony. Packed hygienically in food-grade containers.',
    status: 'pending',
    distance: '2.4 km',
    submittedAt: '2024-07-04T09:30:00',
  },
  {
    id: 'D002',
    donorName: 'Ramesh Mehta',
    contactPhone: '+91 87654 32109',
    address: '88, MG Road, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9716, lng: 77.6412 },
    foodType: 'both',
    quantity: '15 kg (approx. 50 servings)',
    preparedAt: '2024-07-04T07:30:00',
    description: 'Office canteen surplus — roti, sabzi, and chicken curry. All packed and ready for pickup.',
    status: 'in_transit',
    distance: '3.8 km',
    claimedBy: 'Meenakshi college',
    volunteer: 'Arjun Nair',
    submittedAt: '2024-07-04T08:00:00',
    acceptedAt: '2024-07-04T09:00:00',
    pickupStartedAt: '2024-07-04T10:00:00',
    pickedUpAt: '2024-07-04T10:15:00',
  },
  {
    id: 'D003',
    donorName: 'Lakshmi Krishnan',
    contactPhone: '+91 76543 21098',
    address: '5, Gandhi Nagar, Jayanagar, Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.5948 },
    foodType: 'veg',
    quantity: '10 kg (approx. 35 servings)',
    preparedAt: '2024-07-03T18:00:00',
    description: 'Home celebration food – sambar rice, rasam and papad. Still fresh.',
    status: 'completed',
    distance: '1.1 km',
    claimedBy: 'Seva Orphanage',
    volunteer: 'Meera Pillai',
    submittedAt: '2024-07-03T19:00:00',
    acceptedAt: '2024-07-03T19:30:00',
    pickupStartedAt: '2024-07-03T19:45:00',
    pickedUpAt: '2024-07-03T20:00:00',
    deliveredAt: '2024-07-03T21:00:00',
    completedAt: '2024-07-03T21:15:00',
  },
  {
    id: 'D004',
    donorName: 'Tech Mahindra Cafeteria',
    contactPhone: '+91 80 1234 5678',
    address: 'Tech Mahindra Office, ITPL Main Road, Whitefield, Bengaluru',
    coordinates: { lat: 12.9698, lng: 77.6995 },
    foodType: 'both',
    quantity: '40 kg (approx. 140 servings)',
    preparedAt: '2024-07-04T12:00:00',
    description: 'Large corporate lunch surplus. Mixed veg and non-veg dishes, well packaged.',
    status: 'pending',
    distance: '6.2 km',
    submittedAt: '2024-07-04T13:00:00',
  },
  {
    id: 'D006',
    donorName: 'Green Farms Produce',
    contactPhone: '+91 98112 67890',
    address: '22, Outer Ring Road, Bellandur, Bengaluru',
    coordinates: { lat: 12.9576, lng: 77.6864 },
    foodType: 'animal-feed',
    quantity: '30 kg (vegetables, grains & cooked rice)',
    preparedAt: '2024-07-04T10:00:00',
    description: 'Surplus vegetables, stale bread, cooked rice, and grain mix — safe and nutritious feed for animals. Coordinated with local animal shelter.',
    status: 'in_transit',
    distance: '3.1 km',
    claimedBy: 'Paws & Care Animal Shelter',
    volunteer: 'Divya Menon',
    submittedAt: '2024-07-04T10:30:00',
    acceptedAt: '2024-07-04T11:00:00',
    pickupStartedAt: '2024-07-04T11:30:00',
    pickedUpAt: '2024-07-04T11:45:00',
  },
  {
    id: 'D007',
    donorName: 'Saravana Bhavan, T.Nagar',
    contactPhone: '+91 44 2433 4545',
    address: '21, Usman Road, T. Nagar, Chennai – 600 017',
    coordinates: { lat: 13.0396, lng: 80.2282 },
    foodType: 'veg',
    quantity: '35 kg (approx. 120 servings)',
    preparedAt: '2024-07-04T09:00:00',
    description: 'Surplus idli, sambar, and pongal from morning service. Freshly prepared and hygienically packed in food-grade containers.',
    status: 'pending',
    distance: '3.2 km',
    submittedAt: '2024-07-04T09:45:00',
    route: [
      { name: 'Saravana Bhavan, T.Nagar', address: '21, Usman Road, T. Nagar, Chennai – 600 017', coordinates: { lat: 13.0396, lng: 80.2282 }, type: 'pickup', status: 'reached', arrivedAt: '2024-07-04T09:45:00' },
      { name: 'FoodEx Hub – T.Nagar', address: '14, Pondy Bazaar, T. Nagar, Chennai – 600 017', coordinates: { lat: 13.0347, lng: 80.2308 }, type: 'hub', status: 'current' },
      { name: 'Kodambakkam Transit Point', address: 'Near Vadapalani Signal, Kodambakkam, Chennai – 600 026', coordinates: { lat: 13.0227, lng: 80.2165 }, type: 'transit', status: 'upcoming' },
      { name: 'Ekta Old Age Home', address: '7, 4th Main Road, Anna Nagar, Chennai – 600 040', coordinates: { lat: 13.0852, lng: 80.2109 }, type: 'delivery', status: 'upcoming' },
    ],
  },
  {
    id: 'D008',
    donorName: 'Kavin Events & Catering',
    contactPhone: '+91 98412 56789',
    address: '5, Khader Nawaz Khan Road, Nungambakkam, Chennai – 600 006',
    coordinates: { lat: 13.0505, lng: 80.2452 },
    foodType: 'both',
    quantity: '50 kg (approx. 170 servings)',
    preparedAt: '2024-07-04T11:00:00',
    description: 'Corporate event catering surplus — biryani, kurma, and payasam. Well packed and labelled with preparation time.',
    status: 'in_transit',
    distance: '5.7 km',
    claimedBy: 'Little Stars Orphanage',
    volunteer: 'Karthik Rajan',
    submittedAt: '2024-07-04T11:30:00',
    acceptedAt: '2024-07-04T12:00:00',
    pickupStartedAt: '2024-07-04T12:15:00',
    pickedUpAt: '2024-07-04T12:30:00',
    route: [
      { name: 'Kavin Events, Nungambakkam', address: '5, Khader Nawaz Khan Road, Nungambakkam, Chennai – 600 006', coordinates: { lat: 13.0505, lng: 80.2452 }, type: 'pickup', status: 'reached', arrivedAt: '2024-07-04T12:30:00' },
      { name: 'FoodEx Hub – Teynampet', address: '3, Cenotaph Road, Teynampet, Chennai – 600 018', coordinates: { lat: 13.0357, lng: 80.2611 }, type: 'hub', status: 'reached', arrivedAt: '2024-07-04T13:00:00' },
      { name: 'Mylapore Transit Point', address: 'Near Kapaleeshwarar Temple, Mylapore, Chennai – 600 004', coordinates: { lat: 13.0356, lng: 80.2705 }, type: 'transit', status: 'current' },
      { name: 'Adyar Checkpoint', address: 'Lattice Bridge Road, Adyar, Chennai – 600 020', coordinates: { lat: 13.0097, lng: 80.2484 }, type: 'transit', status: 'upcoming' },
      { name: 'Little Stars Orphanage', address: '12, Gandhi Nagar, Adyar, Chennai – 600 020', coordinates: { lat: 13.0066, lng: 80.2463 }, type: 'delivery', status: 'upcoming' },
    ],
  },
  {
    id: 'D009',
    donorName: 'IIT Madras Mess',
    contactPhone: '+91 44 2257 8000',
    address: 'IIT Madras Campus, Sardar Patel Road, Guindy, Chennai – 600 036',
    coordinates: { lat: 12.9914, lng: 80.2329 },
    foodType: 'veg',
    quantity: '20 kg (approx. 70 servings)',
    preparedAt: '2024-07-03T13:00:00',
    description: 'Mess surplus — rice, dal fry, vegetable curry. Nutritious and freshly cooked campus food.',
    status: 'completed',
    distance: '4.1 km',
    claimedBy: 'Street Paws Rescue',
    volunteer: 'Sneha Balaji',
    submittedAt: '2024-07-03T13:30:00',
    acceptedAt: '2024-07-03T13:45:00',
    pickupStartedAt: '2024-07-03T13:50:00',
    pickedUpAt: '2024-07-03T14:00:00',
    deliveredAt: '2024-07-03T15:30:00',
    completedAt: '2024-07-03T15:45:00',
    route: [
      { name: 'IIT Madras Mess', address: 'IIT Madras Campus, Sardar Patel Road, Guindy, Chennai – 600 036', coordinates: { lat: 12.9914, lng: 80.2329 }, type: 'pickup', status: 'reached', arrivedAt: '2024-07-03T14:00:00' },
      { name: 'FoodEx Hub – Guindy', address: '18, Mount Poonamallee Road, Guindy, Chennai – 600 032', coordinates: { lat: 12.9865, lng: 80.2273 }, type: 'hub', status: 'reached', arrivedAt: '2024-07-03T14:30:00' },
      { name: 'Velachery Transit', address: 'Velachery Main Road, Velachery, Chennai – 600 042', coordinates: { lat: 12.9695, lng: 80.2325 }, type: 'transit', status: 'reached', arrivedAt: '2024-07-03T15:00:00' },
      { name: 'Street Paws Rescue', address: '9, 100 Feet Road, Velachery, Chennai – 600 042', coordinates: { lat: 12.9657, lng: 80.2369 }, type: 'delivery', status: 'reached', arrivedAt: '2024-07-03T15:30:00' },
    ],
  },
  {
    id: 'D005',
    donorName: 'Hotel Grand Pavilion',
    contactPhone: '+91 80 9876 5432',
    address: 'No. 1, Brigade Road, Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.5960 },
    foodType: 'veg',
    quantity: '60 kg (approx. 200 servings)',
    preparedAt: '2024-07-04T11:00:00',
    description: 'Conference buffet leftovers — paneer dishes, rice, and desserts. Still warm.',
    status: 'pickup_started',
    distance: '4.5 km',
    claimedBy: 'Hope Old Age Home',
    volunteer: 'Suresh Kumar',
    submittedAt: '2024-07-04T11:30:00',
    acceptedAt: '2024-07-04T12:00:00',
    pickupStartedAt: '2024-07-04T12:30:00',
    pickedUpAt: '2024-07-04T12:45:00',
  },
];

export const recipients: Recipient[] = [
  {
    id: 'R001',
    name: 'Meenakshi college',
    type: 'old-age-home',
    address: 'Arcot road, Kodambakkam, Chennai – 600 024',
    coordinates: { lat: 13.0227, lng: 80.2165 },
    capacity: 60,
    contactPerson: 'Mrs. Savitha Rao',
    phone: '+91 9962430880',
    claimedDonations: ['D002'],
    verified: true,
  },
  {
    id: 'R005',
    name: 'Ekta Old Age Home',
    type: 'old-age-home',
    address: '7, 4th Main Road, Anna Nagar, Chennai – 600 040',
    coordinates: { lat: 13.0852, lng: 80.2109 },
    capacity: 55,
    contactPerson: 'Mrs. Jayalakshmi Narayanan',
    phone: '+91 44 2626 8890',
    claimedDonations: [],
    verified: true,
  },
  {
    id: 'R006',
    name: 'Little Stars Orphanage',
    type: 'orphanage',
    address: '12, Gandhi Nagar, Adyar, Chennai – 600 020',
    coordinates: { lat: 13.0066, lng: 80.2463 },
    capacity: 65,
    contactPerson: 'Mr. Sridhar Venkatesh',
    phone: '+91 44 2491 3322',
    claimedDonations: ['D008'],
    verified: true,
  },
  {
    id: 'R007',
    name: 'Street Paws Rescue',
    type: 'animal-shelter',
    address: '9, 100 Feet Road, Velachery, Chennai – 600 042',
    coordinates: { lat: 13.0657, lng: 80.2369 },
    capacity: 80,
    contactPerson: 'Ms. Preethi Anand',
    phone: '+91 98430 12345',
    claimedDonations: ['D009'],
    verified: true,
  },
  {
    id: 'R002',
    name: 'Seva Orphanage',
    type: 'orphanage',
    address: '34, Children Colony, JP Nagar, Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.5900 },
    capacity: 80,
    contactPerson: 'Mr. Thomas George',
    phone: '+91 80 3456 7890',
    claimedDonations: ['D003'],
    verified: true,
  },
  {
    id: 'R004',
    name: 'Paws & Care Animal Shelter',
    type: 'animal-shelter',
    address: '22, Sarjapur Road, Carmelaram, Bengaluru',
    coordinates: { lat: 12.9420, lng: 77.6798 },
    capacity: 120,
    contactPerson: 'Ms. Anita Bose',
    phone: '+91 80 7654 3210',
    claimedDonations: ['D006'],
    verified: true,
  },
  {
    id: 'R003',
    name: 'Hope Old Age Home',
    type: 'old-age-home',
    address: '7, Rainbow Road, Basavanagudi, Bengaluru',
    coordinates: { lat: 12.9500, lng: 77.5750 },
    capacity: 45,
    contactPerson: 'Dr. Padma Venkat',
    phone: '+91 80 4567 8901',
    claimedDonations: ['D005'],
    verified: true,
  },
];

export const oldAgeHomes: OldAgeHome[] = [
  {
    id: 'OAH-001',
    name: 'Brindavanam Old Age Home',
    address: 'Tambaram, Chennai',
    coordinates: { lat: 12.9216, lng: 80.1270 },
    city: 'Chennai',
    phone: '+91 44 2243 7890',
    capacity: 50,
    verified: true,
  },
  {
    id: 'OAH-002',
    name: 'Akshaya Trust - Valasaravakkam',
    address: 'Valasaravakkam, Chennai',
    coordinates: { lat: 13.0109, lng: 80.1657 },
    city: 'Chennai',
    phone: '+91 44 2450 3210',
    capacity: 60,
    verified: true,
  },
  {
    id: 'OAH-003',
    name: 'Natchathira Retirement Luxury Old Age Home',
    address: 'Kilpauk, Chennai',
    coordinates: { lat: 13.0657, lng: 80.2437 },
    city: 'Chennai',
    phone: '+91 44 2819 8765',
    capacity: 40,
    verified: true,
  },
  {
    id: 'OAH-004',
    name: 'Akshaya Trust - Pallikaranai',
    address: 'Pallikaranai, Chennai',
    coordinates: { lat: 12.8975, lng: 80.2103 },
    city: 'Chennai',
    phone: '+91 44 2697 5432',
    capacity: 55,
    verified: true,
  },
  {
    id: 'OAH-005',
    name: 'Idhaya Vaasal Elders Home',
    address: 'Aarathy Trust, Chennai',
    coordinates: { lat: 13.0500, lng: 80.2300 },
    city: 'Chennai',
    phone: '+91 44 2345 6789',
    capacity: 45,
    verified: true,
  },
  {
    id: 'OAH-006',
    name: 'Athulya Senior Care – Pallavaram',
    address: 'Pallavaram, Chennai',
    coordinates: { lat: 12.9750, lng: 80.1650 },
    city: 'Chennai',
    phone: '+91 44 2765 4321',
    capacity: 50,
    verified: true,
  },
  {
    id: 'OAH-007',
    name: 'Kaikoduppom Old Age Home',
    address: 'Kaikoduppom, Chennai',
    coordinates: { lat: 13.0900, lng: 80.2450 },
    city: 'Chennai',
    phone: '+91 44 2890 1234',
    capacity: 55,
    verified: true,
  },
  {
    id: 'OAH-008',
    name: 'KIRUBAI OLD AGE HOME',
    address: 'Mylapore, Chennai',
    coordinates: { lat: 13.0356, lng: 80.2705 },
    city: 'Chennai',
    phone: '+91 44 2494 7890',
    capacity: 60,
    verified: true,
  },
  {
    id: 'OAH-009',
    name: 'Divine Senior Care',
    address: 'Anna Nagar, Chennai',
    coordinates: { lat: 13.0852, lng: 80.2109 },
    city: 'Chennai',
    phone: '+91 44 2626 5432',
    capacity: 50,
    verified: true,
  },
  {
    id: 'OAH-010',
    name: 'Geri Care Assisted Living',
    address: 'RA Puram, Chennai',
    coordinates: { lat: 13.0245, lng: 80.2670 },
    city: 'Chennai',
    phone: '+91 44 2493 2109',
    capacity: 45,
    verified: true,
  },
  {
    id: 'OAH-011',
    name: 'Oxford Senior Care - Mogappair',
    address: 'Mogappair, Chennai',
    coordinates: { lat: 13.1068, lng: 80.2107 },
    city: 'Chennai',
    phone: '+91 44 2696 8765',
    capacity: 55,
    verified: true,
  },
];

export const impactStats = {
  mealsServed: 12480,
  organizationsServed: 34,
  volunteersActive: 128,
  citiesCovered: 5,
  tonsRescued: 6.2,
};
