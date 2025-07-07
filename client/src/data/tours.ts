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
  location: 'southport' | 'st-simons';
  features: string[];
  image: string;
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
    image: 'https://flyhightide.com/_astro/high-tide-aviation-team-southport.Xj9jwjZu.jpg'
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
    image: 'https://flyhightide.com/_astro/HTA-map-southport.DWpsbb3K.jpg'
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
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=400&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=400&fit=crop'
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
    image: 'https://flyhightide.com/_astro/high-tide-helicopter-with-pilot-ready-to-takeoff.FFBadvWW.jpg'
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
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop'
  }
];

export const locations = [
  {
    id: 'southport',
    name: 'Southport, NC',
    description: 'Helicopter + Airplane Tours Available',
    note: 'Helicopter tours only available at this location',
    image: 'https://flyhightide.com/_astro/high-tide-aviation-team-southport.Xj9jwjZu.jpg',
    tours: tours.filter(t => t.location === 'southport')
  },
  {
    id: 'st-simons',
    name: 'St Simons Island, GA',
    description: 'Airplane Tours Only',
    note: 'Scenic airplane tours of Golden Isles',
    image: 'https://flyhightide.com/_astro/st-simons-island-ga-tour-map-high-tide-aviation-aerial-tours.B9FcXsEV.jpg',
    tours: tours.filter(t => t.location === 'st-simons')
  }
];
