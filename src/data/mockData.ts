import { Item, Category, User, ExchangeProposal, RentalBooking, ChatConversation } from '../types';

export const DEMO_USERS: User[] = [];

export const CATEGORIES: Category[] = [
  {
    id: 'tools',
    name: 'Power & Hand Tools',
    description: 'Drills, saws, pressure washers, sanders, and lawn equipment',
    iconName: 'Wrench',
    itemCount: 0,
    popularItems: ['Cordless Drill', 'Miter Saw', 'Pressure Washer', 'Orbital Sander']
  },
  {
    id: 'cameras',
    name: 'Cameras & AV Gear',
    description: 'Mirrorless cameras, prime lenses, drones, studio lighting, and audio mics',
    iconName: 'Camera',
    itemCount: 0,
    popularItems: ['Mirrorless Camera', 'Drone', 'Wireless Mic', 'Gimbal']
  },
  {
    id: 'mobility',
    name: 'Bikes & Mobility',
    description: 'Road bikes, cargo e-bikes, electric scooters, and car racks',
    iconName: 'Bike',
    itemCount: 0,
    popularItems: ['Gravel Bike', 'Cargo E-Bike', 'Bike Rack', 'Electric Scooter']
  },
  {
    id: 'outdoors',
    name: 'Outdoor & Camping',
    description: 'Tents, sleeping pads, roof boxes, kayaks, and portable coolers',
    iconName: 'Compass',
    itemCount: 0,
    popularItems: ['Camping Tent', 'Paddleboard', 'Cooler', 'Camp Stove']
  },
  {
    id: 'electronics',
    name: 'Electronics & Gaming',
    description: 'Consoles, VR headsets, projectors, speakers, and monitors',
    iconName: 'Gamepad2',
    itemCount: 0,
    popularItems: ['Console', 'VR Headset', 'Projector', 'PA Speaker']
  },
  {
    id: 'home',
    name: 'Home & Appliances',
    description: 'Carpet cleaners, sewing machines, ozone machines, and pasta makers',
    iconName: 'Home',
    itemCount: 0,
    popularItems: ['Carpet Extractor', 'Kitchen Stand Mixer', 'Steam Cleaner', 'Dehumidifier']
  },
  {
    id: 'music',
    name: 'Music & Instruments',
    description: 'Electric guitars, synthesizers, digital pianos, and amplifiers',
    iconName: 'Music',
    itemCount: 0,
    popularItems: ['Electric Guitar', 'Digital Piano', 'Audio Interface', 'Synth']
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    description: 'Adjustable dumbbells, ski gear, surfboards, and golf club sets',
    iconName: 'Activity',
    itemCount: 0,
    popularItems: ['Dumbbell Set', 'Snowboard', 'Surfboard', 'Golf Clubs']
  }
];

// Empty by default: Only real items uploaded by authorized users in Firebase database are shown
export const INITIAL_ITEMS: Item[] = [];


// Empty by default: Only real exchange proposals initiated by authorized users
export const INITIAL_EXCHANGE_PROPOSALS: ExchangeProposal[] = [];

// Empty by default: Only real bookings placed by authorized users
export const INITIAL_RENTAL_BOOKINGS: RentalBooking[] = [];

// Empty by default: Only real conversations initiated by authorized users
export const INITIAL_CONVERSATIONS: ChatConversation[] = [];

export const CITIES = [
  'Brooklyn, NY',
  'Manhattan, NY',
  'Queens, NY',
  'Austin, TX',
  'Seattle, WA',
  'Portland, OR',
  'Denver, CO',
  'San Francisco, CA',
  'Chicago, IL',
  'London, UK'
];

export const SAMPLE_PHOTO_LIBRARY: { label: string; url: string }[] = [];
