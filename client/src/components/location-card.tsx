import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    description: string;
    note: string;
    image: string;
    tours: any[];
  };
  selected?: boolean;
  onSelect?: (locationId: string) => void;
  onExplore?: (locationId: string) => void;
  className?: string;
}

export const LocationCard = ({ 
  location, 
  selected, 
  onSelect, 
  onExplore, 
  className 
}: LocationCardProps) => {
  const hasHelicopter = location.tours.some(t => t.type === 'helicopter');
  const hasAirplane = location.tours.some(t => t.type === 'airplane');
  
  // Calculate pricing information
  const helicopterTours = location.tours.filter(t => t.type === 'helicopter');
  const airplaneTours = location.tours.filter(t => t.type === 'airplane');
  const allTours = location.tours;
  
  const minHelicopterPrice = helicopterTours.length > 0 ? Math.min(...helicopterTours.map(t => t.price)) : 0;
  const minAirplanePrice = airplaneTours.length > 0 ? Math.min(...airplaneTours.map(t => t.price)) : 0;
  const minOverallPrice = allTours.length > 0 ? Math.min(...allTours.map(t => t.price)) : 0;

  const getRouteColorStyle = (color: string) => {
    switch (color) {
      case 'yellow':
        return { backgroundColor: '#facc15', color: '#000', borderColor: '#eab308' };
      case 'orange':
        return { backgroundColor: '#fb923c', color: '#fff', borderColor: '#ea580c' };
      case 'blue':
        return { backgroundColor: '#60a5fa', color: '#fff', borderColor: '#3b82f6' };
      case 'purple':
        return { backgroundColor: '#a78bfa', color: '#fff', borderColor: '#8b5cf6' };
      case 'red':
        return { backgroundColor: '#f87171', color: '#fff', borderColor: '#ef4444' };
      case 'green':
        return { backgroundColor: '#4ade80', color: '#fff', borderColor: '#22c55e' };
      case 'gray':
        return { backgroundColor: '#9ca3af', color: '#fff', borderColor: '#6b7280' };
      default:
        return { backgroundColor: '#9ca3af', color: '#fff', borderColor: '#6b7280' };
    }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        selected && 'ring-2 ring-blue-500 bg-blue-50',
        className
      )}
      onClick={() => onSelect?.(location.id)}
    >
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{location.description}</p>
        </div>

        <div className="flex items-center mb-4">
          <MapPin className="w-4 h-4 text-coastal-teal mr-2" />
          <span className="text-sm text-gray-600">{location.note}</span>
        </div>

        {/* Pricing Information */}
        <div className="mb-4">
          {location.id === 'southport' ? (
            <div className="space-y-1">
              {hasAirplane && (
                <p className="text-sm text-gray-700">
                  Airplane tours start at <span className="font-semibold text-ocean-blue">${minAirplanePrice}</span>
                </p>
              )}
              {hasHelicopter && (
                <p className="text-sm text-gray-700">
                  Helicopter tours start at <span className="font-semibold text-ocean-blue">${minHelicopterPrice}</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-700">
              Tours start at <span className="font-semibold text-ocean-blue">${minOverallPrice}</span>
            </p>
          )}
        </div>

<div className="mb-4">
  <div className="flex flex-wrap gap-2">
    {location.tours.map((tour, index) => (
      <div key={index} className="flex flex-col items-start mb-2">
        <Badge 
          variant="outline" 
          className="text-xs font-medium border-2 mb-1"
          style={tour.routeColor ? getRouteColorStyle(tour.routeColor) : undefined}
        >
          {tour.name}
        </Badge>
        <Button
          className="bg-ocean-blue hover:bg-blue-600 text-white text-xs px-3 py-1"
          onClick={(e) => {
            e.stopPropagation();
            window.open(tour.bookingUrl, '_blank');
          }}
        >
          Book Now
        </Button>
      </div>
    ))}
  </div>
</div> 

        {location.id === 'southport' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800">
              <span className="font-medium">Special:</span> Only location with helicopter tours
            </p>
          </div>
        )}

        <Button 
          className="w-full bg-ocean-blue hover:bg-blue-600 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onExplore?.(location.id);
          }}
        >
          Explore Tours
        </Button>
      </CardContent>
    </Card>
  );
};
