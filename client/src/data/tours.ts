import southportTourMap from '@assets/Southport Tour Map July 2025_1752252741987.webp';
import wilmingtonTourMap from '@assets/ILM Tours July 2025 no labels_1752254832578.png';

export interface Tour {
  id: string;
  name: string;
  duration: string;
  price: number;
  minPassengers: number;
  maxPassengers: number;
  maxWeight: number;
  type: 'helicopter' | 'airplane';
  description: string;
  location: 'southport' | 'st-simons' | 'wilmington';
  features: string[];
  image: string;
  routeColor?: string;
}

export const tours: Tour[] = [
  // Southport, NC Tours
  {
    id: 'southport-beach-lover',
    name: 'Beach Lover',
    duration: '20 minutes',
    price: 89,
    minPassengers: 2,
    maxPassengers: 3,
    maxWeight: 500,
    type: 'helicopter',
    description: 'Scenic coastal flight along beautiful beaches with stunning ocean views',
    location: 'southport',
    features: ['Coastal beaches', 'Ocean views', 'Perfect for first-timers'],
    image: 'https://flyhightide.com/_astro/high-tide-aviation-team-southport.Xj9jwjZu.jpg',
    routeColor: 'green'
  },
  {
    id: 'southport-oak-island',
    name: 'Oak Island',
    duration: '30 minutes',
    price: 125,
    minPassengers: 2,
    maxPassengers: 3,
    maxWeight: 500,
    type: 'helicopter',
    description: 'Explore Oak Island\'s pristine shores and historic sites from above',
    location: 'southport',
    features: ['Oak Island beaches', 'Historic sites', 'Pristine coastline'],
    image: 'https://flyhightide.com/_astro/HTA-map-southport.DWpsbb3K.jpg',
    routeColor: 'gray'
  },
  {
    id: 'southport-lighthouse',
    name: 'Lighthouse Tour',
    duration: '35 minutes',
    price: 145,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Historic lighthouse tour with stunning aerial views of Cape Fear',
    location: 'southport',
    features: ['Historic lighthouses', 'Cape Fear views', 'Aerial photography'],
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=400&fit=crop',
    routeColor: 'orange'
  },
  {
    id: 'southport-bald-head',
    name: 'Bald Head Island',
    duration: '45 minutes',
    price: 165,
    minPassengers: 2,
    maxPassengers: 3,
    maxWeight: 500,
    type: 'helicopter',
    description: 'Premium tour of Bald Head Island\'s natural beauty and wildlife',
    location: 'southport',
    features: ['Bald Head Island', 'Natural beauty', 'Wildlife viewing'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
    routeColor: 'yellow'
  },
  {
    id: 'southport-cape-fear',
    name: 'Cape Fear Passport',
    duration: '60 minutes',
    price: 225,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Complete Cape Fear region aerial adventure covering all highlights',
    location: 'southport',
    features: ['Complete Cape Fear region', 'All major highlights', 'Extended flight'],
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
    routeColor: 'purple'
  },
  // St Simons Island, GA Tours
  {
    id: 'st-simons-lighthouse',
    name: 'Lighthouse Tour',
    duration: '25 minutes',
    price: 95,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Historic St Simons lighthouse aerial tour with coastal views',
    location: 'st-simons',
    features: ['Historic lighthouse', 'Coastal views', 'St Simons Island'],
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=400&fit=crop',
    routeColor: 'blue'
  },
  {
    id: 'st-simons-jekyll',
    name: 'Jekyll Island',
    duration: '40 minutes',
    price: 155,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Scenic flight over Jekyll Island\'s natural wonders and beaches',
    location: 'st-simons',
    features: ['Jekyll Island', 'Natural wonders', 'Pristine beaches'],
    image: 'https://flyhightide.com/_astro/high-tide-helicopter-with-pilot-ready-to-takeoff.FFBadvWW.jpg',
    routeColor: 'green'
  },
  {
    id: 'st-simons-golden-isles',
    name: 'Golden Isles Passport',
    duration: '55 minutes',
    price: 195,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Complete Golden Isles aerial experience covering all major islands',
    location: 'st-simons',
    features: ['Complete Golden Isles', 'All major islands', 'Comprehensive tour'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
    routeColor: 'orange'
  },
  // Wilmington, NC Tours
  {
    id: 'wilmington-battleship-beach',
    name: 'Battleship to the Beach',
    duration: '20 minutes',
    price: 120,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Begin your journey with a bird\'s eye view of USS North Carolina, then soar over Wilmington to Wrightsville Beach. Cruise over the coastline past the US Coast Guard Station, the Crystal Pier, and Johnnie Mercers Pier. You may even spot dolphins and sea turtles in the clear blue waters!',
    location: 'wilmington',
    features: ['USS North Carolina', 'Wrightsville Beach', 'Crystal Pier', 'Johnnie Mercers Pier', 'Dolphin & sea turtle spotting'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
    routeColor: 'yellow'
  },
  {
    id: 'wilmington-masonboro-excursion',
    name: 'Masonboro Excursion',
    duration: '35 minutes',
    price: 180,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Extend your Battleship to the Beach Tour to include a jaunt down the Cape Fear River to see the State Port and Orton Plantation. Then follow Snow\'s Cut to the Intracoastal Waterway (ICW) and discover Masonboro Island, 8 miles of pristine nature preserve only accessible by boat.',
    location: 'wilmington',
    features: ['Cape Fear River', 'State Port', 'Orton Plantation', 'Masonboro Island', 'Intracoastal Waterway'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
    routeColor: 'orange'
  },
  {
    id: 'wilmington-topsail-trek',
    name: 'Topsail Trek',
    duration: '45 minutes',
    price: 220,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Venture North past Wrightsville to exclusive Figure Eight Island, with crystal clear waters for spotting sea life. Then explore the unspoiled beaches of Lea-Hutaff Island as you make your way to Surf City. After rounding the pier and bridge, follow the ICW south for stunning marsh views!',
    location: 'wilmington',
    features: ['Figure Eight Island', 'Lea-Hutaff Island', 'Surf City', 'Crystal clear waters', 'Marsh views'],
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
    routeColor: 'blue'
  },
  {
    id: 'wilmington-cape-fear-expedition',
    name: 'Cape Fear Expedition',
    duration: '50 minutes',
    price: 250,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'For a REAL adventure, journey to Bald Head Island for the BEST photo ops! See everything on the Masonboro Excursion, AND Brunswick Town, Southport, Fort Fisher, Carolina Beach, Gen. Beauregard shipwreck and 2 lighthouses. 35 miles of beaches and of course, Cape Fear itself!',
    location: 'wilmington',
    features: ['Bald Head Island', 'Brunswick Town', 'Southport', 'Fort Fisher', 'Carolina Beach', 'Gen. Beauregard shipwreck', '2 lighthouses'],
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=400&fit=crop',
    routeColor: 'purple'
  },
  {
    id: 'wilmington-beach-lover',
    name: 'Beach Lover Tour',
    duration: '65 minutes',
    price: 320,
    minPassengers: 1,
    maxPassengers: 3,
    maxWeight: 650,
    type: 'airplane',
    description: 'Our most comprehensive scenic air tour. Perfect for explorers who want to take an extensive historical journey around the Cape Fear Region. This tour not only covers everything from the Cape Fear Expedition, it includes the CSS Bendigo shipwreck, 3 lighthouses, and Fort Caswell!',
    location: 'wilmington',
    features: ['Most comprehensive tour', 'Cape Fear Region', 'CSS Bendigo shipwreck', '3 lighthouses', 'Fort Caswell', 'Historical journey'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
    routeColor: 'red'
  }
];

export const locations = [
  {
    id: 'southport',
    name: 'Southport, NC',
    description: 'Helicopter + Airplane Tours Available',
    note: 'Helicopter tours only available at this location',
    image: southportTourMap,
    tours: tours.filter(t => t.location === 'southport')
  },
  {
    id: 'st-simons',
    name: 'St Simons Island, GA',
    description: 'Airplane Tours Only',
    note: 'Scenic airplane tours of Golden Isles',
    image: 'https://flyhightide.com/_astro/st-simons-island-ga-tour-map-high-tide-aviation-aerial-tours.B9FcXsEV.jpg',
    tours: tours.filter(t => t.location === 'st-simons')
  },
  {
    id: 'wilmington',
    name: 'Wilmington, NC',
    description: 'Airplane Tours Only',
    note: 'Scenic airplane tours of Cape Fear Region',
    image: wilmingtonTourMap,
    tours: tours.filter(t => t.location === 'wilmington')
  }
];
